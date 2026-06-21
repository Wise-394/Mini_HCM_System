import { useEffect, useState } from 'react';
import { DailySummaryByDate } from '../../components/home/dashboard/DailySummaryByDate.tsx';
import { DailySummaryList } from '../../components/home/dashboard/DailySummaryList.tsx';
import { PunchClockPanel } from '../../components/home/dashboard/PunchClockPanel.tsx';
import { useUserProfile } from '../../hooks/get/useUserProfile.ts';

export const Dashboard = () => {
  const [now, setNow] = useState(new Date());
  const { userProfile, isUserLoading, userError } = useUserProfile();

  useEffect(() => {
    const time = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(time);
  }, []);

  if (isUserLoading) {
    return <DashboardSkeleton />;
  }

  if (userError) {
    return (
      <div
        className="flex-1 bg-slate-100 px-4 py-8 sm:px-6 lg:px-10 flex
          items-center justify-center"
      >
        <div className="text-center text-red-500">
          <p className="font-semibold">Failed to load dashboard</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-slate-100 px-4 py-8 sm:px-6 lg:px-10">
      <div className="max-w-6xl mx-auto flex flex-col gap-6">
        {/* Header */}
        <header className="flex flex-col gap-1">
          <p
            className="text-xs font-semibold text-gray-400 uppercase
              tracking-wide"
          >
            {now.toLocaleDateString('en-PH', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          </p>
          <h1
            className="text-2xl sm:text-3xl font-extrabold text-slate-900
              tracking-tight"
          >
            Welcome back, {userProfile?.name?.split(' ')[0] || 'User'}
          </h1>
        </header>

        <PunchClockPanel />
        <DailySummaryByDate />
        <DailySummaryList />
      </div>
    </div>
  );
};

const DashboardSkeleton = () => {
  return (
    <div
      className="flex-1 bg-slate-100 px-4 py-8 sm:px-6 lg:px-10 animate-pulse"
    >
      <div className="max-w-6xl mx-auto flex flex-col gap-6">
        <header className="flex flex-col gap-2">
          <div className="h-4 w-48 bg-slate-200 rounded"></div>
          <div className="h-8 w-64 bg-slate-200 rounded"></div>
        </header>

        <div className="h-48 bg-slate-200 rounded-xl"></div>
        <div className="h-32 bg-slate-200 rounded-xl"></div>
        <div className="h-64 bg-slate-200 rounded-xl"></div>
      </div>
    </div>
  );
};
