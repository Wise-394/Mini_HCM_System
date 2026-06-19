import { describe, it, expect } from 'vitest';
import { Timestamp } from 'firebase-admin/firestore';
import { calculateNightDifferentialHours } from '../services/utils/dailyAttendanceCalculation.js';
import type { AttendanceDoc } from '../types/types.js';

const buildPunch = (type: 'in' | 'out', isoTime: string): AttendanceDoc => ({
  userId: 'test-user',
  type,
  date: '6/19/2026',
  timestamp: Timestamp.fromDate(new Date(isoTime)),
});

describe('calculateNightDifferentialHours', () => {
  it('returns 0 when session has no overlap with the 22:00–06:00 window', () => {
    const punchIn = buildPunch('in', '2026-06-19T09:15:00+08:00');
    const punchOut = buildPunch('out', '2026-06-19T20:00:00+08:00');

    expect(calculateNightDifferentialHours(punchIn, punchOut)).toBe(0);
  });

  it('returns full 8 hours for a full overnight shift (22:00–06:00)', () => {
    const punchIn = buildPunch('in', '2026-06-19T22:00:00+08:00');
    const punchOut = buildPunch('out', '2026-06-20T06:00:00+08:00');

    expect(calculateNightDifferentialHours(punchIn, punchOut)).toBe(8);
  });

  it('returns partial ND hours when shift ends in the middle of the ND window', () => {
    const punchIn = buildPunch('in', '2026-06-19T18:00:00+08:00');
    const punchOut = buildPunch('out', '2026-06-19T23:00:00+08:00');

    expect(calculateNightDifferentialHours(punchIn, punchOut)).toBe(1);
  });

  it('returns partial ND hours when shift starts in the middle of the ND window', () => {
    const punchIn = buildPunch('in', '2026-06-19T03:00:00+08:00');
    const punchOut = buildPunch('out', '2026-06-19T09:00:00+08:00');

    expect(calculateNightDifferentialHours(punchIn, punchOut)).toBe(3);
  });

  it('returns 0 when punchOut equals punchIn (zero-length session)', () => {
    const punchIn = buildPunch('in', '2026-06-19T22:00:00+08:00');
    const punchOut = buildPunch('out', '2026-06-19T22:00:00+08:00');

    expect(calculateNightDifferentialHours(punchIn, punchOut)).toBe(0);
  });

  it('caps ND at 8 hours even for an unusually long session spanning multiple nights', () => {
    const punchIn = buildPunch('in', '2026-06-19T22:00:00+08:00');
    const punchOut = buildPunch('out', '2026-06-21T04:00:00+08:00');

    expect(calculateNightDifferentialHours(punchIn, punchOut)).toBe(8);
  });
});
