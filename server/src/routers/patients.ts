import { Router } from 'express';
const router: Router = Router();
import controller from '../controllers/patient.js';
import controllerAll from '../controllers/patients.js';
import middleware from '../middleware/patients.js';

router.get('/', controllerAll.readAll);

router.get('/appointments', controllerAll.readAllConnexion);

router.get('/:id', controller.read);
router.delete('/:id', controller.delete);

router.post('/add', middleware.create, controller.create);

router.put('/:id', middleware.update, controller.update);

export default router;
