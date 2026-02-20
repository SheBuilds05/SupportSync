const API_URL = "https://supportsync-ujib.onrender.com/api/tickets";

// Get all tickets
export const getTickets = async (token) => {
  const res = await fetch(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch tickets");
  }

  return res.json();
};

// Assign ticket to current user
export const assignTicket = async (id, token) => {
  const res = await fetch(`${API_URL}/${id}/assign`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to assign ticket");
  }

  return res.json();
};

// Update ticket status
export const updateTicketStatus = async (id, status, token) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });

  if (!res.ok) {
    throw new Error("Failed to update ticket");
  }

  return res.json();
};
