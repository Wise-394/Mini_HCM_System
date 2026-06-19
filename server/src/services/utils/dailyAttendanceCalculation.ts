import type { AttendanceDoc, WorkSchedule } from '../../types/types.js';

// 1
export const calculateHoursWorked = (
  punchIn: AttendanceDoc,
  punchOut: AttendanceDoc
): number => {
  const diffMs = punchOut.timestamp.toMillis() - punchIn.timestamp.toMillis();
  const hours = diffMs / (1000 * 60 * 60);
  return Math.max(0, hours);
};
// 2
export const calculateRegularHours = (
  hoursWorked: number,
  schedule: WorkSchedule
): number => {
  // TODO: min(hoursWorked, scheduled shift length)
  return 0;
};

// 3
export const calculateOvertimeHours = (
  hoursWorked: number,
  schedule: WorkSchedule
): number => {
  // TODO: max(0, hoursWorked - scheduled shift length)
  return 0;
};

// 4
export const calculateLateMinutes = (
  punchIn: AttendanceDoc,
  schedule: WorkSchedule
): number => {
  // TODO: compare punchIn.timestamp against schedule.start (same date)
  // return max(0, punchIn - scheduledStart) in minutes
  return 0;
};

// 5
export const calculateUndertimeMinutes = (
  punchOut: AttendanceDoc,
  schedule: WorkSchedule
): number => {
  // TODO: compare punchOut.timestamp against schedule.end (same date)
  // return max(0, scheduledEnd - punchOut) in minutes
  return 0;
};

// 6
export const calculateNightDifferentialHours = (
  punchIn: AttendanceDoc,
  punchOut: AttendanceDoc
): number => {
  // TODO: overlap of [punchIn, punchOut] with 22:00–06:00 window
  return 0;
};
