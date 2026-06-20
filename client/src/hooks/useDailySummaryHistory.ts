import { useQuery } from '@tanstack/react-query';
import { auth } from '../configs/firebase.ts';
import { getIdToken } from 'firebase/auth';
import { useAuthStore } from '../store/useAuthStore.ts';
import type { DailySummary } from '../types/types.ts';

interface DailySummaryHistoryResponse {
  data: DailySummary[];
  pagination: {
    offset: number;
    limit: number;
    total: number;
  };
}

const getDailySummaryHistory = async (
  userId: string,
  limit: number,
  offset: number
): Promise<DailySummaryHistoryResponse> => {
  const api = import.meta.env.VITE_BACKEND_API;
  const user = auth.currentUser;
  if (!user) throw new Error('Not authenticated');

  const token = await getIdToken(user);
  const res = await fetch(
    `${api}/daily-summaries/${userId}?limit=${limit}&offset=${offset}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    const serverError = await res.json();
    throw new Error(
      serverError.message || 'Error getting daily summary history'
    );
  }

  return res.json();
};

export const useDailySummaryHistory = (limit = 7, offset = 0) => {
  const user = useAuthStore((state) => state.user);
  const isAuthLoading = useAuthStore((state) => state.isAuthLoading);

  const { data, isLoading, error } = useQuery({
    queryKey: ['dailySummaryHistory', user?.uid, limit, offset],
    queryFn: () => getDailySummaryHistory(user!.uid, limit, offset),
    enabled: !!user?.uid && !isAuthLoading,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    retry: false,
  });

  return {
    summaryHistory: data?.data ?? [],
    pagination: data?.pagination,
    isSummaryHistoryLoading: isAuthLoading || (!!user?.uid && isLoading),
    summaryHistoryError: error,
  };
};
