import type { AttendanceDoc, WorkSchedule } from '../../types/types.js';
import { DateTime } from 'luxon';

const MANILA_TZ = 'Asia/Manila';

// ── Helpers ──────────────────────────────────────────

const roundHours = (hours: number): number => Math.round(hours * 100) / 100;

const parseTimeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

const getShiftLengthHours = (schedule: WorkSchedule): number => {
  const startMinutes = parseTimeToMinutes(schedule.start);
  let endMinutes = parseTimeToMinutes(schedule.end);

  if (endMinutes <= startMinutes) {
    endMinutes += 24 * 60;
  }

  return (endMinutes - startMinutes) / 60;
};

// ── Computation functions ───────────────────────────

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
  punchOut: AttendanceDoc,
  schedule: WorkSchedule
): number => {
  const punchOutDt = DateTime.fromMillis(punchOut.timestamp.toMillis(), {
    zone: MANILA_TZ,
  });

  const [endHour, endMinute] = schedule.end.split(':').map(Number);
  const scheduledEnd = punchOutDt.set({
    hour: endHour,
    minute: endMinute,
    second: 0,
    millisecond: 0,
  });

  const diffMinutes = scheduledEnd.diff(punchOutDt, 'minutes').minutes;
  return Math.max(0, Math.round(diffMinutes));
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
