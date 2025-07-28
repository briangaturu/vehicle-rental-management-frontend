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
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md mt-6 sm:mt-8">
  {/* Header */}
  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mb-6">
    <h2 className="text-xl sm:text-2xl font-bold text-gray-900">My Support Tickets</h2>
    <span className="bg-blue-100 text-blue-800 text-xs sm:text-sm font-medium px-3 py-1 rounded-full">
      {ticketList.length} {ticketList.length === 1 ? 'ticket' : 'tickets'}
    </span>
  </div>

  {/* Create Ticket Button */}
  <button
    onClick={() => setIsModalOpen(true)}
    className="w-full sm:w-auto bg-[#0D1C49] text-white px-4 sm:px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium mb-6 flex items-center justify-center"
  >
    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
    </svg>
    Create New Ticket
  </button>

  {/* Modal */}
  {isModalOpen && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-[90%] max-w-md relative">
        <button
          onClick={() => setIsModalOpen(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl font-bold"
        >
          &times;
        </button>

        <div className="p-4 sm:p-6">
          <div className="flex items-center mb-6">
            <div className="bg-blue-100 p-2 rounded-lg mr-3">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900">Create Support Ticket</h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Subject</label>
              <input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Enter ticket subject..."
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                rows={4}
                placeholder="Describe your issue..."
                required
              ></textarea>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-full sm:w-auto px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-full sm:w-auto bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isCreating}
              >
                {isCreating ? 'Creating...' : 'Submit Ticket'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )}

  {/* Tickets Grid */}
  {!isLoading && ticketList.length > 0 && (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {ticketList.map((ticket) => (
        <div
          key={ticket.ticketId}
          className="bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-4 sm:p-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
            <h3 className="text-base sm:text-lg font-bold text-gray-900">{ticket.subject}</h3>
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-1 rounded-full mt-2 sm:mt-0">
              #{ticket.ticketId}
            </span>
          </div>
          <p className="text-gray-700 mb-4 text-sm sm:text-base line-clamp-3">{ticket.description}</p>
          <div className="pt-4 border-t border-gray-100 text-xs sm:text-sm text-gray-500 flex items-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {ticket.createdAt ? new Date(ticket.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            }) : 'N/A'}
          </div>
        </div>
      ))}
    </div>
  )}
</div>

  );
};

export default UserTicketsPage;
