import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createUserWithEmailAndPassword, getIdToken } from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import type { User } from 'firebase/auth';
import { auth } from '../configs/firebase.ts';
import type { UserProfileType } from '../types/types.ts';

interface RegisterParams {
  password: string;
  userProfile: Omit<UserProfileType, 'uid'>;
}

interface RegisterResponse {
  user: User;
  idToken: string;
}

const FIREBASE_ERROR_MESSAGES: Record<string, string> = {
  'auth/email-already-in-use': 'An account with this email already exists.',
  'auth/too-many-requests': 'Too many attempts. Please try again later.',
  'auth/network-request-failed': 'Network error. Please check your connection.',
};

//Core registration workflow:
// Creates the user in Firebase
// Get JWT from Firebase
// Sends the user's profile data to backend

//if backend fails to save profile data
//delete user in firebase and restart registration (to prevent user with no database record)

const registerUser = async ({
  password,
  userProfile,
}: RegisterParams): Promise<RegisterResponse> => {
  let createdUser: User | null = null;

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      userProfile.email,
      password
    );
    createdUser = userCredential.user;
    const idToken = await getIdToken(createdUser);
    const api = import.meta.env.VITE_BACKEND_API;

    const response = await fetch(`${api}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`,
      },
      body: JSON.stringify({
        uid: createdUser.uid,
        ...userProfile,
      }),
    });

    if (!response.ok) {
      const serverError = await response.json();
      throw new Error(serverError.message || 'Failed to register user.');
    }

    return { user: createdUser, idToken };
  } catch (err) {
    if (createdUser) {
      await createdUser.delete().catch(() => {});
    }

    if (err instanceof FirebaseError) {
      throw new Error(
        FIREBASE_ERROR_MESSAGES[err.code] ??
          'Registration failed. Please try again.',
        { cause: err }
      );
    }
    throw err;
  }
};

export const useRegister = () => {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending, error } = useMutation({
    mutationFn: registerUser,
    onSuccess: (data, variables) => {
      queryClient.setQueryData(['userProfile', data.user.uid], {
        uid: data.user.uid,
        ...variables.userProfile,
      });
    },
  });

  return {
    registerUser: mutateAsync,
    isLoading: isPending,
    error: error?.message || null,
  };
};
