import { HiOutlineUsers } from 'react-icons/hi2';
import { useAllEmployees } from '../../hooks/get/useAllEmployees.ts';
import {
  EmployeeRow,
  GRID,
} from '../../components/admin/EmployeesProfile/EmployeeListRow.tsx';

//----------------------------------------------------------------
// /admin/employees

const COLUMNS = ['Name', 'Email', 'Shift', 'Role', ''];

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
            className={`hidden sm:grid ${GRID} px-6 py-3 text-xs font-semibold
              text-gray-400 uppercase tracking-wide border-b border-gray-100`}
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
