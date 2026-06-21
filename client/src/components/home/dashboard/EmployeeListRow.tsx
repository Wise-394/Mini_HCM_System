import { useNavigate } from 'react-router';
import { HiOutlineChevronRight } from 'react-icons/hi2';
import type { UserProfileType } from '../../../types/types.ts';
import { formatShiftTime } from '../../../helpers/formats.ts';

export const GRID =
  'grid grid-cols-2 sm:grid-cols-[2fr_2fr_1.5fr_1fr_auto] gap-x-3 gap-y-1 sm:gap-x-4 sm:gap-y-0 sm:items-center';

const RoleBadge = ({ role }: { role: string | null }) => (
  <span
    className="inline-block text-[10px] sm:text-xs font-medium px-2 py-0.5
      rounded-full text-gray-500"
  >
    {role ?? '—'}
  </span>
);

export const EmployeeRow = ({ emp }: { emp: UserProfileType }) => {
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
