export const getTodayManila = (): string =>
  new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Manila' });

export const toStringParam = (value: unknown): string | undefined => {
  if (Array.isArray(value))
    return typeof value[0] === 'string' ? value[0] : undefined;
  return typeof value === 'string' ? value : undefined;
};
