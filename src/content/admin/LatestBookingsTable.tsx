import React from 'react';

const bookings = [
  { id: 1, customer: 'John Doe', vehicle: 'Toyota Corolla', date: '2025-07-14' },
  { id: 2, customer: 'Jane Smith', vehicle: 'Honda Civic', date: '2025-07-13' },
  { id: 3, customer: 'Mike Brown', vehicle: 'Ford Focus', date: '2025-07-12' },
  { id: 4, customer: 'Sarah Lee', vehicle: 'Nissan X-Trail', date: '2025-07-11' },
  { id: 5, customer: 'Ali Khan', vehicle: 'Hyundai Tucson', date: '2025-07-10' },
];

const LatestBookingsTable: React.FC = () => {
  return (
    <div className="bg-white p-4 rounded shadow mt-4">
      <h3 className="text-base font-bold mb-3 text-gray-700">
        Latest Bookings
      </h3>

      <div className="overflow-y-auto max-h-48">
        <table className="min-w-full text-xs">
          <thead className="bg-blue-600">
            <tr>
              <th className="text-left py-2 px-3 text-white">Customer</th>
              <th className="text-left py-2 px-3 text-white">Vehicle</th>
              <th className="text-left py-2 px-3 text-white">Date</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking, idx) => (
              <tr
                key={booking.id}
                className={`
                  ${idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
                  hover:bg-blue-50
                `}
              >
                <td className="py-1 px-3">{booking.customer}</td>
                <td className="py-1 px-3">{booking.vehicle}</td>
                <td className="py-1 px-3 text-blue-700 font-semibold">{booking.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LatestBookingsTable;
