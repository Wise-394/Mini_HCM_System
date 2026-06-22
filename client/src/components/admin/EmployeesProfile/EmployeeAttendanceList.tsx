import { HiOutlineClipboardDocumentList } from 'react-icons/hi2';
import { useAllAttendanceWithDailySummaryOfUser } from '../../../hooks/get/useAllAttendanceWithDailySummaryOfUser.ts';
import { EmployeeAttendanceRow, GRID } from './EmployeeAttendanceRow.tsx';

const COLUMNS = [
  'Date',
  'Time In',
  'Time Out',
  'Hours Worked',
  'Regular',
  'Overtime',
  'Late',
  'Undertime',
  '',
];

export const EmployeeAttendanceList = ({ userId }: { userId: string }) => {
  const { attendance, isAttendanceLoading } =
    useAllAttendanceWithDailySummaryOfUser(userId);

  const rows = attendance
    ? Object.entries(attendance).sort(([a], [b]) => b.localeCompare(a))
    : [];

  return (
    <section
      className="bg-white rounded-2xl border border-slate-200 overflow-hidden"
    >
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
            Attendance History
          </h2>
          <p className="text-[11px] sm:text-xs font-medium text-gray-400">
            Clock in and out records
          </p>
        </div>
      </div>

      <div
        className={`hidden sm:grid ${GRID} px-6 py-3 text-xs font-semibold
          text-gray-400 uppercase tracking-wide border-b border-gray-100`}
      >
        {COLUMNS.map((col, i) => (
          <div key={i} className={i === COLUMNS.length - 1 ? 'w-16' : ''}>
            {col}
          </div>
        ))}
      </div>

      <div>
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
            No attendance records found.
          </p>
        ) : (
          rows.map(([date, record]) => (
            <div key={date} className="border-b border-gray-100 last:border-0">
              <EmployeeAttendanceRow
                userId={userId}
                date={date}
                record={record}
              />
            </div>
          ))
        )}
      </div>
    </section>
  );
};
