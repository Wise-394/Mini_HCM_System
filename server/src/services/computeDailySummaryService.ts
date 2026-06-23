import { readAttendanceOfUserByDate } from './attendanceService.js';
import { readUser } from './userService.js';
import { saveDailySummary } from './dailySummaryService.js';
import {
  calculateLateMinutes,
  calculateUndertimeMinutes,
  calculateHoursWorked,
  calculateRegularHours,
  calculateOvertimeHours,
  calculateNightDifferentialHours,
} from './utils/dailyAttendanceCalculation.js';
import type { DailySummary } from '../types/types.js';

//----------------------------------------------------------------
//Responsible for computing daily summary logic

export const computeDailySummary = async (
  userId: string,
  date: string
): Promise<DailySummary> => {
  const [{ in: punchIn, out: punchOut }, profile] = await Promise.all([
    readAttendanceOfUserByDate(userId, date),
    readUser(userId),
  ]);

  if (!profile) {
    throw new Error(`User not found: ${userId}`);
  }

  const schedule = profile.schedule;

  let status: DailySummary['status'];
  let hoursWorked: number | null = null;
  let regularHours: number | null = null;
  let overtimeHours: number | null = null;
  let nightDifferentialHours: number | null = null;
  let lateMinutes: number | null = null;
  let undertimeMinutes: number | null = null;

  if (punchIn && !punchOut) {
    status = 'incomplete';
    lateMinutes = calculateLateMinutes(punchIn, schedule);
  } else if (punchIn && punchOut) {
    status = 'present';
    hoursWorked = calculateHoursWorked(punchIn, punchOut);
    regularHours = calculateRegularHours(hoursWorked, schedule);
    overtimeHours = calculateOvertimeHours(hoursWorked, schedule);
    nightDifferentialHours = calculateNightDifferentialHours(punchIn, punchOut);
    lateMinutes = calculateLateMinutes(punchIn, schedule);
    undertimeMinutes = calculateUndertimeMinutes(hoursWorked, schedule);
  } else {
    status = 'incomplete';
  }

  const summary: DailySummary = {
    userId,
    date,
    status,
    hoursWorked,
    regularHours,
    overtimeHours,
    nightDifferentialHours,
    lateMinutes,
    undertimeMinutes,
  };

  await saveDailySummary(summary);

  return summary;
};
