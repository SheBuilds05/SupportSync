import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import DashboardStats from "../components/DashboardStats";
import TicketCard from "../components/TicketCard";
import TicketModal from "../components/TicketModal";

const mockTickets = [
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
  }
];

const SupportDashboard = ({ user, onLogout }) => {
  const [tickets, setTickets] = useState(mockTickets);
  const [search, setSearch] = useState("");
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");

  const updateStatus = (id, status) => {
    setTickets(prev =>
      prev.map(ticket =>
        ticket._id === id ? { ...ticket, status } : ticket
      )
    );
  };

  const assignToMe = (id) => {
    setTickets(prev =>
      prev.map(ticket =>
        ticket._id === id ? { ...ticket, assignedTo: user.name } : ticket
      )
    );
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.title.toLowerCase().includes(search.toLowerCase()) ||
                         ticket.description.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All" || ticket.status === statusFilter;
    const matchesPriority = priorityFilter === "All" || ticket.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <div className="flex bg-white min-h-screen">
      <Sidebar user={user} onLogout={onLogout} />

      <div className="flex-1 p-8">
        <Navbar user={user} />
        
        {/* Welcome Section */}
        <div className="mb-8">
          <p className="text-gray-400 text-sm">Support Dashboard</p>
          <h1 className="text-3xl font-bold text-[#1B314C]">Ticket Management</h1>
          <p className="text-gray-500 mt-1">Manage and resolve support tickets efficiently</p>
        </div>

        <DashboardStats tickets={tickets} />

        {/* Filters Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search tickets by title or description..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#82AFE5] focus:border-transparent"
              />
            </div>
            
            <div className="flex gap-3">
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#82AFE5] min-w-[140px]"
              >
                <option>All Status</option>
                <option>Open</option>
                <option>In Progress</option>
                <option>Resolved</option>
              </select>

              <select
                value={priorityFilter}
                onChange={e => setPriorityFilter(e.target.value)}
                className="border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#82AFE5] min-w-[140px]"
              >
                <option>All Priority</option>
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Ticket Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTickets.map(ticket => (
            <TicketCard
              key={ticket._id}
              ticket={ticket}
              updateStatus={updateStatus}
              assignToMe={assignToMe}
              openModal={() => setSelectedTicket(ticket)}
              currentUser={user}
            />
          ))}
        </div>

        {filteredTickets.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">No tickets found matching your filters</p>
          </div>
        )}

        {selectedTicket && (
          <TicketModal
            ticket={selectedTicket}
            onClose={() => setSelectedTicket(null)}
            updateStatus={updateStatus}
            assignToMe={assignToMe}
            currentUser={user}
          />
        )}
      </div>
    </div>
  );
};

export default SupportDashboard;