import { Router } from 'express';
const router: Router = Router();
import controller from '../controllers/contacts';
import middleware from '../middleware/contacts';

router.get('/', controller.readAll);
router.get('/:id', controller.readOne);
router.post('/add', middleware.create, controller.create);
router.post('/update', middleware.update, controller.update);

export default router;
