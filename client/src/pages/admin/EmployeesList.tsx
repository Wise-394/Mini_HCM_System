import { useNavigate } from 'react-router';
import { HiOutlineUsers, HiOutlineChevronRight } from 'react-icons/hi2';
import type { UserProfileType } from '../../types/types.ts';
import { formatShiftTime } from '../../helpers/formats.ts';
import { useAllEmployees } from '../../hooks/get/useAllEmployees.ts';

const GRID =
  'grid grid-cols-2 sm:grid-cols-[2fr_2fr_1.5fr_1fr_auto] gap-x-3 gap-y-1 sm:gap-x-4 sm:gap-y-0 sm:items-center';

const COLUMNS = ['Name', 'Email', 'Shift', 'Role', ''];

const RoleBadge = ({ role }: { role: string | null }) => (
  <span
    className="inline-block text-[10px] sm:text-xs font-medium px-2 py-0.5
      rounded-full text-gray-500"
  >
    {role ?? '—'}
  </span>
);

const EmployeeRow = ({ emp }: { emp: UserProfileType }) => {
  const navigate = useNavigate();

  const shiftLabel = emp.schedule
    ? `${formatShiftTime(emp.schedule.start)} – ${formatShiftTime(emp.schedule.end)}`
    : '—';

  return (
    <div
      onClick={() => navigate(`/admin/employees/${emp.uid}`)}
      className={`px-4 py-2.5 sm:px-6 sm:py-4 ${GRID} cursor-pointer
        hover:bg-slate-50 transition-colors group`}
    >
      <div>
        <p
          className="font-semibold text-slate-900 text-xs sm:text-sm
            leading-tight"
        >
          {emp.name}
        </p>
        <p className="text-[11px] text-slate-400 leading-tight">
          {emp.timezone}
        </p>
      </div>
      <p className="text-slate-500 text-xs sm:text-sm truncate">{emp.email}</p>
      <p className="text-slate-500 text-xs sm:text-sm">{shiftLabel}</p>
      <RoleBadge role={emp.role} />
      <div className="hidden sm:flex justify-end">
        <HiOutlineChevronRight
          className="w-4 h-4 text-slate-300 group-hover:text-slate-500
            transition-colors"
        />
      </div>
    </div>
  );
};

export const EmployeesList = () => {
  const { employees, isLoading } = useAllEmployees();

  return (
    <main className="flex-1 p-4 sm:p-6 bg-slate-100">
      <div className="max-w-7xl mx-auto">
        <section
          className="bg-white rounded-2xl border border-slate-200
            overflow-hidden"
        >
          {/* Header */}
          <div
            className="px-4 py-3 sm:px-6 sm:py-5 flex items-center gap-3
              border-b border-gray-100"
          >
            <div
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-slate-100
                text-gray-600 flex items-center justify-center"
            >
              <HiOutlineUsers className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h2 className="text-xs sm:text-sm font-bold text-slate-900">
                Employees
              </h2>
              <p className="text-[11px] sm:text-xs font-medium text-gray-400">
                All registered employees
              </p>
            </div>
          </div>

          {/* Column headers — desktop only */}
          <div
            className="hidden sm:grid sm:grid-cols-[2fr_2fr_1.5fr_1fr_auto]
              gap-x-4 px-6 py-3 text-xs font-semibold text-gray-400 uppercase
              tracking-wide border-b border-gray-100"
          >
            {COLUMNS.map((col, i) => (
              <div key={i}>{col}</div>
            ))}
          </div>

          {/* Rows */}
          <div className="divide-y divide-gray-100">
            {isLoading ? (
              <p
                className="px-4 py-6 sm:px-6 sm:py-8 text-center text-gray-400
                  text-sm"
              >
                Loading...
              </p>
            ) : !employees || employees.length === 0 ? (
              <p
                className="px-4 py-6 sm:px-6 sm:py-8 text-center text-gray-400
                  text-sm"
              >
                No employees found.
              </p>
            ) : (
              employees.map((emp) => <EmployeeRow key={emp.uid} emp={emp} />)
            )}
          </div>
        </section>
      </div>
    </main>
  );
};
