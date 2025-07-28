import React, { useMemo } from "react";
import { useGetAllBookingsQuery } from "../../features/api/bookingsApi";

const LatestBookingsTable: React.FC = () => {
  const { data: bookingsData = [], isLoading, error } = useGetAllBookingsQuery();

  // Sort by newest and pick top 5
  const latestBookings = useMemo(() => {
    return [...bookingsData]
      .sort(
        (a, b) =>
          new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime()
      )
      .slice(0, 5);
  }, [bookingsData]);

  return (
    <div className="bg-white p-4 rounded shadow mt-4">
      <h3 className="text-base font-bold mb-3 text-gray-700">Latest Bookings</h3>

      {error ? (
        <p className="text-red-500 text-center">Error loading bookings.</p>
      ) : isLoading ? (
        <p className="text-gray-500 text-center">Loading latest bookings...</p>
      ) : latestBookings.length === 0 ? (
        <p className="text-gray-500 text-center">No recent bookings available.</p>
      ) : (
        <div className="overflow-y-auto max-h-48">
          <table className="min-w-full text-xs">
            <thead className="bg-blue-600">
              <tr>
                <th className="text-left py-2 px-3 text-white">Customer</th>
                <th className="text-left py-2 px-3 text-white">Vehicle</th>
                <th className="text-left py-2 px-3 text-white">Booking Date</th>
              </tr>
            </thead>
            <tbody>
              {latestBookings.map((booking, idx) => (
                <tr
                  key={booking.bookingId}
                  className={`${
                    idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                  } hover:bg-blue-50`}
                >
                  <td className="py-1 px-3">
                    {booking.user?.firstname} {booking.user?.lastname}
                  </td>
                  <td className="py-1 px-3">
                    {"vehicleId" in booking && booking.vehicleId && typeof booking.vehicleId === "object" && "name" in booking.vehicleId
                      ? (booking.vehicleId as { name?: string }).name ?? "N/A"
                      : "N/A"}
                  </td>
                  <td className="py-1 px-3 text-blue-700 font-semibold">
                    {new Date(booking.bookingDate).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default LatestBookingsTable;
