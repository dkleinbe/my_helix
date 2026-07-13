
import logger from '../tools/logger.js';
import fs from 'node:fs';
import sqlite3 from 'better-sqlite3'; 
import type { Database } from 'better-sqlite3'
import { createBundle, readBundle } from './migrations/bundler.js'
import { runBundle } from './migrations/runner.js';
import dotenv from 'dotenv'

dotenv.config();


export async function setupDatabase(migrationDir: string) {
  // Database migration, do it before starting server
  createBundle(migrationDir);
  const bundle = readBundle(migrationDir);
  await runBundle(db, bundle)
}

const openDb = () => {
  
  try {  

    const db = new sqlite3(process.env.DB_PATH + '/' + process.env.DB_NAME); // ./build/database/Hypnobase.db
    logger.info('Connected to database');
    return db;

  } catch (err) {

    if (err instanceof Error)
      logger.error(err.message);
    throw new Error('Can not open db')
  }
}

// TODO: await runBundle(db, bundle);


const db = openDb();
export default db;
