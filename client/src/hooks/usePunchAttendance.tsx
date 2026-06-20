import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getIdToken } from 'firebase/auth';
import { auth } from '../configs/firebase.ts';
import { useAuthStore } from '../store/useAuthStore.tsx';
import type { PunchType } from '../types/types.ts';

const postPunchAttendance = async (punchType: PunchType) => {
  const api = import.meta.env.VITE_BACKEND_API;
  const user = auth.currentUser;
  if (!user) throw new Error('Not authenticated');
  const token = await getIdToken(user);

  const res = await fetch(`${api}/attendance/punch`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ type: punchType }),
  });

  if (!res.ok) {
    const serverError = await res.json();
    throw new Error(serverError.message || 'Error punching attendance');
  }
};

export const usePunchAttendance = () => {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);

  const { mutate, isPending, error } = useMutation({
    mutationFn: postPunchAttendance,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['lastAttendance', user?.uid],
      });
      queryClient.invalidateQueries({
        queryKey: ['attendance', user?.uid],
      });
    },
  });

  return {
    punchAttendance: mutate,
    isPunchLoading: isPending,
    punchError: error,
  };
};
