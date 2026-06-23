import {
  formatHrs,
  formatMins,
  formatDateLabel,
} from '../../../helpers/formats.ts';
import {
  HiOutlineCheckCircle,
  HiOutlineArrowTrendingUp,
  HiOutlineArrowTrendingDown,
  HiOutlineMoon,
  HiOutlineExclamationTriangle,
  HiOutlineArrowUturnLeft,
} from 'react-icons/hi2';
import { useDailySummary } from '../../../hooks/get/useDailySummary.ts';
import { useSelectedDateStore } from '../../../store/useSelectedStore.ts';

//----------------------------------------------------------------
//Shows the daily summary of specified date of the logged in user

const getTodayDate = () => new Date().toISOString().split('T')[0];

export const DailySummaryByDate = () => {
  const today = getTodayDate();
  const selectedDate = useSelectedDateStore((state) => state.selectedDate);
  const resetToToday = useSelectedDateStore((state) => state.resetToToday);

  const activeDate = selectedDate ?? today;
  const isToday = activeDate === today;

  const { dailySummary, isDailySummaryLoading } = useDailySummary(activeDate);

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
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-bold text-slate-900">
          {isToday
            ? "Today's Summary"
            : `Summary for ${formatDateLabel(activeDate)}`}
        </h2>
        {!isToday && (
          <button
            onClick={resetToToday}
            className="flex items-center gap-1 text-xs font-semibold
              text-blue-600 hover:text-blue-700 hover:cursor-pointer"
          >
            <HiOutlineArrowUturnLeft className="w-3.5 h-3.5" />
            Back to Today
          </button>
        )}
      </div>
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
