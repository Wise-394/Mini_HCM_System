import { getFirestore } from 'firebase-admin/firestore';
import type {
  UserProfileType,
  DailySummary,
  AdminDailyKpis,
  DailyAttendance,
  AttendanceDoc,
  DailyAttendanceWithSummary,
} from '../types/types.js';
import { roundHours } from './utils/helpers.js';

//--------------EMPLOYEES
export const readAllEmployees = async (): Promise<UserProfileType[]> => {
  const db = getFirestore();
  const snapshot = await db
    .collection('users')
    .where('role', '==', 'employee')
    .get();

  return snapshot.docs.map(
    (doc) => ({ ...doc.data(), uid: doc.id }) as UserProfileType
  );
};

//---------------DAILY SUMMARY
export const readDailySummaryOfEmployeesByDate = async (
  date: string
): Promise<DailySummary[]> => {
  const db = getFirestore();

  const [snapshot, employees] = await Promise.all([
    db.collection('dailySummary').where('date', '==', date).get(),
    readAllEmployees(),
  ]);

  const nameByUserId = new Map(
    employees.map((employee) => [employee.uid, employee.name])
  );

  return snapshot.docs.map((doc) => {
    const data = doc.data() as DailySummary;
    return {
      ...data,
      name: nameByUserId.get(data.userId) ?? 'Unknown',
    };
  });
};

export const computeAdminDailyKpis = async (
  date: string
): Promise<AdminDailyKpis> => {
  const [employees, summaries] = await Promise.all([
    readAllEmployees(),
    readDailySummaryOfEmployeesByDate(date),
  ]);

  const kpis: AdminDailyKpis = {
    totalEmployees: employees.length,
    presentCount: 0,
    regularHours: 0,
    overtimeHours: 0,
    nightDifferentialHours: 0,
    lateCount: 0,
    undertimeCount: 0,
  };

  for (const summary of summaries) {
    if (summary.status === 'present') kpis.presentCount++;
    kpis.regularHours += summary.regularHours ?? 0;
    kpis.overtimeHours += summary.overtimeHours ?? 0;
    kpis.nightDifferentialHours += summary.nightDifferentialHours ?? 0;
    if ((summary.lateMinutes ?? 0) > 0) kpis.lateCount++;
    if ((summary.undertimeMinutes ?? 0) > 0) kpis.undertimeCount++;
  }

  kpis.regularHours = roundHours(kpis.regularHours);
  kpis.overtimeHours = roundHours(kpis.overtimeHours);
  kpis.nightDifferentialHours = roundHours(kpis.nightDifferentialHours);

  return kpis;
};

//---------ATTENDANCE
export const readAllUsersAttendanceByDate = async (
  date: string
): Promise<Record<string, DailyAttendanceWithSummary>> => {
  const db = getFirestore();
  const baseQuery = db.collection('attendance').where('date', '==', date);

  const [inResult, outResult, employees, summaries] = await Promise.all([
    baseQuery.where('type', '==', 'in').orderBy('timestamp', 'asc').get(),
    baseQuery.where('type', '==', 'out').orderBy('timestamp', 'asc').get(),
    readAllEmployees(),
    readDailySummaryOfEmployeesByDate(date),
  ]);

  const summaryByUserId = new Map(summaries.map((s) => [s.userId, s]));

  const result: Record<string, DailyAttendanceWithSummary> = {};

  for (const employee of employees) {
    result[employee.uid] = {
      name: employee.name,
      schedule: employee.schedule,
      in: null,
      out: null,
      summary: summaryByUserId.get(employee.uid) ?? null,
    };
  }

  const ensureEntry = (userId: string) => {
    if (!result[userId]) {
      result[userId] = {
        name: 'Unknown',
        schedule: null,
        in: null,
        out: null,
        summary: null,
      };
    }
  };

  for (const doc of inResult.docs) {
    const data = { id: doc.id, ...doc.data() } as AttendanceDoc;
    ensureEntry(data.userId);
    if (!result[data.userId].in) result[data.userId].in = data;
  }

  for (const doc of outResult.docs) {
    const data = { id: doc.id, ...doc.data() } as AttendanceDoc;
    ensureEntry(data.userId);
    if (!result[data.userId].out) result[data.userId].out = data;
  }

  return result;
};

export const readAllAttendanceOfUser = async (
  userId: string
): Promise<Record<string, DailyAttendance>> => {
  const db = getFirestore();
  const baseQuery = db.collection('attendance').where('userId', '==', userId);

  const [inResult, outResult] = await Promise.all([
    baseQuery.where('type', '==', 'in').orderBy('timestamp', 'asc').get(),
    baseQuery.where('type', '==', 'out').orderBy('timestamp', 'asc').get(),
  ]);

  const result: Record<string, DailyAttendance> = {};

  const ensureEntry = (date: string) => {
    if (!result[date]) result[date] = { in: null, out: null };
  };

  for (const doc of inResult.docs) {
    const data = { id: doc.id, ...doc.data() } as AttendanceDoc;
    ensureEntry(data.date);
    if (!result[data.date].in) result[data.date].in = data;
  }

  for (const doc of outResult.docs) {
    const data = { id: doc.id, ...doc.data() } as AttendanceDoc;
    ensureEntry(data.date);
    if (!result[data.date].out) result[data.date].out = data;
  }

  return result;
};
