import { describe, it, expect } from 'vitest';
import { Timestamp } from 'firebase-admin/firestore';
import { calculateUndertimeMinutes } from '../services/utils/dailyAttendanceCalculation.js';
import type { AttendanceDoc, WorkSchedule } from '../types/types.js';

const buildPunch = (type: 'in' | 'out', isoTime: string): AttendanceDoc => ({
  userId: 'test-user',
  type,
  date: '6/19/2026',
  timestamp: Timestamp.fromDate(new Date(isoTime)),
});

const schedule: WorkSchedule = { start: '09:00', end: '18:00' };

describe('calculateUndertimeMinutes', () => {
  it('returns 0 when punching out exactly on time', () => {
    const punchOut = buildPunch('out', '2026-06-19T18:00:00+08:00');

    expect(calculateUndertimeMinutes(punchOut, schedule)).toBe(0);
  });

  it('returns 0 when punching out after scheduled end (overtime, not undertime)', () => {
    const punchOut = buildPunch('out', '2026-06-19T19:00:00+08:00');

    expect(calculateUndertimeMinutes(punchOut, schedule)).toBe(0);
  });

  it('returns 30 when punching out 30 minutes early', () => {
    const punchOut = buildPunch('out', '2026-06-19T17:30:00+08:00');

    expect(calculateUndertimeMinutes(punchOut, schedule)).toBe(30);
  });

  it('returns 120 when punching out 2 hours early', () => {
    const punchOut = buildPunch('out', '2026-06-19T16:00:00+08:00');

    expect(calculateUndertimeMinutes(punchOut, schedule)).toBe(120);
  });
});
