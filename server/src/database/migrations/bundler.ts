import fs from "fs";
import path from "path";
import logger from '../../tools/logger.js';
import { Name } from "ajv";

const bundleFileName = "bundle.json";
const versionAndNameRegex = /V(\d+)_(.+).sql/i;
const underscoreRegex = /_/g;
const headerRegex= /\/\*[^*]*\*+.*\n([^\/][^*]*)\*+\//

type BundleHeader = {

    isInit: boolean;
    version: number;
    comment: string,
    name: string;
    fileName: string;
}

type BundleItem = {
  desc: BundleHeader;
  content: { 
    transactional: string[];
    nonTransactional: string[];
  };
}

export { BundleHeader, BundleItem }

export function readBundle(migrationsDir: string) : BundleItem[] {
  const json = fs.readFileSync(migrationsDir + bundleFileName, { encoding: "utf8" });

  const bundle = JSON.parse(json);
  return bundle;
}

export function createBundle(dir: string) {

  function parseVersionAndName(fileName: string) {
    // Search for header in file
    const headerGroup = fs.readFileSync(migrationsDir + fileName).toString().match(headerRegex);
    if (headerGroup && headerGroup.length === 2) { 
      logger.info('DB: file header found for: ' + fileName)
      const header = JSON.parse(headerGroup[1])

      return { 
        isInit: header.INIT, 
        version: header.VERSION, 
        comment: header.COMMENT, 
        name: header.NAME, 
        fileName: fileName 
      };
      
    } else {
      logger.info('DB: no migration file header found, using filename for: ' + fileName)
      const groups = fileName.match(versionAndNameRegex);
      if (groups && groups.length === 3) {
        const version = parseInt(groups[1]);
        const name = groups[2];
        return { 
          inInit: false,
          version: version, 
          comment: "no comment", 
          name: name.replace(underscoreRegex, " "), 
          fileName: fileName };
      }
    }
    logger.error('DB: Not a migration file: ' + fileName)
    return undefined;
  }

  if (dir.length === 0) {
    logger.error("Error: Migrations folder path expected as first argument");
    return;
  }

  const migrationsDir = dir;
  const dirStats = getFileStats(migrationsDir);
  if (!dirStats) {
    logger.error(`Error: Migrations folder "${migrationsDir}" doesn't exist`);
    return;
  }
  if (!dirStats.isDirectory()) {
    logger.error(`Error: "${migrationsDir}" is not a directory`);
    return;
  }

  const allFiles = fs.readdirSync(migrationsDir);
  let lastModifiedMs = 0;
  let sqlFiles: {desc: {}, name: string}[] = ([]);
  allFiles
    .sort((a, b) => a.localeCompare(b))
    .forEach((f) => {
      if (f.endsWith(".sql") || f.endsWith(".SQL")) {
        const desc = parseVersionAndName(f)
        if (desc !== undefined) {
          const stats = fs.lstatSync(path.join(migrationsDir, f));
          if (lastModifiedMs < stats.mtimeMs) {
            lastModifiedMs = stats.mtimeMs;
          }
          sqlFiles.push({desc: desc, name: f});
        }
      }
    });

  const migrationsBundle = path.join(migrationsDir, bundleFileName);
  const bundleStats = getFileStats(migrationsBundle);
  const lastModifiedSeconds = lastModifiedMs / 1000;
  if (
    !bundleStats ||
    Math.trunc(bundleStats.mtimeMs / 1000) !== Math.trunc(lastModifiedSeconds)
  ) {
    
    const bundleObj = sqlFiles.map((file) => {
      return {
        desc: file.desc,
        content: buildStatements(path.join(migrationsDir, file.name)),
      };
    });

    fs.writeFileSync(
      migrationsBundle,
      JSON.stringify(bundleObj, undefined, 2),
      { encoding: "utf8" },
    );
    fs.utimesSync(migrationsBundle, lastModifiedSeconds, lastModifiedSeconds);
    logger.info(`Generated SQL bundle file: ${migrationsBundle}`);
    return;
  }

  logger.info("Nothing to generate, SQL bundle is up to date!");
}

function buildStatements(file: string) {

  const content =  fs.readFileSync(file).toString();

  const statements = content
    .split(";")
    .map((s: string) => s.trim())
    .filter((s: string) => s.length !== 0);
  
    const nonTransactional = statements.filter((s: string) => s.includes("non-transactional"), );

    //const transactional = statements.filter((s: string) => !s.includes("non-transactional"), );
    const transactional = statements.filter((s: string) => !s.includes("non-transactional"), )
      .map((stm) => stm.replace(headerRegex, ""));


    return { transactional: transactional, nonTransactional: nonTransactional}
}

function getFileStats(file: string) {
  try {
    return fs.lstatSync(file);
  } catch (_) {
    return undefined;
  }
}