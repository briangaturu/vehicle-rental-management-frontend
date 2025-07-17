import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaPlus } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'; // ← Import this
import type { RootState } from '../../app/store';

type Booking = {
  bookingId: number;
  vehicle: string;
  status: string;
  totalAmount: number;
};

const BookingTable: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate(); // ← Hook to navigate

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const userId = user?.id;

        if (!userId) {
          setError('User not found.');
          setLoading(false);
          return;
        }

        const response = await axios.get(`/api/bookings/user/${userId}`);
        const fetchedBookings = Array.isArray(response.data)
          ? response.data
          : response.data.bookings || [];

        setBookings(fetchedBookings);
      } catch (error: any) {
        console.error(error);
        setError(error.response?.data?.error || 'Failed to fetch bookings.');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user]);

  return (
    <div className="bg-white p-6 rounded shadow mt-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold">My Recent Bookings</h3>
        <button
          className="flex items-center bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm"
          onClick={() => navigate('/explore')} // ← Navigate to Explore page
        >
          <FaPlus className="mr-2" /> New Booking
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <table className="w-full text-sm">
          <thead className="text-left text-gray-600">
            <tr>
              <th>Booking ID</th>
              <th>Vehicle</th>
              <th>Status</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.bookingId} className="border-t">
                <td>{booking.bookingId}</td>
                <td>{booking.vehicle}</td>
                <td
                  className={[
                    booking.status === 'Active' && 'text-green-600 font-semibold',
                    booking.status === 'Completed' && 'text-blue-600 font-semibold',
                    booking.status === 'Cancelled' && 'text-red-600 font-semibold',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
                  {booking.status}
                </td>
                <td>${booking.totalAmount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default BookingTable;
