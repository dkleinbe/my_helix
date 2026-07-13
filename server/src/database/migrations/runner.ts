
import fs from "fs";
import logger from '../../tools/logger.js';
import db from '../../database/config.js'
import type { Database as IDatabase } from 'better-sqlite3'
import type { BundleItem, BundleHeader } from './bundler.js';
import { format } from 'date-fns'

const dbTable = "schema_versions";



export async function runBundle(db: IDatabase, bundle: BundleItem[]) {
  try {
    const date = format(Date.now(), "yyyy-MM-dd-H-mm-ss")
    const dbName = process.env.DB_NAME?.split('.')[0]
    const fileName = `backup-${dbName}-${date}.db`

    await db.backup(process.env.DB_PATH + `/${fileName}`)
    
    logger.info('Database backup done: ' + fileName)

  } catch(err) {

    logger.error('Database backup failed: ' + err);

  };

  
  try {
    run(
      db,
      bundle,
    );
  } catch (error) {
    logger.error(`DB: ${error}`);
    throw error;
  }


}

function run(db: IDatabase, all: BundleItem[]) {
  let count = 0;
  const currVersions = readCurrentVersions(db);

  if (currVersions.has(0)) {
    createDatabase(all)
  }

  all
    .filter((m) => ! currVersions.has(m.desc.version) && // don't re apply patch
                   m.desc.version > getDatabaseUserVersion(db) && // don't apply previous patch
                   ! m.desc.isInit) // don't apply init patch
    .sort((m1, m2) => m1.desc.version - m2.desc.version)
    .forEach((m) => {

      runNonTransactional(db, m.content.nonTransactional);
      const applied = runTransactional(db, m.desc, m.content.transactional);
      if (applied) {
        count += 1;
      }
    });

  if (count > 0) {
    logger.info(`DB: ${count} migration(s) were applied successfully`);
  } else {
    logger.info("DB is up to date");
  }
}

function createDatabase(all: BundleItem[]) {

  const lastInit = all
    .filter((m) => m.desc.isInit === true)
    .sort((m1, m2) => m2.desc.version - m1.desc.version);
  
  logger.info('DB: Init with latest init : ' + lastInit[0].desc.version)

  runNonTransactional(db, lastInit[0].content.nonTransactional);
  const applied = runTransactional(db, lastInit[0].desc, lastInit[0].content.transactional);

}
function runNonTransactional(db: IDatabase, statements: string[]) {
  statements.forEach((statement) => {
    db.prepare(statement).run();
  });
}

function runTransactional(db: IDatabase, m: BundleHeader, statements: string[]) {
  return db.transaction(() => {
    let applied = false;

    checkVersion(db, m, () => {
      logger.info(`DB: migrating to version ${m.version} - ${m.name}`);

      statements.forEach((statement) => {
        db.prepare(statement).run();
      });

      applied = true;
    });

    return applied;
  })();
}

function setDatabaseUserVersion(db: IDatabase, version: number): void {
  db.exec(`PRAGMA user_version = ${version};`)
}

function getDatabaseUserVersion(db: IDatabase): number {
  const result = db.prepare('PRAGMA user_version;').get() as {
    user_version: number
  }
  return result['user_version']
}


function checkVersion(db: IDatabase, m: BundleHeader, applyChanges: () => void) {
  const query = db.prepare(
    /* sql */ `select version from ${dbTable} where version = ?;`,
  );
  const rows = query.all(m.version);
  if (rows.length === 0) {
    applyChanges();

    const insert = db.prepare(
      /* sql */ `insert into ${dbTable} (version, name, comment, fileName) values (?, ?, ?, ?);`,
    );
    insert.run(m.version, m.name, m.comment, m.fileName);
    setDatabaseUserVersion(db, m.version)
  }
}

function readCurrentVersions(db: IDatabase) {
  return db.transaction(() => {
    db.prepare(
      /* sql */ `create table if not exists ${dbTable} (
        version  integer primary key,
        name     text not null,
        comment  text not null,
        fileName text not null
      );`,
    ).run();

    const query = db.prepare(/* sql */ `select version from ${dbTable};`);
    const rows = query.all() as { version: number}[];
    return new Set(rows.map((r) => (r.version))).add(getDatabaseUserVersion(db));
  })();
}