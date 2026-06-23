import { Link } from 'react-router';

//----------------------------------------------------------------
// error route
// responsible for showing error page eg. invalid link

export const ErrorRoute = () => {
  return (
    <>
      <main
        className="flex h-screen items-center justify-center bg-gray-50 p-6
          font-sans"
      >
        <section className="flex flex-col items-center gap-4 text-center">
          <div
            className="flex h-20 w-20 items-center justify-center rounded-full
              bg-red-100"
          >
            <span className="text-4xl font-bold text-red-500">!</span>
          </div>

          <h1 className="text-6xl font-bold text-gray-900">404</h1>

          <h2 className="text-xl font-semibold text-gray-700">
            Page Not Found
          </h2>

          <p className="max-w-sm text-sm text-gray-500">
            The page you're looking for doesn't exist. Check the URL and try
            again.
          </p>

          <Link
            to="/"
            className="mt-2 rounded-md bg-blue-600 px-5 py-2.5 text-sm
              font-semibold text-white transition-colors hover:bg-blue-700
              focus:ring-2 focus:ring-blue-600/40 focus:outline-none"
          >
            Go back home
          </Link>
        </section>
      </main>
    </>
  );
};
