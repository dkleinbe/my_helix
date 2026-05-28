import { Response, Request } from 'express';
import db from '../database/config';
import logger from '../tools/logger';
import sc from '../tools/status-codes';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { IUser } from '../tools/interfaces';
import role from '../config/roles';
import moment from 'moment';
require('dotenv').config();

const queryAuth = async (query: string, values: any, req: Request): Promise<IUser> => {

    return new Promise((resolve, reject) => {
        const select = db.prepare(query);
        try {
            const rows = select.all(values);
            resolve(rows[0]);
        } catch (error) {
            reject(error);
        }        
        // db.query(query, values, (err: any, data: any) => {
        //     if (err) {
        //         reject(err);
        //     } else {
        //         resolve(data[0]);
        //     }
        // });
    });
};

const login = async (req: Request, res: Response) => {
    const { id, password } = req.body;
    let user: IUser;
    try {
        user = await queryAuth(`SELECT * FROM users WHERE id = ?`, [id], req);
    } catch (err: any) {
        res.status(sc.UNAUTHORIZED).json({ message: err.message });
        return logger.fail(req, res, err);
    }

    if (!user) {
        res.status(sc.UNAUTHORIZED).json({ message: 'User not found' });
        return logger.fail(req, res, 'User not found');
    }

    if (!(await bcrypt.compare(password, user.password))) {
        res.status(sc.UNAUTHORIZED).json({ message: 'Invalid password' });
        return logger.fail(req, res, 'Invalid password');
    }

    const roleCode = role.getCode(user.role);
    const accessToken = jwt.sign(
        {
            userData: {
                id: user.id,
                role: roleCode,
            },
        },
        process.env.ACCESS_TOKEN_SECRET as string,
        { expiresIn: '10m' }
    );
    const refreshToken = jwt.sign({ id: user.id }, process.env.REFRESH_TOKEN_SECRET as string, { expiresIn: '12h' });

    const sqlQuery = 'UPDATE users SET refreshToken = ?, `lastActive` = ? WHERE id = ?';
    const values = [refreshToken, moment().format('YYYY-MM-DD HH:mm:ss'), user.id];
    const select = db.prepare(sqlQuery);
    try {
        const rows = select.run(values);
        logger.success(req, res, 'Refresh token added to database');
    } catch (error) {
        res.status(sc.METHOD_FAILURE).json({ message: error.message });
        return logger.fail(req, res, error);
    }
    // db.query(sqlQuery, values, (err: any, data: any) => {
    //     if (err) {
    //         res.status(sc.METHOD_FAILURE).json({ message: err.message });
    //         return logger.fail(req, res, err);
    //     }
    //     logger.success(req, res, 'Refresh token added to database');
    // });
    res.cookie('jwt', refreshToken, { httpOnly: true, maxAge: 12 * 60 * 60 * 1000, sameSite: 'none', secure: true });
    res.status(sc.ACCEPTED).json({
        id: id,
        name: user.name,
        role: roleCode,
        message: `User ${id} successfully logged in`,
        token: accessToken,
    });
    logger.success(req, res, `User ${id} successfully logged in`);
};

const refreshToken = async (req: Request, res: Response) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.status(sc.UNAUTHORIZED).json({ message: 'No token provided' });
    const refreshToken = cookies.jwt;
    let user: IUser;
    try {
        user = await queryAuth(`SELECT * FROM users WHERE refreshToken = ?`, [refreshToken], req);
    } catch (err: any) {
        res.status(sc.FORBIDDEN).json({ message: err.message });
        return logger.fail(req, res, err);
    }

    if (!user) {
        res.status(sc.FORBIDDEN).json({ message: 'User not found' });
        return logger.fail(req, res, 'User not found');
    }

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET as string, (err: any, decoded: any) => {
        if (err || user.id !== decoded.id) {
            res.status(sc.FORBIDDEN).json({ message: err });
            logger.fail(req, res, err);
        } else {
            const accessToken = jwt.sign(
                {
                    userData: {
                        id: decoded.id,
                        role: role.getCode(user.role),
                    },
                },
                process.env.ACCESS_TOKEN_SECRET as string,
                { expiresIn: '10m' }
            );
            res.status(sc.ACCEPTED).json({
                id: user.id,
                name: user.name,
                role: role.getCode(user.role),
                message: `User ${user.id} successfully refreshed token`,
                token: accessToken,
            });
            logger.success(req, res, `User ${user.id} successfully refreshed token`);
        }
    });
};

const logout = async (req: Request, res: Response) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) {
        res.status(sc.ACCEPTED).json({ message: 'Already logged out' });
        return logger.success(req, res, 'Already logged out');
    }
    const refreshToken = cookies.jwt;
    let user: IUser;
    try {
        user = await queryAuth(`SELECT * FROM users WHERE refreshToken = ?`, [refreshToken], req);
    } catch (err: any) {
        res.clearCookie('jwt', { httpOnly: true, maxAge: 12 * 60 * 60 * 1000, sameSite: 'none', secure: true });
        res.status(sc.ACCEPTED).json({ message: 'Already logged out' });
        return logger.fail(req, res, 'User not found, already logged out?');
    }

    if (!user) {
        res.clearCookie('jwt', { httpOnly: true, maxAge: 12 * 60 * 60 * 1000, sameSite: 'none', secure: true });
        res.status(sc.ACCEPTED).json({ message: 'Already logged out' });
        return logger.fail(req, res, 'User not found, already logged out?');
    }

    const sqlQuery = `UPDATE users SET refreshToken = NULL WHERE id = ?`;
    const values = [user.id];
    const select = db.prepare(sqlQuery);
    try {
        const rows = select.run(values);
        logger.success(req, res, 'Refresh token added to database');
    } catch (error) {
        res.status(sc.METHOD_FAILURE).json({ message: error.message });
        return logger.fail(req, res, error);
    }    
    // db.query(sqlQuery, values, (err: any, data: any) => {
    //     if (err) {
    //         res.status(sc.METHOD_FAILURE).json({ message: err.message });
    //         return logger.fail(req, res, err);
    //     }
    //     logger.success(req, res, 'Refresh token removed from database');
    // });
    res.clearCookie('jwt', { httpOnly: true, maxAge: 12 * 60 * 60 * 1000, sameSite: 'none', secure: true });
    res.status(sc.ACCEPTED).json({ id: user.id, message: `User ${user.id} successfully logged out` });
    logger.success(req, res, `User ${user.id} successfully logged out`);
};

export default module.exports = {
    login,
    refreshToken,
    logout,
};
