import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

const Profile = ({ user, onLogout }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [ticketStats, setTicketStats] = useState({
    resolved: 0,
    assigned: 0,
    open: 0,
    inProgress: 0
  });
  
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    department: "IT Support",
    location: "",
    bio: "",
    skills: [],
    role: user?.role || "support",
    joinedDate: "",
    ticketsResolved: 0
  });

  // Fetch real user data and ticket statistics
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('auth_token') || localStorage.getItem('token');
        
        // Fetch tickets to calculate stats
        const ticketsResponse = await fetch('https://supportsync-ujib.onrender.com/api/tickets', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (ticketsResponse.ok) {
          const tickets = await ticketsResponse.json();
          
          // Calculate statistics for current user
          const assignedToUser = tickets.filter((t: any) => t.assignedTo === user?.name);
          const resolvedByUser = tickets.filter((t: any) => 
            t.assignedTo === user?.name && t.status === 'Resolved'
          );
          const openTickets = tickets.filter((t: any) => 
            t.assignedTo === user?.name && t.status === 'Open'
          );
          const inProgressTickets = tickets.filter((t: any) => 
            t.assignedTo === user?.name && t.status === 'In Progress'
          );

          setTicketStats({
            resolved: resolvedByUser.length,
            assigned: assignedToUser.length,
            open: openTickets.length,
            inProgress: inProgressTickets.length
          });

          // You could also fetch user profile details from a /api/users/me endpoint
          // For now, we'll use the user prop and mock data
          setProfileData(prev => ({
            ...prev,
            name: user?.name || "",
            email: user?.email || "",
            ticketsResolved: resolvedByUser.length,
            // Mock data - you can replace with real data from a user profile endpoint
            phone: "+27 123 456 789",
            location: "Johannesburg, SA",
            bio: `Dedicated IT support professional with experience in troubleshooting and customer service. Currently managing tickets and providing technical solutions.`,
            skills: ["JavaScript", "React", "Node.js", "MongoDB", "Customer Support", "Ticketing Systems"],
            joinedDate: "February 2026"
          }));
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchUserData();
    }
  }, [user]);

  const stats = [
    { label: "Tickets Resolved", value: ticketStats.resolved.toString() },
    { label: "Currently Assigned", value: ticketStats.assigned.toString() },
    { label: "Open Tickets", value: ticketStats.open.toString() },
    { label: "In Progress", value: ticketStats.inProgress.toString() }
  ];

  const handleSaveProfile = () => {
    // Here you would typically save to a backend API
    setIsEditing(false);
    // Show success message or notification
  };

  if (loading) {
    return (
      <div className="flex bg-white min-h-screen">
        <Sidebar user={user} onLogout={onLogout} />
        <div className="flex-1 p-8 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1B314C] mx-auto"></div>
            <p className="mt-4 text-gray-500">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex bg-white min-h-screen">
      <Sidebar user={user} onLogout={onLogout} />

      <div className="flex-1 p-4 md:p-8">
        <Navbar user={user} title="Profile" />

        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8 mb-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-[#1B314C] to-[#82AFE5] rounded-full flex items-center justify-center text-white text-3xl md:text-4xl font-bold shadow-lg">
                {profileData.name?.charAt(0) || 'U'}
              </div>
              
              <div className="flex-1 w-full">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-[#1B314C]">{profileData.name}</h1>
                    <p className="text-gray-500 flex items-center gap-2 mt-1">
                      <span className="bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full text-xs capitalize">
                        {profileData.role === 'support' ? 'Support Agent' : 'User'}
                      </span>
                      <span className="text-gray-300">•</span>
                      <span className="text-sm text-gray-400">Member since {profileData.joinedDate}</span>
                    </p>
                  </div>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="bg-[#1B314C] text-white px-4 py-2 rounded-lg hover:bg-[#82AFE5] transition text-sm md:text-base w-full md:w-auto"
                  >
                    {isEditing ? "Save Changes" : "Edit Profile"}
                  </button>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs md:text-sm">IT Support</span>
                  <span className="bg-green-50 text-green-600 px-3 py-1 rounded-full text-xs md:text-sm">Support Agent</span>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-gray-100">
              {stats.map((stat, index) => (
                <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-xl md:text-2xl font-bold text-[#1B314C]">{stat.value}</p>
                  <p className="text-xs md:text-sm text-gray-500">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Profile Details */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              {/* Bio */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-lg font-semibold text-[#1B314C]">About</h2>
                </div>
                {isEditing ? (
                  <textarea
                    value={profileData.bio}
                    onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                    rows={4}
                    className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#82AFE5]"
                    placeholder="Tell us about yourself..."
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
                    <span key={index} className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-[#1B314C] mb-4">Recent Activity</h2>
                <div className="space-y-4">
                  {ticketStats.resolved > 0 && (
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 mt-2 bg-green-500 rounded-full"></div>
                      <div>
                        <p className="text-sm text-gray-600">Resolved {ticketStats.resolved} ticket(s)</p>
                        <p className="text-xs text-gray-400">All time</p>
                      </div>
                    </div>
                  )}
                  {ticketStats.assigned > 0 && (
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 mt-2 bg-blue-500 rounded-full"></div>
                      <div>
                        <p className="text-sm text-gray-600">Currently assigned to {ticketStats.assigned} ticket(s)</p>
                        <p className="text-xs text-gray-400">
                          {ticketStats.open} open, {ticketStats.inProgress} in progress
                        </p>
                      </div>
                    </div>
                  )}
                  {ticketStats.resolved === 0 && ticketStats.assigned === 0 && (
                    <p className="text-sm text-gray-400">No recent activity</p>
                  )}
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-[#1B314C] mb-4">Contact Information</h2>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-400 flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      Email
                    </p>
                    <p className="font-medium text-gray-700 ml-6">{profileData.email}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-400 flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      Phone
                    </p>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profileData.phone}
                        onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                        className="w-full border border-gray-200 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#82AFE5] mt-1"
                      />
                    ) : (
                      <p className="font-medium text-gray-700 ml-6">{profileData.phone}</p>
                    )}
                  </div>

                  <div>
                    <p className="text-sm text-gray-400 flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l14-4" />
                      </svg>
                      Department
                    </p>
                    <p className="font-medium text-gray-700 ml-6">{profileData.department}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-400 flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Location
                    </p>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profileData.location}
                        onChange={(e) => setProfileData(prev => ({ ...prev, location: e.target.value }))}
                        className="w-full border border-gray-200 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#82AFE5] mt-1"
                      />
                    ) : (
                      <p className="font-medium text-gray-700 ml-6">{profileData.location}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Performance Stats */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-[#1B314C] mb-4">Performance</h2>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Resolution Rate</span>
                      <span className="font-medium text-green-600">
                        {ticketStats.assigned > 0 
                          ? Math.round((ticketStats.resolved / ticketStats.assigned) * 100) 
                          : 0}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{ 
                          width: `${ticketStats.assigned > 0 
                            ? (ticketStats.resolved / ticketStats.assigned) * 100 
                            : 0}%` 
                        }}
                      ></div>
                    </div>
                  </div>
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
