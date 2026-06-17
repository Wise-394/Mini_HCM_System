import { Link } from 'react-router';
import { useAuthStore } from '../store/useAuthStore.tsx';
export const Header = () => {
  const user = useAuthStore((state) => state.user);
  return (
    <header className="p-5 flex w-full">
      <Link to="/">HCM</Link>
      {user ? (
        <button className="ml-auto hover:cursor-pointer">Logout</button>
      ) : (
        <nav className="flex ml-auto gap-5">
          <Link to="/register">Register</Link>
          <Link to="/login">Login</Link>
        </nav>
      )}
    </header>
  );
};
