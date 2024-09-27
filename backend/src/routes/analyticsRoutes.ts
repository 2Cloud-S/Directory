import express from 'express';
import { getToolAnalyticsHandler, getUserAnalyticsHandler, getOverallAnalyticsHandler } from '../controllers/analyticsController';
import { authenticate, authorize } from '../middleware/auth';

const router = express.Router();

router.get('/tool/:toolId', authenticate, authorize(['admin']), getToolAnalyticsHandler);
router.get('/user/:userId', authenticate, authorize(['admin']), getUserAnalyticsHandler);
router.get('/overall', authenticate, authorize(['admin']), getOverallAnalyticsHandler);

export default router;