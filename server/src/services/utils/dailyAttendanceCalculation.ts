import type { AttendanceDoc, WorkSchedule } from '../../types/types.js';

export const calculateLateMinutes = (
  punchIn: AttendanceDoc,
  schedule: WorkSchedule
): number => {
  // TODO: compare punchIn.timestamp against schedule.start (same date)
  // return max(0, punchIn - scheduledStart) in minutes
  return 0;
};

export const calculateUndertimeMinutes = (
  punchOut: AttendanceDoc,
  schedule: WorkSchedule
): number => {
  // TODO: compare punchOut.timestamp against schedule.end (same date)
  // return max(0, scheduledEnd - punchOut) in minutes
  return 0;
};

export const calculateHoursWorked = (
  punchIn: AttendanceDoc,
  punchOut: AttendanceDoc
): number => {
  // TODO: (punchOut.timestamp - punchIn.timestamp) in hours
  return 0;
};

export const calculateRegularHours = (
  hoursWorked: number,
  schedule: WorkSchedule
): number => {
  // TODO: min(hoursWorked, scheduled shift length)
  return 0;
};

export const calculateOvertimeHours = (
  hoursWorked: number,
  schedule: WorkSchedule
): number => {
  // TODO: max(0, hoursWorked - scheduled shift length)
  return 0;
};

export const calculateNightDifferentialHours = (
  punchIn: AttendanceDoc,
  punchOut: AttendanceDoc
): number => {
  // TODO: overlap of [punchIn, punchOut] with 22:00–06:00 window
  return 0;
};
