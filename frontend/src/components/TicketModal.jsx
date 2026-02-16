const TicketModal = ({ ticket, onClose, updateStatus, assignToMe }) => {
  const getStatusColor = (status) => {
    switch(status) {
      case "Open": return "text-orange-600 bg-orange-50";
      case "In Progress": return "text-blue-600 bg-blue-50";
      case "Resolved": return "text-green-600 bg-green-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case "High": return "text-red-600 bg-red-50";
      case "Medium": return "text-yellow-600 bg-yellow-50";
      case "Low": return "text-green-600 bg-green-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl w-96 shadow-xl">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-bold text-[#1B314C]">
            Ticket Details
          </h2>
          <span className={`px-3 py-1 text-xs rounded-full font-medium ${getStatusColor(ticket.status)}`}>
            {ticket.status}
          </span>
        </div>

        <div className="mb-4">
          <h3 className="font-semibold text-[#1B314C] mb-2">{ticket.title}</h3>
          <p className="text-gray-600 text-sm bg-gray-50 p-3 rounded-lg">
            {ticket.description}
          </p>
        </div>

        <div className="space-y-3 text-sm">
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-400">Ticket ID</span>
            <span className="font-medium text-[#1B314C]">{ticket._id}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-400">Created by</span>
            <span className="font-medium text-[#1B314C]">{ticket.createdBy}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-400">Assigned to</span>
            <span className="font-medium text-[#1B314C]">{ticket.assignedTo || "Unassigned"}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-400">Category</span>
            <span className="font-medium text-[#1B314C]">{ticket.category}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-400">Priority</span>
            <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
              {ticket.priority}
            </span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-gray-400">Created</span>
            <span className="font-medium text-[#1B314C]">{ticket.createdAt}</span>
          </div>
        </div>

        <div className="mt-6 flex gap-2">
          {ticket.status !== "Resolved" && (
            <button
              onClick={() => {
                updateStatus(ticket._id, "Resolved");
                onClose();
              }}
              className="flex-1 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
            >
              Mark Resolved
            </button>
          )}
          {!ticket.assignedTo && (
            <button
              onClick={() => {
                assignToMe(ticket._id);
                onClose();
              }}
              className="flex-1 bg-[#1B314C] text-white px-4 py-2 rounded-lg hover:bg-[#82AFE5] transition"
            >
              Assign to me
            </button>
          )}
          <button
            onClick={onClose}
            className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TicketModal;