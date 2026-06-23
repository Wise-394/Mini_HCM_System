import { Link } from 'react-router';
import {
  HiOutlineClock,
  HiOutlineChartBar,
  HiOutlineArrowRight,
} from 'react-icons/hi2';
import { FaGithub } from 'react-icons/fa';

//----------------------------------------------------------------
// /

export const Index = () => {
  return (
    <div className="flex-1 bg-slate-100 flex flex-col justify-between">
      {/* Hero Section */}
      <section
        className="flex-1 flex flex-col items-center justify-center px-6 py-20
          text-center max-w-4xl mx-auto"
      >
        {/* Hero Title */}
        <h1
          className="text-4xl md:text-6xl font-extrabold text-slate-900
            tracking-tight mb-6 leading-tight"
        >
          Manage your workforce <br />
          <span className="text-blue-600 bg-clip-text">with HCM System.</span>
        </h1>

        {/* Hero Subtitle */}
        <p className="text-sm text-gray-400 max-w-md mb-10 font-medium">
          Streamline attendance tracking, and empower your entire organization
          with a clean, high-performance workspace.
        </p>

        {/* Call to Action Buttons */}
        <div
          className="flex flex-col sm:flex-row items-center gap-4 w-full
            justify-center mb-16 max-w-xs sm:max-w-none"
        >
          <Link
            to="/register"
            className="w-full sm:w-auto px-8 py-3.5 bg-blue-600
              hover:bg-blue-700 text-white font-medium text-sm rounded-lg
              transition-colors shadow-xs flex items-center justify-center gap-2
              group hover:cursor-pointer"
          >
            Get Started
            <HiOutlineArrowRight
              className="w-4 h-4 transition-transform
                group-hover:translate-x-0.5"
            />
          </Link>
          <Link
            to="/login"
            className="w-full sm:w-auto px-8 py-3.5 bg-white hover:bg-gray-50
              text-gray-700 font-medium text-sm rounded-lg transition-colors
              border border-white shadow-sm text-center hover:cursor-pointer"
          >
            Sign In
          </Link>
        </div>

        {/* Feature Grid Box */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl
            text-left"
        >
          {/* Card 1 */}
          <div
            className="bg-white p-6 rounded-2xl border border-white shadow-lg"
          >
            <div
              className="w-9 h-9 rounded-xl bg-slate-100 text-gray-600 flex
                items-center justify-center mb-4"
            >
              <HiOutlineClock className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">
              Time & Attendance
            </h3>
            <p className="text-xs font-medium text-gray-400 leading-relaxed">
              One-click clock-in and out with automated calculations.
            </p>
          </div>

          {/* Card 2 */}
          <div
            className="bg-white p-6 rounded-2xl border border-white shadow-lg"
          >
            <div
              className="w-9 h-9 rounded-xl bg-slate-100 text-gray-600 flex
                items-center justify-center mb-4"
            >
              <HiOutlineChartBar className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">Dashboard</h3>
            <p className="text-xs font-medium text-gray-400 leading-relaxed">
              Instant summaries showing real-time performance updates.
            </p>
          </div>
        </div>
      </section>

      {/* Landing Footer */}
      <footer
        className="w-full bg-white border-t border-gray-200 py-6 text-center
          text-xs font-semibold text-gray-400 flex items-center justify-center
          gap-2"
      >
        <FaGithub /> github.com/wise-394
      </footer>
    </div>
  );
};
