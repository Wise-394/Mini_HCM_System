import { useState, useEffect } from 'react';
import { useUserProfile } from '../../hooks/useUserProfile.tsx';
import { useLastAttendance } from '../../hooks/useLastAttendance.tsx';
import { usePunchAttendance } from '../../hooks/usePunchAttendance.tsx';
import { getInitials } from '../../helpers/getInitials.ts';
import { getGreeting } from '../../helpers/getGreetings.ts';
import type { FirestoreTimestamp } from '../../types/types.ts';
export const Home = () => {
  const { userProfile, isUserLoading, userError } = useUserProfile();
  const { lastAttendance, isAttendanceLoading } = useLastAttendance();
  const { punchAttendance, isPunchLoading } = usePunchAttendance();
  const [date, setDate] = useState(new Date());
  const today = date.toLocaleDateString('en-CA', { timeZone: 'Asia/Manila' });
  const isDoneForToday =
    lastAttendance?.type === 'out' && lastAttendance?.date === today;

  useEffect(() => {
    const interval = setInterval(() => setDate(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  const formattedDate = date.toLocaleDateString('en-PH', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  const formattedHour = date.toLocaleTimeString('en-PH', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  const [time, period] = formattedHour.split(' ');
  const isClockedIn = lastAttendance?.type === 'in';

  return (
    <main className="flex items-center justify-center p-4 flex-1 bg-slate-100">
      <div
        className="flex flex-col md:flex-row w-full max-w-3xl rounded-2xl
          overflow-hidden shadow-lg border border-white"
      >
        {/* Sidebar */}
        <aside
          className="bg-gray-700 flex flex-row md:flex-col justify-between
            md:w-60 p-6 md:p-9"
        >
          <div>
            <p className="text-white/60 text-xs mb-2 tracking-wide">
              {formattedDate}
            </p>
            <p className="text-white font-light leading-none text-6xl">
              {time}
              <span className="text-2xl font-normal align-super ml-1 opacity-80">
                {period.toLowerCase()}
              </span>
            </p>
          </div>
          <div className="md:mt-auto text-right md:text-left">
            <p className="text-white text-sm font-semibold">Sample Company</p>
            <p className="text-white/50 text-xs mt-0.5">Main Office · Manila</p>
          </div>
        </aside>

        {/* Main */}
        <section
          className="bg-white flex-1 flex flex-col items-center justify-center
            px-8 py-10"
        >
          {isUserLoading || isAttendanceLoading ? (
            <HomeSkeleton />
          ) : userError ? (
            <p className="text-sm text-red-400">{userError}</p>
          ) : (
            <>
              {/* Avatar */}
              <div
                className="w-24 h-24 rounded-full bg-linear-to-br from-blue-400
                  to-blue-600 flex items-center justify-center text-white
                  text-3xl font-semibold mb-5 select-none"
              >
                {getInitials(userProfile?.name ?? '')}
              </div>

              {/* Greeting */}
              <h1 className="text-2xl font-bold text-gray-900 text-center">
                {getGreeting()}, {userProfile?.name}
              </h1>
              <p className="text-sm text-gray-400 mt-1 mb-4">
                Let's get to work.
              </p>

              {/* Status badge */}
              <span
                className={`inline-flex items-center gap-1.5 text-xs px-3 py-1
                  rounded-full mb-4 font-medium ${
                    isClockedIn
                      ? 'bg-green-50 text-green-700'
                      : 'bg-orange-50 text-orange-700'
                  }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    isClockedIn ? 'bg-green-500' : 'bg-orange-400'
                  }`}
                />
                {isClockedIn ? 'Clocked In' : 'Clocked Out'}
              </span>

              {/* Clock-in details */}
              {isClockedIn && lastAttendance?.timestamp && (
                <div
                  className="bg-gray-50 rounded-lg px-5 py-3 mb-6 text-center
                    w-full max-w-xs"
                >
                  <p className="text-xs text-gray-400 mb-1">Clocked in at</p>
                  <p className="text-sm font-semibold text-gray-700">
                    {new Date(
                      (lastAttendance.timestamp as FirestoreTimestamp)
                        ._seconds * 1000
                    ).toLocaleTimeString('en-PH', {
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true,
                    })}
                  </p>
                </div>
              )}

              {/* Button */}
              <button
                disabled={isPunchLoading || isDoneForToday}
                onClick={() => punchAttendance(isClockedIn ? 'out' : 'in')}
                className={`w-full max-w-xs py-3.5 rounded-lg text-white
                  font-medium text-sm transition-colors mb-2.5
                  hover:cursor-pointer disabled:opacity-50
                  disabled:cursor-not-allowed ${
                    isDoneForToday
                      ? 'bg-gray-400'
                      : isClockedIn
                        ? 'bg-red-500 hover:bg-red-600'
                        : 'bg-blue-600 hover:bg-blue-700'
                  }`}
              >
                {isPunchLoading
                  ? 'Processing...'
                  : isDoneForToday
                    ? 'Done for today'
                    : isClockedIn
                      ? 'Clock Out'
                      : 'Clock In'}
              </button>
            </>
          )}
        </section>
      </div>
    </main>
  );
};

// loading state
const HomeSkeleton = () => (
  <>
    <div className="w-24 h-24 rounded-full bg-gray-200 animate-pulse mb-5" />
    <div className="h-7 w-48 bg-gray-200 animate-pulse rounded mb-2" />
    <div className="h-4 w-32 bg-gray-100 animate-pulse rounded mb-4" />
    <div className="h-6 w-20 bg-gray-100 animate-pulse rounded-full mb-6" />
    <div className="w-full max-w-xs h-12 bg-gray-200 animate-pulse rounded-lg" />
  </>
);
