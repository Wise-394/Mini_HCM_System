import { describe, it, expect } from 'vitest';
import { Timestamp } from 'firebase-admin/firestore';
import { calculateLateMinutes } from '../services/utils/dailyAttendanceCalculation.js';
import type { AttendanceDoc, WorkSchedule } from '../types/types.js';

const buildPunch = (type: 'in' | 'out', isoTime: string): AttendanceDoc => ({
  userId: 'test-user',
  type,
  date: '6/19/2026',
  timestamp: Timestamp.fromDate(new Date(isoTime)),
});

const schedule: WorkSchedule = { start: '09:00', end: '18:00' };

describe('calculateLateMinutes', () => {
  it('returns 0 when punching in exactly on time', () => {
    const punchIn = buildPunch('in', '2026-06-19T09:00:00+08:00');

    expect(calculateLateMinutes(punchIn, schedule)).toBe(0);
  });

  it('returns 0 when punching in early', () => {
    const punchIn = buildPunch('in', '2026-06-19T08:45:00+08:00');

    expect(calculateLateMinutes(punchIn, schedule)).toBe(0);
  });

  it('returns 15 when punching in 15 minutes late', () => {
    const punchIn = buildPunch('in', '2026-06-19T09:15:00+08:00');

    expect(calculateLateMinutes(punchIn, schedule)).toBe(15);
  });

  it('returns 90 when punching in 1.5 hours late', () => {
    const punchIn = buildPunch('in', '2026-06-19T10:30:00+08:00');

    expect(calculateLateMinutes(punchIn, schedule)).toBe(90);
  });
});
