import { useMutation } from '@tanstack/react-query';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import { auth } from '../configs/firebase.ts';

interface LoginParams {
  email: string;
  password: string;
}

const FIREBASE_ERROR_MESSAGES: Record<string, string> = {
  'auth/invalid-credential': 'Invalid email or password.',
  'auth/user-disabled': 'This user account has been disabled.',
  'auth/too-many-requests': 'Too many attempts. Please try again later.',
  'auth/network-request-failed': 'Network error. Please check your connection.',
};

// Core login workflow:
// Authenticates credentials via Firebase
const loginUserWorkflow = async ({ email, password }: LoginParams) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (err) {
    if (err instanceof FirebaseError) {
      const message =
        FIREBASE_ERROR_MESSAGES[err.code] ?? 'Login failed. Please try again.';
      throw new Error(message, { cause: err });
    }
    throw err;
  }
};

export const useLogin = () => {
  const { mutateAsync, isPending, error } = useMutation({
    mutationFn: loginUserWorkflow,
  });

  return {
    loginUser: mutateAsync,
    isLoading: isPending,
    error: error?.message ?? null,
  };
};
