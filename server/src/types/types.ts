import type { Timestamp } from 'firebase-admin/firestore';

export interface WorkSchedule {
  start: string;
  end: string;
}
export type UserRole = 'employee' | 'admin';
export interface UserProfileType {
  uid: string;
  name: string;
  email: string;
  role: UserRole | null;
  timezone: string;
  schedule: WorkSchedule;
}

export type PunchType = 'in' | 'out';
export interface AttendanceDoc {
  id?: string;
  userId: string;
  type: PunchType;
  timestamp: Timestamp;
  date: string;
}

export interface DailyAttendance {
  in: AttendanceDoc | null;
  out: AttendanceDoc | null;
}

export interface DailySummary {
  userId: string;
  date: string;
  punchIn: AttendanceDoc | null;
  punchOut: AttendanceDoc | null;
  status: 'present' | 'absent' | 'incomplete';
  hoursWorked: number | null;
  regularHours: number | null;
  overtimeHours: number | null;
  nightDifferentialHours: number | null;
  lateMinutes: number | null;
  undertimeMinutes: number | null;
}
