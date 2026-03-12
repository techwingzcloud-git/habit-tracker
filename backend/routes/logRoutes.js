import express from 'express';
import { getLogs, toggleLog, getAnalytics, getHeatmap } from '../controllers/logController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/', getLogs);
router.post('/toggle', toggleLog);
router.get('/analytics', getAnalytics);
router.get('/heatmap', getHeatmap);

export default router;
