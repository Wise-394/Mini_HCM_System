import { useQuery } from '@tanstack/react-query';
import { getIdToken } from 'firebase/auth';
import { auth } from '../configs/firebase.ts';
import type { UserProfileType } from '../types/types.ts';

const getUserProfile = async (): Promise<UserProfileType> => {
  const user = auth.currentUser;
  if (!user) throw new Error('Not authenticated');

  const token = await getIdToken(user);
  const api = import.meta.env.VITE_BACKEND_API;

  const res = await fetch(`${api}/users/${user.uid}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    const serverError = await res.json();
    throw new Error(serverError.message || 'Failed to fetch profile.');
  }

  const data = await res.json();
  return data.user;
};

export const useUserProfile = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['UserProfile'],
    queryFn: getUserProfile,
    retry: false,
  });

  return {
    userProfile: data,
    isLoading,
    error: error?.message || null,
  };
};
