import { Router } from 'express';
const router: Router = Router();
import controller from '../controllers/users';
import middleware from '../middleware/users';

router.get('/', controller.readAll);
router.get('/roles', controller.readAllRoles);
router.get('/states', controller.readAllStates);
router.get('/connexion', controller.getForConnection);
router.get('/practitioners', controller.getPractitioners);
router.get('/:id', controller.readOne);
router.delete('/:id', controller.disable);
router.put('/:id/enable', controller.enable);
router.post('/add', middleware.create, controller.create);
router.post('/update', middleware.update, controller.update);

export default router;
