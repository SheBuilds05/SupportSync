import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

const Profile = ({ user, onLogout }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || "Sarah Chen",
    email: user?.email || "sarah.chen@company.com",
    phone: "+1 (555) 123-4567",
    department: "IT Support",
    location: "New York, NY",
    bio: "Dedicated IT support professional with 5 years of experience in troubleshooting and customer service.",
    skills: ["JavaScript", "React", "Node.js", "Database Management", "Customer Support", "Ticketing Systems"]
  });

  const stats = [
    { label: "Tickets Resolved", value: "147" },
    { label: "Avg Response Time", value: "2.4h" },
    { label: "Satisfaction Rate", value: "98%" },
    { label: "Current Load", value: "3 tickets" }
  ];

  return (
    <div className="flex bg-white min-h-screen">
      <Sidebar user={user} onLogout={onLogout} />

      <div className="flex-1 p-8">
        <Navbar user={user} title="Profile" />

        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-6">
            <div className="flex items-start gap-6">
              <div className="w-24 h-24 bg-[#1B314C] rounded-full flex items-center justify-center text-white text-3xl font-bold">
                {profileData.name.charAt(0)}
              </div>
              
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h1 className="text-2xl font-bold text-[#1B314C]">{profileData.name}</h1>
                    <p className="text-gray-500">Support Agent</p>
                  </div>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="bg-[#1B314C] text-white px-4 py-2 rounded-lg hover:bg-[#82AFE5] transition"
                  >
                    {isEditing ? "Save Changes" : "Edit Profile"}
                  </button>
                </div>

                <div className="mt-4 flex gap-2">
                  <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm">IT Support</span>
                  <span className="bg-green-50 text-green-600 px-3 py-1 rounded-full text-sm">Senior Agent</span>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4 mt-8 pt-6 border-t border-gray-100">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <p className="text-2xl font-bold text-[#1B314C]">{stat.value}</p>
                  <p className="text-sm text-gray-400">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Profile Details */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              {/* Bio */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-[#1B314C] mb-3">About</h2>
                {isEditing ? (
                  <textarea
                    value={profileData.bio}
                    onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                    rows={4}
                    className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#82AFE5]"
                  />
                ) : (
                  <p className="text-gray-600">{profileData.bio}</p>
                )}
              </div>

              {/* Skills */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-[#1B314C] mb-3">Skills & Expertise</h2>
                <div className="flex flex-wrap gap-2">
                  {profileData.skills.map((skill, index) => (
                    <span key={index} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-[#1B314C] mb-4">Contact Information</h2>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-400">Email</p>
                  <p className="font-medium text-gray-700">{profileData.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Phone</p>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.phone}
                      onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full border border-gray-200 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#82AFE5]"
                    />
                  ) : (
                    <p className="font-medium text-gray-700">{profileData.phone}</p>
                  )}
                </div>
                <div>
                  <p className="text-sm text-gray-400">Department</p>
                  <p className="font-medium text-gray-700">{profileData.department}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Location</p>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.location}
                      onChange={(e) => setProfileData(prev => ({ ...prev, location: e.target.value }))}
                      className="w-full border border-gray-200 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#82AFE5]"
                    />
                  ) : (
                    <p className="font-medium text-gray-700">{profileData.location}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;