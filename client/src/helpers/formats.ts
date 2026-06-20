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
