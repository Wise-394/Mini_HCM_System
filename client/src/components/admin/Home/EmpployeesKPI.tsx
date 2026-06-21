import { useEffect } from 'react';
import {
  HiOutlineUserGroup,
  HiOutlineCheckCircle,
  HiOutlineArrowTrendingUp,
  HiOutlineArrowTrendingDown,
  HiOutlineMoon,
  HiOutlineExclamationTriangle,
  HiOutlineCalendarDays,
} from 'react-icons/hi2';
import {
  formatHrs,
  formatDateLabel,
  getTodayDate,
} from '../../../helpers/formats.ts';
import { useKPIOfAllEmployees } from '../../../hooks/get/useKPIOfAllEmployeess.ts';
import { useSelectedDateStore } from '../../../store/useSelectedStore.ts';

type KpiDatePickerProps = {
  value: string;
  onChange: (date: string) => void;
};

const KpiDatePicker = ({ value, onChange }: KpiDatePickerProps) => {
  return (
    <label
      className="flex items-center gap-2 bg-white rounded-xl border
        border-slate-200 px-3 py-2 shadow-sm cursor-pointer"
    >
      <HiOutlineCalendarDays className="w-4 h-4 text-slate-400" />
      <input
        type="date"
        value={value}
        max={getTodayDate()}
        onChange={(e) => onChange(e.target.value)}
        className="text-xs font-semibold text-slate-700 outline-none
          bg-transparent"
      />
    </label>
  );
};

export const EmployeesKPI = () => {
  const today = getTodayDate();
  const selectedDate = useSelectedDateStore((s) => s.selectedDate);
  const setSelectedDate = useSelectedDateStore((s) => s.setSelectedDate);
  const resetToToday = useSelectedDateStore((s) => s.resetToToday);
  const date = selectedDate ?? today;
  const isToday = date === today;

  useEffect(() => {
    resetToToday();
  }, [resetToToday]);

  const { kpis, isKPIsLoading, kpisError } = useKPIOfAllEmployees(date);

  const cards = [
    {
      label: 'Present Today',
      value: kpis ? `${kpis.presentCount}/${kpis.totalEmployees}` : '0/0',
      icon: HiOutlineUserGroup,
      accent: 'text-violet-600',
    },
    {
      label: 'Regular Hours',
      value: formatHrs(kpis?.regularHours ?? 0),
      icon: HiOutlineCheckCircle,
      accent: 'text-emerald-600',
    },
    {
      label: 'Overtime',
      value: formatHrs(kpis?.overtimeHours ?? 0),
      icon: HiOutlineArrowTrendingUp,
      accent: 'text-blue-600',
    },
    {
      label: 'Night Diff',
      value: formatHrs(kpis?.nightDifferentialHours ?? 0),
      icon: HiOutlineMoon,
      accent: 'text-indigo-600',
    },
    {
      label: 'Late Arrivals',
      value: kpis?.lateCount ?? 0,
      icon: HiOutlineExclamationTriangle,
      accent: 'text-amber-600',
    },
    {
      label: 'Undertime',
      value: kpis?.undertimeCount ?? 0,
      icon: HiOutlineArrowTrendingDown,
      accent: 'text-rose-600',
    },
  ];

  return (
    <section>
      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
        <h2 className="text-sm font-bold text-slate-900">
          {isToday
            ? "Today's Company Summary"
            : `Company Summary for ${formatDateLabel(date)}`}
        </h2>
        <div className="flex items-center gap-2">
          {!isToday && (
            <button
              onClick={resetToToday}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700
                hover:cursor-pointer"
            >
              Back to Today
            </button>
          )}
          <KpiDatePicker value={date} onChange={setSelectedDate} />
        </div>
      </div>

      {kpisError && (
        <p className="text-xs font-medium text-rose-600 mb-3">
          Failed to load KPIs for this date. Please try again.
        </p>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {cards.map(({ label, value, icon: Icon, accent }) => (
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
              {isKPIsLoading ? (
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
