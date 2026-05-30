import { Request, Response } from 'express';
import uuid from '../tools/uuid';
import queries from '../database/queries';
import bcrypt from 'bcrypt';

const readAll = async (req: Request, res: Response) => {
  const sqlQuery = `
      SELECT users.id,
             login,
             lastActive,
             user_roles.label role,
             user_states.label state
      FROM users
        INNER JOIN user_roles ON users.role = user_roles.id
        INNER JOIN user_states ON users.state = user_states.id
      ORDER BY login ASC
  `;
  await queries.pull(req, res, sqlQuery, [], { id: '', name: 'Users', verb: 'returned' });
};

const getForConnection = async (req: Request, res: Response) => {
  const sqlQuery = `
      SELECT login,
             id
      FROM users
      WHERE state != 'disabled'
      ORDER BY login ASC
  `;
  await queries.pull(req, res, sqlQuery, [], { id: '', name: 'Users', verb: 'returned for connection' });
};

const getPractitioners = async (req: Request, res: Response) => {
  const sqlQuery = `
      SELECT login,
             id
      FROM users
      WHERE role = 'practitioner'
        AND state != 'disabled'
      ORDER BY login ASC
  `;
  await queries.pull(req, res, sqlQuery, [], { id: '', name: 'Practitioners', verb: 'returned for appointment' });
};

const readOne = async (req: Request, res: Response) => {
  const sqlQuery = `
      SELECT id,
             login,
             lastActive,
             state,
             role
      FROM users
      WHERE id = ?
  `;
  await queries.pull(req, res, sqlQuery, [req.params.id], { id: req.params.id as string, name: 'User', verb: 'returned' });
};

const create = async (req: Request, res: Response) => {
  let id = uuid();
  while (await queries.checkId(id, 'users', 'id')) id = uuid();
  const sqlQuery = `
      INSERT INTO users (id,
                         login,
                         lastlogin,
                         role,
                         state,
                         password,
                         lastActive)
      VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  const values = [
    id,
    req.body.login,
    req.body.lastlogin,
    req.body.role,
    'first-time',
    hashedPassword,
    '1970-01-01 00:00:00',
  ];

  await queries.push(req, res, sqlQuery, values, { id, name: 'User', verb: 'created' });
};

const disable = async (req: Request, res: Response) => {
  const sqlQuery = `
      UPDATE
          users
      SET state = 'disabled'
      WHERE id = ?
  `;
  await queries.push(req, res, sqlQuery, [req.params.id], { id: req.params.id as string, name: 'User', verb: 'disabled' });
};

const enable = async (req: Request, res: Response) => {
  const sqlQuery = `
      UPDATE
          users
      SET state = 'regular'
      WHERE id = ?
  `;
  await queries.push(req, res, sqlQuery, [req.params.id], { id: req.params.id as string, name: 'User', verb: 'enabled' });
};

export default {
  readAll,
  create,
  getForConnection,
  readOne,
  getPractitioners,
  disable,
  enable,
};
