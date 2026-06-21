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
  name?: string;
  schedule?: WorkSchedule | null;
  in: AttendanceDoc | null;
  out: AttendanceDoc | null;
}

export interface DailySummary {
  userId: string;
  date: string;
  status: 'present' | 'absent' | 'incomplete';
  hoursWorked: number | null;
  regularHours: number | null;
  overtimeHours: number | null;
  nightDifferentialHours: number | null;
  lateMinutes: number | null;
  undertimeMinutes: number | null;
}

export type AttendanceValidationResult =
  | { allowed: true }
  | { allowed: false; reason: string };

export type AdminDailyKpis = {
  totalEmployees: number;
  presentCount: number;
  regularHours: number;
  overtimeHours: number;
  nightDifferentialHours: number;
  lateCount: number;
  undertimeCount: number;
};

export interface DailyAttendanceWithSummary {
  name?: string;
  schedule?: WorkSchedule | null;
  in: AttendanceDoc | null;
  out: AttendanceDoc | null;
  summary?: DailySummary | null;
}
