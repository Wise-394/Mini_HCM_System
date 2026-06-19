import { describe, it, expect } from 'vitest';
import { Timestamp } from 'firebase-admin/firestore';
import {
  calculateHoursWorked,
  calculateRegularHours,
} from '../services/utils/dailyAttendanceCalculation.js';
import type { AttendanceDoc, WorkSchedule } from '../types/types.js';

const buildPunch = (type: 'in' | 'out', isoTime: string): AttendanceDoc => ({
  userId: 'test-user',
  type,
  date: '6/19/2026',
  timestamp: Timestamp.fromDate(new Date(isoTime)),
});

const schedule: WorkSchedule = { start: '09:00', end: '18:00' };

describe('calculateRegularHours', () => {
  it('returns hours worked when under shift length', () => {
    const punchIn = buildPunch('in', '2026-06-19T09:00:00+08:00');
    const punchOut = buildPunch('out', '2026-06-19T13:00:00+08:00');
    const hoursWorked = calculateHoursWorked(punchIn, punchOut);

    expect(calculateRegularHours(hoursWorked, schedule)).toBeCloseTo(4, 5);
  });

  it('returns exact hours when worked equals shift length', () => {
    const punchIn = buildPunch('in', '2026-06-19T09:00:00+08:00');
    const punchOut = buildPunch('out', '2026-06-19T18:00:00+08:00');
    const hoursWorked = calculateHoursWorked(punchIn, punchOut);

    expect(calculateRegularHours(hoursWorked, schedule)).toBeCloseTo(9, 5);
  });

  it('caps regular hours at shift length when worked exceeds shift', () => {
    const punchIn = buildPunch('in', '2026-06-19T09:15:00+08:00');
    const punchOut = buildPunch('out', '2026-06-19T20:00:00+08:00');
    const hoursWorked = calculateHoursWorked(punchIn, punchOut);

    expect(calculateRegularHours(hoursWorked, schedule)).toBeCloseTo(9, 5);
  });

  it('returns 0 when hoursWorked is 0', () => {
    expect(calculateRegularHours(0, schedule)).toBe(0);
  });

  it('handles an overnight shift (22:00–06:00) correctly', () => {
    const overnightSchedule: WorkSchedule = { start: '22:00', end: '06:00' };
    const punchIn = buildPunch('in', '2026-06-19T22:00:00+08:00');
    const punchOut = buildPunch('out', '2026-06-20T06:00:00+08:00');
    const hoursWorked = calculateHoursWorked(punchIn, punchOut);

    expect(calculateRegularHours(hoursWorked, overnightSchedule)).toBeCloseTo(
      8,
      5
    );
  });
});
