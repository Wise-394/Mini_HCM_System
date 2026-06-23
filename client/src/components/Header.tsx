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
  HiOutlineUser,
} from 'react-icons/hi2';

//----------------------------------------------------------------
//Serves as a header for the whole web appplication
//changes view depending if guest/employee/admin

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
  close: () => void;
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
        <Link
          to="/admin/employees"
          className="flex items-center space-x-1.5 hover:text-gray-900"
        >
          <HiOutlineUser className="h-4 w-4" />
          <span>Employees</span>
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

const MobileNav = ({ user, handleLogout, close }: MobileNavProps) => {
  const baseItem =
    'flex items-center space-x-2 py-3 text-sm font-medium text-gray-600 hover:text-gray-900 active:text-gray-900 border-b border-gray-100 last:border-0';

  if (!user) {
    return (
      <nav className="flex flex-col px-6 py-2">
        <Link to="/register" className={baseItem} onClick={close}>
          <HiOutlineUserPlus className="h-5 w-5" />
          <span>Register</span>
        </Link>
        <Link to="/login" className={baseItem} onClick={close}>
          <HiOutlineArrowRightOnRectangle className="h-5 w-5" />
          <span>Login</span>
        </Link>
      </nav>
    );
  }

  if (user.role === 'admin') {
    return (
      <nav className="flex flex-col px-6 py-2">
        <Link to="/admin" className={baseItem} onClick={close}>
          <HiOutlineHome className="h-5 w-5" />
          <span>Home</span>
        </Link>
        <Link to="/admin/employees" className={baseItem} onClick={close}>
          <HiOutlineUser className="h-5 w-5" />
          <span>Employees</span>
        </Link>
        <button
          onClick={handleLogout}
          className={`${baseItem} w-full text-left`}
        >
          <HiOutlineArrowLeftOnRectangle className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </nav>
    );
  }

  return (
    <nav className="flex flex-col px-6 py-2">
      <Link to="/home" className={baseItem} onClick={close}>
        <HiOutlineHome className="h-5 w-5" />
        <span>Home</span>
      </Link>
      <Link to="/home/dashboard" className={baseItem} onClick={close}>
        <HiOutlineSquares2X2 className="h-5 w-5" />
        <span>Dashboard</span>
      </Link>
      <button onClick={handleLogout} className={`${baseItem} w-full text-left`}>
        <HiOutlineArrowLeftOnRectangle className="h-5 w-5" />
        <span>Logout</span>
      </button>
    </nav>
  );
};

export const Header = () => {
  const user = useAuthStore((state) => state.user);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const close = () => setIsOpen(false);

  const handleLogout = async () => {
    await signOut(auth);
    close();
  };

  return (
    <header
      className="w-full bg-white border-b border-gray-200 sticky top-0 z-50"
    >
      <div
        className="max-w-7xl mx-auto px-6 h-16 flex items-center
          justify-between"
      >
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center space-x-2 text-xl font-bold
            text-gray-800"
          onClick={close}
        >
          <HiOutlineClock className="h-6 w-6 text-gray-600" />
          <span>HCM</span>
        </Link>

        <DesktopNav user={user} handleLogout={handleLogout} />

        {/* Toggle Button */}
        <div className="flex md:hidden">
          <button
            onClick={() => setIsOpen((prev) => !prev)}
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

      {/* Mobile menu */}
      <div
        className={`absolute top-16 left-0 right-0 md:hidden border-b
          border-gray-200 bg-white shadow-lg transition-all duration-300
          ease-in-out ${
            isOpen
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 -translate-y-2 pointer-events-none'
          }`}
      >
        <MobileNav user={user} handleLogout={handleLogout} close={close} />
      </div>
    </header>
  );
};
