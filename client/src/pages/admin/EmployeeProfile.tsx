import { useParams } from 'react-router';
import { EmployeeAttendanceList } from '../../components/admin/EmployeesProfile/EmployeeAttendanceList.tsx';
import { EditAttendanceModal } from '../../components/admin/EmployeesProfile/EditAttendanceModal.tsx';
export const EmployeeProfilePage = () => {
  const { userId } = useParams<{ userId: string }>();

  if (!userId) return null;

  return (
    <main className="flex-1 p-4 sm:p-6 bg-slate-100">
      <EditAttendanceModal />
      <div className="max-w-7xl mx-auto">
        <EmployeeAttendanceList userId={userId} />
      </div>
    </main>
  );
};
