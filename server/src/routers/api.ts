import { Router, Request, Response } from 'express';
import accounting from './accounting.js';
import appointments from './appointments.js';
import auth from '../middleware/auth.js';
import authORoute from './auth.js';
import events from './events.js';
import patients from './patients.js';
import unsecured from './unsecured.js';
import users from './users.js';
import contacts from './contacts.js';
import sessions from './sessions.js';
import logger from '../tools/tapeLogger.js';
import sc from '../tools/status-codes.js';

const router: Router = Router();

router.get('/', (req: Request, res: Response) => {
    res.status(sc.OK).json({ message: 'Helix: A System for Patient Management [[API]]' });
    logger.successReq(req, res, 'Return API');
});

// Routers
router.use('/unsecured', unsecured);
router.use('/auth', authORoute);

// Protected routes
router.use(auth.verifyToken);
router.use('/patients', patients);
router.use('/appointments', appointments);
router.use('/users', users);
router.use('/contacts', contacts);
router.use('/sessions', sessions);
router.use('/accounting', accounting);
router.use('/events', events);

export default router;
