import { useState } from 'react';

const UserSettings = () => {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className={`ml-64 p-8 min-h-screen transition-colors duration-300 ${darkMode ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-800'}`}>
      {/* Header Area */}
      <div className="mb-8">
        <p className="text-sm text-slate-500">Welcome back,</p>
        <h1 className="text-2xl font-bold">Goitseone Rak</h1>
        <p className="text-xs text-slate-400 mt-1">Settings</p>
      </div>

      <div className="mb-6">
        <h2 className="text-3xl font-bold">Settings</h2>
        <p className="text-slate-500">Manage your preferences and account settings</p>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Preferences & Signature */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Preferences Card */}
          <div className={`${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} p-6 rounded-xl border shadow-sm`}>
            <h3 className="text-xl font-semibold mb-6">Preferences</h3>
            
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-slate-400">Receive email updates for ticket assignments</p>
                </div>
                <input type="checkbox" className="w-10 h-5 bg-blue-600 rounded-full appearance-none cursor-pointer relative checked:bg-blue-500 transition-all" defaultChecked />
              </div>

              <div className="flex justify-between items-center border-t pt-6 border-slate-100 dark:border-slate-700">
                <div>
                  <p className="font-medium">Auto-assign tickets</p>
                  <p className="text-sm text-slate-400">Automatically assign new tickets to available agents</p>
                </div>
                <input type="checkbox" className="w-10 h-5 bg-blue-600 rounded-full appearance-none cursor-pointer relative transition-all" defaultChecked />
              </div>

              <div className="flex justify-between items-center border-t pt-6 border-slate-100 dark:border-slate-700">
                <div>
                  <p className="font-medium">Dark Mode</p>
                  <p className="text-sm text-slate-400">Toggle dark theme</p>
                </div>
                <button 
                  onClick={() => setDarkMode(!darkMode)}
                  className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${darkMode ? 'bg-blue-500' : 'bg-slate-300'}`}
                >
                  <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${darkMode ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
              </div>
            </div>
          </div>

          {/* Email Signature Card */}
          <div className={`${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} p-6 rounded-xl border shadow-sm`}>
            <h3 className="text-xl font-semibold mb-4">Email Signature</h3>
            <textarea 
              className={`w-full p-4 h-32 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none transition-all ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-700'}`}
              defaultValue={`Best regards,\nSarah Chen\nSupport Agent`}
            />
            <button className="mt-4 bg-[#1e293b] text-white px-6 py-2 rounded-md font-medium hover:bg-slate-700 transition">
              Save Signature
            </button>
          </div>
        </div>

        {/* Right Column: Account & Password */}
        <div className="space-y-6">
          
          {/* Account Info Card */}
          <div className={`${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} p-6 rounded-xl border shadow-sm`}>
            <h3 className="text-xl font-semibold mb-6">Account</h3>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-slate-400 uppercase font-bold">Name</p>
                <p className="font-medium">Goitseone Rak</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase font-bold">Email</p>
                <p className="font-medium">goitseonetrade@gmail.com</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase font-bold">Role</p>
                <p className="font-medium">Support Agent</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase font-bold">Member since</p>
                <p className="font-medium">January 2024</p>
              </div>
            </div>
          </div>

          {/* Change Password Card */}
          <div className={`${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} p-6 rounded-xl border shadow-sm`}>
            <h3 className="text-xl font-semibold mb-4">Change Password</h3>
            <div className="space-y-3">
              <input type="password" placeholder="Current password" className={`w-full p-2 border rounded-md outline-none ${darkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`} />
              <input type="password" placeholder="New password" className={`w-full p-2 border rounded-md outline-none ${darkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`} />
              <input type="password" placeholder="Confirm new password" className={`w-full p-2 border rounded-md outline-none ${darkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`} />
              <button className="w-full bg-[#1e293b] text-white py-2 rounded-md font-medium hover:bg-slate-700 transition mt-2">
                Update Password
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default UserSettings;