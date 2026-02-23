import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { Users, Ticket, Clock, Shield, LogOut, RefreshCw, Activity } from "lucide-react";

// The production API URL
const API_BASE = "https://supportsync-ujib.onrender.com/api/admin";

function AdminDashboard() {
  const { logout } = useAuth();
  const [logs, setLogs] = useState<any[]>([]);
  const [agents, setAgents] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [tickets, setTickets] = useState<any[]>([]);
  const [stats, setStats] = useState({ totalUsers: 0, totalTickets: 0, pendingWork: 0 });
  const [newAdminCode, setNewAdminCode] = useState("");
  const [loading, setLoading] = useState(false);

  // UseCallback prevents the build tool (Rollup) from getting confused during deployment
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('auth_token') || localStorage.getItem('token');
      const headers = { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json' 
      };

      const [u, t, s, l] = await Promise.all([
        fetch(`${API_BASE}/users`, { headers }).then(r => r.ok ? r.json() : []),
        fetch(`${API_BASE}/tickets`, { headers }).then(r => r.ok ? r.json() : []),
        fetch(`${API_BASE}/stats`, { headers }).then(r => r.ok ? r.json() : null),
        fetch(`${API_BASE}/logs`, { headers }).then(r => r.ok ? r.json() : [])
      ]);

      // Added safety checks to prevent ".filter" errors if the server returns an error object
      const safeUsers = Array.isArray(u) ? u : [];
      setUsers(safeUsers);
      setTickets(Array.isArray(t) ? t : []);
      setStats(s?.totalUsers !== undefined ? s : (s?.data || { totalUsers: 0, totalTickets: 0, pendingWork: 0 }));
      setLogs(Array.isArray(l) ? l : []);
      
      setAgents(safeUsers.filter((user: any) => user.role === 'support'));
    } catch (err) {
      console.error("Connection failed:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const changeRole = async (userId: string, newRole: string) => {
    const token = localStorage.getItem('auth_token') || localStorage.getItem('token');
    await fetch(`${API_BASE}/users/${userId}/role`, {
      method: 'PATCH',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify({ role: newRole })
    });
    fetchData();
  };

  const updateSecretCode = async () => {
    if (!newAdminCode) return;
    const token = localStorage.getItem('auth_token') || localStorage.getItem('token');
    await fetch(`${API_BASE}/update-code`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ newCode: newAdminCode })
    });
    alert("✅ Secret code updated successfully!");
    setNewAdminCode("");
  };

  const reassignTicket = async (ticketId: string, agentId: string) => {
    const token = localStorage.getItem('auth_token') || localStorage.getItem('token');
    await fetch(`${API_BASE}/tickets/${ticketId}/reassign`, {
      method: 'PATCH',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ agentId })
    });
    fetchData();
  };

  return (
    <div className="min-h-screen bg-[#0a192f] text-white p-4 md:p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Admin Control</h1>
          <p className="text-[#82AFE5] opacity-70">SupportSync System Management</p>
        </div>
        <div className="flex gap-4">
          <button onClick={fetchData} className="p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
            <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
          </button>
          <button onClick={logout} className="flex items-center gap-2 bg-red-500/20 border border-red-500/50 text-red-200 px-5 py-2 rounded-xl hover:bg-red-500/30 transition-all">
            <LogOut size={18} /> Logout
          </button>
        </div>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white/5 backdrop-blur-md p-6 rounded-3xl border-l-4 border-[#82AFE5]">
          <div className="flex items-center gap-4">
            <Users className="text-[#82AFE5]" />
            <div>
              <p className="text-xs uppercase tracking-widest opacity-50">Total Users</p>
              <p className="text-3xl font-bold">{stats.totalUsers}</p>
            </div>
          </div>
        </div>
        <div className="bg-white/5 backdrop-blur-md p-6 rounded-3xl border-l-4 border-blue-500">
          <div className="flex items-center gap-4">
            <Ticket className="text-blue-500" />
            <div>
              <p className="text-xs uppercase tracking-widest opacity-50">Global Tickets</p>
              <p className="text-3xl font-bold">{stats.totalTickets}</p>
            </div>
          </div>
        </div>
        <div className="bg-white/5 backdrop-blur-md p-6 rounded-3xl border-l-4 border-orange-500">
          <div className="flex items-center gap-4">
            <Clock className="text-orange-500" />
            <div>
              <p className="text-xs uppercase tracking-widest opacity-50">Pending Work</p>
              <p className="text-3xl font-bold">{stats.pendingWork}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white/5 backdrop-blur-md p-8 rounded-[2rem]">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Shield size={20} className="text-[#82AFE5]" /> Users & Permissions
          </h2>
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
            {users.map(u => (
              <div key={u._id} className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5">
                <div>
                  <p className="font-medium">{u.name}</p>
                  <p className="text-xs opacity-40 uppercase tracking-tighter">{u.email}</p>
                </div>
                <select 
                  className="bg-[#1B314C] border border-white/10 rounded-lg px-3 py-1 text-sm outline-none"
                  value={u.role} 
                  onChange={(e) => changeRole(u._id, e.target.value)}
                >
                  <option value="user">User</option>
                  <option value="support">Support</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-md p-8 rounded-[2rem]">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Activity size={20} className="text-cyan-400" /> System Security
          </h2>
          <div className="bg-cyan-500/5 border border-cyan-500/20 p-6 rounded-2xl">
            <label className="block text-sm font-bold uppercase tracking-widest mb-3 opacity-70">Admin Secret Code</label>
            <div className="flex gap-3">
              <input 
                type="text" 
                className="bg-white/5 border border-white/10 p-3 flex-grow rounded-xl outline-none"
                placeholder="New Secret Code" 
                value={newAdminCode}
                onChange={(e) => setNewAdminCode(e.target.value)}
              />
              <button onClick={updateSecretCode} className="bg-cyan-500 text-[#0a192f] font-bold px-6 py-2 rounded-xl hover:brightness-110 transition-all">
                Update
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white/5 backdrop-blur-md p-8 rounded-[2rem] mt-8">
        <h2 className="text-xl font-bold mb-6">Ticket Reassignment</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-80 overflow-y-auto pr-2">
          {tickets.map(t => (
            <div key={t._id} className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5">
              <div>
                <p className="font-medium truncate max-w-[150px]">{t.title}</p>
                <p className="text-[10px] uppercase opacity-40">Agent: {t.assignedTo?.name || "Unassigned"}</p>
              </div>
              <select 
                className="bg-[#1B314C] border border-white/10 rounded-lg px-3 py-1 text-sm outline-none"
                onChange={(e) => reassignTicket(t._id, e.target.value)}
                value={t.assignedTo?._id || ""}
              >
                <option value="">Select Agent...</option>
                {agents.map(agent => (
                  <option key={agent._id} value={agent._id}>{agent.name}</option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
