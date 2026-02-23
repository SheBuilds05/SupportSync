import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Users, Ticket, Clock, Shield, LogOut, RefreshCw, Activity } from "lucide-react";

function AdminDashboard() {
  const { logout } = useAuth();
  const [logs, setLogs] = useState<any[]>([]);
  const [agents, setAgents] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [tickets, setTickets] = useState<any[]>([]);
  const [stats, setStats] = useState({ totalUsers: 0, totalTickets: 0, pendingWork: 0 });
  const [newAdminCode, setNewAdminCode] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

 const fetchData = async () => {
  setLoading(true);
  try {
    const token = localStorage.getItem('auth_token') || localStorage.getItem('token');
    
    const API_BASE = "https://supportsync-ujib.onrender.com/api/admin";

    const [u, t, s, l] = await Promise.all([
      fetch(`${API_BASE}/users`, { headers: { 'Authorization': `Bearer ${token}` } }).then(r => r.json()),
      fetch(`${API_BASE}/tickets`, { headers: { 'Authorization': `Bearer ${token}` } }).then(r => r.json()),
      fetch(`${API_BASE}/stats`, { headers: { 'Authorization': `Bearer ${token}` } }).then(r => r.json()),
      fetch(`${API_BASE}/logs`, { headers: { 'Authorization': `Bearer ${token}` } }).then(r => r.json())
    ]);

    setUsers(u || []);
    setTickets(t || []);
    setStats(s || { totalUsers: 0, totalTickets: 0, pendingWork: 0 });
    setLogs(l || []);
    
    setAgents(u?.filter((user: any) => user.role === 'support') || []);

  } catch (err) {
    console.error("Connection failed. Check if the Render server is awake:", err);
  } finally {
    setLoading(false);
  }
};

  const changeRole = async (userId: string, newRole: string) => {
    await fetch(`http://localhost:5000/api/admin/users/${userId}/role`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: newRole })
    });
    fetchData();
  };

  const updateSecretCode = async () => {
    if(!newAdminCode) return;
    await fetch("http://localhost:5000/api/admin/update-code", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ newCode: newAdminCode })
    });
    alert("✅ Secret code updated successfully!");
    setNewAdminCode("");
  };

  const reassignTicket = async (ticketId: string, agentId: string) => {
    await fetch(`http://localhost:5000/api/admin/tickets/${ticketId}/reassign`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
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
          <button 
            onClick={fetchData} 
            className="p-2.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all shadow-sm"
            title="Refresh Data"
          >
            <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
          </button>
          <button 
            onClick={logout} 
            className="flex items-center gap-2 bg-white border border-red-200 text-red-600 px-5 py-2.5 rounded-lg hover:bg-red-50 transition-all font-medium shadow-sm"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
              <Users size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Total Users</p>
              <p className="text-2xl font-bold text-slate-900">{stats.totalUsers}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
              <Ticket size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Global Tickets</p>
              <p className="text-2xl font-bold text-slate-900">{stats.totalTickets}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-50 text-orange-600 rounded-lg">
              <Clock size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Pending Work</p>
              <p className="text-2xl font-bold text-slate-900">{stats.pendingWork}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* USER MANAGEMENT */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h2 className="text-lg font-bold mb-6 flex items-center gap-2 text-slate-800">
            <Shield size={20} className="text-blue-600" /> Users & Permissions
          </h2>
          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {users.map(u => (
              <div key={u._id} className="flex justify-between items-center p-4 bg-slate-50 rounded-lg border border-slate-100">
                <div>
                  <p className="font-semibold text-slate-700">{u.name}</p>
                  <p className="text-xs text-slate-500">{u.email}</p>
                </div>
                <select 
                  className="bg-white border border-slate-300 rounded-md px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
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

        {/* SECURITY & CODES */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h2 className="text-lg font-bold mb-6 flex items-center gap-2 text-slate-800">
            <Activity size={20} className="text-blue-600" /> System Security
          </h2>
          <div className="bg-blue-50/50 border border-blue-100 p-6 rounded-xl">
            <label className="block text-xs font-bold uppercase tracking-widest mb-3 text-slate-500">Admin Secret Code</label>
            <div className="flex gap-3">
              <input 
                type="text" 
                className="bg-white border border-slate-300 p-2.5 flex-grow rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                placeholder="Enter new secret code" 
                value={newAdminCode}
                onChange={(e) => setNewAdminCode(e.target.value)}
              />
              <button 
                onClick={updateSecretCode} 
                className="bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg hover:bg-blue-700 transition-all shadow-md active:transform active:scale-95"
              >
                Update
              </button>
            </div>
            <p className="mt-4 text-xs text-slate-400 italic">This code is required for new admin registrations.</p>
          </div>
        </div>
      </div>

      {/* TICKET REASSIGNMENT */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm mt-8">
        <h2 className="text-lg font-bold mb-6 text-slate-800">Global Ticket Reassignment</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-80 overflow-y-auto pr-2">
          {tickets.map(t => (
            <div key={t._id} className="p-4 bg-slate-50 rounded-lg border border-slate-100 hover:border-blue-200 transition-colors">
              <div className="mb-3">
                <p className="font-semibold text-slate-700 truncate" title={t.title}>{t.title}</p>
                <p className="text-[11px] font-medium text-slate-400 uppercase">Current: {t.assignedTo?.name || "Unassigned"}</p>
              </div>
              <select 
                className="w-full bg-white border border-slate-300 rounded-md px-3 py-1.5 text-sm outline-none focus:border-blue-500"
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

      {/* AUDIT LOGS */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm mt-8 overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <span>📋</span> System Audit Logs
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[11px] font-bold tracking-wider">
              <tr>
                <th className="p-4">Timestamp</th>
                <th className="p-4">Admin</th>
                <th className="p-4">Action</th>
                <th className="p-4">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {logs?.map((log) => (
                <tr key={log._id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4 text-slate-500">{new Date(log.timestamp).toLocaleString()}</td>
                  <td className="p-4 font-semibold text-blue-700">{log.performedBy?.name || "System"}</td>
                  <td className="p-4">
                    <span className="bg-blue-100 text-blue-700 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border border-blue-200">
                      {log.action}
                    </span>
                  </td>
                  <td className="p-4 text-slate-600">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
