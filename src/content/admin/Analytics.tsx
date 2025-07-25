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
} from 'recharts';
import { useGetAllBookingsQuery } from '../../features/api/bookingsApi';

const BookingsChart: React.FC = () => {
  const { data: bookings = [], isLoading, isError } = useGetAllBookingsQuery();

  const monthlyData = useMemo(() => {
    const grouped: { [month: string]: number } = {};

    bookings.forEach(b => {
      if (!b.createdAt) return;
      const date = new Date(b.createdAt);
      const month = date.toLocaleString('default', { month: 'short', year: 'numeric' });
      grouped[month] = (grouped[month] || 0) + 1;
    });

    return Object.entries(grouped)
      .map(([month, count]) => ({ month, count }))
      .sort((a, b) => {
        const getDateValue = (m: string) => new Date('1 ' + m).getTime(); // "1 Jan 2025"
        return getDateValue(a.month) - getDateValue(b.month);
      });
  }, [bookings]);

  return (
    <div className="bg-white border border-rose-200 p-4 rounded-xl shadow flex flex-col">
      <h2 className="text-xl font-semibold text-rose-700 mb-4">Monthly Booking Trends</h2>

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
  );
};

export default BookingsChart;
