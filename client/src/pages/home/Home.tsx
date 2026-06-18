export const Home = () => {
  return (
    <main className="flex items-center justify-center p-4 flex-1 bg-slate-100">
      <div
        className="flex flex-col md:flex-row w-full max-w-3xl rounded-2xl
          overflow-hidden shadow-lg border border-white"
      >
        {/* Sidebar */}
        <aside
          className="bg-gray-700 flex flex-row md:flex-col justify-between
            md:w-60 p-6 md:p-9"
        >
          <div>
            <p className="text-white/60 text-xs mb-2 tracking-wide">
              Thursday, June 18
            </p>
            <p className="text-white font-light leading-none text-7xl">
              9:31
              <span className="text-2xl font-normal align-super ml-1 opacity-80">
                am
              </span>
            </p>
          </div>
          <div className="md:mt-auto text-right md:text-left">
            <p className="text-white text-sm font-semibold">Sample Company</p>
            <p className="text-white/50 text-xs mt-0.5">Main Office · Manila</p>
          </div>
        </aside>

        {/* Main */}
        <section
          className="bg-white flex-1 flex flex-col items-center justify-center
            px-8 py-10"
        >
          {/* Avatar */}
          <div
            className="w-24 h-24 rounded-full bg-linear-to-br from-blue-400
              to-blue-600 flex items-center justify-center text-white text-3xl
              font-semibold mb-5 select-none"
          ></div>

          {/* Greeting */}
          <h1 className="text-2xl font-bold text-gray-900">
            Good morning, User
          </h1>
          <p className="text-sm text-gray-400 mt-1 mb-4">Let's get to work.</p>

          {/* Status badge */}
          <span
            className="inline-flex items-center gap-1.5 text-xs px-3 py-1
              rounded-full mb-6 font-medium bg-orange-50 text-black"
          >
            <span className="w-2 h-2 rounded-full bg-black" />
            In time
          </span>

          {/* button */}
          <button
            className="w-full max-w-xs py-3.5 rounded-lg bg-blue-600
              hover:bg-blue-700 text-white font-medium text-sm transition-colors
              mb-2.5 hover:cursor-pointer"
          >
            Clock In
          </button>
        </section>
      </div>
    </main>
  );
};
