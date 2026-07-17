import { NextFunction, Request, Response } from 'express';
import sc from './status-codes.js';
import log from './tapeLogger.js';

const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  //log.message('error', err.message);
  res.status(sc.INTERNAL_SERVER_ERROR).json({ error: err.message });
};

export default errorHandler;
