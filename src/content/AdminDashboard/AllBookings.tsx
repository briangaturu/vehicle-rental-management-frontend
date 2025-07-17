import React, { useState } from "react";
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
import { useSelector } from "react-redux";
import type { RootState } from "../../app/store";

export const AllBookings = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const {user} = useSelector((state:RootState)=>state.auth);

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

      <div className="text-2xl font-bold text-center mb-4 text-orange-500 flex justify-between items-center">
        All Bookings
        <button
          className="btn bg-red-600 text-white hover:bg-red-700"
          onClick={() => handleModalToggle()}
        >
          Add Booking
        </button>
      </div>

      {error ? (
        <div className="text-red-500 text-center">Error fetching bookings.</div>
      ) : isLoading ? (
        <div className="flex justify-center my-8">
          <PuffLoader color="#0aff13" />
        </div>
      ) : bookingsData.length === 0 ? (
        <div className="text-gray-500 text-center mt-6">
          No bookings found.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead className="bg-green-100 text-orange-600 uppercase">
              <tr>
                <th className="text-left">#</th>
                <th className="text-left">Booking Date</th>
                <th className="text-left">Return Date</th>
                <th className="text-left">Total Amount</th>
                <th className="text-left">Vehicle ID</th>
                <th className="text-left">Location ID</th>
                <th className="text-left">User ID</th>
                <th className="text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookingsData.map((booking) => (
                <tr key={booking.bookingId}>
                  <td className="text-blue-950 font-bold">{booking.bookingId}</td>
                  <td>{new Date(booking.bookingDate).toLocaleDateString()}</td>
                  <td>{new Date(booking.returnDate).toLocaleDateString()}</td>
                  <td className="text-green-600 font-semibold">
                    KSH {booking.totalAmount}
                  </td>
                  <td>{booking.vehicleId}</td>
                  <td>{booking.locationId}</td>
                  <td>{booking.userId}</td>
                  <td className="flex gap-2">
                    <button
                      onClick={() => handleModalToggle(booking)}
                      className="btn btn-sm btn-outline border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
                    >
                      <FiEdit />
                    </button>
                    <button
                      onClick={() => handleDeleteBooking(booking.bookingId)}
                      className="btn btn-sm btn-outline border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
                    >
                      <AiFillDelete />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="modal modal-open flex justify-center items-center bg-opacity-50 bg-black fixed inset-0 z-50">
          <div className="modal-box w-fit bg-white p-6 rounded shadow-xl">
            <div className="mb-4 text-center">
              <h2 className="text-2xl font-bold text-orange-500">
                {editingBooking ? "Edit Booking" : "Add New Booking"}
              </h2>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label text-orange-600">Booking Date</label>
                  <input
                    type="date"
                    className="input input-bordered w-full"
                    {...register("bookingDate", { required: true })}
                  />
                  {errors.bookingDate && (
                    <span className="text-red-500 text-xs">
                      Booking date is required
                    </span>
                  )}
                </div>
                <div>
                  <label className="label text-orange-600">Return Date</label>
                  <input
                    type="date"
                    className="input input-bordered w-full"
                    {...register("returnDate", { required: true })}
                  />
                  {errors.returnDate && (
                    <span className="text-red-500 text-xs">
                      Return date is required
                    </span>
                  )}
                </div>
                <div>
                  <label className="label text-orange-600">Total Amount</label>
                  <input
                    type="number"
                    step="0.01"
                    className="input input-bordered w-full"
                    {...register("totalAmount", { required: true })}
                  />
                  {errors.totalAmount && (
                    <span className="text-red-500 text-xs">
                      Total amount is required
                    </span>
                  )}
                </div>
                <div>
                  <label className="label text-orange-600">Vehicle ID</label>
                  <input
                    type="number"
                    className="input input-bordered w-full"
                    {...register("vehicleId", { required: true })}
                  />
                  {errors.vehicleId && (
                    <span className="text-red-500 text-xs">
                      Vehicle ID is required
                    </span>
                  )}
                </div>
                <div>
                  <label className="label text-orange-600">Location ID</label>
                  <input
                    type="number"
                    className="input input-bordered w-full"
                    {...register("locationId", { required: true })}
                  />
                  {errors.locationId && (
                    <span className="text-red-500 text-xs">
                      Location ID is required
                    </span>
                  )}
                </div>
                <div>
                  <label className="label text-orange-600">User ID</label>
                  <input
                    type="number"
                    className="input input-bordered w-full"
                    {...register("userId", { required: true })}
                  />
                  {errors.userId && (
                    <span className="text-red-500 text-xs">
                      User ID is required
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => handleModalToggle()}
                  className="btn btn-error"
                >
                  <FaTimes /> Cancel
                </button>
                <button type="submit" className="btn btn-primary flex gap-2">
                  <SaveIcon size={18} />
                  {editingBooking ? "Update Booking" : "Add Booking"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AllBookings;
