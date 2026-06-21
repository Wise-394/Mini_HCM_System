import type { FirestoreTimestamp } from '../types/types.ts';

export const formatClock = (date: Date) =>
  date.toLocaleTimeString('en-PH', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

export const formatDateLabel = (iso: string) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString('en-PH', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

export const formatHrs = (hrs: number) =>
  hrs > 0 ? `${hrs.toFixed(1)}h` : '—';

export const formatMins = (mins: number) => (mins > 0 ? `${mins}m` : '—');

export const formatTimestamp = (
  timestamp: string | FirestoreTimestamp | undefined
) => {
  if (!timestamp) return null;
  const date =
    typeof timestamp === 'string'
      ? new Date(timestamp)
      : new Date(timestamp._seconds * 1000);
  return date.toLocaleTimeString('en-PH', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatShiftTime = (time: string) => {
  const [hourStr, minute] = time.split(':');
  const hour = Number(hourStr);
  const period = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${hour12}:${minute} ${period}`;
};

export const getTodayDate = () =>
  new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Manila' });
