import { HiOutlineCalendarDays } from 'react-icons/hi2';
import type { DailySummary } from '../../../types/types.ts';
import {
  formatMins,
  formatDateLabel,
  formatHrs,
} from '../../../helpers/formats.ts';
import { useDailySummaryHistory } from '../../../hooks/useDailySummaryHistory.ts';
import { useSelectedDateStore } from '../../../store/useSelectedStore.ts';

const GRID =
  'grid grid-cols-3 sm:grid-cols-6 gap-x-3 gap-y-1 sm:gap-x-4 sm:gap-y-2 sm:items-center';

const Stat = ({ label, value }: { label: string; value: string }) => (
  <div>
    <p className="font-semibold text-slate-900 text-xs sm:text-sm leading-tight">
      {value}
    </p>
    <p className="text-gray-400 text-[10px] sm:hidden leading-tight">{label}</p>
  </div>
);

interface DailySummaryItemProps {
  day: DailySummary;
  isSelected: boolean;
  onSelect: (date: string) => void;
}

const DailySummaryItem = ({
  day,
  isSelected,
  onSelect,
}: DailySummaryItemProps) => {
  const handleClick = () => onSelect(day.date);
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect(day.date);
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={`px-4 py-2.5 sm:px-6 sm:py-4 ${GRID} cursor-pointer
        transition-colors hover:bg-blue-100 ${isSelected ? 'bg-blue-200' : ''}`}
    >
      <p
        className="col-span-3 sm:col-span-1 font-semibold text-slate-900 text-xs
          sm:text-sm"
      >
        {formatDateLabel(day.date)}
      </p>
      <Stat label="Regular" value={formatHrs(day.regularHours)} />
      <Stat label="OT" value={formatHrs(day.overtimeHours)} />
      <Stat label="ND" value={formatHrs(day.nightDifferentialHours)} />
      <Stat label="Late" value={formatMins(day.lateMinutes)} />
      <Stat label="Undertime" value={formatMins(day.undertimeMinutes)} />
    </div>
  );
};

export const DailySummaryList = () => {
  const { summaryHistory, isSummaryHistoryLoading } = useDailySummaryHistory();
  const selectedDate = useSelectedDateStore((state) => state.selectedDate);
  const setSelectedDate = useSelectedDateStore(
    (state) => state.setSelectedDate
  );
  const activeDate = selectedDate ?? new Date().toISOString().split('T')[0]; //default to today's date if none

  return (
    <section
      className="bg-white rounded-2xl border border-white shadow-lg
        overflow-hidden"
    >
      <div
        className="px-4 py-3 sm:px-6 sm:py-5 flex items-center gap-3 border-b
          border-gray-100"
      >
        <div
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-slate-100 text-gray-600
            flex items-center justify-center"
        >
          <HiOutlineCalendarDays className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
        <div>
          <h2 className="text-xs sm:text-sm font-bold text-slate-900">
            Daily Attendance History
          </h2>
          <p className="text-[11px] sm:text-xs font-medium text-gray-400">
            Daily breakdown of your punches
          </p>
        </div>
      </div>

      <div
        className="hidden sm:grid sm:grid-cols-6 gap-x-4 px-6 py-3 text-xs
          font-semibold text-gray-400 uppercase tracking-wide border-b
          border-gray-100"
      >
        <div>Date</div>
        <div>Regular</div>
        <div>OT</div>
        <div>ND</div>
        <div>Late</div>
        <div>Undertime</div>
      </div>

      <div className="divide-y divide-gray-100">
        {isSummaryHistoryLoading ? (
          <p
            className="px-4 py-6 sm:px-6 sm:py-8 text-center text-gray-400
              text-sm"
          >
            Loading...
          </p>
        ) : summaryHistory.length === 0 ? (
          <p
            className="px-4 py-6 sm:px-6 sm:py-8 text-center text-gray-400
              text-sm"
          >
            No attendance records found.
          </p>
        ) : (
          summaryHistory.map((day) => (
            <DailySummaryItem
              key={day.date}
              day={day}
              isSelected={day.date === activeDate}
              onSelect={setSelectedDate}
            />
          ))
        )}
      </div>
    </section>
  );
};
