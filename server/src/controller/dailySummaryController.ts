import type { Request, Response, NextFunction } from 'express';
import {
  readDailySummaryHistory,
  readDailySummary,
} from '../services/dailySummaryService.js';
import { toStringParam } from '../services/utils/helpers.js';

//----------------------------------------------------------------
//Middleware Controllers for the route /daily-summaries

export const getUserDailySummaryHistory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = toStringParam(req.params.userId);

  if (!userId) {
    return res.status(400).json({ message: 'Invalid parameters.' });
  }

  if (userId !== req.user!.uid) {
    return res.status(403).json({ message: 'Unauthorized access.' });
  }

  const limit = Math.min(Number(req.query.limit) || 7, 20);
  const offset = Number(req.query.offset) || 0;

  try {
    const summaries = await readDailySummaryHistory(userId, limit, offset);

    res.status(200).json({
      data: summaries,
      pagination: {
        offset,
        limit,
        total: summaries.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getUserDailySummaryByDate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = toStringParam(req.params.userId);
  const date = toStringParam(req.params.date);

  if (!userId || !date) {
    return res.status(400).json({ message: 'Invalid parameters.' });
  }

  if (userId !== req.user!.uid) {
    return res.status(403).json({ message: 'Unauthorized access.' });
  }

  try {
    const summary = await readDailySummary(userId, date);

    if (!summary) {
      return res.status(404).json({ message: 'Daily summary not found.' });
    }

    return res.status(200).json({ data: summary });
  } catch (error) {
    next(error);
  }
};
