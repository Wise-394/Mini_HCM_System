import { useNavigate, Outlet } from 'react-router';
import { useEffect } from 'react';
import { Header } from '../../components/Header.tsx';
import { useAuthStore } from '../../store/useAuthStore.tsx';

export const IndexLayout = () => {
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/home');
    }
  }, [user, navigate]);

  return (
    <>
      <Header />
      <Outlet />
    </>
  );
};
