export const getTodayManila = (): string =>
  new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Manila' });
