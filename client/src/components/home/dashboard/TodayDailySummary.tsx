import { formatHrs, formatMins } from '../../../helpers/formats.ts';
import {
  HiOutlineCheckCircle,
  HiOutlineArrowTrendingUp,
  HiOutlineArrowTrendingDown,
  HiOutlineMoon,
  HiOutlineExclamationTriangle,
} from 'react-icons/hi2';
import { useDailySummary } from '../../../hooks/useDailySummary.ts';

export const TodayDailySummary = () => {
  const today = new Date().toISOString().split('T')[0];
  const { dailySummary, isDailySummaryLoading } = useDailySummary(today);

  const kpis = [
    {
      label: 'Regular Hours',
      value: formatHrs(dailySummary?.regularHours ?? 0),
      icon: HiOutlineCheckCircle,
      accent: 'text-emerald-600',
    },
    {
      label: 'Overtime',
      value: formatHrs(dailySummary?.overtimeHours ?? 0),
      icon: HiOutlineArrowTrendingUp,
      accent: 'text-blue-600',
    },
    {
      label: 'Night Diff',
      value: formatHrs(dailySummary?.nightDifferentialHours ?? 0),
      icon: HiOutlineMoon,
      accent: 'text-indigo-600',
    },
    {
      label: 'Late',
      value: formatMins(dailySummary?.lateMinutes ?? 0),
      icon: HiOutlineExclamationTriangle,
      accent: 'text-amber-600',
    },
    {
      label: 'Undertime',
      value: formatMins(dailySummary?.undertimeMinutes ?? 0),
      icon: HiOutlineArrowTrendingDown,
      accent: 'text-rose-600',
    },
  ];

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
              {isDailySummaryLoading ? (
                <div
                  className="h-7 w-16 bg-slate-200 rounded-md animate-pulse
                    mb-1"
                />
              ) : (
                <p
                  className="text-xl font-extrabold text-slate-900
                    tracking-tight"
                >
                  {value}
                </p>
              )}
              <p className="text-xs font-medium text-gray-400">{label}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
