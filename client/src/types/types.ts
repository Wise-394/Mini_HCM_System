export type UserRole = 'employee' | 'admin';

export interface WorkSchedule {
  start: string;
  end: string;
}

export interface UserProfileType {
  uid?: string;
  name: string;
  email: string;
  role: UserRole | null;
  timezone: string;
  schedule: WorkSchedule;
}

export interface FirestoreTimestamp {
  _seconds: number;
  _nanoseconds: number;
}

export type PunchType = 'in' | 'out';
export interface Attendance {
  id?: string;
  userId: string;
  type: PunchType;
  timestamp: string | FirestoreTimestamp;
  date: string;
}

export interface DailyAttendance {
  in: Attendance | null;
  out: Attendance | null;
}

export interface DailySummary {
  date: string;
  regularHours: number;
  overtimeHours: number;
  nightDifferentialHours: number;
  lateMinutes: number;
  undertimeMinutes: number;
  hoursWorked: number;
  status: string;
  userId: string;
}

export interface PaginationMeta {
  offset: number;
  limit: number;
  total: number;
}

export interface DailySummaryHistoryResponse {
  data: DailySummary[];
  pagination: PaginationMeta;
}
