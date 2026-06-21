import type { WorkSchedule } from '../../types/types.js';

export const getTodayManila = (): string =>
  new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Manila' });

export const toStringParam = (value: unknown): string | undefined => {
  if (Array.isArray(value))
    return typeof value[0] === 'string' ? value[0] : undefined;
  return typeof value === 'string' ? value : undefined;
};

export const roundHours = (hours: number): number =>
  Math.round(hours * 100) / 100;

export const parseTimeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

export const getShiftLengthHours = (schedule: WorkSchedule): number => {
  const startMinutes = parseTimeToMinutes(schedule.start);
  let endMinutes = parseTimeToMinutes(schedule.end);

  if (endMinutes <= startMinutes) {
    endMinutes += 24 * 60;
  }

  return (endMinutes - startMinutes) / 60;
};
