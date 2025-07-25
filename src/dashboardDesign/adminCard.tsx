import React from 'react';
import { FaCar, FaUser, FaPlayCircle } from 'react-icons/fa';
import { useGetAllVehiclesQuery } from '../features/api/vehiclesApi';
import { useGetAllBookingsQuery } from '../features/api/bookingsApi';
import { useGetAllUsersProfilesQuery } from '../features/api/userApi';

const AdminCards: React.FC = () => {
  const { data: vehicles = [], isLoading: loadingVehicles } = useGetAllVehiclesQuery();
  const { data: bookings = [], isLoading: loadingBookings } = useGetAllBookingsQuery();
  const { data: users = [], isLoading: loadingUsers } = useGetAllUsersProfilesQuery();

  // Safely calculate total revenue
  const totalRevenue = bookings.reduce((sum, booking) => {
    const amount = Number(booking?.totalAmount) || 0;
    return sum + amount;
  }, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
      <Card
        icon={<FaCar />}
        label="Total Vehicles"
        value={loadingVehicles ? '...' : vehicles.length.toString()}
      />
      <Card
        icon={<FaPlayCircle />}
        label="All Bookings"
        value={loadingBookings ? '...' : bookings.length.toString()}
      />
      <Card
        icon={<FaUser />}
        label="Total Users"
        value={loadingUsers ? '...' : users.length.toString()}
      />
      <div className="bg-white p-4 rounded shadow">
        <div className="text-gray-500 text-sm">Total Revenue</div>
        <div className="text-xl font-bold mt-2">
          {loadingBookings ? '...' : `KES ${totalRevenue.toFixed(2)}`}
        </div>
        <div className="text-green-500 text-sm mt-1 flex items-center">
          
        </div>
      </div>
    </div>
  );
};

const Card: React.FC<{ icon: React.ReactNode; label: string; value: string }> = ({
  icon,
  label,
  value,
}) => (
  <div className="bg-white p-4 rounded shadow flex items-center space-x-4">
    <div className="text-blue-600">{icon}</div>
    <div>
      <div className="text-gray-500 text-sm">{label}</div>
      <div className="text-xl font-bold">{value}</div>
    </div>
  </div>
);

export default AdminCards;
