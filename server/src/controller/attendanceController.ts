import type { NextFunction, Request, Response } from 'express';
import {
  validatePunch,
  processPunch,
} from '../services/attendanceDomainService.js';
import {
  readActiveSession,
  readAttendanceOfUserByDate,
} from '../services/attendanceService.js';
import type { PunchType } from '../types/types.js';

//----------------------------------------------------------------
//Middleware Controllers for the route /attendance

export const punchAttendance = async (req: Request, res: Response) => {
  try {
    const type = req.body.type as PunchType;
    if (type !== 'in' && type !== 'out') {
      return res.status(400).json({ message: 'Invalid punch type' });
    }

    const userId = req.user!.uid;

    const validation = await validatePunch(userId, type);
    if (!validation.ok) {
      return res.status(400).json({ message: validation.reason });
    }

    await processPunch(userId, type);

    return res.status(201).json({ message: 'success' });
  } catch (err) {
    if (err instanceof Error) console.error(err.message);
    return res.status(500).json({ message: 'Failed to punch attendance' });
  }
};

export const getLastPunchAttendanceByUser = async (
  req: Request,
  res: Response
) => {
  try {
    if (req.params.userId !== req.user!.uid) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const attendance = await readActiveSession(req.user!.uid);
    return res.status(200).json({ data: attendance });
  } catch (err) {
    if (err instanceof Error) console.error(err.message);
    return res.status(500).json({ message: 'Failed to retrieve attendance' });
  }
};

export const getAttendanceOfUserByDate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.params.userId !== req.user!.uid) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { userId, date } = req.params;

    if (typeof date !== 'string') {
      return res
        .status(400)
        .json({ message: 'Invalid or missing date parameter' });
    }

    const attendance = await readAttendanceOfUserByDate(userId, date);

    return res.status(200).json({ data: attendance });
  } catch (err) {
    if (err instanceof Error) console.error(err.message);
    return res
      .status(500)
      .json({ message: 'Failed to retrieve attendance for today' });
  }
};
