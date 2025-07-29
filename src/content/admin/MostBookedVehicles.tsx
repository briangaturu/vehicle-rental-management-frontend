import React, { useMemo } from "react";
import { useGetAllBookingsQuery } from "../../features/api/bookingsApi";
import { useGetAllVehiclesQuery } from "../../features/api/vehiclesApi";



const MostBookedVehiclesTable: React.FC = () => {
  const { data: bookingsData = [], isLoading: loadingBookings, error } = useGetAllBookingsQuery();
  const { data: vehiclesData = [] } = useGetAllVehiclesQuery();
  

  
  const mostBookedVehicles = useMemo(() => {
    const counts: { [vehicleId: number]: { model: string; count: number } } = {};

    bookingsData.forEach((booking) => {
      const vehicle = vehiclesData.find((v: any) => v.vehicleId === booking.vehicleId);
      
      const model =
  (vehicle?.vehicleSpec?.model || vehicle?.vehicleSpec?.brand) ||
  `Vehicle #${booking.vehicleId}`;


      if (!counts[booking.vehicleId]) {
        counts[booking.vehicleId] = { model, count: 0 };
      }
      counts[booking.vehicleId].count += 1;
    });

    return Object.values(counts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [bookingsData, vehiclesData]);

  return (
    <div className="bg-white p-4 rounded shadow mt-4">
      <h3 className="text-base font-bold mb-3 text-gray-700">Most Booked Vehicles</h3>

      {error ? (
        <p className="text-red-500 text-center">Error loading data.</p>
      ) : loadingBookings ? (
        <p className="text-gray-500 text-center">Loading...</p>
      ) : mostBookedVehicles.length === 0 ? (
        <p className="text-gray-500 text-center">No booking data available.</p>
      ) : (
        <div className="overflow-y-auto max-h-48">
          <table className="min-w-full text-xs">
            <thead className="bg-green-600">
              <tr>
                <th className="text-left py-2 px-3 text-white">Vehicle</th>
                <th className="text-left py-2 px-3 text-white">Total Bookings</th>
              </tr>
            </thead>
            <tbody>
              {mostBookedVehicles.map((v, idx) => (
                <tr
                  key={idx}
                  className={`${
                    idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                  } hover:bg-green-50`}
                >
                  <td className="py-1 px-3">{v.model}</td>
                  <td className="py-1 px-3 text-green-700 font-semibold">{v.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MostBookedVehiclesTable;
