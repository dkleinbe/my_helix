import { Response, Request, NextFunction } from 'express';
import validate from '../validation/validator.js';
import logger from '../tools/tapeLogger.js';
import sc from '../tools/status-codes.js';
import db from '../database/config.js';

const create = async (req: Request, res: Response, next: NextFunction) => {
    const isValid = validate.eventCreate(req.body);
    if (!isValid) {
        res.status(sc.NOT_ACCEPTABLE).json(validate.eventCreate.errors);
        logger.failReq(req, res, 'Invalid request body');
    } else {
        logger.successReq(req, res, 'Valid request body');
        next();
    }
};

const addAppointment = async (req: Request, res: Response, next: NextFunction) => {
    const isValid = validate.addAppointment(req.body);
    if (!isValid) {
        res.status(sc.NOT_ACCEPTABLE).json(validate.addAppointment.errors);
        logger.failReq(req, res, 'Invalid request body');
    } else {
        logger.successReq(req, res, 'Valid request body');
        const patientId = req.body.patientId;
        const sqlQuery = `
            UPDATE
                patients
            SET
                passif = json_insert(passif, '$[#]', ?)
            WHERE
                id = ?
        `;
        const values = [req.body.appId];
        const update =db.prepare(sqlQuery);
        try {
            const info = update.run(...values, patientId);
            if (info.changes === 0) {
                logger.failReq(req, res, `Patient ${patientId} not found`);
                res.status(sc.NOT_FOUND).json({ message: `Patient ${patientId} not found` });
            } else {
                logger.successReq(req, res, `Appointment ${req.body.id} added to patient ${patientId}`);
                next();
            }
        } catch (err) {
            if (err instanceof Error)
                logger.failReq(req, res, err.message);
            res.status(sc.METHOD_FAILURE).json({ message: 'Method fails' });
        }
        // db.query(sqlQuery, [...values, patientId], (err: any, data: any) => {
        //     if (err) {
        //         res.status(sc.METHOD_FAILURE).json({ message: 'Method fails' });
        //         logger.fail(req, res, err);
        //     } else if (data.affectedRows === 0) {
        //         res.status(sc.NOT_FOUND).json({ message: `Patient ${patientId} not found` });
        //         logger.fail(req, res, `Patient ${patientId} not found`);
        //     } else {
        //         logger.success(req, res, `Appointment ${req.body.id} added to patient ${patientId}`);
        //         next();
        //     }
        // });
    }
};

export default {
    create,
    addAppointment,
};
