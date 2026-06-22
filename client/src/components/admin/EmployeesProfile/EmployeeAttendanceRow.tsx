import type { DailyAttendanceWithSummary } from '../../../types/types.ts';
import { formatTimestamp, formatDateLabel } from '../../../helpers/formats.ts';
import { HiOutlinePencilSquare } from 'react-icons/hi2';
const GRID =
  'grid grid-cols-2 sm:grid-cols-[1.5fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_auto] gap-x-3 gap-y-1 sm:gap-x-4 sm:gap-y-0 sm:items-center';

const Stat = ({ label, value }: { label: string; value: string }) => (
  <div>
    <p className="font-semibold text-slate-900 text-xs sm:text-sm leading-tight">
      {value}
    </p>
    <p className="text-gray-400 text-[10px] sm:hidden leading-tight">{label}</p>
  </div>
);

export { GRID };

export const EmployeeAttendanceRow = ({
  date,
  record,
}: {
  date: string;
  record: DailyAttendanceWithSummary;
}) => {
  const isAbsent = !record.in && !record.out;
  const summary = record.summary;

  return (
    <div className={`px-4 py-2.5 sm:px-6 sm:py-4 ${GRID}`}>
      <p className="font-semibold text-slate-900 text-xs sm:text-sm">
        {formatDateLabel(date)}
      </p>

      <Stat
        label="Time In"
        value={formatTimestamp(record.in?.timestamp) ?? '—'}
      />

      <Stat
        label="Time Out"
        value={formatTimestamp(record.out?.timestamp) ?? '—'}
      />

      <Stat
        label="Hours Worked"
        value={summary?.hoursWorked?.toFixed(2) ?? '—'}
      />

      <Stat label="Regular" value={summary?.regularHours?.toFixed(2) ?? '—'} />

      <Stat
        label="Overtime"
        value={summary?.overtimeHours?.toFixed(2) ?? '—'}
      />

      <Stat
        label="Late"
        value={
          summary?.lateMinutes !== undefined ? `${summary.lateMinutes}m` : '—'
        }
      />

      <Stat
        label="Undertime"
        value={
          summary?.undertimeMinutes !== undefined
            ? `${summary.undertimeMinutes}m`
            : '—'
        }
      />

      <Stat
        label="Status"
        value={isAbsent ? 'Absent' : summary?.status ? summary.status : '—'}
      />
      <button
        type="button"
        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs
          font-medium text-slate-600 border border-slate-200 rounded-lg
          hover:bg-slate-50 transition"
      >
        <HiOutlinePencilSquare className="w-4 h-4" />
        Edit
      </button>
    </div>
  );
};
