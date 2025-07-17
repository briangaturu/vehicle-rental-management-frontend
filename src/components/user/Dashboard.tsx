import React from "react";
import { FaShoppingCart, FaDollarSign, FaTicketAlt } from "react-icons/fa";

const UserDashboard: React.FC = () => {
  // Example data - replace with real data fetched from backend or Redux store
  const totalBookings = 12;
  const totalPayments = 4;
  const totalTickets = 2;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        User Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Bookings Card */}
        <Card
          title="My Bookings"
          value={totalBookings}
          icon={<FaShoppingCart className="text-white text-3xl" />}
          bgColor="bg-blue-500"
        />

        {/* Payments Card */}
        <Card
          title="My Payments"
          value={totalPayments}
          icon={<FaDollarSign className="text-white text-3xl" />}
          bgColor="bg-green-500"
        />

        {/* Tickets Card */}
        <Card
          title="My Tickets"
          value={totalTickets}
          icon={<FaTicketAlt className="text-white text-3xl" />}
          bgColor="bg-red-500"
        />
      </div>
    </div>
  );
};

interface CardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  bgColor: string;
}

const Card: React.FC<CardProps> = ({ title, value, icon, bgColor }) => {
  return (
    <div
      className={`rounded-xl shadow p-6 flex items-center justify-between ${bgColor} text-white`}
    >
      <div>
        <h2 className="text-xl font-semibold">{title}</h2>
        <p className="text-3xl font-bold mt-2">{value}</p>
      </div>
      <div>{icon}</div>
    </div>
  );
};

export default UserDashboard;
