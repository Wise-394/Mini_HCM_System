import { getFirestore } from 'firebase-admin/firestore';
import type { UserProfileType } from '../types/types.js';

export const createUser = async (userProfile: UserProfileType) => {
  const db = getFirestore();
  await db.collection('users').doc(userProfile.uid).set(userProfile);
  return userProfile;
};
