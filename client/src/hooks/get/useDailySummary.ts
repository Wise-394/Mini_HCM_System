import { useQuery } from '@tanstack/react-query';
import { auth } from '../../configs/firebase.ts';
import { getIdToken } from 'firebase/auth';
import { useAuthStore } from '../../store/useAuthStore.ts';
import type { DailySummary } from '../../types/types.ts';

//----------------------------------------------------------------
//Responsible for getting a daily summary of the logged in user by specific date

const getDailySummaryByDate = async (
  userId: string,
  date: string
): Promise<DailySummary> => {
  const api = import.meta.env.VITE_BACKEND_API;
  const user = auth.currentUser;
  if (!user) throw new Error('Not authenticated');

  const token = await getIdToken(user);
  const res = await fetch(`${api}/daily-summaries/${userId}/${date}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const serverError = await res.json();
    throw new Error(serverError.message || 'Error getting daily summary');
  }

  const data = await res.json();
  return data.data;
};

export const useDailySummary = (date: string) => {
  const user = useAuthStore((state) => state.user);
  const isAuthLoading = useAuthStore((state) => state.isAuthLoading);

  const { data, isLoading, error } = useQuery({
    queryKey: ['dailySummary', user?.uid, date],
    queryFn: () => getDailySummaryByDate(user!.uid, date),
    enabled: !!user?.uid && !isAuthLoading && !!date,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    retry: false,
  });

  return {
    dailySummary: data,
    isDailySummaryLoading: isAuthLoading || (!!user?.uid && isLoading),
    dailySummaryError: error,
  };
};
