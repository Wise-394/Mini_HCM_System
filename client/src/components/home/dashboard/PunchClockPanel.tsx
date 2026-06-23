import { useEffect, useState, useMemo } from 'react';
import { HiOutlineClock, HiOutlineBuildingOffice2 } from 'react-icons/hi2';
import type { WorkSchedule, UserRole } from '../../../types/types.ts';
import { useAttendance } from '../../../hooks/get/useAttendance.ts';
import { useUserProfile } from '../../../hooks/get/useUserProfile.ts';
import { formatClock, formatTimestamp } from '../../../helpers/formats.ts';
import { useSelectedDateStore } from '../../../store/useSelectedStore.ts';

//----------------------------------------------------------------
//For punching in and punching out daily attendance of the logged in user

interface PunchClockCardProps {
  now: Date;
  statusLabel: string;
  clockIn: string | null;
  clockOut: string | null;
}

export const PunchClockPanel = () => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  //useMemo for memoziation of today
  //state updates every second, needs to memoized/cache today to prevent 'today' to recalculate every state update
  const today = useMemo(() => new Date().toISOString().split('T')[0], []);
  const selectedDate = useSelectedDateStore((state) => state.selectedDate);
  const date = selectedDate ?? today;
  const { attendance } = useAttendance(date);
  const { userProfile } = useUserProfile();

  const clockIn = formatTimestamp(attendance?.in?.timestamp as string);
  const clockOut = formatTimestamp(attendance?.out?.timestamp as string);

  const statusLabel = !attendance?.in
    ? 'Awaiting punch'
    : !attendance?.out
      ? 'Clocked in'
      : 'Clocked out';

  return (
    <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <PunchClockCard
        now={now}
        statusLabel={statusLabel}
        clockIn={clockIn}
        clockOut={clockOut}
      />
      {userProfile && (
        <ScheduleCard
          schedule={userProfile.schedule}
          timezone={userProfile.timezone}
          role={userProfile.role}
        />
      )}
    </section>
  );
};

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
