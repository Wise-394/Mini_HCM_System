import { useMutation } from '@tanstack/react-query';
import { signInWithEmailAndPassword, getIdToken } from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import { auth } from '../configs/firebase.ts';
import { useAuthStore } from '../store/useAuthStore.tsx';
import type { User } from 'firebase/auth';

interface LoginParams {
  email: string;
  password: string;
}

interface LoginResponse {
  user: User;
  idToken: string;
}

const FIREBASE_ERROR_MESSAGES: Record<string, string> = {
  'auth/invalid-credential': 'Invalid email or password.',
  'auth/user-disabled': 'This user account has been disabled.',
  'auth/too-many-requests': 'Too many attempts. Please try again later.',
  'auth/network-request-failed': 'Network error. Please check your connection.',
};

// Core login workflow:
// Authenticates credentials via Firebase
// Retrieves the JWT ID Token from Firebase
const loginUserWorkflow = async ({
  email,
  password,
}: LoginParams): Promise<LoginResponse> => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const loggedInUser = userCredential.user;

    if (!loggedInUser.email) {
      throw new Error('User does not have a valid email address.');
    }

    const idToken = await getIdToken(loggedInUser);

    return { user: loggedInUser, idToken };
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
  const login = useAuthStore((state) => state.login);

  const { mutateAsync, isPending, error } = useMutation({
    mutationFn: loginUserWorkflow,
    onSuccess: ({ user, idToken }) => {
      login({ uid: user.uid, email: user.email! }, idToken);
    },
  });

  return {
    loginUser: mutateAsync,
    isLoading: isPending,
    error: error?.message ?? null,
  };
};
