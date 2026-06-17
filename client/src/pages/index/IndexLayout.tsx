import { useNavigate, Outlet } from 'react-router';
import { Header } from '../../components/Header.tsx';
import { useAuthStore } from '../../store/useAuthStore.tsx';

export const IndexLayout = () => {
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();
  if (user) {
    return navigate('/home');
  }
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
};
