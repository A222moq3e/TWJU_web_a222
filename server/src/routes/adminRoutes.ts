import { Router } from 'express';
import { getAdmin } from '../controllers/adminController';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = Router();

router.get('/', authenticateToken, requireAdmin, getAdmin);

export default router;
