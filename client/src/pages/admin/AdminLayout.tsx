import { useNavigate, Outlet } from 'react-router';
import { useEffect } from 'react';
import { useAuthStore } from '../../store/useAuthStore.ts';
import { Header } from '../../components/Header.tsx';

//----------------------------------------------------------------
// layout page for admin pages

export const AdminLayout = () => {
  const user = useAuthStore((state) => state.user);
  const isAuthLoading = useAuthStore((state) => state.isAuthLoading);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthLoading) return;
    if (!user) {
      navigate('/');
      return;
    }
    if (user.role !== 'admin') {
      navigate('/home');
    }
  }, [user, isAuthLoading, navigate]);

  if (isAuthLoading)
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-100">
        <div
          className="w-8 h-8 border-4 border-blue-500 border-t-transparent
            rounded-full animate-spin"
        />
      </div>
    );

  if (!user || user.role !== 'admin') return null;

  return (
    <>
      <Header />
      <Outlet />
    </>
  );
};
