import { Router } from 'express';
import { getFile } from '../controllers/mediaController';

const router = Router();

router.get('/file', getFile);

export default router;
