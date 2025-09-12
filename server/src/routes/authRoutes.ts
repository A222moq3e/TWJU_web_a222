import { Router } from 'express';
import { register, login, getMe, getMyDashboard } from '../controllers/authController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', authenticateToken, getMe);
router.get('/me/dashboard', authenticateToken, getMyDashboard);

export default router;
