import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import DashboardStats from "../components/DashboardStats";
import TicketCard from "../components/TicketCard";
import TicketModal from "../components/TicketModal";

const SupportDashboard = ({ user, onLogout }) => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");

  // Debug: Log user object
  useEffect(() => {
    console.log('Current user in dashboard:', user);
  }, [user]);

  // Fetch tickets from MongoDB
  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      // Try both possible token locations
      const token = localStorage.getItem('auth_token') || localStorage.getItem('token');
      
      console.log('Fetching tickets - Token exists:', !!token);
      
      if (!token) {
        setError('Please log in to view tickets');
        setLoading(false);
        return;
      }
      
      const response = await fetch('http://localhost:5000/api/tickets', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Tickets response status:', response.status);
      
      if (response.status === 401) {
        // Clear all possible token keys
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setError('Your session has expired. Please log in again.');
        return;
      }
      
      if (response.status === 403) {
        setError('You do not have permission to view tickets');
        return;
      }
      
      if (!response.ok) {
        throw new Error(`Failed to fetch tickets: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Tickets fetched successfully:', data.length);
      setTickets(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching tickets:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      console.log(`Updating ticket ${id} to status: ${status}`);
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
        console.log('Status updated successfully');
        fetchTickets(); // Refresh the list
      } else {
        const errorData = await response.json();
        console.error('Failed to update status:', errorData);
      }
    } catch (error) {
      console.error('Error updating ticket:', error);
    }
  };

  const assignToMe = async (id) => {
    try {
      console.log(`Assigning ticket ${id} to current user`);
      const token = localStorage.getItem('auth_token') || localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/tickets/${id}/assign`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        console.log('Ticket assigned successfully');
        fetchTickets(); // Refresh the list
      } else {
        const errorData = await response.json();
        console.error('Failed to assign ticket:', errorData);
      }
    } catch (error) {
      console.error('Error assigning ticket:', error);
    }
  };

  const resolveTicket = async (id) => {
    try {
      console.log(`Resolving ticket ${id}`);
      const token = localStorage.getItem('auth_token') || localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/tickets/${id}/resolve`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        console.log('Ticket resolved successfully');
        fetchTickets(); // Refresh the list
      } else {
        const errorData = await response.json();
        console.error('Failed to resolve ticket:', errorData);
      }
    } catch (error) {
      console.error('Error resolving ticket:', error);
    }
  };

  // Filter tickets based on search and filters
  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.title?.toLowerCase().includes(search.toLowerCase()) ||
                         ticket.description?.toLowerCase().includes(search.toLowerCase()) ||
                         ticket.ticketId?.toLowerCase().includes(search.toLowerCase()) ||
                         ticket.createdBy?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All" || ticket.status === statusFilter;
    const matchesPriority = priorityFilter === "All" || ticket.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Calculate stats for display
  const openCount = tickets.filter(t => t.status === 'Open').length;
  const inProgressCount = tickets.filter(t => t.status === 'In Progress').length;
  const resolvedCount = tickets.filter(t => t.status === 'Resolved').length;

  if (loading) {
    return (
      <div className="flex bg-white min-h-screen">
        <Sidebar user={user} onLogout={onLogout} />
        <div className="flex-1 p-8 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1B314C] mx-auto"></div>
            <p className="mt-4 text-gray-500">Loading tickets from database...</p>
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
            <p className="font-semibold">Error loading tickets:</p>
            <p>{error}</p>
            <button 
              onClick={fetchTickets}
              className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex bg-white min-h-screen">
      <Sidebar user={user} onLogout={onLogout} />

      <div className="flex-1 p-4 md:p-8">
        <Navbar user={user} />
        
        {/* Welcome Section */}
        <div className="mb-8">
          <p className="text-gray-400 text-sm">Support Dashboard</p>
          <h1 className="text-3xl font-bold text-[#1B314C]">Ticket Management</h1>
          <p className="text-gray-500 mt-1">
            {tickets.length} total tickets • {openCount} open • {inProgressCount} in progress • {resolvedCount} resolved
          </p>
        </div>

        <DashboardStats tickets={tickets} />

        {/* Filters Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search tickets by ID, title, description, or creator..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#82AFE5] focus:border-transparent"
              />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
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

        {/* Results count and active filters */}
        <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div className="text-sm text-gray-500">
            Showing {filteredTickets.length} of {tickets.length} tickets
          </div>
          {(search || statusFilter !== "All" || priorityFilter !== "All") && (
            <div className="flex gap-2 text-xs">
              {search && <span className="bg-gray-100 px-2 py-1 rounded">Search: "{search}"</span>}
              {statusFilter !== "All" && <span className="bg-gray-100 px-2 py-1 rounded">Status: {statusFilter}</span>}
              {priorityFilter !== "All" && <span className="bg-gray-100 px-2 py-1 rounded">Priority: {priorityFilter}</span>}
            </div>
          )}
        </div>

        {/* Ticket Grid */}
        {filteredTickets.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 className="text-lg font-medium text-gray-700 mb-2">No tickets found</h3>
            <p className="text-gray-400">
              {search || statusFilter !== "All" || priorityFilter !== "All" 
                ? "Try adjusting your filters"
                : "No tickets available in the database"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
        )}

        {/* Ticket Modal */}
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