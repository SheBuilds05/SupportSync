import { useState, useEffect } from 'react';

interface User {
  name?: string;
  email?: string;
  role?: string;
}

interface UserSettingsProps {
  user?: User;
  onLogout: () => void;
}

const UserSettings = ({ user, onLogout }: UserSettingsProps) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  // Account info
  const [accountInfo, setAccountInfo] = useState({
    name: user?.name || "Goitseone Rak",
    email: user?.email || "goitseonetrade@gmail.com",
    role: user?.role || "Support Agent",
    memberSince: "January 2024"
  });

  // Settings state
  const [settings, setSettings] = useState({
    emailNotifications: true,
    autoAssign: true,
    darkMode: false,
    emailSignature: "Best regards,\nSarah Chen\nSupport Agent"
  });

  // Password state
  const [passwordData, setPasswordData] = useState({
    current: "",
    new: "",
    confirm: ""
  });

  // Load saved settings
  useEffect(() => {
    const savedSettings = localStorage.getItem('userSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  // Apply dark mode to entire app
  useEffect(() => {
    if (settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.darkMode]);

  const handleSettingChange = (key: keyof typeof settings): void => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const saveSettings = async () => {
    try {
      setLoading(true);
      localStorage.setItem('userSettings', JSON.stringify(settings));
      
      setMessage({
        type: 'success',
        text: 'Settings saved successfully!'
      });

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

  const handlePasswordChange = async () => {
    // Validation
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

  return (
    <div className={`ml-64 p-8 min-h-screen transition-colors duration-300 ${
      settings.darkMode ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-800'
    }`}>
      
      {/* Header Area */}
      <div className="mb-8">
        <p className="text-sm text-slate-500">Welcome back,</p>
        <h1 className="text-2xl font-bold">{accountInfo.name}</h1>
        <p className="text-xs text-slate-400 mt-1">Settings</p>
      </div>

      <div className="mb-6">
        <h2 className="text-3xl font-bold">Settings</h2>
        <p className="text-slate-500">Manage your preferences and account settings</p>
      </div>

      {/* Message Alert */}
      {message.text && (
        <div className={`mb-6 p-4 rounded-lg ${
          message.type === 'success' 
            ? 'bg-green-50 text-green-700 border border-green-200' 
            : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {message.text}
        </div>
      )}

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Preferences & Account */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Preferences Card */}
          <div className={`${
            settings.darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
          } p-6 rounded-xl border shadow-sm`}>
            <h3 className="text-xl font-semibold mb-6">Preferences</h3>
            
            <div className="space-y-6">
              {/* Email Notifications */}
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-slate-400">Receive email updates for ticket assignments</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.emailNotifications}
                    onChange={() => handleSettingChange('emailNotifications')}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                </label>
              </div>
              {/* Dark Mode */}
              <div className="flex justify-between items-center pt-6 border-t border-slate-100 dark:border-slate-700">
                <div>
                  <p className="font-medium">Dark Mode</p>
                  <p className="text-sm text-slate-400">Toggle dark theme</p>
                </div>
                <button
                  onClick={() => handleSettingChange('darkMode')}
                  className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${
                    settings.darkMode ? 'bg-blue-500' : 'bg-slate-300'
                  }`}
                >
                  <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
                    settings.darkMode ? 'translate-x-6' : 'translate-x-0'
                  }`} />
                </button>
              </div>
            </div>
          </div>

          {/* Account Info Card  */}
          <div className={`${
            settings.darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
          } p-6 rounded-xl border shadow-sm`}>
            <h3 className="text-xl font-semibold mb-6">Account Information</h3>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-slate-400 uppercase font-bold">Name</p>
                <p className="font-medium">{accountInfo.name}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase font-bold">Email</p>
                <p className="font-medium">{accountInfo.email}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase font-bold">Role</p>
                <p className="font-medium">{accountInfo.role}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase font-bold">Member since</p>
                <p className="font-medium">{accountInfo.memberSince}</p>
              </div>
            </div>
          </div>
          
            {/* Save Settings Button - Moved to bottom of preferences card */}
            <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-700">
              <button
                onClick={saveSettings}
                disabled={loading}
                className="w-full bg-green-500 text-white py-3 rounded-md hover:bg-green-600 transition font-medium disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save All Settings'}
              </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default UserSettings;