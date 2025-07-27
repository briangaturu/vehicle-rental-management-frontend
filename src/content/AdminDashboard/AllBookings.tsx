import { useState } from "react";
import { PuffLoader } from "react-spinners";
import { FiEdit } from "react-icons/fi";
import { AiFillDelete } from "react-icons/ai";
import { SaveIcon } from "lucide-react";
import { FaTimes } from "react-icons/fa";
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
 

  const {
    data: bookingsData = [],
    isLoading,
    error,
  } = useGetAllBookingsQuery();

  const [createBooking] = useCreateBookingMutation();
  const [updateBooking] = useUpdateBookingMutation();
  const [deleteBooking] = useDeleteBookingMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateBookingPayload>();

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
    const toastId = toast.loading(
      editingBooking ? "Updating booking..." : "Creating booking..."
    );

    try {
      if (editingBooking) {
        await updateBooking({
          bookingId: editingBooking.bookingId,
          ...data,
        }).unwrap();
        toast.success("Booking updated successfully!", { id: toastId });
      } else {
        await createBooking(data).unwrap();
        toast.success("Booking created successfully!", { id: toastId });
      }
      setIsModalOpen(false);
      reset();
    } catch (err: any) {
      toast.error(
        err?.data?.message || "An error occurred while saving booking.",
        { id: toastId }
      );
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

      <div className="bg-white p-6 rounded-lg shadow-md mt-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">All Bookings</h2>
          <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
            {bookingsData.length} {bookingsData.length === 1 ? 'booking' : 'bookings'}
          </span>
        </div>

        <button
          className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium mb-6 flex items-center"
          onClick={() => handleModalToggle()}
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Booking
        </button>

      {error ? (
        <div className="text-center py-8">
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <p className="text-red-600 font-medium">Error fetching bookings.</p>
        </div>
      ) : isLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading bookings...</p>
        </div>
      ) : bookingsData.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📋</div>
          <p className="text-gray-500 text-lg font-medium">No bookings found.</p>
          <p className="text-gray-400 text-sm">Create your first booking to get started.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-4 px-4 font-semibold text-gray-700 uppercase tracking-wider">#</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700 uppercase tracking-wider">Booking Date</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700 uppercase tracking-wider">Return Date</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700 uppercase tracking-wider">Total Amount</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700 uppercase tracking-wider">Vehicle ID</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700 uppercase tracking-wider">Location ID</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700 uppercase tracking-wider">User ID</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {bookingsData.map((booking, index) => (
                <tr key={booking.bookingId} className={`hover:bg-gray-50 transition-colors duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                  <td className="py-4 px-4 font-bold text-gray-900">#{booking.bookingId}</td>
                  <td className="py-4 px-4 text-gray-700">{new Date(booking.bookingDate).toLocaleDateString()}</td>
                  <td className="py-4 px-4 text-gray-700">{new Date(booking.returnDate).toLocaleDateString()}</td>
                  <td className="py-4 px-4 font-semibold text-green-600">KSH {booking.totalAmount}</td>
                  <td className="py-4 px-4 text-gray-700">#{booking.vehicleId}</td>
                  <td className="py-4 px-4 text-gray-700">#{booking.locationId}</td>
                  <td className="py-4 px-4 text-gray-700">#{booking.userId}</td>
                  <td className="py-4 px-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleModalToggle(booking)}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors duration-200"
                        title="Edit booking"
                      >
                        <FiEdit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteBooking(booking.bookingId)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors duration-200"
                        title="Delete booking"
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl relative">
            <button
              onClick={() => handleModalToggle()}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl font-bold"
            >
              &times;
            </button>

            <div className="p-6">
              <div className="flex items-center mb-6">
                <div className="bg-blue-100 p-2 rounded-lg mr-3">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-gray-900">
                  {editingBooking ? "Edit Booking" : "Add New Booking"}
                </h2>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Booking Date</label>
                    <input
                      type="date"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      {...register("bookingDate", { required: true })}
                    />
                    {errors.bookingDate && (
                      <span className="text-red-500 text-xs mt-1 block">
                        Booking date is required
                      </span>
                    )}
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Return Date</label>
                    <input
                      type="date"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      {...register("returnDate", { required: true })}
                    />
                    {errors.returnDate && (
                      <span className="text-red-500 text-xs mt-1 block">
                        Return date is required
                      </span>
                    )}
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Total Amount</label>
                    <input
                      type="number"
                      step="0.01"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="0.00"
                      {...register("totalAmount", { required: true })}
                    />
                    {errors.totalAmount && (
                      <span className="text-red-500 text-xs mt-1 block">
                        Total amount is required
                      </span>
                    )}
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Vehicle ID</label>
                    <input
                      type="number"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Enter vehicle ID"
                      {...register("vehicleId", { required: true })}
                    />
                    {errors.vehicleId && (
                      <span className="text-red-500 text-xs mt-1 block">
                        Vehicle ID is required
                      </span>
                    )}
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Location ID</label>
                    <input
                      type="number"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Enter location ID"
                      {...register("locationId", { required: true })}
                    />
                    {errors.locationId && (
                      <span className="text-red-500 text-xs mt-1 block">
                        Location ID is required
                      </span>
                    )}
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">User ID</label>
                    <input
                      type="number"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Enter user ID"
                      {...register("userId", { required: true })}
                    />
                    {errors.userId && (
                      <span className="text-red-500 text-xs mt-1 block">
                        User ID is required
                      </span>
                    )}
                  </div>
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
                    className="flex-1 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center"
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
