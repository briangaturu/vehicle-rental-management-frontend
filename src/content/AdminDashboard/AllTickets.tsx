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
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-blue-950">All Tickets</h1>
        <button
          onClick={() => handleModalToggle()}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
        >
          Create Ticket
        </button>
      </div>

      {error && (
        <p className="text-red-600 font-semibold">Error loading tickets.</p>
      )}

      {isLoading && (
        <span>
          <PuffLoader color="black" />
        </span>
      )}

      {!isLoading && !error && tickets?.length === 0 && (
        <p className="text-gray-600 font-semibold">No tickets found.</p>
      )}

      {!isLoading && !error && tickets && tickets.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-300">
            <thead className="bg-green-100">
              <tr>
                <th className="text-red-500 border border-gray-300 p-2">#</th>
                <th className="text-red-500 border border-gray-300 p-2">Subject</th>
                <th className="text-red-500 border border-gray-300 p-2">Description</th>
                <th className="text-red-500 border border-gray-300 p-2">User ID</th>
                <th className="text-red-500 border border-gray-300 p-2">Created</th>
                <th className="text-red-500 border border-gray-300 p-2">Updated</th>
                <th className="text-red-500 border border-gray-300 p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((ticket: Ticket) => (
                <tr
                  key={ticket.ticketId}
                  className="hover:bg-blue-200 transition"
                >
                  <td className="border border-gray-300 p-2">
                    {ticket.ticketId}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {ticket.subject}
                  </td>
                  <td className="border border-gray-300 p-2 max-w-xs truncate">
                    {ticket.description}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {ticket.userId}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {ticket.createdAt
                      ? new Date(ticket.createdAt).toLocaleString()
                      : "N/A"}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {ticket.updatedAt
                      ? new Date(ticket.updatedAt).toLocaleString()
                      : "N/A"}
                  </td>
                  <td className="border border-gray-300 p-2 flex gap-2">
                    <button
                      onClick={() => handleModalToggle(ticket)}
                      className="text-blue-700 hover:text-blue-500 p-1"
                    >
                      <FiEdit size={18} />
                    </button>
                    <button
                      onClick={() => deleteTicketById(ticket.ticketId)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <AiFillDelete size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded shadow-lg w-full max-w-md p-6">
            <h2 className="text-xl font-bold text-blue-900 mb-4">
              {editingTicket ? "Edit Ticket" : "Create New Ticket"}
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-gray-700 font-semibold">
                  Subject
                </label>
                <input
                  type="text"
                  className="border w-full p-2 rounded focus:outline-none focus:ring focus:ring-blue-300"
                  {...register("subject", { required: true })}
                />
                {errors.subject && (
                  <span className="text-red-500 text-sm">
                    Subject is required
                  </span>
                )}
              </div>

              <div>
                <label className="block text-gray-700 font-semibold">
                  Description
                </label>
                <textarea
                  className="border w-full p-2 rounded focus:outline-none focus:ring focus:ring-blue-300"
                  rows={3}
                  {...register("description", { required: true })}
                />
                {errors.description && (
                  <span className="text-red-500 text-sm">
                    Description is required
                  </span>
                )}
              </div>

              <div>
                <label className="block text-gray-700 font-semibold">
                  User ID
                </label>
                <input
                  type="number"
                  className="border w-full p-2 rounded focus:outline-none focus:ring focus:ring-blue-300"
                  {...register("userId", { required: true })}
                />
                {errors.userId && (
                  <span className="text-red-500 text-sm">
                    User ID is required
                  </span>
                )}
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => handleModalToggle()}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
                >
                  <FaTimes className="inline mr-1" /> Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded flex items-center"
                >
                  <SaveIcon className="mr-2" size={18} />
                  {editingTicket ? "Update Ticket" : "Create Ticket"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminTicketsTable;
