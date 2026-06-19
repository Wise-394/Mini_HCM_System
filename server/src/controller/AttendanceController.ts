import type { Request, Response, NextFunction } from 'express';
import {
  createAttendanceDoc,
  readLastAttendanceDocByUser,
} from '../services/attendanceService.js';
import type { AttendanceDoc, PunchType } from '../types/types.js';
import { Timestamp } from 'firebase-admin/firestore';

export const validateAttendanceType = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const type = req.body.type as PunchType;
    const userId = req.user!.uid;
    const lastPunch = await readLastAttendanceDocByUser(userId);

    //CONDITIONS:
    //can only punch-in if last punch is null or out
    //can only punch-out if last punch is in
    //can only punch in and punch out 1 times a day
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
        .json({ message: 'Already completed attendance for today' });
    }

    next();
  } catch (err) {
    if (err instanceof Error)
      console.error('failed to validate attendance', err.message);
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
    const today = new Date().toLocaleDateString('en-PH', {
      timeZone: 'Asia/Manila',
    });

    let date = today;

    // for punch-out, reuse the matching punch-in's date instead of today's
    // calendar date — keeps overnight shifts (e.g. 10pm-6am) as one shift
    // under a single date instead of splitting across two calendar days
    if (type === 'out') {
      const lastPunch = await readLastAttendanceDocByUser(req.user!.uid);
      if (lastPunch?.type === 'in') {
        date = lastPunch.date;
      }
    }

    const attendance: AttendanceDoc = {
      userId: req.user!.uid,
      date,
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

export const getLastAttendanceByUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //check if params.userId === user.id (if authorized to get attendance)
    if (req.params.userId !== req.user!.uid) {
      return res.status(401).json({ message: 'unauthorized' });
    }

    const attendance: AttendanceDoc | null = await readLastAttendanceDocByUser(
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
