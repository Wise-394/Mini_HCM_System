import { useQuery } from '@tanstack/react-query';
import { getIdToken } from 'firebase/auth';
import { auth } from '../../configs/firebase.ts';
import type { UserProfileType } from '../../types/types.ts';
import { useAuthStore } from '../../store/useAuthStore.ts';

const getUserProfile = async (
  uid: string | undefined
): Promise<UserProfileType> => {
  const currentUser = auth.currentUser;
  if (!currentUser || currentUser.uid !== uid) {
    throw new Error('Not authenticated');
  }
  const token = await getIdToken(currentUser);
  const api = import.meta.env.VITE_BACKEND_API;

  const res = await fetch(`${api}/users/${uid}`, {
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
  return data.data;
};

export const useUserProfile = () => {
  const user = useAuthStore((state) => state.user);
  const isAuthLoading = useAuthStore((state) => state.isAuthLoading);

  const { data, isLoading, error } = useQuery({
    queryKey: ['userProfile', user?.uid],
    queryFn: () => getUserProfile(user?.uid),
    enabled: !!user?.uid && !isAuthLoading,
    staleTime: 1000 * 60 * 10,
    retry: 0,
    refetchOnWindowFocus: false,
  });

  return {
    userProfile: data || null,
    isUserLoading: isAuthLoading || (!!user?.uid && isLoading),
    userError: error?.message || null,
  };
};
