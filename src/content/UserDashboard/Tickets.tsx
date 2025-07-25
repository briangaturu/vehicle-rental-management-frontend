import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../app/store';
import {
  useGetTicketsByUserIdQuery,
  useCreateTicketMutation,
} from '../../features/api/supportTicketsApi';

const UserTicketsPage: React.FC = () => {
  const userId = useSelector((state: RootState) => state.auth.user?.id);

  const { data: tickets, isLoading, error, refetch } =
    useGetTicketsByUserIdQuery(userId!, {
      skip: !userId,
    });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [createTicket, { isLoading: isCreating }] = useCreateTicketMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    await createTicket({
      subject,
      description,
      userId,
    });

    setSubject('');
    setDescription('');
    setIsModalOpen(false);
    refetch();
  };

  const ticketList = Array.isArray(tickets) ? tickets : [];

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">My Support Tickets</h2>

      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-[#0D1C49] text-white px-4 py-2 rounded hover:bg-blue-700 mb-6"
      >
        Create New Ticket
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
            >
              &times;
            </button>

            <h3 className="text-lg font-bold mb-4">Create Support Ticket</h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 font-medium mb-1">Subject</label>
                <input
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="border border-gray-300 rounded w-full px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="border border-gray-300 rounded w-full px-3 py-2"
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                disabled={isCreating}
              >
                {isCreating ? 'Creating...' : 'Submit Ticket'}
              </button>
            </form>
          </div>
        </div>
      )}

      {isLoading && <p>Loading tickets...</p>}
      {error && <p className="text-red-600">Error loading tickets</p>}

      {!isLoading && ticketList.length === 0 && (
        <p className="text-gray-600">You have no tickets yet.</p>
      )}

      {!isLoading && ticketList.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ticketList.map((ticket) => (
            <div
              key={ticket.ticketId}
              className="border border-gray-200 rounded-lg shadow-sm p-4 bg-white hover:shadow-md transition-shadow"
            >
              <h3 className="text-lg font-semibold text-blue-700 mb-2">{ticket.subject}</h3>
              <p className="text-gray-700 mb-2">{ticket.description}</p>
              <p className="text-sm text-gray-500">Ticket ID: {ticket.ticketId}</p>
              <p className="text-sm text-gray-500">
                Created: {ticket.createdAt ? new Date(ticket.createdAt).toLocaleString() : 'N/A'}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserTicketsPage;
