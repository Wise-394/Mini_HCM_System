import { useState } from 'react';
import { Link } from 'react-router';
import { useAuthStore } from '../store/useAuthStore.ts';
import { signOut } from 'firebase/auth';
import { auth } from '../configs/firebase.ts';
import {
  HiOutlineHome,
  HiOutlineSquares2X2,
  HiOutlineArrowLeftOnRectangle,
  HiOutlineUserPlus,
  HiOutlineArrowRightOnRectangle,
  HiOutlineClock,
  HiBars3,
  HiXMark,
} from 'react-icons/hi2';

type UserRole = 'admin' | 'employee';

interface AuthUser {
  uid: string;
  email: string;
  role: UserRole;
}

interface DesktopNavProps {
  user: AuthUser | null;
  handleLogout: () => Promise<void>;
}

interface MobileNavProps extends DesktopNavProps {
  setIsOpen: (isOpen: boolean) => void;
}

const DesktopNav = ({ user, handleLogout }: DesktopNavProps) => {
  if (!user) {
    return (
      <nav
        className="hidden md:flex items-center space-x-6 text-sm font-medium
          text-gray-600"
      >
        <Link
          to="/register"
          className="flex items-center space-x-1.5 hover:text-gray-900"
        >
          <HiOutlineUserPlus className="h-4 w-4" />
          <span>Register</span>
        </Link>
        <Link
          to="/login"
          className="flex items-center space-x-1.5 hover:text-gray-900"
        >
          <HiOutlineArrowRightOnRectangle className="h-4 w-4" />
          <span>Login</span>
        </Link>
      </nav>
    );
  }

  if (user.role === 'admin') {
    return (
      <nav
        className="hidden md:flex items-center space-x-6 text-sm font-medium
          text-gray-600"
      >
        <Link
          to="/admin"
          className="flex items-center space-x-1.5 hover:text-gray-900"
        >
          <HiOutlineHome className="h-4 w-4" />
          <span>Home</span>
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center space-x-1.5 hover:text-gray-900
            hover:cursor-pointer"
        >
          <HiOutlineArrowLeftOnRectangle className="h-4 w-4" />
          <span>Logout</span>
        </button>
      </nav>
    );
  }

  return (
    <nav
      className="hidden md:flex items-center space-x-6 text-sm font-medium
        text-gray-600"
    >
      <Link
        to="/home"
        className="flex items-center space-x-1.5 hover:text-gray-900"
      >
        <HiOutlineHome className="h-4 w-4" />
        <span>Home</span>
      </Link>
      <Link
        to="/home/dashboard"
        className="flex items-center space-x-1.5 hover:text-gray-900"
      >
        <HiOutlineSquares2X2 className="h-4 w-4" />
        <span>Dashboard</span>
      </Link>
      <button
        onClick={handleLogout}
        className="flex items-center space-x-1.5 hover:text-gray-900
          hover:cursor-pointer"
      >
        <HiOutlineArrowLeftOnRectangle className="h-4 w-4" />
        <span>Logout</span>
      </button>
    </nav>
  );
};

const MobileNav = ({ user, handleLogout, setIsOpen }: MobileNavProps) => {
  if (!user) {
    return (
      <div
        className="absolute top-16 left-0 right-0 md:hidden border-b
          border-gray-200 bg-white px-6 py-4 space-y-4 shadow-lg z-50"
      >
        <nav
          className="flex flex-col space-y-4 text-sm font-medium text-gray-600"
        >
          <Link
            to="/register"
            className="flex items-center space-x-2 hover:text-gray-900 py-1"
            onClick={() => setIsOpen(false)}
          >
            <HiOutlineUserPlus className="h-5 w-5" />
            <span>Register</span>
          </Link>
          <Link
            to="/login"
            className="flex items-center space-x-2 hover:text-gray-900 py-1"
            onClick={() => setIsOpen(false)}
          >
            <HiOutlineArrowRightOnRectangle className="h-5 w-5" />
            <span>Login</span>
          </Link>
        </nav>
      </div>
    );
  }

  if (user.role === 'admin') {
    return (
      <div
        className="absolute top-16 left-0 right-0 md:hidden border-b
          border-gray-200 bg-white px-6 py-4 space-y-4 shadow-lg z-50"
      >
        <nav
          className="flex flex-col space-y-4 text-sm font-medium text-gray-600"
        >
          <Link
            to="/admin"
            className="flex items-center space-x-2 hover:text-gray-900 py-1"
            onClick={() => setIsOpen(false)}
          >
            <HiOutlineHome className="h-5 w-5" />
            <span>Home</span>
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 hover:text-gray-900 py-1
              text-left w-full"
          >
            <HiOutlineArrowLeftOnRectangle className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </nav>
      </div>
    );
  }

  return (
    <div
      className="absolute top-16 left-0 right-0 md:hidden border-b
        border-gray-200 bg-white px-6 py-4 space-y-4 shadow-lg z-50"
    >
      <nav className="flex flex-col space-y-4 text-sm font-medium text-gray-600">
        <Link
          to="/home"
          className="flex items-center space-x-2 hover:text-gray-900 py-1"
          onClick={() => setIsOpen(false)}
        >
          <HiOutlineHome className="h-5 w-5" />
          <span>Home</span>
        </Link>
        <Link
          to="/home/dashboard"
          className="flex items-center space-x-2 hover:text-gray-900 py-1"
          onClick={() => setIsOpen(false)}
        >
          <HiOutlineSquares2X2 className="h-5 w-5" />
          <span>Dashboard</span>
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center space-x-2 hover:text-gray-900 py-1
            text-left w-full"
        >
          <HiOutlineArrowLeftOnRectangle className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </nav>
    </div>
  );
};

export const Header = () => {
  const user = useAuthStore((state) => state.user);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleLogout = async () => {
    await signOut(auth);
    setIsOpen(false);
  };

  return (
    <header className="w-full bg-white border-b border-gray-200 sticky top-0
      z-50">
      <div
        className="max-w-7xl mx-auto px-6 h-16 flex items-center
          justify-between"
      >
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center space-x-2 text-xl font-bold
            text-gray-800"
          onClick={() => setIsOpen(false)}
        >
          <HiOutlineClock className="h-6 w-6 text-gray-600" />
          <span>HCM</span>
        </Link>

        <DesktopNav user={user} handleLogout={handleLogout} />

        {/* Toggle Button */}
        <div className="flex md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-gray-600 hover:text-gray-900 focus:outline-none"
          >
            {isOpen ? (
              <HiXMark className="h-6 w-6" />
            ) : (
              <HiBars3 className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {isOpen && (
        <MobileNav
          user={user}
          handleLogout={handleLogout}
          setIsOpen={setIsOpen}
        />
      )}
    </header>
  );
};
