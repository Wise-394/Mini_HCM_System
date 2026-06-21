import { getFirestore } from 'firebase-admin/firestore';
import type { UserProfileType } from '../types/types.js';

export const createUser = async (userProfile: UserProfileType) => {
  const db = getFirestore();
  await db.collection('users').doc(userProfile.uid).set(userProfile);
  return userProfile;
};

export const readUser = async (
  uid: string
): Promise<UserProfileType | null> => {
  const db = getFirestore();
  const doc = await db.collection('users').doc(uid).get();

  if (!doc.exists) return null;

  return doc.data() as UserProfileType;
};

//-----------admin---------------------------
//functions needed by admin

export const readAllEmployees = async (): Promise<UserProfileType[]> => {
  const db = getFirestore();
  const snapshot = await db
    .collection('users')
    .where('role', '==', 'employee')
    .get();

  return snapshot.docs.map((doc) => doc.data() as UserProfileType);
};
