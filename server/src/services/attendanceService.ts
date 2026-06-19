import type { AttendanceDoc } from '../types/types.js';
import { getFirestore } from 'firebase-admin/firestore';
import type { DailyAttendance } from '../types/types.js';

export const createAttendanceDoc = async (attendanceDoc: AttendanceDoc) => {
  const db = getFirestore();
  await db.collection('attendance').add(attendanceDoc);
};

export const readLastAttendanceDocByUser = async (
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
  const attendance: AttendanceDoc = {
    id: doc.id,
    ...doc.data(),
  } as AttendanceDoc;
  return attendance;
};

export const readAttendanceOfUserByDate = async (
  userId: string,
  date: string
): Promise<DailyAttendance> => {
  const db = getFirestore();
  const result = await db
    .collection('attendance')
    .where('userId', '==', userId)
    .where('date', '==', date)
    .limit(2)
    .get();

  const docs = result.docs.map(
    (doc) =>
      ({
        id: doc.id,
        ...doc.data(),
      }) as AttendanceDoc
  );

  return {
    in: docs.find((d) => d.type === 'in') ?? null,
    out: docs.find((d) => d.type === 'out') ?? null,
  };
};
