import { useNavigate, Outlet } from 'react-router';
import { useEffect } from 'react';
import { Header } from '../../components/Header.tsx';
import { useAuthStore } from '../../store/useAuthStore.tsx';

export const IndexLayout = () => {
  const user = useAuthStore((state) => state.user);
  const isAuthLoading = useAuthStore((state) => state.isAuthLoading);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthLoading) return;
    if (user) navigate('/home');
  }, [user, isAuthLoading, navigate]);

  if (isAuthLoading) return null;

  return (
    <>
      <Header />
      <Outlet />
    </>
  );
};
