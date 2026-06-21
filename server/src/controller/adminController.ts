//some controllers are reused from employees and arent in admin controller
//check adminRoute.ts to view all controllers used by admin
import type { Request, Response, NextFunction } from 'express';
import {
  computeAdminDailyKpis,
  readAllEmployees,
} from '../services/adminService.js';
import { readAllUserAttendanceByDate } from '../services/adminService.js';
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

export const getAllUserAttendanceByDate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { date } = req.params;
    if (!date || typeof date !== 'string') {
      return res.status(400).json({ message: 'Invalid date parameter.' });
    }
    const attendance = await readAllUserAttendanceByDate(date);
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
