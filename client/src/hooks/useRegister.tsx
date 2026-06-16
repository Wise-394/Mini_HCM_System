import { useMutation } from '@tanstack/react-query';
import { createUserWithEmailAndPassword, getIdToken } from 'firebase/auth';
import type { User } from 'firebase/auth';
import { auth } from '../configs/firebase.ts';
import type { UserProfileType } from '../types/types.ts';

interface RegisterVariables {
  password: string;
  userProfile: Omit<UserProfileType, 'uid'>;
}

//1.Register the user on firebase auth
//2.when success, send user data to express
//3.express will save user data to collection
export const useRegister = () => {
  const mutation = useMutation<User, Error, RegisterVariables>({
    mutationFn: async ({ password, userProfile }) => {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        userProfile.email,
        password
      );

      const idToken = await getIdToken(userCredential.user);
      const response = await fetch('http://localhost:5000/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          uid: userCredential.user.uid,
          ...userProfile,
        }),
      });

      if (!response.ok) {
        const serverError = await response.json();
        throw new Error(
          serverError.message || 'Failed to save profile on backend database.'
        );
      }

      return userCredential.user;
    },
  });

  return {
    registerUser: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error ? mutation.error.message : null,
  };
};
