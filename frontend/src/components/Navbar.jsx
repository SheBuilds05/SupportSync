import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Navbar = ({ user, title }) => {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch tickets and generate notifications
  useEffect(() => {
    if (user) {
      generateNotificationsFromTickets();
    }
  }, [user]);

  const generateNotificationsFromTickets = async () => {
    try {
      const token = localStorage.getItem('auth_token') || localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/tickets', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const tickets = await response.json();
        
        // Generate notifications based on ticket data
        const ticketNotifications = [];
        
        tickets.forEach(ticket => {
          // Notification for tickets assigned to current user that are Open
          if (ticket.assignedTo === user?.name && ticket.status === 'Open') {
            ticketNotifications.push({
              id: `ticket-${ticket._id}-open`,
              message: `You have an open ticket: "${ticket.title}"`,
              ticketId: ticket._id,
              ticketNumber: ticket.ticketId,
              time: new Date(ticket.updatedAt),
              read: false,
              type: 'open'
            });
          }
          
          // Notification for tickets assigned to current user that are In Progress
          if (ticket.assignedTo === user?.name && ticket.status === 'In Progress') {
            ticketNotifications.push({
              id: `ticket-${ticket._id}-progress`,
              message: `Ticket in progress: "${ticket.title}"`,
              ticketId: ticket._id,
              ticketNumber: ticket.ticketId,
              time: new Date(ticket.updatedAt),
              read: false,
              type: 'progress'
            });
          }
          
          // Notification for unassigned tickets (for support agents)
          if (user?.role === 'support' && !ticket.assignedTo) {
            ticketNotifications.push({
              id: `ticket-${ticket._id}-unassigned`,
              message: `Unassigned ticket: "${ticket.title}"`,
              ticketId: ticket._id,
              ticketNumber: ticket.ticketId,
              time: new Date(ticket.createdAt),
              read: false,
              type: 'unassigned'
            });
          }
          
          // Notification for recently resolved tickets (last 24 hours)
          if (ticket.status === 'Resolved' && 
              ticket.assignedTo === user?.name &&
              new Date(ticket.updatedAt) > new Date(Date.now() - 24 * 60 * 60 * 1000)) {
            ticketNotifications.push({
              id: `ticket-${ticket._id}-resolved`,
              message: `Ticket resolved: "${ticket.title}"`,
              ticketId: ticket._id,
              ticketNumber: ticket.ticketId,
              time: new Date(ticket.updatedAt),
              read: false,
              type: 'resolved'
            });
          }
        });
        
        // Sort by date (newest first) and limit to 10
        ticketNotifications.sort((a, b) => b.time - a.time);
        setNotifications(ticketNotifications.slice(0, 10));
        setUnreadCount(ticketNotifications.length);
      }
    } catch (error) {
      console.error('Error generating notifications:', error);
    }
  };

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
  };

  const handleProfileClick = () => {
    navigate("/profile");
  };

  const handleNotificationItemClick = (notification) => {
    // Mark as read (in memory only)
    setNotifications(prev => 
      prev.map(n => n.id === notification.id ? { ...n, read: true } : n)
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
    
    // Navigate to the ticket
    if (notification.ticketId) {
      navigate(`/support-dashboard?ticket=${notification.ticketId}`);
    }
    setShowNotifications(false);
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const formatTime = (date) => {
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  };

  const getNotificationIcon = (type) => {
    switch(type) {
      case 'open':
        return (
          <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'progress':
        return (
          <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        );
      case 'unassigned':
        return (
          <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
        );
      case 'resolved':
        return (
          <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return (
          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        );
    }
  };

  return (
    <div className="flex justify-between items-center mb-8">
      <div>
        <p className="text-gray-400 text-sm">Welcome back,</p>
        <h2 className="text-2xl font-semibold text-[#1B314C]">{user?.name || "User"}</h2>
        {title && <p className="text-sm text-gray-400 mt-1">{title}</p>}
      </div>

      <div className="flex items-center gap-4">
        {/* Notifications Icon */}
        <div className="relative">
          <button
            onClick={handleNotificationClick}
            className="relative p-2 text-gray-400 hover:text-[#82AFE5] transition rounded-lg hover:bg-gray-100"
          >
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowNotifications(false)}
              />
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-100 z-50">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                  <h3 className="font-semibold text-[#1B314C]">Notifications</h3>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-xs text-[#82AFE5] hover:text-[#1B314C] transition"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition ${
                          !notification.read ? "bg-blue-50/50" : ""
                        }`}
                        onClick={() => handleNotificationItemClick(notification)}
                      >
                        <div className="flex justify-between items-start gap-3">
                          <div className="flex-shrink-0 mt-0.5">
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div className="flex-1">
                            <p className={`text-sm ${!notification.read ? "font-semibold text-[#1B314C]" : "text-gray-600"}`}>
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              {notification.ticketNumber && `Ticket: ${notification.ticketNumber} • `}
                              {formatTime(notification.time)}
                            </p>
                          </div>
                          {!notification.read && (
                            <span className="w-2 h-2 bg-[#82AFE5] rounded-full flex-shrink-0"></span>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center text-gray-400">
                      <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                      </svg>
                      <p>No notifications</p>
                    </div>
                  )}
                </div>
                <div className="p-3 border-t border-gray-100 text-center">
                  <button
                    onClick={() => {
                      setShowNotifications(false);
                      navigate('/support-dashboard');
                    }}
                    className="text-sm text-[#82AFE5] hover:text-[#1B314C] transition"
                  >
                    View all tickets
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Profile Name - Clickable */}
        <button
          onClick={handleProfileClick}
          className="bg-[#1B314C] text-white px-5 py-2.5 rounded-xl font-medium shadow-sm hover:bg-[#82AFE5] transition cursor-pointer flex items-center gap-2"
        >
          <span>{user?.name?.split(' ')[0] || "User"}</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Navbar;