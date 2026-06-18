import { useQuery } from '@tanstack/react-query';
import { getIdToken } from 'firebase/auth';
import { auth } from '../configs/firebase.ts';
import type { UserProfileType } from '../types/types.ts';
import { useAuthStore } from '../store/useAuthStore.tsx';

const getUserProfile = async (): Promise<UserProfileType> => {
  const user = auth.currentUser;
  if (!user) throw new Error('Not authenticated');

  const token = await getIdToken(user);
  const api = import.meta.env.VITE_BACKEND_API;

  const res = await fetch(`${api}/users/${user.uid}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
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
  const user = useAuthStore((state) => state.user);
  const isAuthLoading = useAuthStore((state) => state.isAuthLoading);
  const { data, isLoading, error } = useQuery({
    queryKey: ['userProfile', user?.uid],
    queryFn: getUserProfile,
    enabled: !!user && !isAuthLoading,
    staleTime: 1000 * 60 * 10,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  return {
    userProfile: data,
    isUserLoading: isLoading || isAuthLoading,
    userError: error?.message || null,
  };
};
