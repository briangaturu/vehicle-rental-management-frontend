import { AiFillDelete } from "react-icons/ai";
import { FiEdit } from "react-icons/fi";
import { PuffLoader } from "react-spinners";
import { FaTimes } from "react-icons/fa";
import { SaveIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast, Toaster } from "sonner";
import Swal from "sweetalert2";
import { useState } from "react";
import {
  useGetAllTicketsQuery,
  useCreateTicketMutation,
  useUpdateTicketMutation,
  useDeleteTicketMutation,
  type Ticket,
  type CreateTicketPayload,
} from "../../features/api/supportTicketsApi";

const AdminTicketsTable = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTicket, setEditingTicket] = useState<Ticket | null>(null);

  const {
    data: tickets,
    isLoading,
    error,
  } = useGetAllTicketsQuery();

  const [createTicket] = useCreateTicketMutation();
  const [updateTicket] = useUpdateTicketMutation();
  const [deleteTicket] = useDeleteTicketMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateTicketPayload>();

  const handleModalToggle = (ticket?: Ticket) => {
    if (ticket) {
      setEditingTicket(ticket);
      reset(ticket);
    } else {
      setEditingTicket(null);
      reset();
    }
    setIsModalOpen(!isModalOpen);
  };

  const onSubmit = async (data: CreateTicketPayload) => {
    const toastId = toast.loading(
      editingTicket ? "Updating ticket..." : "Creating ticket..."
    );
    try {
      if (editingTicket) {
        await updateTicket({
          ticketId: editingTicket.ticketId,
          ...data,
        }).unwrap();
        toast.success("Ticket updated successfully!", { id: toastId });
      } else {
        await createTicket(data).unwrap();
        toast.success("Ticket created successfully!", { id: toastId });
      }
      setIsModalOpen(false);
      setEditingTicket(null);
      reset();
    } catch (err: any) {
      toast.error(
        "Failed: " + (err?.data?.message || "Something went wrong"),
        { id: toastId }
      );
    }
  };

  const deleteTicketById = (ticketId: number) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This ticket will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteTicket(ticketId).unwrap();
          toast.success("Ticket deleted successfully!");
          Swal.fire("Deleted!", "Ticket has been deleted.", "success");
        } catch (error: any) {
          Swal.fire("Something went wrong", "Please try again.", "error");
        }
      }
    });
  };

  return (
    <>
      <Toaster richColors position="top-right" />
      
      <div className="bg-white p-6 rounded-lg shadow-md mt-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-blue-950">All Tickets</h1>
          <span className="bg-green-100 text-red-500 text-sm font-medium px-3 py-1 rounded-full">
            {tickets?.length || 0} {tickets?.length === 1 ? 'ticket' : 'tickets'}
          </span>
        </div>

        <button
          onClick={() => handleModalToggle()}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition-colors duration-200 font-medium mb-6 flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Create Ticket
        </button>

        {error && (
          <div className="text-center py-8">
            <div className="text-red-400 text-6xl mb-4">⚠️</div>
            <p className="text-red-600 font-medium">Error loading tickets.</p>
          </div>
        )}

        {isLoading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Loading tickets...</p>
          </div>
        )}

        {!isLoading && !error && tickets?.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🎫</div>
            <p className="text-gray-500 text-lg font-medium">No tickets found.</p>
            <p className="text-gray-400 text-sm">Support tickets will appear here once they are created.</p>
          </div>
        )}

        {!isLoading && !error && tickets && tickets.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-4 px-4 font-semibold text-red-500 uppercase tracking-wider">#</th>
                  <th className="text-left py-4 px-4 font-semibold text-red-500 uppercase tracking-wider">Subject</th>
                  <th className="text-left py-4 px-4 font-semibold text-red-500 uppercase tracking-wider">Description</th>
                  <th className="text-left py-4 px-4 font-semibold text-red-500 uppercase tracking-wider">User ID</th>
                  <th className="text-left py-4 px-4 font-semibold text-red-500 uppercase tracking-wider">Created</th>
                  <th className="text-left py-4 px-4 font-semibold text-red-500 uppercase tracking-wider">Updated</th>
                  <th className="text-left py-4 px-4 font-semibold text-red-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {tickets.map((ticket: Ticket, index) => (
                  <tr key={ticket.ticketId} className={`hover:bg-green-50 transition-colors duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-green-50'}`}>
                    <td className="py-4 px-4 font-bold text-gray-900">#{ticket.ticketId}</td>
                    <td className="py-4 px-4 text-gray-700 font-medium">{ticket.subject}</td>
                    <td className="py-4 px-4 text-gray-700 max-w-xs">
                      <div className="truncate" title={ticket.description}>
                        {ticket.description}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-gray-700">#{ticket.userId}</td>
                    <td className="py-4 px-4 text-gray-700">
                      {ticket.createdAt
                        ? new Date(ticket.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })
                        : (
                          <span className="text-gray-400 italic">N/A</span>
                        )}
                    </td>
                    <td className="py-4 px-4 text-gray-700">
                      {ticket.updatedAt
                        ? new Date(ticket.updatedAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })
                        : (
                          <span className="text-gray-400 italic">N/A</span>
                        )}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleModalToggle(ticket)}
                          className="p-2 text-blue-700 hover:bg-blue-100 rounded-lg transition-colors duration-200"
                          title="Edit ticket"
                        >
                          <FiEdit size={18} />
                        </button>
                        <button
                          onClick={() => deleteTicketById(ticket.ticketId)}
                          className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition-colors duration-200"
                          title="Delete ticket"
                        >
                          <AiFillDelete size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg relative">
            <button
              onClick={() => handleModalToggle()}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl font-bold"
            >
              &times;
            </button>

            <div className="p-6">
              <div className="flex items-center mb-6">
                <div className="bg-green-100 p-2 rounded-lg mr-3">
                  <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  {editingTicket ? "Edit Ticket" : "Create New Ticket"}
                </h3>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                    {...register("subject", { required: true })}
                    placeholder="Enter ticket subject"
                  />
                  {errors.subject && (
                    <span className="text-red-500 text-xs mt-1 block">
                      Subject is required
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Description
                  </label>
                  <textarea
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                    rows={4}
                    {...register("description", { required: true })}
                    placeholder="Enter ticket description"
                  />
                  {errors.description && (
                    <span className="text-red-500 text-xs mt-1 block">
                      Description is required
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    User ID
                  </label>
                  <input
                    type="number"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                    {...register("userId", { required: true })}
                    placeholder="Enter user ID"
                  />
                  {errors.userId && (
                    <span className="text-red-500 text-xs mt-1 block">
                      User ID is required
                    </span>
                  )}
                </div>

                <div className="flex gap-3 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => handleModalToggle()}
                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="flex-1 bg-red-600 text-white px-4 py-3 rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center justify-center"
                  >
                    <SaveIcon size={18} className="mr-2" />
                    {editingTicket ? "Update Ticket" : "Create Ticket"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminTicketsTable;
