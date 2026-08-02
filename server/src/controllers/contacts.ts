import { Request, Response } from 'express';
import queries from '../database/queries.js';
import bcrypt from 'bcrypt';
import loggerBuilder from '../tools/tapeLogger.js';

const readAllTypes = async (req: Request, res: Response) => {
  const sqlQuery = `
    SELECT contact_types.id value,
           contact_types.label label
    FROM contact_types
    ORDER BY value ASC
  `;
  await queries.pull(req, res, sqlQuery, [], { id: '', name: 'contact_types', verb: 'returned' });
};
/**
 * Reads all contact with `type_bitfield` containing `req.query.types`
 * @param req 
 * @param res 
 */
const readAll = async (req: Request, res: Response) => {
  loggerBuilder.info('Types = ' +  req.query.types)
  
  const sqlQuery = `
    SELECT contacts.id,
            type_bitfield,
            firstName,
            lastName,
            birthDate,
            sex,
            email,
            phone,
            address,
            city,
            job
    FROM contacts
    WHERE type_bitfield & ?
    ORDER BY lastName ASC
  `;
  await queries.pull(req, res, sqlQuery, [req.query.types], { id: '', name: 'Contacts', verb: 'returned' });
};


const readOne = async (req: Request, res: Response) => {
  const sqlQuery = `
      SELECT id,
            type_bitfield,
            firstName,
            lastName,
            birthDate,
            sex,
            email,
            phone,
            address,
            city,
            job
      FROM contacts
      WHERE id = ?
  `;
  await queries.pull(req, res, sqlQuery, [req.params.id], { id: req.params.id as string, name: 'Contact', verb: 'returned' });
};
/**
 * Create new contact
 * 
 * @param req 
 * @param res 
 */
const create = async (req: Request, res: Response) => {
  //let id = uuid();
  //while (await queries.checkId(id, 'contacts', 'id')) id = uuid();
  const sqlQuery = `
      INSERT INTO contacts (
            firstName,
            lastName,
            birthDate,
            sex,
            email,
            phone,
            address,
            city,
            job
                        )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  
  const values = [
            req.body.firstName,
            req.body.lastName,
            req.body.birthDate,
            req.body.sex,
            req.body.email,
            req.body.phone,
            req.body.address,
            req.body.city,
            req.body.job
  ];

  await queries.push(req, res, sqlQuery, values, { id: req.body.login, name: 'Contact', verb: 'created' });
};

const update = async (req: Request, res: Response) => {
  //let id = uuid();
  //while (await queries.checkId(id, 'contacts', 'id')) id = uuid();
  const sqlQuery = `
      UPDATE contacts SET
            firstName = ?,
            lastName = ?,
            birthDate = ?,
            sex = ?,
            email = ?,
            phone = ?,
            address = ?,
            city = ?,
            job = ?,
            type_bitfield = ?
      WHERE id = ?
  `;
  
  const values = [
            req.body.firstName,
            req.body.lastName,
            req.body.birthDate,
            req.body.sex,
            req.body.email,
            req.body.phone,
            req.body.address,
            req.body.city,
            req.body.job,
            req.body.type_bitfield,
            req.body.id
  ];

  await queries.push(req, res, sqlQuery, values, { id: req.body.login, name: 'Contact', verb: 'updated' });
};



export default {
  readAllTypes,
  readAll,
  create,
  update,
  readOne,
};
