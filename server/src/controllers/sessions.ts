import { Request, Response } from 'express';
import moment from 'moment';
import queries from '../database/queries.js';


const  getByParticipant = async (req: Request, res: Response) => {
  const sqlQuery = `
    SELECT s.id, st.label AS type, sm.label AS mode, s.notes FROM sessions s
        INNER JOIN session_participants sp ON s.id = sp.session_id
        INNER JOIN session_types st ON s.session_type = st.id
        INNER JOIN session_modes sm ON s.mode = sm.id
        WHERE sp.participant_id = ?
    `
  await queries.pull(req, res, sqlQuery, [req.params.participant], {
    id: req.params.participant as string,
    name: 'Sessions',
    verb: 'returned',
  });
}



const getByPatient = async (req: Request, res: Response) => {
  const sqlQuery = `
      SELECT app.id     AS appID,
             app.kind,
             app.status,
             e.start,
             e.end,
             u.name     AS practitionerName,
             u.lastName AS practitionerLastName,
             app.content,
             app.payment,
             acc.amount,
             acc.method
      FROM appointments app
               INNER JOIN events e ON app.id = e.appID
               INNER JOIN users u ON e.calendar = u.id
               LEFT JOIN accounting acc ON app.payment = acc.id
      WHERE patientId = ?
      ORDER BY e.start DESC;
  `;

  await queries.pull(req, res, sqlQuery, [req.params.id], {
    id: req.params.id as string,
    name: 'Appointments',
    verb: 'returned',
  });
};

export default  {
  getByParticipant,
  getByPatient,
};
