import { Response, Request, NextFunction } from 'express';
import validate from '../validation/validator.js';
import logger from '../tools/tapeLogger.js';
import sc from '../tools/status-codes.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'
dotenv.config()

const login = (req: Request, res: Response, next: NextFunction) => {
    const isValid = validate.login(req.body);
    if (!isValid) {
        res.status(sc.NOT_ACCEPTABLE).json({ message: 'Invalid request body' });
        logger.failReq(req, res, 'Invalid request body');
    } else {
        logger.successReq(req, res, 'Valid request body');
        next();
    }
};

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization || (req.headers.Authorization as string);
    if (!authHeader?.startsWith('Bearer ')) {
        res.status(sc.UNAUTHORIZED).json({ message: 'No token provided' });
        return logger.failReq(req, res, 'No token provided');
    }
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string, (err: any, decoded: any) => {
        if (err) {
            res.status(sc.FORBIDDEN).json({ message: 'Invalid token' });
            return logger.failReq(req, res, 'Invalid token');
        } else {
            logger.successReq(req, res, 'Valid token');
            // req.body.role = decoded.userData.role;
            next();
        }
    });
};

const verifyRole =
    (...allowedRoles: number[]) =>
    (req: Request, res: Response, next: NextFunction) => {
        if (!req.body?.role) {
            res.status(sc.UNAUTHORIZED).json({ message: 'No role provided' });
            return logger.failReq(req, res, 'No role provided');
        }
        if (!allowedRoles.includes(req.body.role)) {
            // modify if many roles
            res.status(sc.UNAUTHORIZED).json({ message: 'Unauthorized' });
            return logger.failReq(req, res, 'Role Unauthorized');
        }

        logger.successReq(req, res, 'Role Authorized');
        next();
    };

export default  {
    login,
    verifyToken,
    verifyRole,
};
