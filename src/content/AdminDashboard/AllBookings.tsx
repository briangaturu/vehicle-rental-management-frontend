import { toast, Toaster } from "sonner";
import Swal from "sweetalert2";
import {
  useGetAllBookingsQuery,
  useDeleteBookingMutation,
  type Booking,
} from "../../features/api/bookingsApi";

export const AllBookings = () => {
  const { data: bookingsData = [], isLoading, error } = useGetAllBookingsQuery();
  const [deleteBooking] = useDeleteBookingMutation();

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
            {bookingsData.length} {bookingsData.length === 1 ? "booking" : "bookings"}
          </span>
        </div>

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
                  <tr
                    key={booking.bookingId}
                    className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-gray-100`}
                  >
                    <td className="py-3 px-2 md:px-4 font-bold">#{booking.bookingId}</td>
                    <td className="py-3 px-2 md:px-4">
                      {new Date(booking.bookingDate).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-2 md:px-4">
                      {new Date(booking.returnDate).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-2 md:px-4 font-semibold text-green-600">
                      KSH {booking.totalAmount}
                    </td>
                    <td className="py-3 px-2 md:px-4">#{booking.vehicleId}</td>
                    <td className="py-3 px-2 md:px-4">#{booking.locationId}</td>
                    <td className="py-3 px-2 md:px-4">#{booking.userId}</td>
                    <td className="py-3 px-2 md:px-4">
                      <button
                        onClick={() => handleDeleteBooking(booking.bookingId)}
                        className="p-1 md:p-2 text-red-600 hover:bg-red-100 rounded-lg"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default AllBookings;
