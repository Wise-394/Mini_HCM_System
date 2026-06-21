import { getFirestore } from 'firebase-admin/firestore';
import type { DailySummary, AdminDailyKpis } from '../types/types.js';
import { roundHours } from './utils/helpers.js';

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

//-----------admin---------------------------
//functions needed by admin

export const readDailySummaryOfEmployeesByDate = async (
  date: string
): Promise<DailySummary[]> => {
  const db = getFirestore();
  const snapshot = await db
    .collection('dailySummary')
    .where('date', '==', date)
    .get();

  return snapshot.docs.map((doc) => doc.data() as DailySummary);
};

export const computeAdminDailyKpis = async (
  date: string
): Promise<AdminDailyKpis> => {
  const summaries = await readDailySummaryOfEmployeesByDate(date);

  const kpis: AdminDailyKpis = {
    totalEmployees: summaries.length,
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
