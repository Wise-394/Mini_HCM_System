export type UserRole = 'employee' | 'admin';

export interface WorkSchedule {
  start: string;
  end: string;
}

export interface UserProfileType {
  uid: string | null;
  name: string;
  email: string;
  role: UserRole | null;
  timezone: string;
  schedule: WorkSchedule;
}
