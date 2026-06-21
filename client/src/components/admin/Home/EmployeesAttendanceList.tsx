import { HiOutlineClipboardDocumentList } from 'react-icons/hi2';
import {
  formatTimestamp,
  formatDateLabel,
  formatShiftTime,
  formatHrs,
  formatMins,
  getTodayDate,
} from '../../../helpers/formats.ts';
import { useAllEmployeesAttendanceByDate } from '../../../hooks/get/useAllEmployeesAttendanceByDate.ts';
import { useSelectedDateStore } from '../../../store/useSelectedStore.ts';
import type { DailyAttendanceWithSummary } from '../../../types/types.ts';

const GRID =
  'grid grid-cols-3 sm:grid-cols-7 gap-x-3 gap-y-1 sm:gap-x-4 sm:gap-y-0 sm:items-center';

const Stat = ({ label, value }: { label: string; value: string }) => (
  <div>
    <p className="font-semibold text-slate-900 text-xs sm:text-sm leading-tight">
      {value}
    </p>
    <p className="text-gray-400 text-[10px] sm:hidden leading-tight">{label}</p>
  </div>
);

const AttendanceRow = ({
  userId,
  record,
}: {
  userId: string;
  record: DailyAttendanceWithSummary;
}) => {
  const isAbsent = !record.in && !record.out;
  const summary = record.summary;
  const shiftLabel = record.schedule
    ? `${formatShiftTime(record.schedule.start)} – ${formatShiftTime(record.schedule.end)}`
    : '—';

  return (
    <div key={userId} className={`px-4 py-2.5 sm:px-6 sm:py-4 ${GRID}`}>
      {/* Name + shift (mobile subtitle) */}
      <div className="col-span-3 sm:col-span-1">
        <p
          className="font-semibold text-slate-900 text-xs sm:text-sm
            leading-tight"
        >
          {record.name}
        </p>
        <p className="text-[11px] text-slate-400 sm:hidden leading-tight">
          {shiftLabel}
        </p>
      </div>

      {/* Shift — desktop only */}
      <p className="hidden sm:block text-slate-500 text-xs sm:text-sm">
        {shiftLabel}
      </p>

      {isAbsent ? (
        <p
          className="col-span-3 sm:col-span-5 text-rose-500 text-xs sm:text-sm
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
          <Stat label="Hours" value={formatHrs(summary?.hoursWorked ?? 0)} />
          <Stat label="OT" value={formatHrs(summary?.overtimeHours ?? 0)} />
          <Stat label="Late" value={formatMins(summary?.lateMinutes ?? 0)} />
        </>
      )}
    </div>
  );
};

export const EmployeesAttendanceList = () => {
  const today = getTodayDate();
  const selectedDate = useSelectedDateStore((state) => state.selectedDate);
  const date = selectedDate ?? today;

  const { attendance, isAttendanceLoading } =
    useAllEmployeesAttendanceByDate(date);
  const rows = attendance ? Object.entries(attendance) : [];

  return (
    <section
      className="bg-white rounded-2xl border border-white shadow-lg
        overflow-hidden"
    >
      {/* Header */}
      <div
        className="px-4 py-3 sm:px-6 sm:py-5 flex items-center gap-3 border-b
          border-gray-100"
      >
        <div
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-slate-100 text-gray-600
            flex items-center justify-center"
        >
          <HiOutlineClipboardDocumentList className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
        <div>
          <h2 className="text-xs sm:text-sm font-bold text-slate-900">
            Employee Attendance
          </h2>
          <p className="text-[11px] sm:text-xs font-medium text-gray-400">
            Punches for {formatDateLabel(date)}
          </p>
        </div>
      </div>

      {/* Column headers — desktop only */}
      <div
        className="hidden sm:grid sm:grid-cols-7 gap-x-4 px-6 py-3 text-xs
          font-semibold text-gray-400 uppercase tracking-wide border-b
          border-gray-100"
      >
        {[
          'Employee',
          'Shift',
          'Time In',
          'Time Out',
          'Hours',
          'OT',
          'Late',
        ].map((col) => (
          <div key={col}>{col}</div>
        ))}
      </div>

      {/* Rows */}
      <div className="divide-y divide-gray-100">
        {isAttendanceLoading ? (
          <p
            className="px-4 py-6 sm:px-6 sm:py-8 text-center text-gray-400
              text-sm"
          >
            Loading...
          </p>
        ) : rows.length === 0 ? (
          <p
            className="px-4 py-6 sm:px-6 sm:py-8 text-center text-gray-400
              text-sm"
          >
            No employees found.
          </p>
        ) : (
          rows.map(([userId, record]) => (
            <AttendanceRow key={userId} userId={userId} record={record} />
          ))
        )}
      </div>
    </section>
  );
};
