import { Router } from 'express';
import { register, login, getMe, getMyDashboard, uploadAvatarMiddleware, updateMyAvatar, updateMyName, updateMyEmail, updateMyGrade, getMyAvatar } from '../controllers/authController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', authenticateToken, getMe);
router.get('/me/dashboard', authenticateToken, getMyDashboard);
// granular profile updates
router.patch('/me/name', authenticateToken, updateMyName);
router.patch('/me/email', authenticateToken, updateMyEmail);
router.patch('/me/grade', authenticateToken, updateMyGrade);
router.patch('/me/avatar', authenticateToken, uploadAvatarMiddleware, updateMyAvatar);
router.get('/me/avatar', authenticateToken, getMyAvatar);

export default router;
