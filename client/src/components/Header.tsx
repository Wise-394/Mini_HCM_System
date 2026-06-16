import { Link } from 'react-router';

export const Header = () => {
  return (
    <header className="p-5 flex w-full">
      <Link to="/">HCM</Link>
      <nav className="flex ml-auto gap-5">
        <Link to="/register">Register</Link>
        <Link to="/login">Login</Link>
      </nav>
    </header>
  );
};
