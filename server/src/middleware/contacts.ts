import { NextFunction, Request, Response } from 'express';
import validate from '../validation/validator.js';
import logger from '../tools/tapeLogger.js';
import sc from '../tools/status-codes.js';

const create = (req: Request, res: Response, next: NextFunction) => {
  const isValid = validate.contactCreate(req.body);
  if (!isValid) {
    logger.failReq(req, res, 'Invalid request body');
    res.status(sc.NOT_ACCEPTABLE).json(validate.contactCreate.errors);
  } else {
    logger.successReq(req, res, 'Valid request body');
    next();
  }
};

const update = (req: Request, res: Response, next: NextFunction) => {
  const isValid = validate.contactUpdate(req.body);
  if (!isValid) {
    logger.failReq(req, res, 'Invalid request body');
    res.status(sc.NOT_ACCEPTABLE).json(validate.contactUpdate.errors);
  } else {
    logger.successReq(req, res, 'Valid request body');
    next();
  }
};

export default  {
  create,
  update,
};
