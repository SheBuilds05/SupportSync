import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

const Settings = ({ user, onLogout }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  // User account info from props
  const [accountInfo, setAccountInfo] = useState({
    name: user?.name || "",
    email: user?.email || "",
    role: user?.role || "support",
    memberSince: ""
  });

  const [settings, setSettings] = useState({
    emailNotifications: true,
    darkMode: false,
    autoAssign: true,
    emailSignature: ""
  });

  const [passwordData, setPasswordData] = useState({
    current: "",
    new: "",
    confirm: ""
  });

  // Fetch user settings (mock for now - would come from a /api/users/settings endpoint)
  useEffect(() => {
    const fetchUserSettings = async () => {
      try {
        setLoading(true);
        // In a real app, you would fetch settings from your backend
        // For now, we'll use mock data or localStorage
        const savedSettings = localStorage.getItem('userSettings');
        if (savedSettings) {
          setSettings(JSON.parse(savedSettings));
        } else {
          // Default settings
          setSettings({
            emailNotifications: true,
            darkMode: false,
            autoAssign: true,
            emailSignature: `Best regards,\n${user?.name || 'Support Agent'}\nSupport Agent`
          });
        }

        // Set member since date (mock - would come from backend)
        setAccountInfo(prev => ({
          ...prev,
          memberSince: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
        }));

      } catch (error) {
        console.error('Error fetching settings:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchUserSettings();
    }
  }, [user]);

  // Handle setting changes
  const handleSettingChange = (key) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Save all settings
  const saveSettings = async () => {
    try {
      setLoading(true);
      // In a real app, you would save to backend
      localStorage.setItem('userSettings', JSON.stringify(settings));
      
      setMessage({
        type: 'success',
        text: 'Settings saved successfully!'
      });

      // Clear message after 3 seconds
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Failed to save settings. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle password change
  const handlePasswordChange = async () => {
    // Validate passwords
    if (!passwordData.current || !passwordData.new || !passwordData.confirm) {
      setMessage({ type: 'error', text: 'All password fields are required' });
      return;
    }

    if (passwordData.new !== passwordData.confirm) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }

    if (passwordData.new.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
      return;
    }

    try {
      setLoading(true);
      
      // In a real app, you would call your backend API
      // const token = localStorage.getItem('auth_token') || localStorage.getItem('token');
      // const response = await fetch('http://localhost:5000/api/auth/change-password', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${token}`
      //   },
      //   body: JSON.stringify({
      //     currentPassword: passwordData.current,
      //     newPassword: passwordData.new
      //   })
      // });

      // Mock success
      setMessage({ type: 'success', text: 'Password updated successfully!' });
      setPasswordData({ current: "", new: "", confirm: "" });
      
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update password. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  // Toggle dark mode (would need to be implemented with context/theme provider)
  useEffect(() => {
    if (settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.darkMode]);

  if (loading && !settings.emailSignature) {
    return (
      <div className="flex bg-white min-h-screen">
        <Sidebar user={user} onLogout={onLogout} />
        <div className="flex-1 p-8 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1B314C] mx-auto"></div>
            <p className="mt-4 text-gray-500">Loading settings...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex bg-white min-h-screen">
      <Sidebar user={user} onLogout={onLogout} />

      <div className="flex-1 p-4 md:p-8">
        <Navbar user={user} title="Settings" />

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#1B314C]">Settings</h1>
          <p className="text-gray-500 mt-1">Manage your preferences and account settings</p>
        </div>

        {/* Message Alert */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 
            'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {message.text}
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-8">
          {/* Preferences */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-[#1B314C] mb-4">Preferences</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <div>
                    <p className="font-medium text-gray-700">Email Notifications</p>
                    <p className="text-sm text-gray-400">Receive email updates for ticket assignments</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.emailNotifications}
                      onChange={() => handleSettingChange('emailNotifications')}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#82AFE5]"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <div>
                    <p className="font-medium text-gray-700">Auto-assign tickets</p>
                    <p className="text-sm text-gray-400">Automatically assign new tickets to available agents</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.autoAssign}
                      onChange={() => handleSettingChange('autoAssign')}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#82AFE5]"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium text-gray-700">Dark Mode</p>
                    <p className="text-sm text-gray-400">Toggle dark theme</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.darkMode}
                      onChange={() => handleSettingChange('darkMode')}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#82AFE5]"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* Email Signature */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-[#1B314C] mb-4">Email Signature</h2>
              <textarea
                value={settings.emailSignature}
                onChange={(e) => setSettings(prev => ({ ...prev, emailSignature: e.target.value }))}
                rows={4}
                className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#82AFE5]"
                placeholder="Your email signature..."
              />
              <button 
                onClick={saveSettings}
                disabled={loading}
                className="mt-4 bg-[#1B314C] text-white px-6 py-2 rounded-lg hover:bg-[#82AFE5] transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Saving...' : 'Save Settings'}
              </button>
            </div>
          </div>

          {/* Account Settings */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-[#1B314C] mb-4">Account</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Name</label>
                  <p className="font-medium text-gray-700">{accountInfo.name}</p>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Email</label>
                  <p className="font-medium text-gray-700">{accountInfo.email}</p>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Role</label>
                  <p className="font-medium text-gray-700 capitalize">{accountInfo.role}</p>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Member since</label>
                  <p className="font-medium text-gray-700">{accountInfo.memberSince}</p>
                </div>
              </div>
            </div>

            {/* Change Password */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-[#1B314C] mb-4">Change Password</h2>
              
              <div className="space-y-3">
                <input
                  type="password"
                  placeholder="Current password"
                  value={passwordData.current}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, current: e.target.value }))}
                  className="w-full border border-gray-200 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#82AFE5]"
                />
                <input
                  type="password"
                  placeholder="New password"
                  value={passwordData.new}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, new: e.target.value }))}
                  className="w-full border border-gray-200 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#82AFE5]"
                />
                <input
                  type="password"
                  placeholder="Confirm new password"
                  value={passwordData.confirm}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, confirm: e.target.value }))}
                  className="w-full border border-gray-200 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#82AFE5]"
                />
                <button 
                  onClick={handlePasswordChange}
                  disabled={loading}
                  className="w-full bg-[#1B314C] text-white px-4 py-2 rounded-lg hover:bg-[#82AFE5] transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Updating...' : 'Update Password'}
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-2">Password must be at least 6 characters</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;