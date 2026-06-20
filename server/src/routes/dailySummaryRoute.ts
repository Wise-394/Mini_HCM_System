import { Router } from 'express';
import { verifyToken } from '../middleware/verifyToken.js';
import {
  getUserDailySummaryHistory,
  getUserDailySummaryByDate,
} from '../controller/dailySummaryController.js';

export const dailySummaryRouter = Router();

// GET    /api/daily-summaries/:userId/:date                   → get daily summary of user in specific date
// GET    /api/daily-summaries/:userId?offset=0&limit=10       → get daily summary history of user based on offset and limit

dailySummaryRouter.get(
  '/:userId/:date',
  verifyToken,
  getUserDailySummaryByDate
);
dailySummaryRouter.get('/:userId', verifyToken, getUserDailySummaryHistory);
