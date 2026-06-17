import { Link } from 'react-router';
import { useAuthStore } from '../store/useAuthStore.tsx';
import { signOut } from 'firebase/auth';
import { auth } from '../configs/firebase.ts';

export const Header = () => {
  const user = useAuthStore((state) => state.user);

  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <header className="p-5 flex w-full">
      <Link to="/">HCM</Link>
      {user ? (
        <button className="ml-auto hover:cursor-pointer" onClick={handleLogout}>
          Logout
        </button>
      ) : (
        <nav className="flex ml-auto gap-5">
          <Link to="/register">Register</Link>
          <Link to="/login">Login</Link>
        </nav>
      )}
    </header>
  );
};
