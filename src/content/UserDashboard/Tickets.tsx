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
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mb-6"
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
        <table className="w-full border border-gray-300 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Subject</th>
              <th className="p-2 border">Description</th>
              <th className="p-2 border">Ticket ID</th>
              <th className="p-2 border">Created</th>
            </tr>
          </thead>
          <tbody>
            {ticketList.map((ticket) => (
              <tr key={ticket.ticketId} className="hover:bg-gray-50">
                <td className="p-2 border">{ticket.subject}</td>
                <td className="p-2 border">{ticket.description}</td>
                <td className="p-2 border">{ticket.ticketId}</td>
                <td className="p-2 border">
                  {ticket.createdAt ? new Date(ticket.createdAt).toLocaleString() : 'N/A'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UserTicketsPage;
