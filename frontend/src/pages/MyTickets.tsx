import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import TicketCard from "../components/TicketCard";
import TicketModal from "../components/TicketModal";

const MyTickets = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([
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
      _id: "TKT-007",
      title: "Database connection timeout",
      description: "Users experiencing intermittent database connection issues during peak hours.",
      status: "Open",
      assignedTo: "Sarah Chen",
      createdBy: "Robert Johnson",
      category: "Database",
      priority: "High",
      createdAt: "2024-02-13"
    }
  ]);

  const [selectedTicket, setSelectedTicket] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const updateStatus = (id, status) => {
    setTickets(prev =>
      prev.map(ticket =>
        ticket._id === id ? { ...ticket, status } : ticket
      )
    );
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.title.toLowerCase().includes(search.toLowerCase()) ||
                         ticket.description.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All" || ticket.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex bg-white min-h-screen">
      <Sidebar user={user} onLogout={onLogout} />

      <div className="flex-1 p-8">
        <Navbar user={user} title="My Tickets" />

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#1B314C]">My Assigned Tickets</h1>
          <p className="text-gray-500 mt-1">Tickets currently assigned to you</p>
        </div>

        {/* Stats for My Tickets */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <p className="text-gray-400 text-sm mb-1">Total Assigned</p>
            <p className="text-3xl font-bold text-[#1B314C]">{tickets.length}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <p className="text-gray-400 text-sm mb-1">In Progress</p>
            <p className="text-3xl font-bold text-blue-600">
              {tickets.filter(t => t.status === "In Progress").length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <p className="text-gray-400 text-sm mb-1">Resolved</p>
            <p className="text-3xl font-bold text-green-600">
              {tickets.filter(t => t.status === "Resolved").length}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search your tickets..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#82AFE5]"
              />
            </div>
            
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
          </div>
        </div>

        {/* Tickets Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTickets.map(ticket => (
            <TicketCard
              key={ticket._id}
              ticket={ticket}
              updateStatus={updateStatus}
              assignToMe={(id) => {}} // Already assigned
              openModal={() => setSelectedTicket(ticket)}
              isAssignedToMe={true}
            />
          ))}
        </div>

        {filteredTickets.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">No tickets assigned to you</p>
          </div>
        )}

        {selectedTicket && (
          <TicketModal
            ticket={selectedTicket}
            onClose={() => setSelectedTicket(null)}
            updateStatus={updateStatus}
            assignToMe={() => {}}
            isAssignedToMe={true}
          />
        )}
      </div>
    </div>
  );
};

export default MyTickets;