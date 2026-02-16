import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

// Type definitions
type TicketStatus = "Open" | "In Progress" | "Resolved";
type TicketPriority = "High" | "Medium" | "Low";

interface Ticket {
  _id: string;
  title: string;
  description: string;
  status: TicketStatus;
  assignedTo: string | null;
  createdBy: string;
  category: string;
  priority: TicketPriority;
  createdAt: string;
}

interface AgentLog {
  id: number;
  agent: string;
  action: string;
  timestamp: string;
  ticketId: string;
}

interface AgentStats {
  assigned: number;
  resolved: number;
  inProgress: number;
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

// Mock data with proper typing
const mockTickets: Ticket[] = [
  {
    _id: "TKT-001",
    title: "Login not working",
    description: "User cannot log in to the system using credentials. Getting error message 'Invalid credentials' even with correct password.",
    status: "Open",
    assignedTo: null,
    createdBy: "John Doe",
    category: "Authentication",
    priority: "High",
    createdAt: "2024-02-10"
  },
  {
    _id: "TKT-002",
    title: "Password reset issue",
    description: "Reset link is not being sent to email. User has checked spam folder but no email received.",
    status: "In Progress",
    assignedTo: "Sarah Chen",
    createdBy: "Jane Smith",
    category: "Authentication",
    priority: "Medium",
    createdAt: "2024-02-11"
  },
  {
    _id: "TKT-003",
    title: "Page crashing",
    description: "Dashboard crashes when clicking reports. Error occurs consistently on Chrome browser.",
    status: "Resolved",
    assignedTo: "Mike Johnson",
    createdBy: "David Lee",
    category: "Bug",
    priority: "High",
    createdAt: "2024-02-09"
  },
  {
    _id: "TKT-004",
    title: "Data export error",
    description: "Excel export failing for large datasets with more than 1000 rows.",
    status: "Open",
    assignedTo: null,
    createdBy: "Alex Wong",
    category: "Feature",
    priority: "Low",
    createdAt: "2024-02-12"
  },
  {
    _id: "TKT-005",
    title: "Mobile responsive issue",
    description: "Dashboard layout broken on mobile devices. Tables overflow and buttons misaligned.",
    status: "In Progress",
    assignedTo: "Sarah Chen",
    createdBy: "Maria Garcia",
    category: "UI/UX",
    priority: "Medium",
    createdAt: "2024-02-12"
  },
  {
    _id: "TKT-006",
    title: "Email notification delay",
    description: "Users reporting 10-15 minute delays in receiving email notifications.",
    status: "Open",
    assignedTo: null,
    createdBy: "Tom Wilson",
    category: "Performance",
    priority: "High",
    createdAt: "2024-02-13"
  },
  {
    _id: "TKT-007",
    title: "Database connection timeout",
    description: "Users experiencing intermittent database connection issues during peak hours.",
    status: "Resolved",
    assignedTo: "Sarah Chen",
    createdBy: "Robert Johnson",
    category: "Database",
    priority: "Low",
    createdAt: "2024-02-08"
  },
  {
    _id: "TKT-008",
    title: "API rate limiting",
    description: "API requests are being throttled unexpectedly.",
    status: "Resolved",
    assignedTo: "Mike Johnson",
    createdBy: "Emily Brown",
    category: "Performance",
    priority: "Medium",
    createdAt: "2024-02-07"
  },
];

const mockAgentLogs: AgentLog[] = [
  { id: 1, agent: "Sarah Chen", action: "Resolved ticket TKT-003", timestamp: "2024-02-13 09:30 AM", ticketId: "TKT-003" },
  { id: 2, agent: "Sarah Chen", action: "Assigned to TKT-005", timestamp: "2024-02-13 10:15 AM", ticketId: "TKT-005" },
  { id: 3, agent: "Mike Johnson", action: "Updated status of TKT-002", timestamp: "2024-02-13 11:00 AM", ticketId: "TKT-002" },
  { id: 4, agent: "Sarah Chen", action: "Commented on TKT-005", timestamp: "2024-02-13 11:30 AM", ticketId: "TKT-005" },
  { id: 5, agent: "Mike Johnson", action: "Resolved ticket TKT-008", timestamp: "2024-02-13 12:15 PM", ticketId: "TKT-008" },
  { id: 6, agent: "Sarah Chen", action: "Created new ticket TKT-009", timestamp: "2024-02-13 01:00 PM", ticketId: "TKT-009" },
  { id: 7, agent: "Sarah Chen", action: "Assigned to TKT-001", timestamp: "2024-02-13 02:30 PM", ticketId: "TKT-001" },
  { id: 8, agent: "Mike Johnson", action: "Resolved ticket TKT-004", timestamp: "2024-02-13 03:45 PM", ticketId: "TKT-004" },
];

const Analytics = ({ user, onLogout }: AnalyticsProps) => {
  const [timeframe, setTimeframe] = useState<"day" | "week" | "month">("week");
  const [selectedAgent, setSelectedAgent] = useState<string>("all");

  // Calculate statistics
  const totalTickets = mockTickets.length;
  const openTickets = mockTickets.filter((t: Ticket) => t.status === "Open").length;
  const inProgressTickets = mockTickets.filter((t: Ticket) => t.status === "In Progress").length;
  const resolvedTickets = mockTickets.filter((t: Ticket) => t.status === "Resolved").length;
  
  const highPriorityTickets = mockTickets.filter((t: Ticket) => t.priority === "High").length;
  const mediumPriorityTickets = mockTickets.filter((t: Ticket) => t.priority === "Medium").length;
  const lowPriorityTickets = mockTickets.filter((t: Ticket) => t.priority === "Low").length;
  
  const unassignedTickets = mockTickets.filter((t: Ticket) => !t.assignedTo).length;
  
  // Category breakdown
  const categories: Record<string, number> = {};
  mockTickets.forEach((ticket: Ticket) => {
    categories[ticket.category] = (categories[ticket.category] || 0) + 1;
  });

  // Agent performance
  const agentPerformance: Record<string, AgentStats> = {};
  mockTickets.forEach((ticket: Ticket) => {
    if (ticket.assignedTo) {
      if (!agentPerformance[ticket.assignedTo]) {
        agentPerformance[ticket.assignedTo] = {
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
  const userTickets = mockTickets.filter((t: Ticket) => t.assignedTo === user?.name);
  const userResolved = userTickets.filter((t: Ticket) => t.status === "Resolved").length;
  const userPending = userTickets.filter((t: Ticket) => t.status !== "Resolved").length;
  const userActivity = mockAgentLogs.filter((log: AgentLog) => log.agent === user?.name);

  // Filter logs based on selected agent
  const filteredLogs = selectedAgent === "all" 
    ? mockAgentLogs 
    : mockAgentLogs.filter((log: AgentLog) => log.agent === selectedAgent);

  // Get unique agent names for filter dropdown
  const agentNames = Array.from(new Set(mockTickets
    .map((t: Ticket) => t.assignedTo)
    .filter((name): name is string => name !== null)
  ));

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar user={user} onLogout={onLogout || (() => {})} />

      <div className="flex-1 p-4 md:p-8">
        <Navbar user={user} title="Analytics Dashboard" />

        {/* Timeframe Selector */}
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#1B314C]">Analytics Overview</h1>
            <p className="text-gray-500 text-sm mt-1">System performance and agent statistics</p>
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

        {/* System Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <p className="text-gray-400 text-sm mb-1">Total Tickets</p>
            <p className="text-3xl font-bold text-[#1B314C]">{totalTickets}</p>
            <p className="text-xs text-green-500 mt-2">↑ 12% from last {timeframe}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <p className="text-gray-400 text-sm mb-1">Open Tickets</p>
            <p className="text-3xl font-bold text-orange-600">{openTickets}</p>
            <p className="text-xs text-gray-400 mt-2">{((openTickets/totalTickets)*100).toFixed(1)}% of total</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <p className="text-gray-400 text-sm mb-1">In Progress</p>
            <p className="text-3xl font-bold text-blue-600">{inProgressTickets}</p>
            <p className="text-xs text-gray-400 mt-2">{((inProgressTickets/totalTickets)*100).toFixed(1)}% of total</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <p className="text-gray-400 text-sm mb-1">Resolved</p>
            <p className="text-3xl font-bold text-green-600">{resolvedTickets}</p>
            <p className="text-xs text-gray-400 mt-2">{((resolvedTickets/totalTickets)*100).toFixed(1)}% of total</p>
          </div>
        </div>

        {/* Priority & Category Distribution */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Priority Distribution */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-[#1B314C] mb-4">Priority Distribution</h2>
            <div className="space-y-4">
              {[
                { label: "High Priority", count: highPriorityTickets, color: "bg-red-500", textColor: "text-red-600" },
                { label: "Medium Priority", count: mediumPriorityTickets, color: "bg-yellow-500", textColor: "text-yellow-600" },
                { label: "Low Priority", count: lowPriorityTickets, color: "bg-green-500", textColor: "text-green-600" }
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">{item.label}</span>
                    <span className={`font-medium ${item.textColor}`}>{item.count} tickets</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`${item.color} h-2 rounded-full transition-all duration-500`}
                      style={{ width: `${(item.count/totalTickets)*100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Category Distribution */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-[#1B314C] mb-4">Category Distribution</h2>
            <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
              {Object.entries(categories).map(([category, count]) => (
                <div key={category}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">{category}</span>
                    <span className="font-medium text-gray-900">{count} tickets</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-[#82AFE5] h-2 rounded-full transition-all duration-500" 
                      style={{ width: `${(count/totalTickets)*100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Agent Performance Table */}
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
                </tr>
              </thead>
              <tbody>
                {Object.entries(agentPerformance).map(([agent, stats]) => (
                  <tr key={agent} className="border-b border-gray-100 hover:bg-gray-50 transition">
                    <td className="py-3 px-4 text-sm font-medium text-[#1B314C]">{agent}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{stats.assigned}</td>
                    <td className="py-3 px-4 text-sm text-green-600">{stats.resolved}</td>
                    <td className="py-3 px-4 text-sm text-blue-600">{stats.inProgress}</td>
                    <td className="py-3 px-4 text-sm font-medium text-gray-700">
                      {stats.assigned > 0 ? ((stats.resolved/stats.assigned)*100).toFixed(1) : 0}%
                    </td>
                  </tr>
                ))}
                {Object.keys(agentPerformance).length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-gray-400">
                      No agent data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Current User's Personal Stats */}
        {user && (
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-[#1B314C] mb-4">Your Statistics</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-blue-600">{userTickets.length}</p>
                  <p className="text-xs text-gray-500">Total Assigned</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-green-600">{userResolved}</p>
                  <p className="text-xs text-gray-500">Resolved</p>
                </div>
                <div className="bg-yellow-50 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-yellow-600">{userPending}</p>
                  <p className="text-xs text-gray-500">Pending</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-purple-600">
                    {userTickets.length > 0 ? ((userResolved/userTickets.length)*100).toFixed(0) : 0}%
                  </p>
                  <p className="text-xs text-gray-500">Success Rate</p>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
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
                  <p className="text-center text-gray-400 py-4">No activity logs found</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Unassigned Tickets Alert */}
        {unassignedTickets > 0 && (
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-orange-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p className="text-sm text-orange-700">
                <span className="font-semibold">{unassignedTickets} unassigned ticket{unassignedTickets !== 1 ? 's' : ''}</span> require attention
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Analytics;