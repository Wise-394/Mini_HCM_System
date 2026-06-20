import {
  createAttendanceDoc,
  readActiveSession,
  readUnresolvedPunchIn,
  readAttendanceOfUserByDate,
} from './attendanceService.js';
import { computeDailySummary } from './computeDailySummaryService.js';
import {
  validatePunchSequence,
  hasCompletedTodaysAttendance,
} from './utils/attendanceValidation.js';
import { getTodayManila } from './utils/helpers.js';
import { Timestamp } from 'firebase-admin/firestore';
import type { AttendanceDoc, PunchType } from '../types/types.js';

export type PunchValidationError = { ok: false; reason: string } | { ok: true };

export const validatePunch = async (
  userId: string,
  type: PunchType
): Promise<PunchValidationError> => {
  const today = getTodayManila();
  const lastPunch = await readActiveSession(userId);

  const sequenceCheck = validatePunchSequence(lastPunch, type, today);
  if (!sequenceCheck.allowed) {
    return { ok: false, reason: sequenceCheck.reason };
  }

  if (type === 'in') {
    const { in: punchIn, out: punchOut } = await readAttendanceOfUserByDate(
      userId,
      today
    );
    if (hasCompletedTodaysAttendance(punchIn, punchOut)) {
      return { ok: false, reason: 'Already completed attendance for today' };
    }
  }

  return { ok: true };
};

export const processPunch = async (
  userId: string,
  type: PunchType
): Promise<void> => {
  const today = getTodayManila();
  let date = today;

  if (type === 'out') {
    // reuse punch-in's date to keep overnight shifts under a single date
    const lastPunch = await readActiveSession(userId);
    if (lastPunch?.type === 'in') {
      date = lastPunch.date;
    }
  }

  if (type === 'in') {
    // resolve any forgotten punch-in from a previous day before writing new one
    const staleUnresolved = await readUnresolvedPunchIn(userId);
    if (staleUnresolved && staleUnresolved.date !== today) {
      await computeDailySummary(userId, staleUnresolved.date);
    }
  }

  const attendance: AttendanceDoc = {
    userId,
    date,
    timestamp: Timestamp.now(),
    type,
  };

  await createAttendanceDoc(attendance);

  if (type === 'out') {
    await computeDailySummary(userId, date);
  }
};
