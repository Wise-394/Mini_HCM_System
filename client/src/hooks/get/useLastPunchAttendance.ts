import { useQuery } from '@tanstack/react-query';
import { auth } from '../../configs/firebase.ts';
import { getIdToken } from 'firebase/auth';
import { useAuthStore } from '../../store/useAuthStore.ts';
import type { Attendance } from '../../types/types.ts';

//----------------------------------------------------------------
//Responsible for getting the last punch attendance
//Necessary for knowing if the next attendance is punch in or punch out

const getLastPunchAttendance = async (): Promise<Attendance> => {
  const api = import.meta.env.VITE_BACKEND_API;
  const user = auth.currentUser;
  if (!user) throw new Error('Not authenticated');

  const token = await getIdToken(user);
  const res = await fetch(`${api}/attendance/${user.uid}/last-punch`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    const serverError = await res.json();
    throw new Error(serverError.message || 'Error getting last attendance');
  }
  const data = await res.json();
  return data.data;
};

export const useLastPunchAttendance = () => {
  const user = useAuthStore((state) => state.user);
  const isAuthLoading = useAuthStore((state) => state.isAuthLoading);
  const { data, isLoading, error } = useQuery({
    queryKey: ['lastAttendance', user?.uid],
    queryFn: getLastPunchAttendance,
    enabled: !!user && !isAuthLoading,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    retry: false,
  });

  return {
    lastAttendance: data,
    isAttendanceLoading: isLoading || isAuthLoading,
    error,
  };
};
