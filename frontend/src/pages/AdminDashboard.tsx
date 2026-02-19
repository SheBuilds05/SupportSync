import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

interface Ticket {
  _id: string;
  title: string;
  status: string;
  createdBy: { name: string };
}

function AdminDashboard() {
  const { logout } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  // Load everything when the page opens
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [userRes, ticketRes] = await Promise.all([
        fetch("http://localhost:5000/api/admin/users"),
        fetch("http://localhost:5000/api/admin/tickets") // Ensure this route exists in backend
      ]);
      const userData = await userRes.json();
      const ticketData = await ticketRes.json();
      setUsers(userData);
      setTickets(ticketData);
    } catch (err) {
      console.error("Failed to fetch admin data", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id: string) => {
    if (window.confirm("Are you sure you want to remove this user?")) {
      await fetch(`http://localhost:5000/api/admin/users/${id}`, { method: 'DELETE' });
      setUsers(users.filter(u => u._id !== id));
    }
  };

  const deleteTicket = async (id: string) => {
    if (window.confirm("Delete this ticket permanently?")) {
      await fetch(`http://localhost:5000/api/admin/tickets/${id}`, { method: 'DELETE' });
      setTickets(tickets.filter(t => t._id !== id));
    }
  };

  if (loading) return <div className="p-8">Loading Command Center...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Admin Command Center</h1>
          <button onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded">Logout</button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* USER MANAGEMENT */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-4 border-b pb-2">Manage Users & Staff</h2>
            <div className="space-y-4">
              {users.map(u => (
                <div key={u._id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <div>
                    <p className="font-medium">{u.name} <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded ml-2">{u.role}</span></p>
                    <p className="text-sm text-gray-500">{u.email}</p>
                  </div>
                  <button 
                    onClick={() => deleteUser(u._id)}
                    className="text-red-500 hover:text-red-700 text-sm font-bold"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* TICKET MANAGEMENT */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-4 border-b pb-2">Global Tickets</h2>
            <div className="space-y-4">
              {tickets.map(t => (
                <div key={t._id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <div>
                    <p className="font-medium">{t.title}</p>
                    <p className="text-xs text-gray-500">By: {t.createdBy?.name || "Unknown"}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-bold uppercase">{t.status}</span>
                    <button 
                      onClick={() => deleteTicket(t._id)}
                      className="text-red-500 hover:text-red-700 text-sm font-bold"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;