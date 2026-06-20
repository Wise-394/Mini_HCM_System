import { useEffect, useState } from 'react';
import { HiOutlineClock, HiOutlineBuildingOffice2 } from 'react-icons/hi2';
import type { WorkSchedule, UserRole } from '../../../types/types.ts';

// ---- Helpers ---------------------------------------------------------
// Move this into helpers/formats.ts if you've already got a clock formatter
// there — kept local for now to avoid guessing at a duplicate.

const formatClock = (date: Date) =>
  date.toLocaleTimeString('en-PH', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

// ---- PunchClockCard ----------------------------------------------------

interface PunchClockCardProps {
  now: Date;
  statusLabel: string;
  clockIn: string | null;
  clockOut: string | null;
}

const PunchClockCard = ({
  now,
  statusLabel,
  clockIn,
  clockOut,
}: PunchClockCardProps) => {
  return (
    <div
      className="lg:col-span-2 bg-white rounded-2xl border border-white
        shadow-lg p-6 sm:p-8 flex flex-col gap-5"
    >
      <div className="flex items-center gap-4">
        <div
          className="w-12 h-12 rounded-xl bg-slate-100 text-gray-600 flex
            items-center justify-center shrink-0"
        >
          <HiOutlineClock className="w-6 h-6" />
        </div>
        <div>
          <p
            className="text-3xl font-extrabold text-slate-900 tabular-nums
              tracking-tight"
          >
            {formatClock(now)}
          </p>
          <p className="text-xs font-medium text-gray-400">{statusLabel}</p>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div>
          <p
            className="text-xs font-semibold text-gray-400 uppercase
              tracking-wide"
          >
            Clock In
          </p>
          <p className="text-sm font-bold text-slate-900">{clockIn ?? '—'}</p>
        </div>
        <div>
          <p
            className="text-xs font-semibold text-gray-400 uppercase
              tracking-wide"
          >
            Clock Out
          </p>
          <p className="text-sm font-bold text-slate-900">{clockOut ?? '—'}</p>
        </div>
      </div>
    </div>
  );
};

// ---- ScheduleCard ----------------------------------------------------

interface ScheduleCardProps {
  schedule: WorkSchedule;
  timezone: string;
  role: UserRole | null;
}

const ScheduleCard = ({ schedule, timezone, role }: ScheduleCardProps) => {
  return (
    <div
      className="bg-white rounded-2xl border border-white shadow-lg p-6 flex
        flex-col justify-center gap-3"
    >
      <div className="flex items-center gap-3">
        <div
          className="w-9 h-9 rounded-xl bg-slate-100 text-gray-600 flex
            items-center justify-center shrink-0"
        >
          <HiOutlineBuildingOffice2 className="w-5 h-5" />
        </div>
        <div>
          <p
            className="text-xs font-semibold text-gray-400 uppercase
              tracking-wide"
          >
            Shift Schedule
          </p>
          <p className="text-sm font-bold text-slate-900">
            {schedule.start} – {schedule.end}
          </p>
        </div>
      </div>
      <p className="text-xs font-medium text-gray-400">
        {timezone} · {role}
      </p>
    </div>
  );
};

export const PunchClockPanel = () => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  // TODO: replace with TanStack Query once wired up
  const statusLabel = 'Awaiting punch';
  const clockIn: string | null = null;
  const clockOut: string | null = null;
  const schedule: WorkSchedule = { start: '09:00', end: '18:00' };
  const timezone = 'Asia/Manila';
  const role: UserRole | null = 'employee';

  return (
    <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <PunchClockCard
        now={now}
        statusLabel={statusLabel}
        clockIn={clockIn}
        clockOut={clockOut}
      />
      <ScheduleCard schedule={schedule} timezone={timezone} role={role} />
    </section>
  );
};
