import { Link } from 'react-router';
export const Login = () => {
  return (
    <main
      className="flex min-h-[90vh] items-center justify-center bg-gray-50 p-6
        font-sans"
    >
      <section
        className="w-full max-w-md rounded-xl border border-gray-100 bg-white
          p-8 shadow-sm"
      >
        <h1
          className="mb-8 text-center text-2xl font-bold tracking-tight
            text-gray-900"
        >
          Sign In to Your Account
        </h1>

        <form className="grid grid-cols-1 gap-6">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="email"
              className="text-sm font-semibold text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full rounded-md border border-gray-300 bg-white px-3
                py-2 text-sm text-gray-900 transition-colors
                focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15
                focus:outline-none"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="text-sm font-semibold text-gray-700"
              >
                Password
              </label>
            </div>
            <input
              type="password"
              id="password"
              name="password"
              className="w-full rounded-md border border-gray-300 bg-white px-3
                py-2 text-sm text-gray-900 transition-colors
                focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15
                focus:outline-none"
              required
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full rounded-md bg-blue-600 px-4 py-2.5 text-sm
                font-semibold text-white transition-colors hover:bg-blue-700
                focus:ring-2 focus:ring-blue-600/40 focus:outline-none
                hover:cursor-pointer"
            >
              Sign In
            </button>
          </div>

          <p className="text-center text-sm text-gray-500">
            Don't have an account?
            <Link to="/register" className="text-blue-600 hover:underline">
              Register
            </Link>
          </p>
        </form>
      </section>
    </main>
  );
};
