import { readAttendanceOfUserByDate } from './attendanceService.js';
import { readUser } from './userService.js';
import {
  calculateLateMinutes,
  calculateUndertimeMinutes,
  calculateHoursWorked,
  calculateRegularHours,
  calculateOvertimeHours,
  calculateNightDifferentialHours,
} from '../services/utils/dailyAttendanceCalculation.js';
import type { DailySummary } from '../types/types.js';

export const computeDailySummary = async (
  userId: string,
  date: string
): Promise<DailySummary> => {
  const [{ in: punchIn, out: punchOut }, profile] = await Promise.all([
    readAttendanceOfUserByDate(userId, date),
    readUser(userId),
  ]);

  // TODO: handle profile === null (user not found)
  const schedule = profile!.schedule;

  let status: DailySummary['status'];
  let hoursWorked: number | null = null;
  let regularHours: number | null = null;
  let overtimeHours: number | null = null;
  let nightDifferentialHours: number | null = null;
  let lateMinutes: number | null = null;
  let undertimeMinutes: number | null = null;

  if (!punchIn && !punchOut) {
    status = 'absent';
    // all metrics stay null — nothing was worked
  } else if (punchIn && !punchOut) {
    status = 'incomplete';
    lateMinutes = calculateLateMinutes(punchIn, schedule);
    // hoursWorked/regular/OT/undertime/ND stay null until punchOut exists
  } else {
    status = 'present';
    hoursWorked = calculateHoursWorked(punchIn!, punchOut!);
    regularHours = calculateRegularHours(hoursWorked, schedule);
    overtimeHours = calculateOvertimeHours(hoursWorked, schedule);
    nightDifferentialHours = calculateNightDifferentialHours(
      punchIn!,
      punchOut!
    );
    lateMinutes = calculateLateMinutes(punchIn!, schedule);
    undertimeMinutes = calculateUndertimeMinutes(punchOut!, schedule);
  }

  return {
    userId,
    date,
    punchIn,
    punchOut,
    status,
    hoursWorked,
    regularHours,
    overtimeHours,
    nightDifferentialHours,
    lateMinutes,
    undertimeMinutes,
  };
};
