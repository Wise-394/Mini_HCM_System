import { useMutation } from '@tanstack/react-query';
import { createUserWithEmailAndPassword, getIdToken } from 'firebase/auth';
import type { User } from 'firebase/auth';
import { auth } from '../configs/firebase.ts';
import type { UserProfileType } from '../types/types.ts';
import { useAuthStore } from '../store/useAuthStore.tsx';

interface RegisterParams {
  password: string;
  userProfile: Omit<UserProfileType, 'uid'>;
}

interface RegisterResponse {
  user: User;
  idToken: string;
}

//Core registration workflow:
// Creates the user in Firebase
// Gets a secure token (JWT) from Firebase
// Sends the user's profile data to express

const registerUserWorkflow = async ({
  password,
  userProfile,
}: RegisterParams): Promise<RegisterResponse> => {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    userProfile.email,
    password
  );
  const { user } = userCredential;
  const idToken = await getIdToken(user);
  const api = import.meta.env.VITE_BACKEND_API;

  const response = await fetch(`${api}/users`, {
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
    throw new Error(serverError.message || 'Failed to register user.');
  }

  return { user, idToken };
};

export const useRegister = () => {
  const login = useAuthStore((state) => state.login);

  const { mutateAsync, isPending, error } = useMutation({
    mutationFn: registerUserWorkflow,
    onSuccess: (data) => {
      login({ uid: data.user.uid, email: data.user.email! }, data.idToken);
    },
  });

  return {
    registerUser: mutateAsync,
    isLoading: isPending,
    error: error?.message || null,
  };
};
