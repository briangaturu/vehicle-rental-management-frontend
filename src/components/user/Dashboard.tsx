import React from "react";
import { FaShoppingCart, FaDollarSign, FaTicketAlt } from "react-icons/fa";
import { useSelector } from "react-redux";
import type { RootState } from "../../app/store";

import { useGetBookingsByUserIdQuery } from "../../features/api/bookingsApi";
import { useGetPaymentsByUserIdQuery } from "../../features/api/PaymentsApi";
import { useGetTicketsByUserIdQuery } from "../../features/api/supportTicketsApi";

const UserDashboard: React.FC = () => {
  const userId = useSelector((state: RootState) => state.auth.user?.id);

  // Fetch bookings
  const {
    data: bookings,
    isLoading: loadingBookings,
  } = useGetBookingsByUserIdQuery(userId!, { skip: !userId });

  // Fetch payments
  const {
    data: payments,
    isLoading: loadingPayments,
  } = useGetPaymentsByUserIdQuery(userId!, { skip: !userId });

  // Fetch tickets
  const {
    data: tickets,
    isLoading: loadingTickets,
  } = useGetTicketsByUserIdQuery(userId!, { skip: !userId });

  const totalBookings = Array.isArray(bookings) ? bookings.length : 0;
  const totalPayments = Array.isArray(payments) ? payments.length : 0;
  const totalTickets = Array.isArray(tickets) ? tickets.length : 0;

  const isLoading = loadingBookings || loadingPayments || loadingTickets;

  return (
    <div className="p-6 bg-white">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        User Dashboard
      </h1>

      {isLoading ? (
        <p className="text-gray-600">Loading dashboard data...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card
            title="My Bookings"
            value={totalBookings}
            icon={<FaShoppingCart className="text-white text-3xl" />}
            bgColor="bg-[#0D1C56]"
          />

          <Card
            title="My Payments"
            value={totalPayments}
            icon={<FaDollarSign className="text-white text-3xl" />}
            bgColor="bg-green-500"
          />

          <Card
            title="My Tickets"
            value={totalTickets}
            icon={<FaTicketAlt className="text-white text-3xl" />}
            bgColor="bg-red-500"
          />
        </div>
      )}
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
