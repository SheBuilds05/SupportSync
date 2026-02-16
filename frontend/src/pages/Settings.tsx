import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

const Settings = ({ user, onLogout }) => {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    darkMode: false,
    autoAssign: true,
    emailSignature: "Best regards,\nSarah Chen\nSupport Agent"
  });

  const [passwordData, setPasswordData] = useState({
    current: "",
    new: "",
    confirm: ""
  });

  const handleSettingChange = (key) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="flex bg-white min-h-screen">
      <Sidebar user={user} onLogout={onLogout} />

      <div className="flex-1 p-8">
        <Navbar user={user} title="Settings" />

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#1B314C]">Settings</h1>
          <p className="text-gray-500 mt-1">Manage your preferences and account settings</p>
        </div>

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
              <button className="mt-4 bg-[#1B314C] text-white px-4 py-2 rounded-lg hover:bg-[#82AFE5] transition">
                Save Signature
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
                  <p className="font-medium text-gray-700">{user?.name || "Sarah Chen"}</p>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Email</label>
                  <p className="font-medium text-gray-700">{user?.email || "sarah.chen@company.com"}</p>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Role</label>
                  <p className="font-medium text-gray-700">Support Agent</p>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Member since</label>
                  <p className="font-medium text-gray-700">January 2024</p>
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
                <button className="w-full bg-[#1B314C] text-white px-4 py-2 rounded-lg hover:bg-[#82AFE5] transition">
                  Update Password
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
