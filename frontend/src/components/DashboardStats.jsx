const DashboardStats = ({ tickets }) => {
  const open = tickets.filter(t => t.status === "Open").length;
  const progress = tickets.filter(t => t.status === "In Progress").length;
  const resolved = tickets.filter(t => t.status === "Resolved").length;
  const unassigned = tickets.filter(t => !t.assignedTo).length;
  
  const highPriority = tickets.filter(t => t.priority === "High").length;
  const mediumPriority = tickets.filter(t => t.priority === "Medium").length;
  const lowPriority = tickets.filter(t => t.priority === "Low").length;

  const stats = [
    {
      label: "Total Tickets",
      value: tickets.length,
      subtext: `${highPriority} high, ${mediumPriority} medium, ${lowPriority} low`,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      )
    },
    {
      label: "Open",
      value: open,
      color: "text-orange-600",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      label: "In Progress",
      value: progress,
      color: "text-blue-600",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      )
    },
    {
      label: "Resolved",
      value: resolved,
      color: "text-green-600",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
  ];

  return (
    <div className="mb-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">{stat.label}</p>
                <p className={`text-3xl font-bold ${stat.color || 'text-[#1B314C]'}`}>
                  {stat.value}
                </p>
                {stat.subtext && (
                  <p className="text-xs text-gray-400 mt-2">{stat.subtext}</p>
                )}
              </div>
              <div className={`p-3 rounded-lg ${stat.color ? 'bg-opacity-10' : 'bg-[#1B314C] bg-opacity-10'} text-[#1B314C]`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Unassigned Alert */}
      {unassigned > 0 && (
        <div className="mt-4 bg-orange-50 border border-orange-200 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-sm text-orange-700">
              <span className="font-semibold">{unassigned} unassigned ticket{unassigned !== 1 ? 's' : ''}</span> require attention
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardStats;