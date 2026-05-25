import mysql from 'mysql';
import logger from '../tools/logger';
import fs from 'node:fs';
const sqlite3 = require('better-sqlite3')

require('dotenv').config();
/*
const db = mysql.createConnection({
  host: process.env.HELIX_DB_HOST,
  user: process.env.HELIX_DB_USER,
  password: process.env.HELIX_DB_PASSWORD,
  database: process.env.HELIX_DB_NAME,
});
*/
let db
try {  
  db = new sqlite3('./build/database/Hypnobase.db');
  logger.info('Connected to database');
} catch (err) {
  logger.error(err);
}

const creationQuery = fs.readFileSync('./build/database/Hypnobase.sql', 'utf8');
db.exec(creationQuery);

export default db;
