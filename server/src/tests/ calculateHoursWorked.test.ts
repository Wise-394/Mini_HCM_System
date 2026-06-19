import { describe, it, expect } from 'vitest';
import { Timestamp } from 'firebase-admin/firestore';
import { calculateHoursWorked } from '../services/utils/dailyAttendanceCalculation.js';
import type { AttendanceDoc } from '../types/types.js';

const buildPunch = (type: 'in' | 'out', isoTime: string): AttendanceDoc => ({
  userId: 'test-user',
  type,
  date: '6/19/2026',
  timestamp: Timestamp.fromDate(new Date(isoTime)),
});

describe('calculateHoursWorked', () => {
  it('computes 9 hours for a standard 9am-6pm shift', () => {
    const punchIn = buildPunch('in', '2026-06-19T09:00:00+08:00');
    const punchOut = buildPunch('out', '2026-06-19T18:00:00+08:00');

    expect(calculateHoursWorked(punchIn, punchOut)).toBeCloseTo(9, 5);
  });

  it('computes 1.75 hours for a fractional duration', () => {
    const punchIn = buildPunch('in', '2026-06-19T22:00:00+08:00');
    const punchOut = buildPunch('out', '2026-06-19T23:45:00+08:00');

    expect(calculateHoursWorked(punchIn, punchOut)).toBeCloseTo(1.75, 5);
  });

  it('returns 0 if punchOut is before punchIn (guards bad data)', () => {
    const punchIn = buildPunch('in', '2026-06-19T18:00:00+08:00');
    const punchOut = buildPunch('out', '2026-06-19T09:00:00+08:00');

    expect(calculateHoursWorked(punchIn, punchOut)).toBe(0);
  });
});
