import type { DailyAttendance } from '../../../types/types.ts';
import { formatTimestamp, formatDateLabel } from '../../../helpers/formats.ts';

const GRID =
  'grid grid-cols-2 sm:grid-cols-[2fr_1.5fr_1.5fr] gap-x-3 gap-y-1 sm:gap-x-4 sm:gap-y-0 sm:items-center';

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
  record: DailyAttendance;
}) => {
  const isAbsent = !record.in && !record.out;

  return (
    <div className={`px-4 py-2.5 sm:px-6 sm:py-4 ${GRID}`}>
      <p className="font-semibold text-slate-900 text-xs sm:text-sm">
        {formatDateLabel(date)}
      </p>
      {isAbsent ? (
        <p
          className="col-span-1 sm:col-span-2 text-rose-500 text-xs sm:text-sm
            font-medium"
        >
          Absent
        </p>
      ) : (
        <>
          <Stat
            label="Time In"
            value={formatTimestamp(record.in?.timestamp) ?? '—'}
          />
          <Stat
            label="Time Out"
            value={formatTimestamp(record.out?.timestamp) ?? '—'}
          />
        </>
      )}
    </div>
  );
};
