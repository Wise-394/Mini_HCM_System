import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getIdToken } from 'firebase/auth';
import { auth } from '../../configs/firebase.ts';
import type { FirestoreTimestamp } from '../../types/types.ts';

//----------------------------------------------------------------
//Responsible for updating the attendance of specific user
//used by admin

type UpdateAttendancePayload = {
  userId: string;
  date: string;
  in?: FirestoreTimestamp;
  out?: FirestoreTimestamp;
};

const putUpdateAttendance = async (payload: UpdateAttendancePayload) => {
  const api = import.meta.env.VITE_BACKEND_API;
  const user = auth.currentUser;
  if (!user) throw new Error('Not authenticated');
  const token = await getIdToken(user);

  const { userId, date, ...body } = payload;

  const res = await fetch(`${api}/admin/attendance/${userId}/${date}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const serverError = await res.json();
    throw new Error(serverError.message || 'Error updating attendance');
  }
};

export const useUpdateAttendance = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending, error } = useMutation({
    mutationFn: putUpdateAttendance,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['allAttendance', variables.userId],
      });
    },
  });

  return {
    updateAttendance: mutate,
    isUpdateLoading: isPending,
    updateError: error,
  };
};
