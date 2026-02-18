import { useEffect, useState } from "react";
import { getTickets } from "../api/ticketService";
import { useAuth } from "../context/AuthContext";
import TicketCard from "./TicketCard";

const Tickets = () => {
  const { token } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAllTickets = async () => {
    try {
      setLoading(true);
      const data = await getTickets(token);
      setTickets(data);
    } catch (err) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchAllTickets();
  }, [token]);

  const updateTicketInState = (updatedTicket) => {
    setTickets((prev) =>
      prev.map((t) =>
        t._id === updatedTicket._id ? updatedTicket : t
      )
    );
  };

  if (loading) return <h2>Loading tickets...</h2>;

  return (
    <div>
      <h2>All Tickets</h2>

      {tickets.length === 0 ? (
        <p>No tickets available.</p>
      ) : (
        tickets.map((ticket) => (
          <TicketCard
            key={ticket._id}
            ticket={ticket}
            onUpdate={updateTicketInState}
          />
        ))
      )}
    </div>
  );
};

export default Tickets;
