import { Router } from 'express';
import { register, login, getMe, getMyDashboard, updateMe } from '../controllers/authController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', authenticateToken, getMe);
router.get('/me/dashboard', authenticateToken, getMyDashboard);
router.put('/me', authenticateToken, updateMe);

export default router;
