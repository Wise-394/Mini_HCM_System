import { getFirestore } from 'firebase-admin/firestore';
import type { DailySummary } from '../types/types.js';

//----------------------------------------------------------------
//Responsible for handling daily summary firestore CRUD

export const saveDailySummary = async (summary: DailySummary) => {
  const db = getFirestore();
  const docId = `${summary.userId}_${summary.date}`;
  await db.collection('dailySummary').doc(docId).set(summary);
  return summary;
};

export const readDailySummary = async (
  userId: string,
  date: string
): Promise<DailySummary | null> => {
  const db = getFirestore();
  const docId = `${userId}_${date}`;
  const doc = await db.collection('dailySummary').doc(docId).get();

  if (!doc.exists) return null;

  return doc.data() as DailySummary;
};

export const readDailySummaryHistory = async (
  userId: string,
  limit: number,
  offset: number
): Promise<DailySummary[]> => {
  const db = getFirestore();

  const result = await db
    .collection('dailySummary')
    .where('userId', '==', userId)
    .orderBy('date', 'desc')
    .limit(limit)
    .offset(offset)
    .get();

  if (result.empty) return [];

  return result.docs.map((doc) => doc.data() as DailySummary);
};
