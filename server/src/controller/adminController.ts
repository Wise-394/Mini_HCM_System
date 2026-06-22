//some controllers are reused from employees and arent in admin controller
//check adminRoute.ts to view all controllers used by admin
import type { Request, Response, NextFunction } from 'express';
import type { DailyAttendance } from '../types/types.js';
import { computeDailySummary } from '../services/computeDailySummaryService.js';
import { putAttendanceByDate } from '../services/adminService.js';
import { readAllAttendanceWithDailySummaryOfUser } from '../services/adminService.js';
import {
  computeAdminDailyKpis,
  readAllEmployees,
} from '../services/adminService.js';
import { readAllUsersAttendanceByDate } from '../services/adminService.js';

export const getKPIOfAllEmployees = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { date } = req.params;
    if (!date || typeof date !== 'string') {
      return res.status(400).json({ message: 'Invalid date parameter.' });
    }
    const kpis = await computeAdminDailyKpis(date);
    return res.status(200).json({ data: kpis });
  } catch (err) {
    if (err instanceof Error) {
      console.error('getKPIOfAllEmployee error:', err.message);
    }
    return res.status(500).json({ message: 'Failed to retrieve KPIs.' });
  }
};

export const getAllUsersAttendanceByDate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { date } = req.params;
    if (!date || typeof date !== 'string') {
      return res.status(400).json({ message: 'Invalid date parameter.' });
    }
    const attendance = await readAllUsersAttendanceByDate(date);
    return res.status(200).json({ data: attendance });
  } catch (err) {
    if (err instanceof Error) {
      console.error('getAllUserAttendanceByDate error:', err.message);
    }
    return res.status(500).json({ message: 'Failed to retrieve attendance.' });
  }
};

export const getAllEmployees = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const employees = await readAllEmployees();
    return res.status(200).json({ data: employees });
  } catch (err) {
    if (err instanceof Error) {
      console.error('getAllEmployees error:', err.message);
    }
    return res.status(500).json({ message: 'Failed to retrieve employees.' });
  }
};

export const getAllAttendanceOfUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.params;
    if (!userId || typeof userId !== 'string') {
      return res.status(400).json({ message: 'Invalid userId parameter.' });
    }
    const attendance = await readAllAttendanceWithDailySummaryOfUser(userId);
    return res.status(200).json({ data: attendance });
  } catch (err) {
    if (err instanceof Error) {
      console.error('getAllUserAttendance error:', err.message);
    }
    return res.status(500).json({ message: 'Failed to retrieve attendance.' });
  }
};

export const updateAttendanceByDate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.params.userId as string;
    const date = req.params.date as string;
    const { in: punchIn, out: punchOut } = req.body;

    if (!punchIn && !punchOut) {
      res
        .status(400)
        .json({ error: 'Provide at least one punch (in or out) to update.' });
      return;
    }

    await putAttendanceByDate(userId, date, { in: punchIn, out: punchOut });
    await computeDailySummary(userId, date);

    res
      .status(200)
      .json({ message: `Attendance for ${userId} on ${date} updated.` });
  } catch (err) {
    if (err instanceof Error) {
      console.error('putAttendanceByDate error:', err.message);
    }
    res.status(500).json({ message: 'Failed to update attendance.' });
  }
};
