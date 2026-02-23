import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { Users, Ticket, Clock, Shield, LogOut, RefreshCw, Activity } from "lucide-react";

//  Move the URL outside the component so it's a stable constant
const API_BASE = "https://supportsync-ujib.onrender.com/api/admin";

export default function AdminDashboard() {
  const { logout } = useAuth();
  const [logs, setLogs] = useState<any[]>([]);
  const [agents, setAgents] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [tickets, setTickets] = useState<any[]>([]);
  const [stats, setStats] = useState({ totalUsers: 0, totalTickets: 0, pendingWork: 0 });
  const [newAdminCode, setNewAdminCode] = useState("");
  const [loading, setLoading] = useState(false);

  // Wrap fetchData in useCallback to satisfy strict build requirements
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('auth_token') || localStorage.getItem('token') || "";
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

      setUsers(Array.isArray(u) ? u : []);
      setTickets(Array.isArray(t) ? t : []);
      setStats(s?.totalUsers !== undefined ? s : (s?.data || { totalUsers: 0, totalTickets: 0, pendingWork: 0 }));
      setLogs(Array.isArray(l) ? l : []);
      
      const userList = Array.isArray(u) ? u : [];
      setAgents(userList.filter((user: any) => user.role === 'support'));
    } catch (err) {
      console.error("Fetch error:", err);
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
    if(!newAdminCode) return;
    const token = localStorage.getItem('auth_token') || localStorage.getItem('token');
    await fetch(`${API_BASE}/update-code`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ newCode: newAdminCode })
    });
    alert("✅ Secret code updated!");
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
    <div className="ml-64 min-h-screen bg-slate-50 text-slate-800 p-8">
      {/* Header */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Admin Control</h1>
          <p className="text-slate-500">System-wide management and oversight</p>
        </div>
        <div className="flex gap-3">
          <button onClick={fetchData} className="p-2.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
            <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
          </button>
          <button onClick={logout} className="flex items-center gap-2 bg-white border border-red-200 text-red-600 px-5 py-2.5 rounded-lg hover:bg-red-50 transition-all font-medium shadow-sm">
            <LogOut size={18} /> Logout
          </button>
        </div>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg"><Users size={24} /></div>
            <div>
              <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Total Users</p>
              <p className="text-2xl font-bold text-slate-900">{stats.totalUsers}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg"><Ticket size={24} /></div>
            <div>
              <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Global Tickets</p>
              <p className="text-2xl font-bold text-slate-900">{stats.totalTickets}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-50 text-orange-600 rounded-lg"><Clock size={24} /></div>
            <div>
              <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Pending Work</p>
              <p className="text-2xl font-bold text-slate-900">{stats.pendingWork}</p>
            </div>
          </div>
        </div>
      </div>

      {/* USER MANAGEMENT */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h2 className="text-lg font-bold mb-6 flex items-center gap-2 text-slate-800">
            <Shield size={20} className="text-blue-600" /> Users & Permissions
          </h2>
          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
            {users.map(u => (
              <div key={u._id} className="flex justify-between items-center p-4 bg-slate-50 rounded-lg border border-slate-100">
                <div>
                  <p className="font-semibold text-slate-700">{u.name}</p>
                  <p className="text-xs text-slate-500">{u.email}</p>
                </div>
                <select 
                  className="bg-white border border-slate-300 rounded-md px-3 py-1.5 text-sm"
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

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h2 className="text-lg font-bold mb-6 flex items-center gap-2 text-slate-800">
            <Activity size={20} className="text-blue-600" /> System Security
          </h2>
          <div className="bg-blue-50/50 border border-blue-100 p-6 rounded-xl">
            <label className="block text-xs font-bold uppercase tracking-widest mb-3 text-slate-500">Admin Secret Code</label>
            <div className="flex gap-3">
              <input 
                type="text" 
                className="bg-white border border-slate-300 p-2.5 flex-grow rounded-lg outline-none"
                placeholder="Enter new secret code" 
                value={newAdminCode}
                onChange={(e) => setNewAdminCode(e.target.value)}
              />
              <button onClick={updateSecretCode} className="bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg hover:bg-blue-700 transition-all shadow-md">
                Update
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* TICKET REASSIGNMENT */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm mt-8">
        <h2 className="text-lg font-bold mb-6 text-slate-800">Global Ticket Reassignment</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-80 overflow-y-auto">
          {tickets.map(t => (
            <div key={t._id} className="p-4 bg-slate-50 rounded-lg border border-slate-100">
              <div className="mb-3">
                <p className="font-semibold text-slate-700 truncate">{t.title}</p>
                <p className="text-[11px] font-medium text-slate-400 uppercase">Current: {t.assignedTo?.name || "Unassigned"}</p>
              </div>
              <select 
                className="w-full bg-white border border-slate-300 rounded-md px-3 py-1.5 text-sm"
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
