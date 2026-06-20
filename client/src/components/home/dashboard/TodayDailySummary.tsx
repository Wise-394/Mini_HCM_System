import { formatHrs, formatMins } from '../../../helpers/formats.ts';
import {
  HiOutlineCheckCircle,
  HiOutlineArrowTrendingUp,
  HiOutlineArrowTrendingDown,
  HiOutlineMoon,
  HiOutlineExclamationTriangle,
} from 'react-icons/hi2';
import type { DailySummary } from '../../../types/types.ts';

const TODAY_SUMMARY: DailySummary = {
  date: '2026-06-20',
  regularHrs: 6.4,
  otHrs: 0,
  ndHrs: 0,
  lateMins: 0,
  undertimeMins: 0,
};

const kpis = [
  {
    label: 'Regular Hours',
    value: formatHrs(TODAY_SUMMARY.regularHrs),
    icon: HiOutlineCheckCircle,
    accent: 'text-emerald-600',
  },
  {
    label: 'Overtime',
    value: formatHrs(TODAY_SUMMARY.otHrs),
    icon: HiOutlineArrowTrendingUp,
    accent: 'text-blue-600',
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

export const TodayDailySummary = () => {
  return (
    <section>
      <h2 className="text-sm font-bold text-slate-900 mb-3">Today's Summary</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {kpis.map(({ label, value, icon: Icon, accent }) => (
          <div
            key={label}
            className="bg-white rounded-2xl border border-white shadow-lg p-5
              flex flex-col gap-3"
          >
            <div
              className={`w-9 h-9 rounded-xl bg-slate-100 flex items-center
              justify-center ${accent}`}
            >
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <p
                className="text-xl font-extrabold text-slate-900 tracking-tight"
              >
                {value}
              </p>
              <p className="text-xs font-medium text-gray-400">{label}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
