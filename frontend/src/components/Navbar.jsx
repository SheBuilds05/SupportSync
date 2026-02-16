import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Navbar = ({ user, title }) => {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    {
      id: 1,
      message: "New ticket assigned to you",
      ticket: "TKT-007",
      time: "5 min ago",
      read: false
    },
    {
      id: 2,
      message: "Ticket TKT-002 has been updated",
      ticket: "TKT-002",
      time: "1 hour ago",
      read: false
    },
    {
      id: 3,
      message: "Ticket TKT-005 marked as In Progress",
      ticket: "TKT-005",
      time: "3 hours ago",
      read: true
    }
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleProfileClick = () => {
    navigate("/profile");
  };

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
  };

  const markAsRead = (id) => {
    // In a real app, you'd update the notification status
    console.log("Mark as read:", id);
  };

  return (
    <div className="flex justify-between items-center mb-8">
      <div>
        <p className="text-gray-400 text-sm">Welcome back,</p>
        <h2 className="text-2xl font-semibold text-[#1B314C]">{user?.name || "Sarah Chen"}</h2>
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
                {unreadCount}
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
                <div className="p-4 border-b border-gray-100">
                  <h3 className="font-semibold text-[#1B314C]">Notifications</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition ${
                          !notification.read ? "bg-blue-50/50" : ""
                        }`}
                        onClick={() => {
                          markAsRead(notification.id);
                          navigate(`/my-tickets`);
                          setShowNotifications(false);
                        }}
                      >
                        <div className="flex justify-between items-start gap-2">
                          <div className="flex-1">
                            <p className={`text-sm ${!notification.read ? "font-semibold text-[#1B314C]" : "text-gray-600"}`}>
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              Ticket: {notification.ticket} • {notification.time}
                            </p>
                          </div>
                          {!notification.read && (
                            <span className="w-2 h-2 bg-[#82AFE5] rounded-full"></span>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center text-gray-400">
                      No notifications
                    </div>
                  )}
                </div>
                <div className="p-3 border-t border-gray-100 text-center">
                  <button
                    onClick={() => {
                      // Mark all as read
                      setShowNotifications(false);
                    }}
                    className="text-sm text-[#82AFE5] hover:text-[#1B314C] transition"
                  >
                    Mark all as read
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
          <span>{user?.name?.split(' ')[0] || "Sarah"}</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Navbar;