import type { Request, Response, NextFunction } from 'express';
import {
  createAttendanceDoc,
  readLastAttendanceDocByUser,
  readUnresolvedPunchIn,
} from '../services/attendanceService.js';
import type { AttendanceDoc, PunchType } from '../types/types.js';
import { Timestamp } from 'firebase-admin/firestore';
import { computeDailySummary } from '../services/computeDailySummaryService.js';
import { readAttendanceOfUserByDate } from '../services/attendanceService.js';

export const validateAttendanceType = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const type = req.body.type as PunchType;
    const userId = req.user!.uid;

    if (type !== 'in' && type !== 'out') {
      return res.status(400).json({ message: 'Invalid punch type' });
    }

    const lastPunch = await readLastAttendanceDocByUser(userId);
    const today = new Date().toLocaleDateString('en-PH', {
      timeZone: 'Asia/Manila',
    });

    // CONDITIONS (SAME-DAY SEQUENCE):
    // - If last punch was today: can only punch-in if last punch is 'out', and punch-out if last punch is 'in'.
    // - If last punch was a previous day: can punch-in directly (stale session auto-closes as incomplete),
    //   or punch-out (continues an active overnight shift).
    // - Enforces strictly 1 full shift (one punch-in and one punch-out) maximum per calendar day.
    if (lastPunch === null && type !== 'in') {
      return res
        .status(400)
        .json({ message: 'No active session, punch in first' });
    }

    // Only apply strict sequence restrictions if the last punch happened today.
    // If the last punch is from a previous day, allow punch-in to pass through
    // so punchAttendance can auto-resolve the stale day.
    if (lastPunch && lastPunch.date === today) {
      if (lastPunch.type === 'in' && type !== 'out') {
        return res
          .status(400)
          .json({ message: 'Already punched in, punch out first' });
      }
      if (lastPunch.type === 'out' && type !== 'in') {
        return res
          .status(400)
          .json({ message: 'Already completed attendance for today' });
      }
    } else if (lastPunch && lastPunch.date !== today) {
      // If there is a stale punch from a previous day, a user can only punch out
      // if that stale punch was an 'in' (handling overnight shifts). They cannot
      // punch out if the last historical punch was an 'out'.
      if (lastPunch.type === 'out' && type === 'out') {
        return res
          .status(400)
          .json({ message: 'No active session, punch in first' });
      }
    }

    // enforce strictly one in + one out per calendar day
    if (type === 'in') {
      const { in: punchIn, out: punchOut } = await readAttendanceOfUserByDate(
        userId,
        today
      );
      if (punchIn && punchOut) {
        return res
          .status(400)
          .json({ message: 'Already completed attendance for today' });
      }
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
    // calendar date. keeps overnight shifts (e.g. 10pm-6am) as one shift
    // under a single date instead of splitting across two calendar days
    if (type === 'out') {
      const lastPunch = await readLastAttendanceDocByUser(req.user!.uid);
      if (lastPunch?.type === 'in') {
        date = lastPunch.date;
      }
    }

    // for punch-in, check if a previous day's punch-in was left unresolved
    // (employee forgot to punch out) — if so, close that old day out as
    // 'incomplete' before recording today's new punch-in
    if (type === 'in') {
      const staleUnresolved = await readUnresolvedPunchIn(req.user!.uid);
      if (staleUnresolved && staleUnresolved.date !== today) {
        await computeDailySummary(req.user!.uid, staleUnresolved.date);
      }
    }

    const attendance: AttendanceDoc = {
      userId: req.user!.uid,
      date,
      timestamp: Timestamp.now(),
      type: type,
    };
    await createAttendanceDoc(attendance);

    if (type === 'out') {
      await computeDailySummary(req.user!.uid, date);
    }

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
