import { useQuery } from '@tanstack/react-query';
import { auth } from '../../configs/firebase.ts';
import { getIdToken } from 'firebase/auth';
import { useAuthStore } from '../../store/useAuthStore.ts';
import type { DailyAttendance } from '../../types/types.ts';

const getAttendanceByDate = async (
  userId: string,
  date: string
): Promise<DailyAttendance> => {
  const api = import.meta.env.VITE_BACKEND_API;
  const user = auth.currentUser;
  if (!user) throw new Error('Not authenticated');

  const token = await getIdToken(user);
  const res = await fetch(`${api}/attendance/${userId}/${date}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const serverError = await res.json();
    throw new Error(serverError.message || 'Error getting attendance');
  }

  const data = await res.json();
  return data.data;
};

export const useAttendance = (date: string) => {
  const user = useAuthStore((state) => state.user);
  const isAuthLoading = useAuthStore((state) => state.isAuthLoading);

  const { data, isLoading, error } = useQuery({
    queryKey: ['attendance', user?.uid, date],
    queryFn: () => getAttendanceByDate(user!.uid, date),
    enabled: !!user?.uid && !isAuthLoading && !!date,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    retry: false,
  });
  return {
    attendance: data,
    isAttendanceLoading: isLoading || isAuthLoading,
    error,
  };
};
