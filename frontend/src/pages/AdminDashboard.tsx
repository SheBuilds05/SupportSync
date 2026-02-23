import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { Users, Ticket, Clock, Shield, LogOut, RefreshCw, Activity } from "lucide-react";

// THIS IS THE MOST IMPORTANT LINE: It tells the site to look at Render, not your computer.
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

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('auth_token') || localStorage.getItem('token') || "";
      const headers = { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      // We use the live API_BASE here
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
    try {
      await fetch(`${API_BASE}/users/${userId}/role`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ role: newRole })
      });
      fetchData();
    } catch (e) {
      console.error(e);
    }
  };

  const updateSecretCode = async () => {
    if(!newAdminCode) return;
    const token = localStorage.getItem('auth_token') || localStorage.getItem('token');
    try {
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
    } catch (e) {
      console.error(e);
    }
  };

  const reassignTicket = async (ticketId: string, agentId: string) => {
    const token = localStorage.getItem('auth_token') || localStorage.getItem('token');
    try {
      await fetch(`${API_BASE}/tickets/${ticketId}/reassign`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ agentId })
      });
      fetchData();
    } catch (e) {
      console.error(e);
    }
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
        <div className="bg-white/5 p-6 rounded-3xl border-l-4 border-[#82AFE5]">
          <div className="flex items-center gap-4">
            <Users className="text-[#82AFE5]" />
            <div>
              <p className="text-xs uppercase tracking-widest opacity-50">Total Users</p>
              <p className="text-3xl font-bold">{stats.totalUsers}</p>
            </div>
          </div>
        </div>
        <div className="bg-white/5 p-6 rounded-3xl border-l-4 border-blue-500">
          <div className="flex items-center gap-4">
            <Ticket className="text-blue-500" />
            <div>
              <p className="text-xs uppercase tracking-widest opacity-50">Global Tickets</p>
              <p className="text-3xl font-bold">{stats.totalTickets}</p>
            </div>
          </div>
        </div>
        <div className="bg-white/5 p-6 rounded-3xl border-l-4 border-orange-500">
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
        <div className="bg-white/5 p-8 rounded-[2rem]">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Shield size={20} className="text-[#82AFE5]" /> Users & Permissions
          </h2>
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
            {users.map((u: any) => (
              <div key={u._id} className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5">
                <div>
                  <p className="font-medium">{u.name}</p>
                  <p className="text-xs opacity-40 uppercase">{u.email}</p>
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

        <div className="bg-white/5 p-8 rounded-[2rem]">
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
              <button onClick={updateSecretCode} className="bg-cyan-500 text-[#0a192f] font-bold px-6 py-2 rounded-xl hover:brightness-110">
                Update
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white/5 p-8 rounded-[2rem] mt-8">
        <h2 className="text-xl font-bold mb-6">Ticket Reassignment</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-80 overflow-y-auto pr-2">
          {tickets.map((t: any) => (
            <div key={t._id} className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5">
              <div className="max-w-[60%]">
                <p className="font-medium truncate">{t.title}</p>
                <p className="text-[10px] uppercase opacity-40">Agent: {t.assignedTo?.name || "Unassigned"}</p>
              </div>
              <select 
                className="bg-[#1B314C] border border-white/10 rounded-lg px-3 py-1 text-sm outline-none"
                onChange={(e) => reassignTicket(t._id, e.target.value)}
                value={t.assignedTo?._id || ""}
              >
                <option value="">Select Agent...</option>
                {agents.map((agent: any) => (
                  <option key={agent._id} value={agent._id}>{agent.name}</option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </div>

      {/* AUDIT LOGS */}
      <div className="bg-white/5 p-8 rounded-[2rem] mt-8 overflow-hidden">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">📜 System Audit Logs</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-white/5 uppercase text-[10px] font-bold tracking-widest">
              <tr>
                <th className="p-4">Time</th>
                <th className="p-4">Admin</th>
                <th className="p-4">Action</th>
                <th className="p-4">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {logs.map((log: any) => (
                <tr key={log._id} className="hover:bg-white/5 transition-colors">
                  <td className="p-4 opacity-50">{new Date(log.timestamp).toLocaleString()}</td>
                  <td className="p-4 font-bold text-[#82AFE5]">{log.performedBy?.name || "System"}</td>
                  <td className="p-4">
                    <span className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-[10px] font-bold uppercase border border-blue-500/20">
                      {log.action}
                    </span>
                  </td>
                  <td className="p-4 opacity-70">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
