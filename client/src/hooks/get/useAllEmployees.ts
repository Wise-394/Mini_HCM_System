import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../../store/useAuthStore.ts';
import { getIdToken } from 'firebase/auth';
import { auth } from '../../configs/firebase.ts';
import type { UserProfileType } from '../../types/types.ts';

const getAllEmployees = async (): Promise<UserProfileType[]> => {
  const api = import.meta.env.VITE_BACKEND_API;
  const user = auth.currentUser;
  if (!user) throw new Error('Not authenticated');
  const token = await getIdToken(user);
  const res = await fetch(`${api}/admin/employees`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const serverError = await res.json();
    throw new Error(serverError.message || 'Error getting employees');
  }

  const { data } = await res.json();
  return data;
};

export const useAllEmployees = () => {
  const user = useAuthStore((state) => state.user);
  const isAuthLoading = useAuthStore((state) => state.isAuthLoading);
  const { data, isLoading, error } = useQuery({
    queryFn: getAllEmployees,
    queryKey: ['allEmployees', user?.uid],
    enabled: !!user?.uid && !isAuthLoading,
    retry: false,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

  return { employees: data, isLoading, error };
};
