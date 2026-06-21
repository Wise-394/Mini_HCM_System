import type { AttendanceDoc, WorkSchedule } from '../../types/types.js';
import { DateTime } from 'luxon';
import { roundHours, getShiftLengthHours } from './helpers.js';
const MANILA_TZ = 'Asia/Manila';

export const calculateHoursWorked = (
  punchIn: AttendanceDoc,
  punchOut: AttendanceDoc
): number => {
  const diffMs = punchOut.timestamp.toMillis() - punchIn.timestamp.toMillis();
  const hours = diffMs / (1000 * 60 * 60);
  return roundHours(Math.max(0, hours));
};

export const calculateRegularHours = (
  hoursWorked: number,
  schedule: WorkSchedule
): number => {
  const shiftLength = getShiftLengthHours(schedule);
  return roundHours(Math.min(hoursWorked, shiftLength));
};

export const calculateOvertimeHours = (
  hoursWorked: number,
  schedule: WorkSchedule
): number => {
  const shiftLength = getShiftLengthHours(schedule);
  return roundHours(Math.max(0, hoursWorked - shiftLength));
};

export const calculateLateMinutes = (
  punchIn: AttendanceDoc,
  schedule: WorkSchedule
): number => {
  const punchInDt = DateTime.fromMillis(punchIn.timestamp.toMillis(), {
    zone: MANILA_TZ,
  });

  const [startHour, startMinute] = schedule.start.split(':').map(Number);
  const scheduledStart = punchInDt.set({
    hour: startHour,
    minute: startMinute,
    second: 0,
    millisecond: 0,
  });

  const diffMinutes = punchInDt.diff(scheduledStart, 'minutes').minutes;
  return Math.max(0, Math.round(diffMinutes));
};

export const calculateUndertimeMinutes = (
  hoursWorked: number,
  schedule: WorkSchedule
): number => {
  const shiftLengthMinutes = getShiftLengthHours(schedule) * 60;
  const workedMinutes = hoursWorked * 60;
  return Math.max(0, Math.round(shiftLengthMinutes - workedMinutes));
};

export const calculateNightDifferentialHours = (
  punchIn: AttendanceDoc,
  punchOut: AttendanceDoc
): number => {
  const sessionStart = DateTime.fromMillis(punchIn.timestamp.toMillis(), {
    zone: MANILA_TZ,
  });
  const sessionEnd = DateTime.fromMillis(punchOut.timestamp.toMillis(), {
    zone: MANILA_TZ,
  });

  // helper: hours of the session that fall inside a given window
  const hoursInWindow = (
    windowStart: DateTime,
    windowEnd: DateTime
  ): number => {
    const overlapStart =
      sessionStart > windowStart ? sessionStart : windowStart;
    const overlapEnd = sessionEnd < windowEnd ? sessionEnd : windowEnd;
    const diffMs = overlapEnd.toMillis() - overlapStart.toMillis();
    return Math.max(0, diffMs / (1000 * 60 * 60));
  };

  // window A: 22:00 on punchIn's date → 06:00 next day
  const windowAStart = sessionStart.set({
    hour: 22,
    minute: 0,
    second: 0,
    millisecond: 0,
  });
  const windowAEnd = windowAStart
    .plus({ days: 1 })
    .set({ hour: 6, minute: 0, second: 0, millisecond: 0 });

  // window B: 22:00 previous day → 06:00 on punchIn's date
  const windowBEnd = sessionStart.set({
    hour: 6,
    minute: 0,
    second: 0,
    millisecond: 0,
  });
  const windowBStart = windowBEnd
    .minus({ days: 1 })
    .set({ hour: 22, minute: 0, second: 0, millisecond: 0 });

  const totalNightDifferentialHours =
    hoursInWindow(windowAStart, windowAEnd) +
    hoursInWindow(windowBStart, windowBEnd);

  return roundHours(totalNightDifferentialHours);
};
