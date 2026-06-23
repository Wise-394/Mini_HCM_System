import type { AttendanceDoc } from '../types/types.js';
import { getFirestore } from 'firebase-admin/firestore';
import type { DailyAttendance } from '../types/types.js';
import { toTimestamp } from './utils/helpers.js';

//----------------------------------------------------------------
//Responsible for attendance firestore CRUD

export const createAttendanceDoc = async (attendanceDoc: AttendanceDoc) => {
  const db = getFirestore();
  await db.collection('attendance').add(attendanceDoc);
};

// Intentionally has NO staleness filter, used to find and resolve
// dangling punch-ins regardless of how old they are. (punch in with no punch out)
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

export const readLastPunch = async (
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
  return { id: doc.id, ...doc.data() } as AttendanceDoc;
};

// Returns the user's active punch-in session, or null if none exists
// or the last punch-in is older than MAX_SHIFT_HOURS (treated as expired)
export const readActiveSession = async (
  userId: string
): Promise<AttendanceDoc | null> => {
  const db = getFirestore();
  const { Timestamp } = await import('firebase-admin/firestore');
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
    const ts =
      lastPunch.timestamp instanceof Timestamp
        ? lastPunch.timestamp
        : new Timestamp(
            (lastPunch.timestamp as any)._seconds,
            (lastPunch.timestamp as any)._nanoseconds
          );

    const hoursSince = (Date.now() - ts.toMillis()) / (1000 * 60 * 60);
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

  const toDoc = (snap: typeof inResult) => {
    if (snap.empty) return null;
    const doc = snap.docs[0];
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      timestamp: toTimestamp(data.timestamp),
    } as AttendanceDoc;
  };

  return {
    in: toDoc(inResult),
    out: toDoc(outResult),
  };
};
