import type { Request, Response, NextFunction } from 'express';
import {
  createAttendanceDoc,
  getLastAttendanceDocByUser,
} from '../services/attendanceService.js';
import type { AttendanceDoc, PunchType } from '../types/types.js';
import { Timestamp } from 'firebase-admin/firestore';

export const validateAttendance = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const type = req.body.type as PunchType;
    const userId = req.user!.uid;

    // type must be "in" or "out"
    if (type !== 'in' && type !== 'out') {
      return res.status(400).json({ message: 'Invalid punch type' });
    }

    const lastPunch = await getLastAttendanceDocByUser(userId);
    //CONDITIONS:
    //can only punch-in if last punch is null or out
    //can only punch-out if last punch is in
    //the rest -> decline all
    if (lastPunch === null && type !== 'in') {
      return res
        .status(400)
        .json({ message: 'No active session, punch in first' });
    }

    if (lastPunch?.type === 'in' && type !== 'out') {
      return res
        .status(400)
        .json({ message: 'Already punched in, punch out first' });
    }

    if (lastPunch?.type === 'out' && type !== 'in') {
      return res
        .status(400)
        .json({ message: 'Already punched out, punch in first' });
    }
    next();
  } catch (err) {
    if (err instanceof Error)
      console.error('failed to validate attendanec', err.message);
    return res.status(500).json({ message: 'Failed to validate attendance' });
  }
};

export const punchAttendance = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const type = req.body.type as PunchType;
    const attendance: AttendanceDoc = {
      userId: req.user!.uid,
      date: new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Manila' }),
      timestamp: Timestamp.now(),
      type: type,
    };
    await createAttendanceDoc(attendance);
    return res.status(201).json({ message: 'success' });
  } catch (err) {
    if (err instanceof Error) {
      console.log(err.message);
    }
    return res.status(500).json({ message: 'failed to punch attendance' });
  }
};

export const getLastAttendanceByUserController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //check if params.userId === user.id (if authorized to get attendance)
    if (req.params.userId !== req.user!.uid) {
      return res.status(401).json({ message: 'unauthorized' });
    }

    const attendance: AttendanceDoc | null = await getLastAttendanceDocByUser(
      req.user!.uid
    );
    return res.status(200).json({ attendance });
  } catch (err) {
    if (err instanceof Error) {
      console.log('failed to get last attendance in controller', err.message);
    }
    return res.status(500).json({ message: 'failed to retrieve attendance' });
  }
};
