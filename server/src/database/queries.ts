import { Request, Response } from 'express';
import db from '../database/config.js';
import sc from '../tools/status-codes.js';
import log from '../tools/tapeLogger.js';

interface IId {
  id: string;
  name: string;
  verb?: string;
}
//type storage = AsyncLocalStorage<{ message: string; }>;

const checkId = async (id: string, table: string, parameter: string): Promise<boolean> => {
  const sqlQuery = `SELECT COUNT(*) AS count
                    FROM ${table}
                    WHERE ${parameter} = ?`;
  const values = [id];

  return new Promise((resolve, reject) => {
    
    const select = db.prepare(sqlQuery);
    try {
      const rows = select.all(values) as { count: number }[];
      resolve(rows[0].count !== 0);
    } catch (error) {
      if (error instanceof Error) 
        log.message('error', error.message);
      reject(error);
    }

/*     db.query(sqlQuery, values, (err: any, data: any) => {
      if (err) {
        log.message(err);
        reject(err);
      } else {
        resolve(data[0].count !== 0);
      }
    }); */
  });
};

const push = async (req: Request, res: Response, sqlQuery: string, values: any[], meta: IId) => {
  const insert = db.prepare(sqlQuery);
  try {
    const info = insert.run(values);
    if (info.changes === 0) {
      log.message('error', `${meta.name} ${meta.id} not pushed`);
      res.status(sc.INTERNAL_SERVER_ERROR).json({ message: 'Data not pushed' });
    } else {
      log.message('info', `${meta.name} ${meta.id ?? 'all'} ${meta.verb ?? 'pushed'}}`);
      res.status(sc.OK).json({ id: meta.id, message: `${meta.name} ${meta.id} ${meta.verb ?? 'pushed'}` });
    }
  } catch (err) {
    if (err instanceof Error) 
      log.message('error', err.message);
    res.status(sc.BAD_REQUEST).json({ message: 'Bad Request' });
  }
  // db.query(sqlQuery, values, (err: any, data: any) => {
  //   if (err) {
  //     log.message(err);
  //     res.status(sc.BAD_REQUEST).json({ message: 'Bad Request' });
  //   } else if (data.affectedRows === 0) {
  //     log.message(`${meta.name} ${meta.id} not pushed`);
  //     res.status(sc.INTERNAL_SERVER_ERROR).json({ message: 'Data not pushed' });
  //   } else {
  //     log.message(`${meta.name} ${meta.id ?? 'all'} ${meta.verb ?? 'pushed'}}`);
  //     res.status(sc.OK).json({ id: meta.id, message: `${meta.name} ${meta.id} ${meta.verb ?? 'pushed'}` });
  //   }
  // });
};

const pull = async (req: Request, res: Response, sqlQuery: string, values: any[], meta: IId) => {
  
  try {
    const select = db.prepare(sqlQuery);
    const rows = select.all(values);
    if (rows.length === 0) {
      log.message('error', `${meta.name} ${meta.id} no content`);
      res.status(sc.NO_CONTENT).json({ message: `${meta.name} no content` });
    } else {
      log.message('info', `${meta.name} ${meta.id ?? 'all'} ${meta.verb ?? 'pulled'}`);
      res.status(sc.OK).json(rows);
    }
  } catch (err) {
    if (err instanceof Error)
    {
      log.message('error', err.message); 
    }

    res.status(sc.BAD_REQUEST).json({ message: 'Bad request' });
  }
  // db.query(sqlQuery, values, (err: any, data: any) => {
  //   if (err) {
  //     log.message(err);
  //     res.status(sc.METHOD_FAILURE).json({ message: 'Method fails' });
  //   } else if (data.length === 0) {
  //     log.message(`${meta.name} ${meta.id} not found`);
  //     res.status(sc.NOT_FOUND).json({ message: `${meta.name} not found` });
  //   } else {
  //     log.message(`${meta.name} ${meta.id ?? 'all'} ${meta.verb ?? 'pulled'}`);
  //     res.status(sc.OK).json(data);
  //   }
  // });
};

export default {
  checkId,
  push,
  pull,
};
