import type { DailyAttendanceWithSummary } from '../../../types/types.ts';
import { formatTimestamp, formatDateLabel } from '../../../helpers/formats.ts';
import { HiOutlinePencilSquare } from 'react-icons/hi2';
import { useAttendanceEditModalStore } from '../../../store/attendanceEditModalStore.ts';

//----------------------------------------------------------------
//each row shows the attendance + daily summary of specific employee
//Desktop and mobile have different jsx format so I separated them for more readability
//used by EmployeeAttendanceList

export const GRID =
  'sm:grid-cols-[1.5fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_auto] sm:gap-4 sm:items-center';

type StatItem = { label: string; mobileLabel?: string; value: string };

type RowProps = {
  date: string;
  stats: StatItem[];
  onEdit: () => void;
};

const Stat = ({ label, value }: { label: string; value: string }) => (
  <div className="min-w-0">
    <p className="font-semibold text-slate-900 text-xs sm:text-sm truncate">
      {value}
    </p>
    <p className="text-gray-400 text-[10px] sm:hidden">{label}</p>
  </div>
);

const MobileRow = ({ date, stats, onEdit }: RowProps) => (
  <div className="sm:hidden px-4 py-4 space-y-3">
    <div className="flex items-start justify-between gap-3">
      <p className="font-semibold text-slate-900">{formatDateLabel(date)}</p>
      <button
        onClick={onEdit}
        type="button"
        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs
          font-medium text-slate-600 border border-slate-200 rounded-lg
          hover:cursor-pointer"
      >
        <HiOutlinePencilSquare className="w-4 h-4" />
        Edit
      </button>
    </div>
    <div className="grid grid-cols-2 gap-3">
      {stats.map(({ label, mobileLabel, value }) => (
        <Stat key={label} label={mobileLabel ?? label} value={value} />
      ))}
    </div>
  </div>
);

const DesktopRow = ({ date, stats, onEdit }: RowProps) => (
  <div className={`hidden sm:grid ${GRID} px-6 py-4`}>
    <p className="font-semibold text-slate-900 text-sm">
      {formatDateLabel(date)}
    </p>
    {stats.map(({ label, value }) => (
      <Stat key={label} label={label} value={value} />
    ))}
    <button
      type="button"
      onClick={onEdit}
      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium
        text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50
        hover:cursor-pointer"
    >
      <HiOutlinePencilSquare className="w-4 h-4" />
      Edit
    </button>
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

  const stats: StatItem[] = [
    {
      label: 'Time In',
      value: formatTimestamp(record.in?.timestamp) ?? '—',
    },
    {
      label: 'Time Out',
      value: formatTimestamp(record.out?.timestamp) ?? '—',
    },
    {
      label: 'Hours Worked',
      mobileLabel: 'Hours',
      value: summary?.hoursWorked?.toFixed(2) ?? '—',
    },
    {
      label: 'Regular',
      value: summary?.regularHours?.toFixed(2) ?? '—',
    },
    {
      label: 'Overtime',
      value: summary?.overtimeHours?.toFixed(2) ?? '—',
    },
    {
      label: 'Late',
      value:
        summary?.lateMinutes !== undefined ? `${summary.lateMinutes}m` : '—',
    },
    {
      label: 'Undertime',
      value:
        summary?.undertimeMinutes !== undefined
          ? `${summary.undertimeMinutes}m`
          : '—',
    },
  ];

  return (
    <>
      <MobileRow date={date} stats={stats} onEdit={handleEdit} />
      <DesktopRow date={date} stats={stats} onEdit={handleEdit} />
    </>
  );
};
