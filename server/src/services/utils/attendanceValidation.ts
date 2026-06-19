import type {
  AttendanceDoc,
  PunchType,
  AttendanceValidationResult,
} from '../../types/types.js';

//  Decides whether a punch of `type` is allowed, given the user's last punch
//  Rules:
//  1. No punch history yet → must punch in first.
//  2. Last punch was TODAY → must alternate in/out strictly.
//  3. Last punch was a PREVIOUS day and still 'in' (forgotten punch-out) →
//      allow punch-in (auto-resolves the stale day) or punch-out (completes
//     an overnight shift).
//  4. Last punch was a PREVIOUS day and already 'out' → must punch in first,
//      cannot punch out again with nothing open.

export const validatePunchSequence = (
  lastPunch: AttendanceDoc | null,
  type: PunchType,
  today: string
): AttendanceValidationResult => {
  if (lastPunch === null) {
    return type === 'in'
      ? { allowed: true }
      : { allowed: false, reason: 'No active session, punch in first' };
  }

  const isFromToday = lastPunch.date === today;

  if (isFromToday) {
    if (lastPunch.type === 'in' && type !== 'out') {
      return { allowed: false, reason: 'Already punched in, punch out first' };
    }
    if (lastPunch.type === 'out' && type !== 'in') {
      return {
        allowed: false,
        reason: 'Already completed attendance for today',
      };
    }
    return { allowed: true };
  }

  // last punch is from a previous day
  if (lastPunch.type === 'out' && type === 'out') {
    return { allowed: false, reason: 'No active session, punch in first' };
  }

  return { allowed: true };
};

export const hasCompletedTodaysAttendance = (
  punchIn: AttendanceDoc | null,
  punchOut: AttendanceDoc | null
): boolean => Boolean(punchIn && punchOut);
