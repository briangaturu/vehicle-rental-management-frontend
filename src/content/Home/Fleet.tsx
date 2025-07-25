import React from "react";
import { useNavigate } from "react-router-dom";
import { useGetAllVehiclesQuery } from "../../features/api/vehiclesApi"; // adjust path as needed

const Fleet: React.FC = () => {
  const { data: vehicles, isLoading, isError } = useGetAllVehiclesQuery();
  const navigate = useNavigate();

  if (isLoading) {
    return <div className="text-center py-12 text-lg font-medium">Loading vehicles...</div>;
  }

  if (isError) {
    return <div className="text-center py-12 text-lg text-red-600">Failed to load vehicles.</div>;
  }

  return (
    <section className="py-12 bg-white">
      <h2 className="text-center text-3xl font-bold text-[#0D1C49] uppercase mb-8">
        Explore Our Fleet
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-8">
        {vehicles?.map((car: any) => (
          <div
            key={car.vehicleId}
            className="bg-white border border-gray-200 shadow hover:shadow-lg transition duration-300 flex flex-col h-full"
          >
            <img
              src={car.imageUrl || "/fallback.jpg"}
              alt={car.name}
              className="w-full h-[250px] object-cover"
            />
            <div className="flex-grow flex flex-col justify-between p-4 text-center">
              <div>
                <h3 className="text-lg font-bold capitalize text-gray-900">{car.name}</h3>
                <p className="text-gray-700">Ksh {car.rentalRate}/day</p>
              </div>
              <button
                onClick={() => navigate("/explore")}
                className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded w-full"
              >
                View
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Fleet;
