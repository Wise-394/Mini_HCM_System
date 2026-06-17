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
