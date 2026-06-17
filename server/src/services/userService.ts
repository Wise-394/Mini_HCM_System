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
  const result = await db.collection('users').where('uid', '==', uid).get();
  if (result.empty) {
    return null;
  }
  const doc = result.docs[0];
  const userProfile: UserProfileType = {
    uid: doc.id,
    ...doc.data(),
  } as UserProfileType;
  return userProfile;
};
