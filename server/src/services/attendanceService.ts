import type { AttendanceDoc } from '../types/types.js';
import { getFirestore } from 'firebase-admin/firestore';
import type { DailyAttendance } from '../types/types.js';
import { readAllEmployees } from './userService.js';
export const createAttendanceDoc = async (attendanceDoc: AttendanceDoc) => {
  const db = getFirestore();
  await db.collection('attendance').add(attendanceDoc);
};

// Intentionally has NO staleness filter — used to find and resolve
// dangling punch-ins regardless of how old they are.
export const readUnresolvedPunchIn = async (
  userId: string
): Promise<AttendanceDoc | null> => {
  const db = getFirestore();
  const result = await db
    .collection('attendance')
    .where('userId', '==', userId)
    .orderBy('timestamp', 'desc')
    .limit(1)
    .get();

  if (result.empty) return null;
  const doc = result.docs[0];
  const lastPunch = { id: doc.id, ...doc.data() } as AttendanceDoc;
  return lastPunch.type === 'in' ? lastPunch : null;
};

// Returns the user's active punch-in session, or null if none exists
// or the last punch-in is older than MAX_SHIFT_HOURS (treated as expired)
export const readActiveSession = async (
  userId: string
): Promise<AttendanceDoc | null> => {
  const db = getFirestore();
  const MAX_SHIFT_HOURS = 20;

  const result = await db
    .collection('attendance')
    .where('userId', '==', userId)
    .orderBy('timestamp', 'desc')
    .limit(1)
    .get();

  if (result.empty) return null;

  const doc = result.docs[0];
  const lastPunch = { id: doc.id, ...doc.data() } as AttendanceDoc;

  if (lastPunch.type === 'in') {
    const hoursSince =
      (Date.now() - lastPunch.timestamp.toMillis()) / (1000 * 60 * 60);
    if (hoursSince > MAX_SHIFT_HOURS) return null;
  }

  return lastPunch;
};

export const readAttendanceOfUserByDate = async (
  userId: string,
  date: string
): Promise<DailyAttendance> => {
  const db = getFirestore();
  const baseQuery = db
    .collection('attendance')
    .where('userId', '==', userId)
    .where('date', '==', date);

  const [inResult, outResult] = await Promise.all([
    baseQuery
      .where('type', '==', 'in')
      .orderBy('timestamp', 'asc')
      .limit(1)
      .get(),
    baseQuery
      .where('type', '==', 'out')
      .orderBy('timestamp', 'asc')
      .limit(1)
      .get(),
  ]);

  const toDoc = (snap: typeof inResult) =>
    snap.empty
      ? null
      : ({ id: snap.docs[0].id, ...snap.docs[0].data() } as AttendanceDoc);

  return {
    in: toDoc(inResult),
    out: toDoc(outResult),
  };
};

//-----------admin---------------------------
//functions needed by admin

export const readAllUserAttendanceByDate = async (
  date: string
): Promise<Record<string, DailyAttendance>> => {
  const db = getFirestore();
  const baseQuery = db.collection('attendance').where('date', '==', date);

  const [inResult, outResult, employees] = await Promise.all([
    baseQuery.where('type', '==', 'in').orderBy('timestamp', 'asc').get(),
    baseQuery.where('type', '==', 'out').orderBy('timestamp', 'asc').get(),
    readAllEmployees(),
  ]);

  const result: Record<string, DailyAttendance> = {};

  for (const employee of employees) {
    result[employee.uid] = {
      name: employee.name,
      schedule: employee.schedule,
      in: null,
      out: null,
    };
  }

  const ensureEntry = (userId: string) => {
    if (!result[userId]) {
      result[userId] = { name: 'Unknown', schedule: null, in: null, out: null };
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
