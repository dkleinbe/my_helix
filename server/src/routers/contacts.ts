import { Router } from 'express';
const router: Router = Router();
import controller from '../controllers/contacts.js';
import middleware from '../middleware/contacts.js';

// controller
router.get('/', controller.readAll);
router.get('/types', controller.readAllTypes);
router.get('/:id', controller.readOne);
// middleware
router.post('/add', middleware.create, controller.create);
router.post('/update', middleware.update, controller.update);

export default router;
