import { getFirestore } from 'firebase-admin/firestore';
import type { DailySummary } from '../types/types.js';

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
