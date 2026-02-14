import { Router } from 'express';
import { getSheet, upsertSheet } from '../controllers/sheetController';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.get('/', requireAuth, getSheet);
router.put('/', requireAuth, upsertSheet);

export default router;
