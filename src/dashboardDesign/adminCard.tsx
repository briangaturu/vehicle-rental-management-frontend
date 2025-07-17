// src/components/DashboardCards.tsx
import React from 'react';
import { FaCar, FaUser, FaPlayCircle, FaArrowUp } from 'react-icons/fa';

const AdminCards: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
      <Card icon={<FaCar />} label="Total Vehicles" value="120" />
      <Card icon={<FaPlayCircle />} label="Active Bookings" value="43" />
      <Card icon={<FaUser />} label="Total Users" value="2,135" />
      <div className="bg-white p-4 rounded shadow">
        <div className="text-gray-500 text-sm">Monthly Revenue</div>
        <div className="text-xl font-bold mt-2">$45,300</div>
        <div className="text-green-500 text-sm mt-1 flex items-center">
          <FaArrowUp className="mr-1" /> +12% this month
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
