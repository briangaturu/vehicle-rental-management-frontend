import React from 'react';

const vehicles = [
  { id: 1, model: 'Toyota Corolla', bookings: 48 },
  { id: 2, model: 'Honda Civic', bookings: 42 },
  { id: 3, model: 'Ford Focus', bookings: 37 },
  { id: 4, model: 'Nissan X-Trail', bookings: 33 },
  { id: 5, model: 'Hyundai Tucson', bookings: 29 },
];

const MostBookedVehiclesTable: React.FC = () => {
  return (
    <div className="bg-white p-4 rounded shadow mt-4">
      <h3 className="text-base font-bold mb-3 text-gray-700">
        Most Booked Vehicles
      </h3>

      <div className="overflow-y-auto max-h-48">
        <table className="min-w-full text-xs">
          <thead className="bg-green-600">
            <tr>
              <th className="text-left py-2 px-3 text-white">Vehicle</th>
              <th className="text-left py-2 px-3 text-white">Total Bookings</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map((v, idx) => (
              <tr
                key={v.id}
                className={`
                  ${idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
                  hover:bg-green-50
                `}
              >
                <td className="py-1 px-3">{v.model}</td>
                <td className="py-1 px-3 text-green-700 font-semibold">{v.bookings}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MostBookedVehiclesTable;
