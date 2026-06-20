import { useEffect, useState } from 'react';
import {
  HiOutlineClock,
  HiOutlineCalendarDays,
  HiOutlineMoon,
  HiOutlineExclamationTriangle,
  HiOutlineArrowTrendingUp,
  HiOutlineArrowTrendingDown,
  HiOutlineCheckCircle,
  HiOutlineBuildingOffice2,
} from 'react-icons/hi2';

// ---- Types -------------------------------------------------------------
// Mirrors the Firestore shape described in the spec: users/{uid}.schedule
// and attendance/{punchId} -> dailySummary/{uid_date}

interface Schedule {
  start: string; // '09:00'
  end: string; // '18:00'
}

interface DailySummaryRow {
  date: string; // ISO date
  timeIn: string | null;
  timeOut: string | null;
  regularHrs: number;
  otHrs: number;
  ndHrs: number;
  lateMins: number;
  undertimeMins: number;
}

// ---- Mock data -----------------------------------------------------------
// Swap these for live Firestore reads (users/{uid}, dailySummary where
// uid == current user, ordered by date) once the backend is wired up.

const CURRENT_USER: {
  name: string;
  role: string;
  timezone: string;
  schedule: Schedule;
} = {
  name: 'Jamie Cruz',
  role: 'employee',
  timezone: 'Asia/Manila',
  schedule: { start: '09:00', end: '18:00' },
};

const TODAY_SUMMARY: DailySummaryRow = {
  date: '2026-06-20',
  timeIn: '08:57',
  timeOut: null,
  regularHrs: 6.4,
  otHrs: 0,
  ndHrs: 0,
  lateMins: 0,
  undertimeMins: 0,
};

const WEEK_HISTORY: DailySummaryRow[] = [
  {
    date: '2026-06-15',
    timeIn: '08:57',
    timeOut: '18:42',
    regularHrs: 8,
    otHrs: 0.7,
    ndHrs: 0,
    lateMins: 0,
    undertimeMins: 0,
  },
  {
    date: '2026-06-16',
    timeIn: '09:12',
    timeOut: '18:05',
    regularHrs: 7.8,
    otHrs: 0,
    ndHrs: 0,
    lateMins: 12,
    undertimeMins: 0,
  },
  {
    date: '2026-06-17',
    timeIn: '08:55',
    timeOut: '17:30',
    regularHrs: 7.5,
    otHrs: 0,
    ndHrs: 0,
    lateMins: 0,
    undertimeMins: 30,
  },
  {
    date: '2026-06-18',
    timeIn: '08:50',
    timeOut: '23:10',
    regularHrs: 8,
    otHrs: 4.2,
    ndHrs: 1.2,
    lateMins: 0,
    undertimeMins: 0,
  },
  {
    date: '2026-06-19',
    timeIn: '09:05',
    timeOut: '18:00',
    regularHrs: 8,
    otHrs: 0,
    ndHrs: 0,
    lateMins: 5,
    undertimeMins: 0,
  },
  TODAY_SUMMARY,
];

// ---- Helpers -------------------------------------------------------------

const formatClock = (date: Date) =>
  date.toLocaleTimeString('en-PH', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

const formatDateLabel = (iso: string) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString('en-PH', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

const formatHrs = (hrs: number) => (hrs > 0 ? `${hrs.toFixed(1)}h` : '—');

const formatMins = (mins: number) => (mins > 0 ? `${mins}m` : '—');

// ---- Component -------------------------------------------------------------

export const Dashboard = () => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const statusLabel = TODAY_SUMMARY.timeOut
    ? `Clocked out at ${TODAY_SUMMARY.timeOut}`
    : TODAY_SUMMARY.timeIn
      ? `Clocked in at ${TODAY_SUMMARY.timeIn}`
      : 'Not clocked in yet';

  const kpis = [
    {
      label: 'Regular Hours',
      value: formatHrs(TODAY_SUMMARY.regularHrs),
      icon: HiOutlineClock,
      accent: 'text-blue-600',
    },
    {
      label: 'Overtime',
      value: formatHrs(TODAY_SUMMARY.otHrs),
      icon: HiOutlineArrowTrendingUp,
      accent: 'text-emerald-600',
    },
    {
      label: 'Night Diff',
      value: formatHrs(TODAY_SUMMARY.ndHrs),
      icon: HiOutlineMoon,
      accent: 'text-indigo-600',
    },
    {
      label: 'Late',
      value: formatMins(TODAY_SUMMARY.lateMins),
      icon: HiOutlineExclamationTriangle,
      accent: 'text-amber-600',
    },
    {
      label: 'Undertime',
      value: formatMins(TODAY_SUMMARY.undertimeMins),
      icon: HiOutlineArrowTrendingDown,
      accent: 'text-rose-600',
    },
  ];

  return (
    <div className="flex-1 bg-slate-100 px-4 py-8 sm:px-6 lg:px-10">
      <div className="max-w-6xl mx-auto flex flex-col gap-6">
        {/* Header */}
        <header className="flex flex-col gap-1">
          <p
            className="text-xs font-semibold text-gray-400 uppercase
              tracking-wide"
          >
            {now.toLocaleDateString('en-PH', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          </p>
          <h1
            className="text-2xl sm:text-3xl font-extrabold text-slate-900
              tracking-tight"
          >
            Welcome back, {CURRENT_USER.name.split(' ')[0]}
          </h1>
        </header>

        {/* Punch Clock + Schedule */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div
            className="lg:col-span-2 bg-white rounded-2xl border border-white
              shadow-lg p-6 sm:p-8 flex items-center gap-4"
          >
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

          <div
            className="bg-white rounded-2xl border border-white shadow-lg p-6
              flex flex-col justify-center gap-3"
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
                  {CURRENT_USER.schedule.start} – {CURRENT_USER.schedule.end}
                </p>
              </div>
            </div>
            <p className="text-xs font-medium text-gray-400">
              {CURRENT_USER.timezone} · {CURRENT_USER.role}
            </p>
          </div>
        </section>

        {/* KPI Grid — today's breakdown */}
        <section>
          <h2 className="text-sm font-bold text-slate-900 mb-3">
            Today's Summary
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {kpis.map(({ label, value, icon: Icon, accent }) => (
              <div
                key={label}
                className="bg-white rounded-2xl border border-white shadow-lg
                  p-5 flex flex-col gap-3"
              >
                <div
                  className={`w-9 h-9 rounded-xl bg-slate-100 flex items-center
                  justify-center ${accent}`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <p
                    className="text-xl font-extrabold text-slate-900
                      tracking-tight"
                  >
                    {value}
                  </p>
                  <p className="text-xs font-medium text-gray-400">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* History */}
        <section
          className="bg-white rounded-2xl border border-white shadow-lg
            overflow-hidden"
        >
          <div
            className="px-6 py-5 flex items-center gap-3 border-b
              border-gray-100"
          >
            <div
              className="w-9 h-9 rounded-xl bg-slate-100 text-gray-600 flex
                items-center justify-center"
            >
              <HiOutlineCalendarDays className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">This Week</h2>
              <p className="text-xs font-medium text-gray-400">
                Daily breakdown of your punches
              </p>
            </div>
          </div>

          {/* Desktop / tablet table */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr
                  className="text-left text-xs font-semibold text-gray-400
                    uppercase tracking-wide"
                >
                  <th className="px-6 py-3">Date</th>
                  <th className="px-4 py-3">Time In</th>
                  <th className="px-4 py-3">Time Out</th>
                  <th className="px-4 py-3">Regular</th>
                  <th className="px-4 py-3">OT</th>
                  <th className="px-4 py-3">ND</th>
                  <th className="px-4 py-3">Late</th>
                  <th className="px-4 py-3">Undertime</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {WEEK_HISTORY.map((day) => {
                  const isComplete = Boolean(day.timeIn && day.timeOut);
                  return (
                    <tr key={day.date} className="border-t border-gray-100">
                      <td className="px-6 py-4 font-semibold text-slate-900">
                        {formatDateLabel(day.date)}
                      </td>
                      <td className="px-4 py-4 text-gray-500">
                        {day.timeIn ?? '—'}
                      </td>
                      <td className="px-4 py-4 text-gray-500">
                        {day.timeOut ?? '—'}
                      </td>
                      <td className="px-4 py-4 text-gray-500">
                        {formatHrs(day.regularHrs)}
                      </td>
                      <td className="px-4 py-4 text-gray-500">
                        {formatHrs(day.otHrs)}
                      </td>
                      <td className="px-4 py-4 text-gray-500">
                        {formatHrs(day.ndHrs)}
                      </td>
                      <td className="px-4 py-4 text-gray-500">
                        {formatMins(day.lateMins)}
                      </td>
                      <td className="px-4 py-4 text-gray-500">
                        {formatMins(day.undertimeMins)}
                      </td>
                      <td className="px-6 py-4">
                        {isComplete ? (
                          <span
                            className="inline-flex items-center gap-1 px-2.5
                              py-1 rounded-full bg-emerald-50 text-emerald-600
                              text-xs font-semibold"
                          >
                            <HiOutlineCheckCircle className="w-3.5 h-3.5" />{' '}
                            Complete
                          </span>
                        ) : (
                          <span
                            className="inline-flex items-center gap-1 px-2.5
                              py-1 rounded-full bg-slate-100 text-gray-400
                              text-xs font-semibold"
                          >
                            In Progress
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="sm:hidden divide-y divide-gray-100">
            {WEEK_HISTORY.map((day) => {
              const isComplete = Boolean(day.timeIn && day.timeOut);
              return (
                <div key={day.date} className="px-6 py-4 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-slate-900 text-sm">
                      {formatDateLabel(day.date)}
                    </p>
                    {isComplete ? (
                      <span
                        className="inline-flex items-center gap-1 px-2.5 py-1
                          rounded-full bg-emerald-50 text-emerald-600 text-xs
                          font-semibold"
                      >
                        <HiOutlineCheckCircle className="w-3.5 h-3.5" />{' '}
                        Complete
                      </span>
                    ) : (
                      <span
                        className="inline-flex items-center gap-1 px-2.5 py-1
                          rounded-full bg-slate-100 text-gray-400 text-xs
                          font-semibold"
                      >
                        In Progress
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400">
                    {day.timeIn ?? '—'} – {day.timeOut ?? '—'}
                  </p>
                  <div className="grid grid-cols-4 gap-2 text-xs">
                    <div>
                      <p className="font-semibold text-slate-900">
                        {formatHrs(day.regularHrs)}
                      </p>
                      <p className="text-gray-400">Reg</p>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">
                        {formatHrs(day.otHrs)}
                      </p>
                      <p className="text-gray-400">OT</p>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">
                        {formatMins(day.lateMins)}
                      </p>
                      <p className="text-gray-400">Late</p>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">
                        {formatMins(day.undertimeMins)}
                      </p>
                      <p className="text-gray-400">UT</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
};
