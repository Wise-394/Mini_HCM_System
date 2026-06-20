import { useState, useEffect, useMemo } from 'react';
import { useUserProfile } from '../../hooks/useUserProfile.ts';
import { useLastPunchAttendance } from '../../hooks/useLastPunchAttendance.ts';
import { usePunchAttendance } from '../../hooks/usePunchAttendance.ts';
import { getInitials } from '../../helpers/getInitials.ts';
import { getGreeting } from '../../helpers/getGreetings.ts';
import { formatClock } from '../../helpers/formats.ts';

export const Home = () => {
  const { userProfile, isUserLoading, userError } = useUserProfile();
  const { lastAttendance, isAttendanceLoading } = useLastPunchAttendance();
  const { punchAttendance, isPunchLoading } = usePunchAttendance();

  const [now, setNow] = useState(() => new Date());
  const [today, setToday] = useState(() =>
    new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Manila' })
  );

  useEffect(() => {
    const interval = setInterval(() => {
      const next = new Date();
      setNow(next);
      const nextDay = next.toLocaleDateString('en-CA', {
        timeZone: 'Asia/Manila',
      });
      setToday((prev) => (prev !== nextDay ? nextDay : prev));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formattedDate = useMemo(
    () =>
      new Date(`${today}T00:00:00`).toLocaleDateString('en-PH', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
      }),
    [today]
  );

  const greeting = useMemo(() => getGreeting(), []);
  const initials = useMemo(
    () => getInitials(userProfile?.name ?? ''),
    [userProfile?.name]
  );
  const scheduleLabel = useMemo(
    () =>
      userProfile?.schedule
        ? `${userProfile.schedule.start} – ${userProfile.schedule.end}`
        : '—',
    [userProfile?.schedule]
  );

  const isDoneForToday =
    lastAttendance?.type === 'out' && lastAttendance?.date === today;
  const isClockedIn = lastAttendance?.type === 'in';

  return (
    <main
      className="flex-1 flex items-center justify-center p-4 sm:p-6 bg-slate-100
        shadow-lg"
    >
      <div
        className="w-full max-w-md bg-white rounded-2xl sm:rounded-3xl border
          border-slate-200"
      >
        {isUserLoading || isAttendanceLoading ? (
          <HomeSkeleton />
        ) : userError ? (
          <p className="text-sm text-red-400 text-center p-10">{userError}</p>
        ) : (
          <div className="p-6 sm:p-9">
            {/* Header */}
            <div
              className="flex items-center justify-between gap-3 mb-7 sm:mb-8
                flex-wrap"
            >
              <div className="flex items-center gap-3 sm:gap-3.5">
                <div
                  className="w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-blue-100
                    flex items-center justify-center text-blue-700 text-sm
                    sm:text-base font-medium select-none shrink-0"
                >
                  {initials}
                </div>
                <div>
                  <p
                    className="text-sm sm:text-base font-medium text-slate-900
                      leading-none"
                  >
                    {userProfile?.name}
                  </p>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1">
                    Sample Company · Manila
                  </p>
                </div>
              </div>
            </div>

            {/* Clock */}
            <div className="mb-7 sm:mb-8">
              <p className="text-xs sm:text-sm text-slate-400 mb-1.5">
                {formattedDate}
              </p>
              <span
                className="text-4xl sm:text-5xl font-medium text-slate-900
                  leading-none tabular-nums"
              >
                {formatClock(now)}
              </span>
            </div>

            {/* Schedule */}
            <div className="bg-slate-50 rounded-xl px-4 py-3.5 mb-7 sm:mb-8">
              <p className="text-xs text-slate-400 mb-1">Schedule</p>
              <p className="text-sm font-medium text-slate-800">
                {scheduleLabel}
              </p>
            </div>

            {/* Message */}
            <p className="text-sm text-slate-400 leading-relaxed mb-5">
              {isDoneForToday
                ? "You're all done for today. Great work!"
                : isClockedIn
                  ? `${greeting}! remember to clock out when done.`
                  : `${greeting}! You haven't clocked in yet.`}
            </p>

            {/* Button */}
            <button
              disabled={isPunchLoading || isDoneForToday}
              onClick={() => punchAttendance(isClockedIn ? 'out' : 'in')}
              className={`w-full py-3.5 rounded-xl text-white text-sm
                font-medium transition-colors cursor-pointer disabled:opacity-50
                disabled:cursor-not-allowed ${
                  isDoneForToday
                    ? 'bg-slate-400'
                    : isClockedIn
                      ? 'bg-red-500 hover:bg-red-600'
                      : 'bg-blue-600 hover:bg-blue-700'
                }`}
            >
              {isPunchLoading
                ? 'Processing…'
                : isDoneForToday
                  ? 'Done for today'
                  : isClockedIn
                    ? 'Clock Out'
                    : 'Clock In'}
            </button>
          </div>
        )}
      </div>
    </main>
  );
};

const HomeSkeleton = () => (
  <div className="p-6 sm:p-9 space-y-6">
    <div className="flex items-center gap-3.5">
      <div
        className="w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-slate-200
          animate-pulse shrink-0"
      />
      <div className="space-y-2">
        <div className="h-4 w-32 bg-slate-200 animate-pulse rounded" />
        <div className="h-3 w-24 bg-slate-100 animate-pulse rounded" />
      </div>
    </div>
    <div className="space-y-2">
      <div className="h-3 w-36 bg-slate-100 animate-pulse rounded" />
      <div className="h-10 w-44 bg-slate-200 animate-pulse rounded" />
    </div>
    <div className="h-16 w-full bg-slate-100 animate-pulse rounded-xl" />
    <div className="h-3.5 w-full bg-slate-100 animate-pulse rounded" />
    <div className="h-12 w-full bg-slate-200 animate-pulse rounded-xl" />
  </div>
);
