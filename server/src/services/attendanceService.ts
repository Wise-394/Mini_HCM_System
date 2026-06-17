import type { AttendanceDoc } from '../types/types.js';
import { getFirestore } from 'firebase-admin/firestore';

export const createAttendanceDoc = async (attendanceDoc: AttendanceDoc) => {
  const db = getFirestore();
  await db.collection('attendance').add(attendanceDoc);
};

export const getLastAttendanceDocByUser = async (
  userId: string
): Promise<AttendanceDoc | null> => {
  const db = getFirestore();
  const result = await db
    .collection('attendance')
    .where('userId', '==', userId)
    .orderBy('timestamp', 'desc')
    .limit(1)
    .get();

  if (result.empty) {
    return null;
  }
  const doc = result.docs[0];
  const attendance: AttendanceDoc = {
    id: doc.id,
    ...doc.data(),
  } as AttendanceDoc;
  return attendance;
};
