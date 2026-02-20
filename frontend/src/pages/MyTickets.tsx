import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import TicketCard from "../components/TicketCard";
import TicketModal from "../components/TicketModal";
 
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
 
interface User {
  name: string;
  email: string;
  role: string;
  id: string;
}
 
interface MyTicketsProps {
  user: User | null;
  onLogout: () => void;
}
 
const MyTickets = ({ user, onLogout }: MyTicketsProps) => {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
 
  // Fetch tickets assigned to current user
  useEffect(() => {
    fetchMyTickets();
  }, []);
 
  const fetchMyTickets = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('auth_token') || localStorage.getItem('token');
     
      // Fetch all tickets first (since we need to filter by assignedTo)
      const response = await fetch('https://supportsync-ujib.onrender.com/api', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
     
      if (!response.ok) {
        throw new Error('Failed to fetch tickets');
      }
     
      const allTickets = await response.json();
     
      // Filter tickets assigned to current user
      const myTickets = allTickets.filter((ticket: Ticket) =>
        ticket.assignedTo === user?.name
      );
     
      setTickets(myTickets);
      setError(null);
    } catch (err) {
      console.error('Error fetching tickets:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
 
  const updateStatus = async (id: string, status: TicketStatus) => {
    try {
      const token = localStorage.getItem('auth_token') || localStorage.getItem('token');
     
      const response = await fetch(`http://localhost:5000/api/tickets/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
 
      if (response.ok) {
        // Update local state
        setTickets(prev =>
          prev.map(ticket =>
            ticket._id === id ? { ...ticket, status } : ticket
          )
        );
      } else {
        const error = await response.json();
        console.error('Failed to update status:', error);
      }
    } catch (error) {
      console.error('Error updating ticket:', error);
    }
  };
 
  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.title.toLowerCase().includes(search.toLowerCase()) ||
                         ticket.description.toLowerCase().includes(search.toLowerCase()) ||
                         ticket.ticketId.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All" || ticket.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
 
  // Calculate stats
  const totalAssigned = tickets.length;
  const inProgressCount = tickets.filter(t => t.status === "In Progress").length;
  const resolvedCount = tickets.filter(t => t.status === "Resolved").length;
  const openCount = tickets.filter(t => t.status === "Open").length;
 
  if (loading) {
    return (
      <div className="flex bg-white min-h-screen">
        <Sidebar user={user} onLogout={onLogout} />
        <div className="flex-1 p-8 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1B314C] mx-auto"></div>
            <p className="mt-4 text-gray-500">Loading your tickets...</p>
          </div>
        </div>
      </div>
    );
  }
 
  if (error) {
    return (
      <div className="flex bg-white min-h-screen">
        <Sidebar user={user} onLogout={onLogout} />
        <div className="flex-1 p-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            Error loading tickets: {error}
          </div>
        </div>
      </div>
    );
  }
 
  return (
    <div className="flex bg-white min-h-screen">
      <Sidebar user={user} onLogout={onLogout} />
 
      <div className="flex-1 p-4 md:p-8">
        <Navbar user={user} title="My Tickets" />
 
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#1B314C]">My Assigned Tickets</h1>
          <p className="text-gray-500 mt-1">
            {totalAssigned} ticket{totalAssigned !== 1 ? 's' : ''} currently assigned to you
          </p>
        </div>
 
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <p className="text-gray-400 text-sm mb-1">Total Assigned</p>
            <p className="text-3xl font-bold text-[#1B314C]">{totalAssigned}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <p className="text-gray-400 text-sm mb-1">Open</p>
            <p className="text-3xl font-bold text-orange-600">{openCount}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <p className="text-gray-400 text-sm mb-1">In Progress</p>
            <p className="text-3xl font-bold text-blue-600">{inProgressCount}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <p className="text-gray-400 text-sm mb-1">Resolved</p>
            <p className="text-3xl font-bold text-green-600">{resolvedCount}</p>
          </div>
        </div>
 
        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search by ID, title, or description..."
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
 
        {/* Results count */}
        <div className="mb-4 text-sm text-gray-500">
          Showing {filteredTickets.length} of {tickets.length} tickets
        </div>
 
        {/* Tickets Grid */}
        {filteredTickets.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 className="text-lg font-medium text-gray-700 mb-2">No tickets found</h3>
            <p className="text-gray-400">
              {search ? "Try adjusting your search" : "No tickets are currently assigned to you"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTickets.map(ticket => (
              <TicketCard
                key={ticket._id}
                ticket={ticket}
                updateStatus={updateStatus}
                assignToMe={() => {}} // Already assigned, no need for assign button
                openModal={() => setSelectedTicket(ticket)}
                currentUser={user}
              />
            ))}
          </div>
        )}
 
        {/* Ticket Modal */}
        {selectedTicket && (
          <TicketModal
            ticket={selectedTicket}
            onClose={() => setSelectedTicket(null)}
            updateStatus={updateStatus}
            assignToMe={() => {}}
            currentUser={user}
          />
        )}
      </div>
    </div>
  );
};
 
export default MyTickets;
 
