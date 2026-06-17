export type UserRole = 'employee' | 'admin';

export interface WorkSchedule {
  start: string;
  end: string;
}

export interface UserProfileType {
  //before registering, uid is null, uid is assigned by firebase automatically
  uid?: string;
  name: string;
  email: string;
  role: UserRole | null;
  timezone: string;
  schedule: WorkSchedule;
}
