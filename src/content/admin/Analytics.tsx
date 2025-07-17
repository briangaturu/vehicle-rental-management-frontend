
import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const data = [
  { month: 'Jan', bookings: 5 },
  { month: 'Feb', bookings: 18 },
  { month: 'Mar', bookings: 15 },
  { month: 'Apr', bookings: 22 },
  { month: 'May', bookings: 25 },
  { month: 'Jun', bookings: 30 },
  { month: 'Jul', bookings: 42 },
  { month: 'Aug', bookings: 38 },
  { month: 'Sep', bookings: 35 },
  { month: 'Oct', bookings: 40 },
  { month: 'Nov', bookings: 32 },
  { month: 'Dec', bookings: 45 },
];

const BookingsChart: React.FC = () => {
  return (
    <div className="bg-white p-4 rounded shadow mt-6">
      <h3 className="text-lg font-bold mb-4">Bookings Over Time</h3>

      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid stroke="#E2E8F0" strokeDasharray="3 3" />
            <XAxis dataKey="month" stroke="#475569" />
            <YAxis stroke="#475569" />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="bookings"
              stroke="#3B82F6"
              strokeWidth={3}
              dot={{ r: 4, strokeWidth: 2, fill: '#3B82F6' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BookingsChart;
