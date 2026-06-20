import { HiOutlineCalendarDays } from 'react-icons/hi2';
import type { DailySummary } from '../../../types/types.ts';
import { formatMins } from '../../../helpers/formats.ts';
import { formatDateLabel } from '../../../helpers/formats.ts';
import { formatHrs } from '../../../helpers/formats.ts';

interface DailySummaryItemProps {
  day: DailySummary;
  variant: 'row' | 'card';
}

const DailySummaryItem = ({ day, variant }: DailySummaryItemProps) => {
  if (variant === 'row') {
    return (
      <tr className="border-t border-gray-100">
        <td className="px-6 py-4 font-semibold text-slate-900">
          {formatDateLabel(day.date)}
        </td>
        <td className="px-4 py-4 text-gray-500">{formatHrs(day.regularHrs)}</td>
        <td className="px-4 py-4 text-gray-500">{formatHrs(day.otHrs)}</td>
        <td className="px-4 py-4 text-gray-500">{formatHrs(day.ndHrs)}</td>
        <td className="px-4 py-4 text-gray-500">{formatMins(day.lateMins)}</td>
        <td className="px-4 py-4 text-gray-500">
          {formatMins(day.undertimeMins)}
        </td>
      </tr>
    );
  }

  return (
    <div className="px-6 py-4 flex flex-col gap-2">
      <p className="font-semibold text-slate-900 text-sm">
        {formatDateLabel(day.date)}
      </p>
      <div className="grid grid-cols-4 gap-2 text-xs">
        <div>
          <p className="font-semibold text-slate-900">
            {formatHrs(day.regularHrs)}
          </p>
          <p className="text-gray-400">Reg</p>
        </div>
        <div>
          <p className="font-semibold text-slate-900">{formatHrs(day.otHrs)}</p>
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
};

// ---- DailySummaryList ----------------------------------------------------

export const DailySummaryList = () => {
  // TODO: replace with TanStack Query once wired up
  const days: DailySummary[] = [];

  return (
    <section
      className="bg-white rounded-2xl border border-white shadow-lg
        overflow-hidden"
    >
      <div className="px-6 py-5 flex items-center gap-3 border-b
        border-gray-100">
        <div
          className="w-9 h-9 rounded-xl bg-slate-100 text-gray-600 flex
            items-center justify-center"
        >
          <HiOutlineCalendarDays className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-slate-900">
            Daily Attendance History
          </h2>
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
              className="text-left text-xs font-semibold text-gray-400 uppercase
                tracking-wide"
            >
              <th className="px-6 py-3">Date</th>
              <th className="px-4 py-3">Regular</th>
              <th className="px-4 py-3">OT</th>
              <th className="px-4 py-3">ND</th>
              <th className="px-4 py-3">Late</th>
              <th className="px-4 py-3">Undertime</th>
            </tr>
          </thead>
          <tbody>
            {days.map((day) => (
              <DailySummaryItem key={day.date} day={day} variant="row" />
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="sm:hidden divide-y divide-gray-100">
        {days.map((day) => (
          <DailySummaryItem key={day.date} day={day} variant="card" />
        ))}
      </div>
    </section>
  );
};
