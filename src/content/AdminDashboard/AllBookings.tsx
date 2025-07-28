import { useState } from "react";
import { FiEdit } from "react-icons/fi";
import { AiFillDelete } from "react-icons/ai";
import { SaveIcon } from "lucide-react";
import { toast, Toaster } from "sonner";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";
import {
  useGetAllBookingsQuery,
  useCreateBookingMutation,
  useUpdateBookingMutation,
  useDeleteBookingMutation,
  type Booking,
  type CreateBookingPayload,
} from "../../features/api/bookingsApi";

export const AllBookings = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);

  const { data: bookingsData = [], isLoading, error } = useGetAllBookingsQuery();
  const [createBooking] = useCreateBookingMutation();
  const [updateBooking] = useUpdateBookingMutation();
  const [deleteBooking] = useDeleteBookingMutation();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CreateBookingPayload>();

  const handleModalToggle = (booking?: Booking) => {
    if (booking) {
      setEditingBooking(booking);
      reset(booking);
    } else {
      setEditingBooking(null);
      reset();
    }
    setIsModalOpen(!isModalOpen);
  };

  const onSubmit = async (data: CreateBookingPayload) => {
    const toastId = toast.loading(editingBooking ? "Updating booking..." : "Creating booking...");
    try {
      if (editingBooking) {
        await updateBooking({ bookingId: editingBooking.bookingId, ...data }).unwrap();
        toast.success("Booking updated successfully!", { id: toastId });
      } else {
        await createBooking(data).unwrap();
        toast.success("Booking created successfully!", { id: toastId });
      }
      setIsModalOpen(false);
      reset();
    } catch (err: any) {
      toast.error(err?.data?.message || "An error occurred while saving booking.", { id: toastId });
    }
  };

  const handleDeleteBooking = async (bookingId: number) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This booking will be deleted permanently.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteBooking(bookingId).unwrap();
          toast.success("Booking deleted successfully!");
        } catch (error) {
          toast.error("Failed to delete booking. Please try again.");
        }
      }
    });
  };

  return (
    <>
      <Toaster richColors position="top-right" />

      <div className="bg-white p-4 md:p-6 rounded-lg shadow-md mt-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">All Bookings</h2>
          <span className="bg-blue-100 text-blue-800 text-xs md:text-sm font-medium px-3 py-1 rounded-full">
            {bookingsData.length} {bookingsData.length === 1 ? 'booking' : 'bookings'}
          </span>
        </div>

        <button
          className="bg-red-600 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium mb-6 flex items-center text-sm md:text-base"
          onClick={() => handleModalToggle()}
        >
          <svg className="w-4 h-4 md:w-5 md:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Booking
        </button>

        {error ? (
          <div className="text-center py-8">
            <p className="text-red-600 font-medium">Error fetching bookings.</p>
          </div>
        ) : isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Loading bookings...</p>
          </div>
        ) : bookingsData.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg font-medium">No bookings found.</p>
            <p className="text-gray-400 text-sm">Create your first booking to get started.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs md:text-sm">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="py-3 px-2 md:px-4">#</th>
                  <th className="py-3 px-2 md:px-4">Booking Date</th>
                  <th className="py-3 px-2 md:px-4">Return Date</th>
                  <th className="py-3 px-2 md:px-4">Amount</th>
                  <th className="py-3 px-2 md:px-4">Vehicle</th>
                  <th className="py-3 px-2 md:px-4">Location</th>
                  <th className="py-3 px-2 md:px-4">User</th>
                  <th className="py-3 px-2 md:px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookingsData.map((booking, index) => (
                  <tr key={booking.bookingId} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-gray-100`}>
                    <td className="py-3 px-2 md:px-4 font-bold">#{booking.bookingId}</td>
                    <td className="py-3 px-2 md:px-4">{new Date(booking.bookingDate).toLocaleDateString()}</td>
                    <td className="py-3 px-2 md:px-4">{new Date(booking.returnDate).toLocaleDateString()}</td>
                    <td className="py-3 px-2 md:px-4 font-semibold text-green-600">KSH {booking.totalAmount}</td>
                    <td className="py-3 px-2 md:px-4">#{booking.vehicleId}</td>
                    <td className="py-3 px-2 md:px-4">#{booking.locationId}</td>
                    <td className="py-3 px-2 md:px-4">#{booking.userId}</td>
                    <td className="py-3 px-2 md:px-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleModalToggle(booking)}
                          className="p-1 md:p-2 text-blue-600 hover:bg-blue-100 rounded-lg"
                        >
                          <FiEdit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteBooking(booking.bookingId)}
                          className="p-1 md:p-2 text-red-600 hover:bg-red-100 rounded-lg"
                        >
                          <AiFillDelete className="w-4 h-4" />
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

      {/* ✅ Responsive Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg sm:max-w-2xl relative">
            <button
              onClick={() => handleModalToggle()}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl font-bold"
            >
              &times;
            </button>

            <div className="p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold mb-4">
                {editingBooking ? "Edit Booking" : "Add New Booking"}
              </h2>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  {/* Booking Date */}
                  <div>
                    <label className="block text-sm font-semibold mb-2">Booking Date</label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      {...register("bookingDate", { required: true })}
                    />
                    {errors.bookingDate && <span className="text-red-500 text-xs">Required</span>}
                  </div>
                  {/* Return Date */}
                  <div>
                    <label className="block text-sm font-semibold mb-2">Return Date</label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      {...register("returnDate", { required: true })}
                    />
                    {errors.returnDate && <span className="text-red-500 text-xs">Required</span>}
                  </div>
                  {/* Amount */}
                  <div>
                    <label className="block text-sm font-semibold mb-2">Total Amount</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      {...register("totalAmount", { required: true })}
                    />
                  </div>
                  {/* Vehicle ID */}
                  <div>
                    <label className="block text-sm font-semibold mb-2">Vehicle ID</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      {...register("vehicleId", { required: true })}
                    />
                  </div>
                  {/* Location ID */}
                  <div>
                    <label className="block text-sm font-semibold mb-2">Location ID</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      {...register("locationId", { required: true })}
                    />
                  </div>
                  {/* User ID */}
                  <div>
                    <label className="block text-sm font-semibold mb-2">User ID</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      {...register("userId", { required: true })}
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => handleModalToggle()}
                    className="flex-1 px-4 py-3 border rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 flex items-center justify-center"
                  >
                    <SaveIcon size={18} className="mr-2" />
                    {editingBooking ? "Update Booking" : "Add Booking"}
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

export default AllBookings;
