// frontend/src/components/TicketCard.jsx
const TicketCard = ({
  ticket,
  updateStatus,
  assignToMe,
  openModal,
  currentUser
}) => {
  const getStatusColor = (status) => {
    switch(status) {
      case "Open":
        return "bg-orange-50 text-orange-600 border border-orange-200";
      case "In Progress":
        return "bg-blue-50 text-blue-600 border border-blue-200";
      case "Resolved":
        return "bg-green-50 text-green-600 border border-green-200";
      default:
        return "bg-gray-50 text-gray-600 border border-gray-200";
    }
  };

  const getPriorityBadge = (priority) => {
    switch(priority) {
      case "High":
        return <span className="text-xs bg-red-50 text-red-600 px-2 py-1 rounded">High</span>;
      case "Medium":
        return <span className="text-xs bg-yellow-50 text-yellow-600 px-2 py-1 rounded">Medium</span>;
      case "Low":
        return <span className="text-xs bg-green-50 text-green-600 px-2 py-1 rounded">Low</span>;
      default:
        return null;
    }
  };

  // Debug: Log when button is clicked
  const handleAssignClick = (e) => {
    e.stopPropagation();
    console.log('🔘 Assign button clicked for ticket:', ticket._id);
    console.log('📦 Ticket data:', ticket);
    console.log('👤 Current user:', currentUser);
    assignToMe(ticket._id);
  };

  const handleStartClick = (e) => {
    e.stopPropagation();
    console.log('🔘 Start button clicked for ticket:', ticket._id);
    updateStatus(ticket._id, "In Progress");
  };

  const handleResolveClick = (e) => {
    e.stopPropagation();
    console.log('🔘 Resolve button clicked for ticket:', ticket._id);
    updateStatus(ticket._id, "Resolved");
  };

  // Check if the current user is assigned to this ticket
  const isAssignedToCurrentUser = currentUser && ticket.assignedTo === currentUser.name;

  return (
    <div
      className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer hover:border-[#82AFE5]"
      onClick={openModal}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h2 className="font-semibold text-[#1B314C] line-clamp-1">
            {ticket.title}
          </h2>
          <p className="text-xs text-gray-400 mt-1">{ticket.ticketId || ticket._id}</p>
        </div>

        <span
          className={`px-3 py-1 text-xs rounded-full font-medium whitespace-nowrap ml-2 ${getStatusColor(ticket.status)}`}
        >
          {ticket.status}
        </span>
      </div>

      <p className="text-gray-500 text-sm mb-4 line-clamp-2">
        {ticket.description}
      </p>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-[#82AFE5] rounded-full flex items-center justify-center text-xs font-medium text-white">
            {ticket.createdBy?.charAt(0) || '?'}
          </div>
          <span className="text-sm text-gray-600">{ticket.createdBy}</span>
        </div>
        {getPriorityBadge(ticket.priority)}
      </div>

      <div className="flex items-center justify-between text-sm mb-3">
        <span className="text-gray-400">Category:</span>
        <span className="text-[#1B314C] font-medium">{ticket.category}</span>
      </div>

      <p className="text-sm mb-4">
        <span className="text-gray-400">Assigned to:</span>{" "}
        <span className={`font-medium ${isAssignedToCurrentUser ? 'text-[#82AFE5]' : 'text-[#1B314C]'}`}>
          {ticket.assignedTo || "Unassigned"}
          {isAssignedToCurrentUser && " (You)"}
        </span>
      </p>

      <div
        className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-gray-100"
        onClick={e => e.stopPropagation()}
      >
        {/* Show Assign button for unassigned tickets */}
        {!ticket.assignedTo && (
          <button
            onClick={handleAssignClick}
            className="text-xs bg-[#1B314C] text-white px-3 py-1.5 rounded-lg hover:bg-[#82AFE5] transition flex items-center gap-1"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Assign to me
          </button>
        )}

        {/* Show Start button for tickets assigned to current user with Open status */}
        {isAssignedToCurrentUser && ticket.status === "Open" && (
          <button
            onClick={handleStartClick}
            className="text-xs bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition flex items-center gap-1"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Start
          </button>
        )}

        {/* Show Resolve button for tickets assigned to current user with In Progress status */}
        {isAssignedToCurrentUser && ticket.status === "In Progress" && (
          <button
            onClick={handleResolveClick}
            className="text-xs bg-green-50 text-green-600 px-3 py-1.5 rounded-lg hover:bg-green-100 transition flex items-center gap-1"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Resolve
          </button>
        )}
      </div>
    </div>
  );
};

export default TicketCard;