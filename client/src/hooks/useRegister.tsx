import { useMutation } from '@tanstack/react-query';
import { createUserWithEmailAndPassword, getIdToken } from 'firebase/auth';
import type { User } from 'firebase/auth';
import { auth } from '../configs/firebase.ts';
import type { UserProfileType } from '../types/types.ts';

interface RegisterParams {
  password: string;
  userProfile: Omit<UserProfileType, 'uid'>;
}

//
//Core authentication workflow:
//  1. Registers user in Firebase Auth
//  2. Fetches the secure JWT ID Token
//  3.Syncs the user profile data to the Express backend
//
const registerUserWorkflow = async ({
  password,
  userProfile,
}: RegisterParams): Promise<User> => {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    userProfile.email,
    password
  );
  const { user } = userCredential;
  const idToken = await getIdToken(user);
  const response = await fetch('http://localhost:5000/api/users/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify({
      uid: user.uid,
      ...userProfile,
    }),
  });

  if (!response.ok) {
    const serverError = await response.json();
    throw new Error(
      serverError.message || 'Failed to save profile on backend database.'
    );
  }

  return user;
};

export const useRegister = () => {
  const { mutateAsync, isPending, error } = useMutation<
    User,
    Error,
    RegisterParams
  >({
    mutationFn: registerUserWorkflow,
  });

  return {
    registerUser: mutateAsync,
    isLoading: isPending,
    error: error?.message || null,
  };
};
