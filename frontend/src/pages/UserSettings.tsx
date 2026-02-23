import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface User {
  name: string;
  email: string;
  role: string;
  memberSince: string;
}

export default function UserSettings() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const API_BASE_URL = "https://supportsync-ujib.onrender.com/api";

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    darkMode: false,
  });

  const [userData] = useState<User>({
    name: "Rosa",
    email: "rosanovela273@gmail.com",
    role: "user",
    memberSince: "January 2024"
  });

  const handleSave = async () => {
    setLoading(true);
    setMessage(null);
    const token = localStorage.getItem('auth_token') || localStorage.getItem('token');
    
    try {
      const response = await fetch(`${API_BASE_URL}/users/settings`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(preferences),
      });

      if (response.ok) {
        setMessage({ type: 'success', text: '✅ Settings updated successfully!' });
      } else {
        throw new Error('Failed to update');
      }
    } catch (err) {
      setMessage({ type: 'error', text: '❌ Connection error. Server may be sleeping.' });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <div className="w-64 bg-[#1e293b] text-white flex flex-col p-4 fixed h-full">
        <div className="mb-8 p-2 text-xl font-bold">
          Support <span className="text-blue-400">Sync</span>
        </div>
        <nav className="flex-1 space-y-2">
          <button onClick={() => navigate('/user-dashboard')} className="w-full text-left p-3 rounded-lg hover:bg-slate-700 transition">🏠 Dashboard</button>
          <button onClick={() => navigate('/user-dashboard/my-tickets')} className="w-full text-left p-3 rounded-lg hover:bg-slate-700 transition">📂 My Tickets</button>
          <button className="w-full text-left p-3 rounded-lg bg-blue-600 text-white">⚙️ Settings</button>
        </nav>
        <button onClick={handleLogout} className="p-3 text-slate-400 hover:text-red-400 transition mt-auto">Logout →</button>
      </div>

      <div className="ml-64 flex-1 p-12">
        <div className="max-w-2xl">
          <h1 className="text-3xl font-bold text-slate-800 mb-8">Settings</h1>
          {message && (
            <div className={`mb-6 p-4 rounded-lg border ${message.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
              {message.text}
            </div>
          )}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mb-6">
            <h3 className="text-lg font-semibold mb-6">Preferences</h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span>Email Notifications</span>
                <input type="checkbox" checked={preferences.emailNotifications} onChange={(e) => setPreferences({...preferences, emailNotifications: e.target.checked})} />
              </div>
            </div>
          </div>
          <button onClick={handleSave} disabled={loading} className="w-full bg-[#00c853] hover:bg-[#00b24a] text-white font-semibold py-4 rounded-xl transition disabled:opacity-50">
            {loading ? "Saving..." : "Save All Settings"}
          </button>
        </div>
      </div>
    </div>
  );
}
