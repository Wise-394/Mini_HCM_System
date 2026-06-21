import { useQuery } from '@tanstack/react-query';
import { auth } from '../../configs/firebase.ts';
import { getIdToken } from 'firebase/auth';
import { useAuthStore } from '../../store/useAuthStore.ts';
import type { DailyAttendanceWithSummary } from '../../types/types.ts';

const getAllEmployeesAttendanceByDate = async (
  date: string
): Promise<Record<string, DailyAttendanceWithSummary>> => {
  const api = import.meta.env.VITE_BACKEND_API;
  const user = auth.currentUser;
  if (!user) throw new Error('Not authenticated');

  const token = await getIdToken(user);
  const res = await fetch(`${api}/admin/daily-summar/${date}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const serverError = await res.json();
    throw new Error(serverError.message || 'Error getting attendance');
  }

  const { data } = await res.json();
  return data;
};

export const useAllEmployeesAttendanceByDate = (date: string) => {
  const user = useAuthStore((state) => state.user);
  const isAuthLoading = useAuthStore((state) => state.isAuthLoading);

  const { data, isLoading, error } = useQuery({
    queryKey: ['adminAttendance', date],
    queryFn: () => getAllEmployeesAttendanceByDate(date),
    enabled: !!user?.uid && !isAuthLoading && !!date,
    staleTime: 0,
    refetchOnWindowFocus: true,
    refetchInterval: 1000 * 30,
    retry: false,
  });

  return {
    attendance: data ?? null,
    isAttendanceLoading: isAuthLoading || (!!user?.uid && isLoading),
    attendanceError: error,
  };
};
