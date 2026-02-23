import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { Users, Ticket, Clock, Shield, LogOut, RefreshCw, Activity } from "lucide-react";

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
      const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };

      const [u, t, s, l] = await Promise.all([
        fetch(`${API_BASE}/users`, { headers }).then(r => r.json()),
        fetch(`${API_BASE}/tickets`, { headers }).then(r => r.json()),
        fetch(`${API_BASE}/stats`, { headers }).then(r => r.json()),
        fetch(`${API_BASE}/logs`, { headers }).then(r => r.json())
      ]);

      setUsers(Array.isArray(u) ? u : []);
      setTickets(Array.isArray(t) ? t : []);
      setStats(s?.totalUsers !== undefined ? s : { totalUsers: 0, totalTickets: 0, pendingWork: 0 });
      setLogs(Array.isArray(l) ? l : []);
      setAgents(Array.isArray(u) ? u.filter((user: any) => user.role === 'support') : []);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  // ... (Keep your changeRole, updateSecretCode, and reassignTicket functions as they were)

  return (
    <div className="min-h-screen bg-[#0a192f] text-white p-8">
        {/* Keep the UI the same as your working version */}
        <h1 className="text-4xl font-bold mb-10">Admin Control</h1>
        <div className="grid grid-cols-3 gap-6 mb-10">
            <div className="bg-white/5 p-6 rounded-3xl border-l-4 border-blue-500">
                <p className="opacity-50">TOTAL USERS</p>
                <p className="text-3xl font-bold">{stats.totalUsers}</p>
            </div>
            {/* ... etc */}
        </div>
        {/* ... Rest of your UI code */}
    </div>
  );
}
