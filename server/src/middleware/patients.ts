import { Response, Request, NextFunction } from 'express';
import validate from '../validation/validator.js';
import logger from '../tools/logger.js';
import sc from '../tools/status-codes.js';

const create = (req: Request, res: Response, next: NextFunction) => {
    const isValid = validate.patientCreate(req.body);
    if (!isValid) {
        res.status(sc.NOT_ACCEPTABLE).json(validate.patientCreate.errors);
        logger.fail(req, res, 'Invalid request body');
    } else {
        logger.success(req, res, 'Valid request body');
        next();
    }
};

const update = (req: Request, res: Response, next: NextFunction) => {
    const isValid = validate.patientUpdate(req.body);
    if (!isValid) {
        res.status(sc.NOT_ACCEPTABLE).json(validate.patientUpdate.errors);
        logger.fail(req, res, 'Invalid request body');
    } else {
        logger.success(req, res, 'Valid request body');
        next();
    }
};

export default  {
    update,
    create,
};
