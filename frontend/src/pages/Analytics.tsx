import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
 
// Type definitions
type TicketStatus = "Open" | "In Progress" | "Resolved";
type TicketPriority = "High" | "Medium" | "Low";
 
interface Ticket {
  _id: string;
  ticketId: string;
  title: string;
  description: string;
  status: TicketStatus;
  assignedTo: string | null;
  createdBy: string;
  createdByEmail: string;
  category: string;
  priority: TicketPriority;
  createdAt: string;
  updatedAt: string;
}
 
interface AgentStats {
  assigned: number;
  resolved: number;
  inProgress: number;
  name: string;
}
 
interface CategoryStats {
  name: string;
  count: number;
  color: string;
}
 
interface User {
  name: string;
  email: string;
  role: string;
  id: string;
}
 
interface AnalyticsProps {
  user: User | null;
  onLogout?: () => void;
}
 
// Colors for charts
const COLORS = {
  primary: '#1B314C',
  secondary: '#82AFE5',
  open: '#F97316',
  inProgress: '#3B82F6',
  resolved: '#10B981',
  high: '#EF4444',
  medium: '#F59E0B',
  low: '#10B981',
  purple: '#8B5CF6',
  pink: '#EC4899',
  teal: '#14B8A6'
};
 
const Analytics = ({ user, onLogout }: AnalyticsProps) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [timeframe, setTimeframe] = useState<"day" | "week" | "month">("week");
  const [selectedAgent, setSelectedAgent] = useState<string>("all");
 
  // Fetch real data
  useEffect(() => {
    fetchTickets();
  }, []);
 
  const fetchTickets = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('auth_token') || localStorage.getItem('token');
     
      const response = await fetch('https://supportsync-ujib.onrender.com/api/tickets', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
     
      if (!response.ok) {
        throw new Error('Failed to fetch tickets');
      }
     
      const data = await response.json();
      setTickets(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching tickets:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
 
  // Calculate real statistics
  const totalTickets = tickets.length;
  const openTickets = tickets.filter(t => t.status === "Open").length;
  const inProgressTickets = tickets.filter(t => t.status === "In Progress").length;
  const resolvedTickets = tickets.filter(t => t.status === "Resolved").length;
 
  const highPriorityTickets = tickets.filter(t => t.priority === "High").length;
  const mediumPriorityTickets = tickets.filter(t => t.priority === "Medium").length;
  const lowPriorityTickets = tickets.filter(t => t.priority === "Low").length;
 
  const unassignedTickets = tickets.filter(t => !t.assignedTo).length;
 
  // Category breakdown with colors
  const categories: Record<string, number> = {};
  tickets.forEach(ticket => {
    categories[ticket.category] = (categories[ticket.category] || 0) + 1;
  });
 
  // Prepare category data with colors
  const categoryData: CategoryStats[] = Object.entries(categories).map(([name, count], index) => ({
    name,
    count,
    color: Object.values(COLORS)[index % Object.values(COLORS).length]
  }));
 
  // Agent performance
  const agentPerformance: Record<string, AgentStats> = {};
  tickets.forEach(ticket => {
    if (ticket.assignedTo) {
      if (!agentPerformance[ticket.assignedTo]) {
        agentPerformance[ticket.assignedTo] = {
          name: ticket.assignedTo,
          assigned: 0,
          resolved: 0,
          inProgress: 0
        };
      }
      agentPerformance[ticket.assignedTo].assigned++;
      if (ticket.status === "Resolved") {
        agentPerformance[ticket.assignedTo].resolved++;
      } else if (ticket.status === "In Progress") {
        agentPerformance[ticket.assignedTo].inProgress++;
      }
    }
  });
 
  // Current user's stats
  const userTickets = tickets.filter(t => t.assignedTo === user?.name);
  const userResolved = userTickets.filter(t => t.status === "Resolved").length;
  const userPending = userTickets.filter(t => t.status !== "Resolved").length;
 
  // Get unique agent names for filter dropdown
  const agentNames = Array.from(new Set(
    tickets
      .map(t => t.assignedTo)
      .filter((name): name is string => name !== null)
  ));
 
  // Generate activity logs from real data
  const activityLogs = tickets
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 10)
    .map(ticket => ({
      id: ticket._id,
      agent: ticket.assignedTo || 'System',
      action: `Ticket ${ticket.ticketId} ${ticket.status === 'Resolved' ? 'resolved' : 'updated'}`,
      timestamp: new Date(ticket.updatedAt).toLocaleString(),
      ticketId: ticket.ticketId
    }));
 
  const filteredLogs = selectedAgent === "all"
    ? activityLogs
    : activityLogs.filter(log => log.agent === selectedAgent);
 
  if (loading) {
    return (
      <div className="flex bg-gray-50 min-h-screen">
        <Sidebar user={user} onLogout={onLogout || (() => {})} />
        <div className="flex-1 p-8 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1B314C] mx-auto"></div>
            <p className="mt-4 text-gray-500">Loading analytics data...</p>
          </div>
        </div>
      </div>
    );
  }
 
  if (error) {
    return (
      <div className="flex bg-gray-50 min-h-screen">
        <Sidebar user={user} onLogout={onLogout || (() => {})} />
        <div className="flex-1 p-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            Error loading analytics: {error}
          </div>
        </div>
      </div>
    );
  }
 
  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar user={user} onLogout={onLogout || (() => {})} />
 
      <div className="flex-1 p-4 md:p-8">
        <Navbar user={user} title="Analytics Dashboard" />
 
        {/* Timeframe Selector */}
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#1B314C]">Analytics Overview</h1>
            <p className="text-gray-500 text-sm mt-1">
              Based on {totalTickets} total tickets in the system
            </p>
          </div>
          <div className="flex gap-2 bg-white rounded-lg shadow-sm border border-gray-100 p-1">
            {(["day", "week", "month"] as const).map((period) => (
              <button
                key={period}
                onClick={() => setTimeframe(period)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition capitalize ${
                  timeframe === period
                    ? "bg-[#1B314C] text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>
 
        {/* System Overview Cards with Visual Indicators */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Total Tickets</p>
                <p className="text-3xl font-bold text-[#1B314C]">{totalTickets}</p>
                <p className="text-xs text-gray-400 mt-2">All time</p>
              </div>
              <div className="p-3 bg-[#1B314C]/10 rounded-lg">
                <svg className="w-6 h-6 text-[#1B314C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
            <div className="mt-4 w-full bg-gray-200 rounded-full h-1.5">
              <div className="bg-[#1B314C] h-1.5 rounded-full" style={{ width: '100%' }}></div>
            </div>
          </div>
 
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Open</p>
                <p className="text-3xl font-bold text-orange-600">{openTickets}</p>
                <p className="text-xs text-gray-400 mt-2">{((openTickets/totalTickets)*100).toFixed(1)}% of total</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="mt-4 w-full bg-gray-200 rounded-full h-1.5">
              <div className="bg-orange-500 h-1.5 rounded-full" style={{ width: `${(openTickets/totalTickets)*100}%` }}></div>
            </div>
          </div>
 
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">In Progress</p>
                <p className="text-3xl font-bold text-blue-600">{inProgressTickets}</p>
                <p className="text-xs text-gray-400 mt-2">{((inProgressTickets/totalTickets)*100).toFixed(1)}% of total</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
            </div>
            <div className="mt-4 w-full bg-gray-200 rounded-full h-1.5">
              <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${(inProgressTickets/totalTickets)*100}%` }}></div>
            </div>
          </div>
 
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Resolved</p>
                <p className="text-3xl font-bold text-green-600">{resolvedTickets}</p>
                <p className="text-xs text-gray-400 mt-2">{((resolvedTickets/totalTickets)*100).toFixed(1)}% of total</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="mt-4 w-full bg-gray-200 rounded-full h-1.5">
              <div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${(resolvedTickets/totalTickets)*100}%` }}></div>
            </div>
          </div>
        </div>
 
        {/* Priority Distribution - Visual Chart */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-[#1B314C] mb-4">Priority Distribution</h2>
            <div className="space-y-4">
              {[
                { label: "High Priority", count: highPriorityTickets, color: COLORS.high, textColor: "text-red-600" },
                { label: "Medium Priority", count: mediumPriorityTickets, color: COLORS.medium, textColor: "text-yellow-600" },
                { label: "Low Priority", count: lowPriorityTickets, color: COLORS.low, textColor: "text-green-600" }
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">{item.label}</span>
                    <span className={`font-medium ${item.textColor}`}>
                      {item.count} tickets ({((item.count/totalTickets)*100).toFixed(1)}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className={`${item.color} h-2.5 rounded-full transition-all duration-500`}
                      style={{ width: `${(item.count/totalTickets)*100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
 
          {/* Category Distribution with Pie Chart Style Bars */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-[#1B314C] mb-4">Category Distribution</h2>
            <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
              {categoryData.map(({ name, count, color }) => (
                <div key={name}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">{name}</span>
                    <span className="font-medium" style={{ color }}>
                      {count} tickets
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="h-2.5 rounded-full transition-all duration-500"
                      style={{
                        width: `${(count/totalTickets)*100}%`,
                        backgroundColor: color
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
 
        {/* Agent Performance Table with Visual Progress */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <h2 className="text-lg font-semibold text-[#1B314C] mb-4">Agent Performance</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Agent</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Assigned</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Resolved</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">In Progress</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Resolution Rate</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Progress</th>
                </tr>
              </thead>
              <tbody>
                {Object.values(agentPerformance).map((stats) => (
                  <tr key={stats.name} className="border-b border-gray-100 hover:bg-gray-50 transition">
                    <td className="py-3 px-4 text-sm font-medium text-[#1B314C]">{stats.name}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{stats.assigned}</td>
                    <td className="py-3 px-4 text-sm text-green-600">{stats.resolved}</td>
                    <td className="py-3 px-4 text-sm text-blue-600">{stats.inProgress}</td>
                    <td className="py-3 px-4 text-sm font-medium text-gray-700">
                      {stats.assigned > 0 ? ((stats.resolved/stats.assigned)*100).toFixed(1) : 0}%
                    </td>
                    <td className="py-3 px-4">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${stats.assigned > 0 ? (stats.resolved/stats.assigned)*100 : 0}%` }}
                        ></div>
                      </div>
                    </td>
                  </tr>
                ))}
                {Object.keys(agentPerformance).length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-gray-400">
                      No agent data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
 
        {/* Current User's Personal Stats with Visual Cards */}
        {user && (
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-[#1B314C] mb-4">Your Statistics</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 text-center">
                  <p className="text-3xl font-bold text-blue-600">{userTickets.length}</p>
                  <p className="text-xs text-gray-600">Assigned to You</p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 text-center">
                  <p className="text-3xl font-bold text-green-600">{userResolved}</p>
                  <p className="text-xs text-gray-600">Resolved</p>
                </div>
                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4 text-center">
                  <p className="text-3xl font-bold text-yellow-600">{userPending}</p>
                  <p className="text-xs text-gray-600">Pending</p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 text-center">
                  <p className="text-3xl font-bold text-purple-600">
                    {userTickets.length > 0 ? ((userResolved/userTickets.length)*100).toFixed(0) : 0}%
                  </p>
                  <p className="text-xs text-gray-600">Success Rate</p>
                </div>
              </div>
            </div>
 
            {/* Recent Activity with Real Data */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                <h2 className="text-lg font-semibold text-[#1B314C]">Recent Activity</h2>
                <select
                  value={selectedAgent}
                  onChange={(e) => setSelectedAgent(e.target.value)}
                  className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#82AFE5]"
                >
                  <option value="all">All Agents</option>
                  {agentNames.map(agent => (
                    <option key={agent} value={agent}>{agent}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                {filteredLogs.slice(0, 8).map((log) => (
                  <div key={log.id} className="flex items-start gap-3 pb-3 border-b border-gray-100 last:border-0">
                    <div className="w-2 h-2 mt-2 bg-[#82AFE5] rounded-full flex-shrink-0"></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium text-[#1B314C]">{log.agent}</span> {log.action}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">{log.timestamp}</p>
                    </div>
                  </div>
                ))}
                {filteredLogs.length === 0 && (
                  <p className="text-center text-gray-400 py-4">No recent activity</p>
                )}
              </div>
            </div>
          </div>
        )}
 
        {/* Unassigned Tickets Alert */}
        {unassignedTickets > 0 && (
          <div className="bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-200 rounded-full">
                <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm text-orange-700">
                  <span className="font-semibold">{unassignedTickets} unassigned ticket{unassignedTickets !== 1 ? 's' : ''}</span> require attention
                </p>
                <div className="w-full bg-orange-200 rounded-full h-1.5 mt-2">
                  <div className="bg-orange-500 h-1.5 rounded-full" style={{ width: `${(unassignedTickets/totalTickets)*100}%` }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
 
export default Analytics;
 
