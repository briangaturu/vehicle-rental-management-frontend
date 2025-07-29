import { AiFillDelete } from "react-icons/ai";
import { SaveIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast, Toaster } from "sonner";
import Swal from "sweetalert2";
import { useState } from "react";
import {
  useGetAllTicketsQuery,
  useUpdateTicketMutation,
  useDeleteTicketMutation,
  type Ticket,
} from "../../features/api/supportTicketsApi";

type RespondPayload = {
  adminResponse: string;
};

const AllTickets = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  const { data: tickets, isLoading, error } = useGetAllTicketsQuery();
  const [updateTicket] = useUpdateTicketMutation();
  const [deleteTicket] = useDeleteTicketMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RespondPayload>();

  const handleModalToggle = (ticket?: Ticket) => {
    if (ticket) {
      setSelectedTicket(ticket);
      reset({ adminResponse: "" }); // Reset only response field
    } else {
      setSelectedTicket(null);
      reset();
    }
    setIsModalOpen(!isModalOpen);
  };

  const onSubmit = async (data: RespondPayload) => {
    const toastId = toast.loading("Sending response...");
    try {
      if (selectedTicket) {
        await updateTicket({
          ticketId: selectedTicket.ticketId,
          adminResponse: data.adminResponse,
        }).unwrap();
        toast.success("Response sent successfully!", { id: toastId });
      }
      setIsModalOpen(false);
      setSelectedTicket(null);
      reset();
    } catch (err: any) {
      toast.error("Failed: " + (err?.data?.message || "Something went wrong"), {
        id: toastId,
      });
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

      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md mt-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
          <h1 className="text-lg sm:text-2xl font-bold text-blue-950">
            All Tickets
          </h1>
          <span className="bg-green-100 text-red-500 text-xs sm:text-sm font-medium px-3 py-1 rounded-full">
            {tickets?.length || 0} {tickets?.length === 1 ? "ticket" : "tickets"}
          </span>
        </div>

        {/* Error / Loading / Empty States */}
        {error && (
          <div className="text-center py-8">
            <div className="text-red-400 text-5xl sm:text-6xl mb-4">⚠️</div>
            <p className="text-red-600 font-medium">Error loading tickets.</p>
          </div>
        )}

        {isLoading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Loading tickets...</p>
          </div>
        )}

        {!isLoading && !error && tickets?.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-5xl sm:text-6xl mb-4">🎫</div>
            <p className="text-gray-500 text-lg font-medium">No tickets found.</p>
            <p className="text-gray-400 text-sm">
              Support tickets will appear here once created.
            </p>
          </div>
        )}

        {/* Cards Grid */}
        {!isLoading && !error && tickets && tickets.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {tickets.map((ticket: Ticket) => (
              <div
                key={ticket.ticketId}
                className="bg-white border rounded-lg shadow hover:shadow-lg transition p-4 flex flex-col justify-between"
              >
                {/* Ticket Info */}
                <div>
                  <h2 className="text-lg font-bold text-blue-950 mb-2">
                    {ticket.subject}
                  </h2>
                  <p className="text-gray-600 text-sm mb-3">
                    {ticket.description.length > 80
                      ? ticket.description.slice(0, 80) + "..."
                      : ticket.description}
                  </p>
                </div>

                <div className="text-xs text-gray-500 space-y-1 mb-4">
                  <p>
                    <span className="font-semibold">Ticket ID:</span> #
                    {ticket.ticketId}
                  </p>
                  <p>
                    <span className="font-semibold">User ID:</span> #
                    {ticket.userId}
                  </p>
                  <p>
                    <span className="font-semibold">Created:</span>{" "}
                    {ticket.createdAt
                      ? new Date(ticket.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "N/A"}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex justify-between mt-auto pt-3 border-t border-gray-200">
                  <button
                    onClick={() => handleModalToggle(ticket)}
                    className="flex items-center gap-1 text-green-600 hover:bg-green-100 px-3 py-1 rounded-lg transition"
                  >
                    💬 Respond
                  </button>
                  <button
                    onClick={() => deleteTicketById(ticket.ticketId)}
                    className="flex items-center gap-1 text-red-500 hover:bg-red-100 px-3 py-1 rounded-lg transition"
                  >
                    <AiFillDelete size={16} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md sm:max-w-lg relative">
            <button
              onClick={() => handleModalToggle()}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-2xl"
            >
              &times;
            </button>

            <div className="p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">
                Respond to Ticket
              </h3>

              <div className="mb-4">
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Subject:</span>{" "}
                  {selectedTicket.subject}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Description:</span>{" "}
                  {selectedTicket.description}
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">
                    Your Response
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    rows={4}
                    {...register("adminResponse", { required: true })}
                    placeholder="Type your response to the user"
                  />
                  {errors.adminResponse && (
                    <p className="text-red-500 text-xs">Response is required</p>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => handleModalToggle()}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center justify-center"
                  >
                    <SaveIcon size={18} className="mr-2" />
                    Send Response
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

export default AllTickets;
