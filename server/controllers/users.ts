import { Request, Response } from 'express';
import uuid from '../tools/uuid';
import queries from '../database/queries';
import bcrypt from 'bcrypt';

const readAll = async (req: Request, res: Response) => {
  const sqlQuery = `
    SELECT users.id,
            login,
            lastActive,
            user_roles.id role_id,
            user_roles.label role,
            user_states.id state_id,
            user_states.label state
    FROM users
    INNER JOIN user_roles ON users.role = user_roles.id
    INNER JOIN user_states ON users.state = user_states.id
    ORDER BY login ASC
  `;
  await queries.pull(req, res, sqlQuery, [], { id: '', name: 'Users', verb: 'returned' });
};

const readAllRoles = async (req: Request, res: Response) => {
  const sqlQuery = `
    SELECT user_roles.id value,
           user_roles.label label
    FROM user_roles
    ORDER BY label ASC
  `;
  await queries.pull(req, res, sqlQuery, [], { id: '', name: 'Roles', verb: 'returned' });
};

const readAllStates = async (req: Request, res: Response) => {
  const sqlQuery = `
    SELECT user_states.id value,
           user_states.label label
    FROM user_states
    ORDER BY label ASC
  `;
  await queries.pull(req, res, sqlQuery, [], { id: '', name: 'States', verb: 'returned' });
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
/**
 * Create new user
 * 
 * @param req 
 * @param res 
 */
const create = async (req: Request, res: Response) => {
  //let id = uuid();
  //while (await queries.checkId(id, 'users', 'id')) id = uuid();
  const sqlQuery = `
      INSERT INTO users (
                         login,
                         role,
                         state,
                         password,
                         lastActive
                        )
      VALUES (?, ?, ?, ?, ?)
  `;
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  const values = [
    req.body.login,
    req.body.role,
    req.body.state,
    hashedPassword,
    'first-time',
  ];

  await queries.push(req, res, sqlQuery, values, { id: 'id', name: 'User', verb: 'created' });
};

const update = async (req: Request, res: Response) => {
  //let id = uuid();
  //while (await queries.checkId(id, 'users', 'id')) id = uuid();
  const sqlQuery = `
      UPDATE users SET
                         login = ?,
                         role = ?,
                         state = ?,
                         password = ?
                   WHERE id = ?
  `;
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  const values = [
    req.body.login,
    req.body.role,
    req.body.state,
    hashedPassword,
    req.body.id,
  ];

  await queries.push(req, res, sqlQuery, values, { id: 'id', name: 'User', verb: 'updated' });
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
  readAllRoles,
  readAllStates,
  create,
  update,
  getForConnection,
  readOne,
  getPractitioners,
  disable,
  enable,
};
