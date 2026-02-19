import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

function AdminDashboard() {
  const { logout } = useAuth();
  const [logs, setLogs] = useState<any[]>([]);
  const [agents, setAgents] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [tickets, setTickets] = useState<any[]>([]);
  const [stats, setStats] = useState({ totalUsers: 0, totalTickets: 0, pendingWork: 0 });
  const [newAdminCode, setNewAdminCode] = useState("");

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    const supportAgents = users.filter(u => u.role === 'support');
    setAgents(supportAgents);
    const l = await fetch("http://localhost:5000/api/admin/logs").then(r => r.json()); setLogs(l);
    const [u, t, s] = await Promise.all([
      fetch("http://localhost:5000/api/admin/users").then(r => r.json()),
      fetch("http://localhost:5000/api/admin/tickets").then(r => r.json()),
      fetch("http://localhost:5000/api/admin/stats").then(r => r.json())
    ]);
    setUsers(u); setTickets(t); setStats(s);
  };

  const changeRole = async (userId: string, newRole: string) => {
    await fetch(`http://localhost:5000/api/admin/users/${userId}/role`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: newRole })
    });
    fetchData(); // Refresh the list
  };

  const updateSecretCode = async () => {
    await fetch("http://localhost:5000/api/admin/update-code", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ newCode: newAdminCode })
    });
    alert("Secret code changed! New admins must use " + newAdminCode);
    setNewAdminCode("");
  };

const reassignTicket = async (ticketId: string, agentId: string) => {
  await fetch(`http://localhost:5000/api/admin/tickets/${ticketId}/reassign`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ agentId })
  });
  alert("Ticket reassigned!");
  fetchData(); // Refresh to show the new owner
};

{/* GLOBAL TICKETS SECTION */}
<div className="bg-white p-6 rounded shadow mt-8">
  <h2 className="text-xl font-bold mb-4">Ticket Reassignment</h2>
  {tickets.map(t => (
    <div key={t._id} className="flex justify-between p-3 border-b items-center">
      <div>
        <p className="font-medium">{t.title}</p>
        <p className="text-xs text-gray-500">Currently: {t.assignedTo?.name || "Unassigned"}</p>
      </div>
      
      <select 
        className="text-sm border rounded p-1"
        onChange={(e) => reassignTicket(t._id, e.target.value)}
        value={t.assignedTo?._id || ""}
      >
        <option value="">Assign to Agent...</option>
        {agents.map(agent => (
          <option key={agent._id} value={agent._id}>{agent.name}</option>
        ))}
      </select>
    </div>
  ))}
</div>

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Control Center</h1>
        <button onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded">Logout</button>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-6 rounded shadow text-center">
            <p className="text-gray-500">Total Users</p>
            <p className="text-2xl font-bold">{stats.totalUsers}</p>
        </div>
        <div className="bg-white p-6 rounded shadow text-center border-l-4 border-blue-500">
            <p className="text-gray-500">Global Tickets</p>
            <p className="text-2xl font-bold">{stats.totalTickets}</p>
        </div>
        <div className="bg-white p-6 rounded shadow text-center border-l-4 border-orange-500">
            <p className="text-gray-500">Tickets Waiting</p>
            <p className="text-2xl font-bold">{stats.pendingWork}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* USER MANAGEMENT */}
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-bold mb-4">Users & Permissions</h2>
          {users.map(u => (
            <div key={u._id} className="flex justify-between p-2 border-b">
              <span>{u.name} ({u.role})</span>
              <select 
                className="text-sm border rounded"
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

        {/* CLUBHOUSE SETTINGS */}
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-bold mb-4">Security Settings</h2>
          <label className="block text-sm mb-2">Change Admin Registration Code</label>
          <div className="flex gap-2">
            <input 
              type="text" 
              className="border p-2 flex-grow rounded"
              placeholder="New Secret Code" 
              value={newAdminCode}
              onChange={(e) => setNewAdminCode(e.target.value)}
            />
            <button onClick={updateSecretCode} className="bg-blue-600 text-white px-4 py-2 rounded">Save</button>
          </div>
        </div>
      </div>
    </div>
  );
}

{/* AUDIT LOG SECTION */}
<div className="bg-white p-6 rounded shadow mt-8">
  <h2 className="text-xl font-bold mb-4">📜 System Audit Logs</h2>
  <div className="overflow-y-auto max-h-60">
    <table className="w-full text-left text-sm">
      <thead className="bg-gray-50 uppercase text-xs font-bold">
        <tr>
          <th className="p-2">Time</th>
          <th className="p-2">Admin</th>
          <th className="p-2">Action</th>
          <th className="p-2">Details</th>
        </tr>
      </thead>
      <tbody>
        {logs.map((log) => (
          <tr key={log._id} className="border-b hover:bg-gray-50">
            <td className="p-2 text-gray-500">{new Date(log.timestamp).toLocaleString()}</td>
            <td className="p-2 font-bold">{log.performedBy?.name || "System"}</td>
            <td className="p-2"><span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">{log.action}</span></td>
            <td className="p-2 text-gray-600">{log.details}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>

export default AdminDashboard;