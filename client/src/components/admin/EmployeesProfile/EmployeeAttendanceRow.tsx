import type { DailyAttendanceWithSummary } from '../../../types/types.ts';
import { formatTimestamp, formatDateLabel } from '../../../helpers/formats.ts';
import { HiOutlinePencilSquare } from 'react-icons/hi2';
import { useAttendanceEditModalStore } from '../../../store/attendanceEditModalStore.ts';

export const GRID =
  'sm:grid-cols-[1.5fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_auto] sm:gap-4 sm:items-center';

const Stat = ({ label, value }: { label: string; value: string }) => (
  <div className="min-w-0">
    <p className="font-semibold text-slate-900 text-xs sm:text-sm truncate">
      {value}
    </p>
    <p className="text-gray-400 text-[10px] sm:hidden">{label}</p>
  </div>
);

export const EmployeeAttendanceRow = ({
  userId,
  date,
  record,
}: {
  userId: string;
  date: string;
  record: DailyAttendanceWithSummary;
}) => {
  const openModal = useAttendanceEditModalStore((state) => state.openModal);
  const summary = record.summary;

  const handleEdit = () => openModal(userId, date, record);

  return (
    <>
      {/* Mobile */}
      <div className="sm:hidden px-4 py-4 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-semibold text-slate-900">
              {formatDateLabel(date)}
            </p>
          </div>
          <button
            onClick={handleEdit}
            type="button"
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs
              font-medium text-slate-600 border border-slate-200 rounded-lg"
          >
            <HiOutlinePencilSquare className="w-4 h-4" />
            Edit
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Stat
            label="Time In"
            value={formatTimestamp(record.in?.timestamp) ?? '—'}
          />
          <Stat
            label="Time Out"
            value={formatTimestamp(record.out?.timestamp) ?? '—'}
          />
          <Stat label="Hours" value={summary?.hoursWorked?.toFixed(2) ?? '—'} />
          <Stat
            label="Regular"
            value={summary?.regularHours?.toFixed(2) ?? '—'}
          />
          <Stat
            label="Overtime"
            value={summary?.overtimeHours?.toFixed(2) ?? '—'}
          />
          <Stat
            label="Late"
            value={
              summary?.lateMinutes !== undefined
                ? `${summary.lateMinutes}m`
                : '—'
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
        </div>
      </div>

      {/* Desktop */}
      <div className={`hidden sm:grid ${GRID} px-6 py-4`}>
        <p className="font-semibold text-slate-900 text-sm">
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
        <Stat
          label="Regular"
          value={summary?.regularHours?.toFixed(2) ?? '—'}
        />
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
        <button
          type="button"
          onClick={handleEdit}
          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs
            font-medium text-slate-600 border border-slate-200 rounded-lg
            hover:bg-slate-50 hover:cursor-pointer"
        >
          <HiOutlinePencilSquare className="w-4 h-4" />
          Edit
        </button>
      </div>
    </>
  );
};
