import { useQuery } from '@tanstack/react-query';
import { auth } from '../../configs/firebase.ts';
import { getIdToken } from 'firebase/auth';
import { useAuthStore } from '../../store/useAuthStore.ts';
import type { DailyAttendanceWithSummary } from '../../types/types.ts';

//----------------------------------------------------------------
//responsible for getting all attendance + daily summary of a specific user
//used by admin

const getAllAttendanceOfUser = async (
  userId: string
): Promise<Record<string, DailyAttendanceWithSummary>> => {
  const api = import.meta.env.VITE_BACKEND_API;
  const user = auth.currentUser;
  if (!user) throw new Error('Not authenticated');

  const token = await getIdToken(user);
  const res = await fetch(`${api}/admin/attendance/${userId}`, {
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

export const useAllAttendanceWithDailySummaryOfUser = (userId: string) => {
  const user = useAuthStore((state) => state.user);
  const isAuthLoading = useAuthStore((state) => state.isAuthLoading);

  const { data, isLoading, error } = useQuery({
    queryKey: ['allAttendance', userId],
    queryFn: () => getAllAttendanceOfUser(userId),
    enabled: !!user?.uid && !isAuthLoading && !!userId,
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
