import { describe, it, expect } from 'vitest';
import { Timestamp } from 'firebase-admin/firestore';
import {
  calculateHoursWorked,
  calculateOvertimeHours,
} from '../services/utils/dailyAttendanceCalculation.js';
import type { AttendanceDoc, WorkSchedule } from '../types/types.js';

const buildPunch = (type: 'in' | 'out', isoTime: string): AttendanceDoc => ({
  userId: 'test-user',
  type,
  date: '6/19/2026',
  timestamp: Timestamp.fromDate(new Date(isoTime)),
});

const schedule: WorkSchedule = { start: '09:00', end: '18:00' };

describe('calculateOvertimeHours', () => {
  it('returns 0 when hours worked is under shift length', () => {
    const punchIn = buildPunch('in', '2026-06-19T09:00:00+08:00');
    const punchOut = buildPunch('out', '2026-06-19T13:00:00+08:00');
    const hoursWorked = calculateHoursWorked(punchIn, punchOut);

    expect(calculateOvertimeHours(hoursWorked, schedule)).toBe(0);
  });

  it('returns 0 when hours worked equals shift length exactly', () => {
    const punchIn = buildPunch('in', '2026-06-19T09:00:00+08:00');
    const punchOut = buildPunch('out', '2026-06-19T18:00:00+08:00');
    const hoursWorked = calculateHoursWorked(punchIn, punchOut);

    expect(calculateOvertimeHours(hoursWorked, schedule)).toBe(0);
  });

  it('returns the excess hours when worked beyond shift length', () => {
    const punchIn = buildPunch('in', '2026-06-19T09:15:00+08:00');
    const punchOut = buildPunch('out', '2026-06-19T20:00:00+08:00');
    const hoursWorked = calculateHoursWorked(punchIn, punchOut);

    expect(calculateOvertimeHours(hoursWorked, schedule)).toBeCloseTo(1.75, 5);
  });

  it('returns 0 when hoursWorked is 0', () => {
    expect(calculateOvertimeHours(0, schedule)).toBe(0);
  });

  it('handles an overnight shift correctly when OT is worked', () => {
    const overnightSchedule: WorkSchedule = { start: '22:00', end: '06:00' };
    const punchIn = buildPunch('in', '2026-06-19T22:00:00+08:00');
    const punchOut = buildPunch('out', '2026-06-20T08:00:00+08:00');
    const hoursWorked = calculateHoursWorked(punchIn, punchOut);

    expect(calculateOvertimeHours(hoursWorked, overnightSchedule)).toBeCloseTo(
      2,
      5
    );
  });
});
