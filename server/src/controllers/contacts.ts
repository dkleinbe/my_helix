import { Request, Response } from 'express';
import queries from '../database/queries';
import bcrypt from 'bcrypt';

const readAll = async (req: Request, res: Response) => {
  const sqlQuery = `
    SELECT contacts.id,
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
    ORDER BY lastName ASC
  `;
  await queries.pull(req, res, sqlQuery, [], { id: '', name: 'Contacts', verb: 'returned' });
};


const readOne = async (req: Request, res: Response) => {
  const sqlQuery = `
      SELECT id,
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
            job = ?
      WHERE id = ?
  `;
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
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

  await queries.push(req, res, sqlQuery, values, { id: req.body.login, name: 'Contact', verb: 'updated' });
};



export default {
  readAll,
  create,
  update,
  readOne,
};
