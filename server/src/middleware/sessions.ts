import { NextFunction, Request, Response } from 'express';
import validate from '../validation/validator.js';
import logger from '../tools/tapeLogger.js';
import log from '../tools/tapeLogger.js';
import sc from '../tools/status-codes.js';

const create = async (req: Request, res: Response, next: NextFunction) => {
  const isValid = validate.sessionCreate(req.body);
  if (!isValid) {
    log.message('error', 'Invalid request body');
    res.status(sc.NOT_ACCEPTABLE).json(validate.sessionCreate.errors);
  } else {
    logger.successReq(req, res, 'Valid request body');
    next();
  }
};

const update = async (req: Request, res: Response, next: NextFunction) => {
  const isValid = validate.sessionUpdate(req.body);
  if (!isValid) {
    log.message('error', 'Invalid request body');
    res.status(sc.NOT_ACCEPTABLE).json(validate.sessionUpdate.errors);
  } else {
    logger.successReq(req, res, 'Valid request body');
    next();
  }
};

export default {
  create,
  update,
};
