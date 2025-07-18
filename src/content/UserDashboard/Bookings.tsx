import React from 'react';
import { FaPlus } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { RootState } from '../../app/store';

import {type Booking as BackendBooking } from '../../features/api/bookingsApi';
import { useGetVehicleByIdQuery } from '../../features/api/vehiclesApi';
import { useGetBookingsByUserIdQuery } from '../../features/api/bookingsApi';

interface DisplayBooking extends BackendBooking {
  vehicleName?: string;
  status: 'Pending' | 'Active' | 'Completed' | 'Cancelled';
}

const VehicleNameDisplay: React.FC<{ vehicleId: number }> = ({ vehicleId }) => {
  const { data: vehicle, isLoading, isError } = useGetVehicleByIdQuery(vehicleId);

  if (isLoading) return <span>Loading vehicle...</span>;
  if (isError) return <span>Error fetching vehicle</span>;
  if (!vehicle) return <span>Unknown Vehicle</span>;

  return <span>{vehicle.vehicleSpec?.brand} {vehicle.vehicleSpec?.model}</span>;
};


const BookingTable: React.FC = () => {
  const userId = useSelector((state: RootState) => state.auth.user?.id);
  const navigate = useNavigate();

  const {
    data: fetchedBookings,
    isLoading: isBookingsLoading,
    isError: isBookingsError,
    error: bookingsError,
    isFetching: isBookingsFetching,
  } = useGetBookingsByUserIdQuery(parseInt(userId as string), {
    skip: !userId || isNaN(parseInt(userId as string)),
  });

  const displayBookings: DisplayBooking[] = fetchedBookings?.map(booking => {
    let status: 'Pending' | 'Active' | 'Completed' | 'Cancelled' = 'Pending';
    const today = new Date();
    const returnDate = new Date(booking.returnDate);
    const bookingDate = new Date(booking.bookingDate);

    if (returnDate < today) {
      status = 'Completed';
    } else if (bookingDate <= today && returnDate >= today) {
      status = 'Active';
    }

    return {
      ...booking,
      status,
      totalAmount: parseFloat(booking.totalAmount as any),
    };
  }) || [];


  if (isBookingsLoading || isBookingsFetching) {
    return (
      <div className="bg-white p-6 rounded shadow mt-8">
        <p>Loading bookings...</p>
      </div>
    );
  }

  if (isBookingsError) {
    const errorMessage = (bookingsError as any)?.data?.error || 'Failed to fetch bookings.';
    return (
      <div className="bg-white p-6 rounded shadow mt-8">
        <p className="text-red-600">Error: {errorMessage}</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded shadow mt-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold">My Recent Bookings</h3>
        <button
          className="flex items-center bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm"
          onClick={() => navigate('/explore')}
        >
          <FaPlus className="mr-2" /> New Booking
        </button>
      </div>

      {displayBookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <table className="w-full text-sm">
          <thead className="text-left text-gray-600">
            <tr>
              <th className="py-2 px-4">Booking ID</th>
              <th className="py-2 px-4">Vehicle</th>
              <th className="py-2 px-4">Booking Date</th>
              <th className="py-2 px-4">Return Date</th>
              <th className="py-2 px-4">Status</th>
              <th className="py-2 px-4">Amount</th>
            </tr>
          </thead>
          <tbody>
            {displayBookings.map((booking) => (
              <tr key={booking.bookingId} className="border-t">
                <td className="py-2 px-4">{booking.bookingId}</td>
                <td className="py-2 px-4">
                  <VehicleNameDisplay vehicleId={booking.vehicleId} />
                </td>
                <td className="py-2 px-4">{new Date(booking.bookingDate).toLocaleDateString()}</td>
                <td className="py-2 px-4">{new Date(booking.returnDate).toLocaleDateString()}</td>
                <td
                  className={[
                    'py-2 px-4',
                    booking.status === 'Active' && 'text-green-600 font-semibold',
                    booking.status === 'Completed' && 'text-blue-600 font-semibold',
                    booking.status === 'Cancelled' && 'text-red-600 font-semibold',
                    booking.status === 'Pending' && 'text-yellow-600 font-semibold',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
                  {booking.status}
                </td>
                <td className="py-2 px-4">Ksh {booking.totalAmount.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default BookingTable;