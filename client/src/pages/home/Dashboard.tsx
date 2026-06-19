import { FiCalendar, FiClock } from 'react-icons/fi';

export const Dashboard = () => {
  const summaryCards = [
    { title: 'Regular', value: '8.75 hrs', icon: FiClock },
    { title: 'Overtime', value: '2.0 hrs', icon: FiClock },
    { title: 'Night diff', value: '0.0 hrs', icon: FiClock },
    {
      title: 'Late',
      value: '15 min',
      icon: FiClock,
      highlightColor: 'text-amber-600',
    },
    { title: 'Undertime', value: '0 min', icon: FiClock },
  ];

  const historyData = [
    {
      date: 'Jun 18',
      regular: '8.75 hrs',
      ot: '2.0 hrs',
      nightDiff: '0.0 hrs',
      late: '15 min',
      undertime: '0',
      lateBadge: 'warn',
      undertimeBadge: 'good',
    },
    {
      date: 'Jun 17',
      regular: '8.0 hrs',
      ot: '0.0 hrs',
      nightDiff: '0.0 hrs',
      late: '0',
      undertime: '0',
      lateBadge: 'good',
      undertimeBadge: 'good',
    },
    {
      date: 'Jun 16',
      regular: '7.5 hrs',
      ot: '0.0 hrs',
      nightDiff: '0.0 hrs',
      late: '0',
      undertime: '30 min',
      lateBadge: 'good',
      undertimeBadge: 'danger',
    },
    {
      date: 'Jun 15',
      regular: '8.0 hrs',
      ot: '1.5 hrs',
      nightDiff: '1.5 hrs',
      late: '0',
      undertime: '0',
      lateBadge: 'good',
      undertimeBadge: 'good',
    },
    {
      date: 'Jun 14',
      regular: '7.75 hrs',
      ot: '0.0 hrs',
      nightDiff: '0.0 hrs',
      late: '10 min',
      undertime: '15 min',
      lateBadge: 'warn',
      undertimeBadge: 'warn',
    },
  ];

  return (
    <main
      className="flex items-center justify-center p-4 flex-1 bg-slate-100
        font-sans antialiased"
    >
      <div
        className="flex flex-col w-full max-w-5xl rounded-2xl bg-white p-6
          md:p-8 shadow-lg border border-white"
      >
        {/* Header Section */}
        <header
          className="flex flex-col sm:flex-row sm:items-center
            sm:justify-between gap-4 mb-8"
        >
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Juan dela Cruz
            </h1>
            <p className="text-gray-400 text-sm mt-1">Today's summary</p>
          </div>

          <div
            className="flex items-center gap-2 self-start sm:self-center
              bg-gray-50 border border-gray-200 rounded-xl px-4 py-2
              text-gray-700 text-sm font-medium hover:bg-gray-100
              transition-colors cursor-pointer group"
          >
            <FiCalendar
              className="w-4 h-4 text-gray-400 group-hover:text-gray-600
                transition-colors"
            />
            <span>June 18, 2026</span>
            <span className="text-gray-400 ml-1 text-xs">▼</span>
          </div>
        </header>

        {/* Dashboard Grid Cards */}
        <section
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-10"
        >
          {summaryCards.map((card, i) => {
            const CardIcon = card.icon;
            return (
              <div
                key={i}
                className="bg-gray-50 border border-gray-100 rounded-xl p-4 flex
                  flex-col justify-between min-h-27 hover:border-gray-200
                  transition-all duration-200"
              >
                <div
                  className="flex items-center justify-between gap-2
                    text-gray-400"
                >
                  <span
                    className="text-xs font-semibold tracking-wide uppercase
                      opacity-80"
                  >
                    {card.title}
                  </span>
                  <CardIcon className="w-3.5 h-3.5 opacity-60" />
                </div>
                <p
                  className={`text-2xl font-bold tracking-tight mt-3
                  ${card.highlightColor || 'text-gray-800'}`}
                >
                  {card.value}
                </p>
              </div>
            );
          })}
        </section>

        {/* History Log Section */}
        <section>
          <h2
            className="text-sm font-bold uppercase tracking-wider text-gray-400
              mb-4"
          >
            History
          </h2>

          <div
            className="overflow-x-auto border border-gray-200 rounded-xl
              bg-white"
          >
            <table className="w-full text-left border-collapse min-w-150">
              <thead>
                <tr
                  className="border-b border-gray-200 bg-gray-50 text-gray-500
                    text-xs font-semibold uppercase tracking-wider"
                >
                  <th className="py-3.5 px-5">Date</th>
                  <th className="py-3.5 px-5">Regular</th>
                  <th className="py-3.5 px-5">OT</th>
                  <th className="py-3.5 px-5">Night diff</th>
                  <th className="py-3.5 px-5">Late</th>
                  <th className="py-3.5 px-5">Undertime</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700 text-sm">
                {historyData.map((row, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-50/80 transition-colors
                      duration-150 group"
                  >
                    <td className="py-4 px-5 font-bold text-gray-900">
                      {row.date}
                    </td>
                    <td className="py-4 px-5 text-gray-600 font-medium">
                      {row.regular}
                    </td>
                    <td className="py-4 px-5 text-gray-600 font-medium">
                      {row.ot}
                    </td>
                    <td className="py-4 px-5 text-gray-400 font-medium">
                      {row.nightDiff}
                    </td>
                    <td className="py-4 px-5">
                      {row.lateBadge === 'warn' ? (
                        <span
                          className="inline-flex items-center justify-center
                            px-3 py-1 rounded-full text-xs font-semibold
                            bg-orange-50 text-orange-700 border
                            border-orange-200"
                        >
                          {row.late}
                        </span>
                      ) : (
                        <span
                          className="inline-flex items-center justify-center
                            min-w-6 h-6 rounded-full text-xs font-bold
                            bg-green-50 text-green-700 border border-green-200"
                        >
                          {row.late}
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-5">
                      {row.undertimeBadge === 'danger' ? (
                        <span
                          className="inline-flex items-center justify-center
                            px-3 py-1 rounded-full text-xs font-semibold
                            bg-red-50 text-red-700 border border-red-200"
                        >
                          {row.undertime}
                        </span>
                      ) : row.undertimeBadge === 'warn' ? (
                        <span
                          className="inline-flex items-center justify-center
                            px-3 py-1 rounded-full text-xs font-semibold
                            bg-orange-50 text-orange-700 border
                            border-orange-200"
                        >
                          {row.undertime}
                        </span>
                      ) : (
                        <span
                          className="inline-flex items-center justify-center
                            min-w-6 h-6 rounded-full text-xs font-bold
                            bg-green-50 text-green-700 border border-green-200"
                        >
                          {row.undertime}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
};
