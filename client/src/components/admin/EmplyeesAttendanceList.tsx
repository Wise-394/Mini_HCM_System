import { HiOutlineClipboardDocumentList } from 'react-icons/hi2';
import {
  formatTimestamp,
  formatDateLabel,
  formatShiftTime,
  getTodayDate,
} from '../../helpers/formats.ts';
import { useAllEmployeesAttendanceByDate } from '../../hooks/get/useAllEmployeesAttendanceByDate.tsx';
import { useSelectedDateStore } from '../../store/useSelectedStore.ts';

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
      <div
        className="px-4 py-3 sm:px-6 sm:py-5 flex items-center justify-between
          gap-3 border-b border-gray-100"
      >
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-slate-100
              text-gray-600 flex items-center justify-center"
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
      </div>

      <div
        className="hidden sm:grid sm:grid-cols-4 gap-x-4 px-6 py-3 text-xs
          font-semibold text-gray-400 uppercase tracking-wide border-b
          border-gray-100"
      >
        <div>Employee</div>
        <div>Shift</div>
        <div>Time In</div>
        <div>Time Out</div>
      </div>

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
          rows.map(([userId, record]) => {
            const isAbsent = !record.in && !record.out;

            return (
              <div
                key={userId}
                className="px-4 py-2.5 sm:px-6 sm:py-4 grid grid-cols-4 gap-x-3
                  items-center"
              >
                <p className="font-semibold text-slate-900 text-xs sm:text-sm">
                  {record.name}
                </p>
                <p className="text-slate-500 text-xs sm:text-sm">
                  {record.schedule
                    ? `${formatShiftTime(record.schedule.start)} – ${formatShiftTime(record.schedule.end)}`
                    : '—'}
                </p>
                {isAbsent ? (
                  <p
                    className="col-span-2 text-rose-500 text-xs sm:text-sm
                      font-medium"
                  >
                    Absent
                  </p>
                ) : (
                  <>
                    <p className="text-slate-700 text-xs sm:text-sm">
                      {formatTimestamp(record.in?.timestamp) ?? '—'}
                    </p>
                    <p className="text-slate-700 text-xs sm:text-sm">
                      {formatTimestamp(record.out?.timestamp) ?? '—'}
                    </p>
                  </>
                )}
              </div>
            );
          })
        )}
      </div>
    </section>
  );
};
