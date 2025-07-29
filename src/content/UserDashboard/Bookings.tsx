import React, { useEffect } from 'react';
import { FaPlus } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import type { RootState } from '../../app/store';

import { type Booking as BackendBooking } from '../../features/api/bookingsApi';
import { useGetVehicleByIdQuery } from '../../features/api/vehiclesApi';
import { useGetBookingsByUserIdQuery } from '../../features/api/bookingsApi';
import { StripeCheckoutButton } from '../Explore/payments';

interface DisplayBooking extends BackendBooking {
  vehicleName?: string;
  status: 'Pending' | 'Active' | 'Completed' | 'Cancelled' | 'Confirmed';
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
  const location = useLocation();

  const {
    data: fetchedBookings,
    isLoading: isBookingsLoading,
    isError: isBookingsError,
    error: bookingsError,
    isFetching: isBookingsFetching,
    refetch,
  } = useGetBookingsByUserIdQuery((userId), {
    skip: !userId || isNaN((userId)),
  });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('payment') === 'success') {
      refetch();
    }
  }, [location.search, refetch]);

  const displayBookings: DisplayBooking[] =
    fetchedBookings?.map((booking:any) => {
      let status: 'Pending' | 'Active' | 'Completed' | 'Cancelled' | 'Confirmed' = 'Pending';
      const today = new Date();
      const returnDate = new Date(booking.returnDate);
      const bookingDate = new Date(booking.bookingDate);

      if (booking.bookingStatus === 'Confirmed') {
        status = 'Confirmed';
      } else if (booking.bookingStatus === 'Cancelled') {
        status = 'Cancelled';
      } else {
        const isPaid = booking.bookingStatus === 'Confirmed';
        const isCurrentlyActive = bookingDate <= today && returnDate >= today;
        const isCompleted = returnDate < today;

        if (!isPaid) {
          status = 'Pending';
        } else if (isCompleted) {
          status = 'Completed';
        } else if (isCurrentlyActive) {
          status = 'Active';
        } else {
          status = 'Pending';
        }
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

  const pendingBookings = displayBookings.filter((b) => b.status === 'Pending');

  return (
    <div className="bg-white p-6 rounded shadow mt-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
        <h3 className="text-lg font-bold">My Recent Bookings</h3>
        <button
          className="flex items-center bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm w-full sm:w-auto justify-center"
          onClick={() => navigate('/explore')}
        >
          <FaPlus className="mr-2" /> New Booking
        </button>
      </div>

      {/* Pending Bookings as Cards */}
      {pendingBookings.length > 0 && (
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center mb-4 gap-2">
            <h4 className="text-lg font-bold text-gray-800">Pending Payments</h4>
            <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
              {pendingBookings.length} {pendingBookings.length === 1 ? 'booking' : 'bookings'}
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pendingBookings.map((booking) => (
              <div
                key={booking.bookingId}
                className="bg-white border border-gray-200 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <h5 className="font-bold text-gray-900 text-lg">Booking #{booking.bookingId}</h5>
                  <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-1 rounded-full">
                    Pending
                  </span>
                </div>

                <div className="space-y-3 mb-4 text-sm">
                  <div className="flex flex-col sm:flex-row">
                    <span className="text-gray-500 font-medium w-20">Vehicle:</span>
                    <span className="text-gray-900 font-semibold">
                      <VehicleNameDisplay vehicleId={booking.vehicleId} />
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row">
                    <span className="text-gray-500 font-medium w-20">Dates:</span>
                    <span className="text-gray-900">
                      {new Date(booking.bookingDate).toLocaleDateString()} -{' '}
                      {new Date(booking.returnDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row">
                    <span className="text-gray-500 font-medium w-20">Amount:</span>
                    <span className="text-gray-900 font-bold">Ksh {booking.totalAmount.toFixed(2)}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-100">
                  <StripeCheckoutButton
                    amount={booking.totalAmount}
                    bookingId={booking.bookingId}
                    userId={userId}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Responsive Table */}
      {displayBookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[650px]">
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
                      booking.status === 'Confirmed' && 'text-green-800 font-bold',
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
        </div>
      )}
    </div>
  );
};

export default BookingTable;
