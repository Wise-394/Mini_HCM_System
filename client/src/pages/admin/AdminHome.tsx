import { useEffect, useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore.ts';
import { EmployeesKPI } from '../../components/admin/EmpployeesKPI.tsx';
import { HiOutlineClock } from 'react-icons/hi2';
import { EmployeesAttendanceList } from '../../components/admin/EmployeesAttendanceList.tsx';

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
};

const formatClock = (date: Date) =>
  date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

const formatDateLong = (date: Date) =>
  date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

export const AdminHome = () => {
  const user = useAuthStore((state) => state.user);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const displayName = user?.email ? user.email.split('@')[0] : 'Admin';

  return (
    <main className="flex flex-1 flex-col bg-slate-50">
      <div
        className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 flex flex-col
          gap-8"
      >
        {/* Page header */}
        <div
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between
            gap-4"
        >
          <div>
            <p
              className="text-xs font-semibold uppercase tracking-wider
                text-slate-400 mb-1"
            >
              Admin Dashboard
            </p>
            <h1
              className="text-2xl sm:text-3xl font-extrabold text-slate-900
                tracking-tight capitalize"
            >
              {getGreeting()}, {displayName}
            </h1>
          </div>

          <div
            className="flex items-center gap-3 bg-white rounded-2xl border
              border-slate-200 shadow-sm px-4 py-3 self-start sm:self-auto"
          >
            <div
              className="w-9 h-9 rounded-xl bg-slate-100 flex items-center
                justify-center text-slate-500"
            >
              <HiOutlineClock className="w-5 h-5" />
            </div>
            <div className="leading-tight">
              <p className="text-base font-bold text-slate-900 tabular-nums">
                {formatClock(now)}
              </p>
              <p className="text-xs font-medium text-slate-400">
                {formatDateLong(now)}
              </p>
            </div>
          </div>
        </div>

        <EmployeesKPI />
        <EmployeesAttendanceList />
      </div>
    </main>
  );
};
