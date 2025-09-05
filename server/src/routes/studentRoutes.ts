import { Router } from 'express';
import { getStudents, getDashboard } from '../controllers/studentController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.get('/', authenticateToken, getStudents);
router.get('/dashboard', authenticateToken, getDashboard);

export default router;
