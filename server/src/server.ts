import cors from './config/cors';
import credentials from './middleware/credentials';
import errorHandler from './tools/errors';
import express, { Express, Request, Response, } from 'express';
import cookieParser from 'cookie-parser';
import logger from './tools/logger';
import log from './tools/newLogger';
import path from 'path';
import sc from './tools/status-codes';
import server from './routers/api';
import { setupDatabase } from './database/config'

// import rateLimit from 'express-rate-limit';

require('dotenv').config();

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
//createBundle('./build/database/migrations');
//const bundle = readBundle('./build/database/migrations/bundle.json')

setupDatabase(process.env.DB_PATH + '/migrations/').then(() => {
  // Start
  api.listen(port, () => {
    logger.info(`Server listening on port ${port}`);
  });
})
