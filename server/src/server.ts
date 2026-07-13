import cors from './config/cors.js';
import credentials from './middleware/credentials.js';
import errorHandler from './tools/errors.js';
import express, { Express, Request, Response, } from 'express';
import cookieParser from 'cookie-parser';
import logger from './tools/logger.js';
import log from './tools/newLogger.js';
import path from 'path';
import sc from './tools/status-codes.js';
import server from './routers/api.js';
import { setupDatabase } from './database/config.js'
import { configure, getConsoleSink } from "@logtape/logtape";
const __dirname = import.meta.dirname;

await configure({
  sinks: { console: getConsoleSink() },
  loggers: [
    { category: "my-app", lowestLevel: "debug", sinks: ["console"] }
  ]
});
// import rateLimit from 'express-rate-limit';

import dotenv from 'dotenv'
dotenv.config()

logger.info(`Launching server...`);
// Config
const api: Express = express();
const port = 3001;
// const limiter = rateLimit({
//     windowMs: 60 * 1000,
//     max: 40,
// });

api.use(cookieParser());
api.set('trust proxy', 1);
api.use((req, res, next) => {
  //console.log('Cookie Header:', req.headers.cookie || '(empty)');
  //console.log('res.cookies:', req.cookies || '(empty)');
  next();
});

api.use(express.json());
api.use(express.urlencoded({ extended: true }));
api.use(credentials);
api.use(cors());
// api.use(limiter);

// Logger
api.use(log.middleware);

// Main
api.use('/api', server);

// Client
api.use(express.static(path.join(__dirname, 'www')));
api.get('*aze', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, 'www', 'index.html'));
  logger.success(req, res, 'Return client');
});

// 404
api.all('*aze', (req: Request, res: Response) => {
  res.status(sc.NOT_FOUND).json({ error: 'Route not found' });
  logger.fail(req, res, 'Not found');
});

// Errors
api.use(errorHandler);

// Database migration, do it before starting server
//createBundle(./build/database/migrations.js');
//const bundle = readBundle(./build/database/migrations/bundle.json.js')

setupDatabase(process.env.DB_PATH + '/migrations/').then(() => {
  // Start
  api.listen(port, () => {
    logger.info(`Server listening on port ${port}`);
  });
})
