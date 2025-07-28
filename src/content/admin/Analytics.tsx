import React, { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useGetAllBookingsQuery } from '../../features/api/bookingsApi';

const COLORS = ['#f43f5e', '#0ea5e9', '#10b981', '#f59e0b', '#8b5cf6'];

const BookingsChart: React.FC = () => {
  const { data: bookings = [], isLoading, isError } = useGetAllBookingsQuery();

  // Line chart data (monthly trends)
  const monthlyData = useMemo(() => {
    const grouped: { [month: string]: number } = {};

    bookings.forEach((b) => {
      if (!b.createdAt) return;
      const date = new Date(b.createdAt);
      const month = date.toLocaleString('default', { month: 'short', year: 'numeric' });
      grouped[month] = (grouped[month] || 0) + 1;
    });

    return Object.entries(grouped)
      .map(([month, count]) => ({ month, count }))
      .sort((a, b) => {
        const getDateValue = (m: string) => new Date('1 ' + m).getTime();
        return getDateValue(a.month) - getDateValue(b.month);
      });
  }, [bookings]);

  // Pie chart data (distribution by vehicle or status)
  const pieData = useMemo(() => {
    const grouped: { [key: string]: number } = {};

    bookings.forEach((b) => {
      const status = b.status || 'Unknown'; // or b.vehicleType
      grouped[status] = (grouped[status] || 0) + 1;
    });

    return Object.entries(grouped).map(([status, value]) => ({ name: status, value }));
  }, [bookings]);

  return (
    <div className="bg-white border border-rose-200 p-4 rounded-xl shadow flex flex-col lg:flex-row gap-6">
      <div className="flex-1">
        <h2 className="text-xl font-semibold text-blue-700 mb-4">Monthly Booking Trends</h2>
        {isLoading ? (
          <p className="text-gray-500">Loading chart...</p>
        ) : isError ? (
          <p className="text-red-500">Failed to load booking data.</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#f43f5e"
                strokeWidth={2}
                dot={{ r: 4, strokeWidth: 2, fill: '#f43f5e' }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Pie Chart Section */}
      <div className="flex-1">
        <h2 className="text-xl font-semibold text-blue-700 mb-4">Booking Distribution</h2>
        {isLoading ? (
          <p className="text-gray-500">Loading chart...</p>
        ) : isError ? (
          <p className="text-red-500">Failed to load booking data.</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="status"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {pieData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default BookingsChart;
