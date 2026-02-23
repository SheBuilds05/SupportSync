import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface User {
  name: string;
  email: string;
  role: string;
  memberSince: string;
}

export const Settings = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // API Base URL from your production deployment
  const API_BASE_URL = "https://supportsync-ujib.onrender.com/api";

  // State for toggles
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    darkMode: false,
  });

  // User data state (Mocked from your screenshot, usually fetched from /api/users/me)
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
      setMessage({ type: 'error', text: '❌ Network error. Render server may be waking up.' });
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
      {/* SIDEBAR */}
      <div className="w-64 bg-[#1e293b] text-white flex flex-col p-4 fixed h-full">
        <div className="mb-8 p-2">
          <h1 className="text-xl font-bold flex items-center gap-2">
            Support <span className="text-blue-400">Sync</span>
          </h1>
        </div>

        <nav className="flex-1 space-y-2">
          <button onClick={() => navigate('/dashboard')} className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-slate-700 transition text-slate-300">
            <span className="p-1 border border-slate-500 rounded-full text-xs">＋</span> Create Ticket
          </button>
          <button onClick={() => navigate('/tickets')} className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-slate-700 transition text-slate-300">
            📂 My Tickets
          </button>
          <button className="w-full flex items-center gap-3 p-3 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-600/30">
            ⚙️ Settings
          </button>
        </nav>

        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition mt-auto"
        >
          Logout →
        </button>
      </div>

      {/* MAIN CONTENT */}
      <div className="ml-64 flex-1 p-12">
        <div className="mb-8">
          <p className="text-sm text-slate-500">Welcome back,</p>
          <h2 className="text-2xl font-bold text-slate-900">{userData.name}</h2>
          <p className="text-xs text-blue-500 mt-1">Settings</p>
        </div>

        <div className="max-w-2xl">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Settings</h1>
          <p className="text-slate-500 mb-8">Manage your preferences and account settings</p>

          {message && (
            <div className={`mb-6 p-4 rounded-lg border ${message.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
              {message.text}
            </div>
          )}

          {/* PREFERENCES CARD */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mb-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-6">Preferences</h3>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-700">Email Notifications</p>
                  <p className="text-sm text-slate-400">Receive email updates for ticket assignments</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={preferences.emailNotifications}
                  onChange={(e) => setPreferences({...preferences, emailNotifications: e.target.checked})}
                  className="w-10 h-5 bg-slate-200 rounded-full appearance-none checked:bg-blue-500 cursor-pointer transition relative"
                />
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <div>
                  <p className="font-medium text-slate-700">Dark Mode</p>
                  <p className="text-sm text-slate-400">Toggle dark theme</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={preferences.darkMode}
                  onChange={(e) => setPreferences({...preferences, darkMode: e.target.checked})}
                  className="w-10 h-5 bg-slate-200 rounded-full appearance-none checked:bg-blue-500 cursor-pointer transition relative"
                />
              </div>
            </div>
          </div>

          {/* ACCOUNT INFO CARD */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mb-8">
            <h3 className="text-lg font-semibold text-slate-800 mb-6">Account Information</h3>
            
            <div className="grid grid-cols-1 gap-6">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Name</p>
                <p className="font-medium text-slate-800">{userData.name}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Email</p>
                <p className="font-medium text-slate-800">{userData.email}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Role</p>
                <p className="font-medium text-slate-800">{userData.role}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Member Since</p>
                <p className="font-medium text-slate-800">{userData.memberSince}</p>
              </div>
            </div>
          </div>

          <button 
            onClick={handleSave}
            disabled={loading}
            className="w-full bg-[#00c853] hover:bg-[#00b24a] text-white font-semibold py-4 rounded-xl transition shadow-lg disabled:opacity-50"
          >
            {loading ? "Saving Changes..." : "Save All Settings"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserSettings;
