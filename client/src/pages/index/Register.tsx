import { Link } from 'react-router';
export const Register = () => {
  return (
    <main
      className="flex min-h-[90vh] items-center justify-center bg-gray-50 p-6
        font-sans"
    >
      <section
        className="w-full max-w-2xl rounded-xl border border-gray-100 bg-white
          p-8 shadow-sm"
      >
        <h1
          className="mb-8 text-center text-2xl font-bold tracking-tight
            text-gray-900"
        >
          Register Your Account
        </h1>

        <form className="grid grid-cols-1 gap-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="name"
                className="text-sm font-semibold text-gray-700"
              >
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="w-full rounded-md border border-gray-300 bg-white
                  px-3 py-2 text-sm text-gray-900 transition-colors
                  focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15
                  focus:outline-none"
                required
                minLength={8}
              />
            </div>

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
                className="w-full rounded-md border border-gray-300 bg-white
                  px-3 py-2 text-sm text-gray-900 transition-colors
                  focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15
                  focus:outline-none"
                required
                minLength={8}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="password"
                className="text-sm font-semibold text-gray-700"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className="w-full rounded-md border border-gray-300 bg-white
                  px-3 py-2 text-sm text-gray-900 transition-colors
                  focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15
                  focus:outline-none"
                required
                minLength={8}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="repeat-password"
                className="text-sm font-semibold text-gray-700"
              >
                Repeat Password
              </label>
              <input
                type="password"
                id="repeat-password"
                name="repeat_password"
                className="w-full rounded-md border border-gray-300 bg-white
                  px-3 py-2 text-sm text-gray-900 transition-colors
                  focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15
                  focus:outline-none"
                required
                minLength={8}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="timezone"
                className="text-sm font-semibold text-gray-700"
              >
                Timezone
              </label>
              <select
                id="timezone"
                name="timezone"
                className="w-full rounded-md border border-gray-300 bg-white
                  px-3 py-2 text-sm text-gray-900 transition-colors
                  focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15
                  focus:outline-none"
                defaultValue=""
                required
              >
                <option value="" disabled>
                  Select your timezone
                </option>
                <option value="philippines">UTC +8, Philippines</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <fieldset className="m-0 rounded-lg border border-gray-200 p-6">
              <legend
                className="px-2 text-xs font-bold tracking-wider text-gray-500
                  uppercase"
              >
                Shift Schedule
              </legend>

              <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="start-time"
                    className="text-sm font-semibold text-gray-700"
                  >
                    Start Time
                  </label>
                  <input
                    type="time"
                    id="start-time"
                    name="schedule_start"
                    className="w-full rounded-md border border-gray-300 bg-white
                      px-3 py-2 text-sm text-gray-900 transition-colors
                      focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15
                      focus:outline-none"
                    required
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="end-time"
                    className="text-sm font-semibold text-gray-700"
                  >
                    End Time
                  </label>
                  <input
                    type="time"
                    id="end-time"
                    name="schedule_end"
                    className="w-full rounded-md border border-gray-300 bg-white
                      px-3 py-2 text-sm text-gray-900 transition-colors
                      focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15
                      focus:outline-none"
                    required
                  />
                </div>
              </div>
            </fieldset>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full rounded-md bg-blue-600 px-4 py-2.5 text-sm
                font-semibold text-white transition-colors hover:bg-blue-700
                focus:ring-2 focus:ring-blue-600/40 focus:outline-none
                hover:cursor-pointer"
            >
              Register
            </button>
          </div>
          <p className="text-center text-sm text-gray-500">
            Already have an account?
            <Link to="/login" className="text-blue-600 hover:underline">
              Login
            </Link>
          </p>
        </form>
      </section>
    </main>
  );
};
