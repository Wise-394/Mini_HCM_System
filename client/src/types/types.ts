export type UserRole = "employee" | "admin";

export interface WorkSchedule {
  start: string;
  end: string;
}

export interface UserProfile {
  name: string;
  email: string;
  role: UserRole;
  timezone: string;
  schedule: WorkSchedule;
}
