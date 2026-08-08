import { Router } from 'express';
//import controller from '../controllers/appointment.js';
import controllerAll from '../controllers/sessions.js';
import middleware from '../middleware/sessions.js';

const router: Router = Router();

//router.get('/patient/:id', controllerAll.getByPatient);
//router.get('/read/:id/', controller.read);
router.get('/contact/:participant', controllerAll.getByParticipant);
//router.get('/:id/get-minimal', controller.getFromEvent);
//router.post('/new', middleware.create, controller.create);
//router.put('/:id/content', middleware.update, controller.updateContent);

export default router;
