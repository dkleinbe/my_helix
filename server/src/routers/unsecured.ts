import { Router } from 'express';
const router: Router = Router();
import controller from '../controllers/users.js';

router.get('/users', controller.getForConnection);

export default router;
