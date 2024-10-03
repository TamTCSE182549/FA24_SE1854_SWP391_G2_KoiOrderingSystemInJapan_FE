import React, { useState } from "react";

const TicketManagement = () => {
  const [tickets, setTickets] = useState([
    {
      id: 1,
      customerName: "John Doe",
      event: "Koi Fish Show",
      seat: "A1",
      status: "Confirmed",
    },
    {
      id: 2,
      customerName: "Jane Smith",
      event: "Koi Fish Auction",
      seat: "B2",
      status: "Pending",
    },
  ]);

  const [newTicket, setNewTicket] = useState({
    customerName: "",
    event: "",
    seat: "",
    status: "",
  });
  const [editingTicket, setEditingTicket] = useState(null);

  // Handle input change for new ticket
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTicket({ ...newTicket, [name]: value });
  };

  // Handle add new ticket
  const handleAddTicket = () => {
    if (
      !newTicket.customerName ||
      !newTicket.event ||
      !newTicket.seat ||
      !newTicket.status
    )
      return;
    setTickets([...tickets, { id: tickets.length + 1, ...newTicket }]);
    setNewTicket({ customerName: "", event: "", seat: "", status: "" });
  };

  // Handle delete ticket
  const handleDeleteTicket = (id) => {
    const updatedTickets = tickets.filter((ticket) => ticket.id !== id);
    setTickets(updatedTickets);
  };

  // Handle edit ticket
  const handleEditTicket = (ticket) => {
    setEditingTicket(ticket);
  };

  // Handle update ticket
  const handleUpdateTicket = () => {
    const updatedTickets = tickets.map((ticket) =>
      ticket.id === editingTicket.id ? editingTicket : ticket
    );
    setTickets(updatedTickets);
    setEditingTicket(null);
  };

  // Handle input change for editing ticket
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditingTicket({ ...editingTicket, [name]: value });
  };

  return (
    <div className="p-4">
      <h2>Ticket Management</h2>

      {/* Add new ticket */}
      <div className="my-4">
        <input
          type="text"
          name="customerName"
          placeholder="Customer Name"
          value={newTicket.customerName}
          onChange={handleInputChange}
          className="border p-2 mr-2"
        />
        <input
          type="text"
          name="event"
          placeholder="Event"
          value={newTicket.event}
          onChange={handleInputChange}
          className="border p-2 mr-2"
        />
        <input
          type="text"
          name="seat"
          placeholder="Seat"
          value={newTicket.seat}
          onChange={handleInputChange}
          className="border p-2 mr-2"
        />
        <input
          type="text"
          name="status"
          placeholder="Status"
          value={newTicket.status}
          onChange={handleInputChange}
          className="border p-2 mr-2"
        />
        <button
          onClick={handleAddTicket}
          className="bg-blue-500 text-white p-2 rounded"
        >
          Add Ticket
        </button>
      </div>

      {/* Ticket list */}
      <div>
        {tickets.map((ticket) => (
          <div
            key={ticket.id}
            className="flex justify-between items-center mb-2 border p-2"
          >
            {editingTicket && editingTicket.id === ticket.id ? (
              <>
                <input
                  type="text"
                  name="customerName"
                  value={editingTicket.customerName}
                  onChange={handleEditInputChange}
                  className="border p-2 mr-2"
                />
                <input
                  type="text"
                  name="event"
                  value={editingTicket.event}
                  onChange={handleEditInputChange}
                  className="border p-2 mr-2"
                />
                <input
                  type="text"
                  name="seat"
                  value={editingTicket.seat}
                  onChange={handleEditInputChange}
                  className="border p-2 mr-2"
                />
                <input
                  type="text"
                  name="status"
                  value={editingTicket.status}
                  onChange={handleEditInputChange}
                  className="border p-2 mr-2"
                />
                <button
                  onClick={handleUpdateTicket}
                  className="bg-green-500 text-white p-2 rounded"
                >
                  Update
                </button>
              </>
            ) : (
              <>
                <span>
                  {ticket.customerName} - {ticket.event} - {ticket.seat} -{" "}
                  {ticket.status}
                </span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditTicket(ticket)}
                    className="bg-yellow-500 text-white p-2 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteTicket(ticket.id)}
                    className="bg-red-500 text-white p-2 rounded"
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TicketManagement;
