import React from "react";
import { useNavigate } from "react-router-dom";
import { FaGasPump, FaCogs, FaUsers, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { useGetAllVehiclesQuery } from "../../features/api/vehiclesApi";

const Fleet: React.FC = () => {
  const { data: vehicles, isLoading, isError } = useGetAllVehiclesQuery();
  const navigate = useNavigate();

  if (isLoading) {
    return <div className="text-center py-12 text-lg font-medium">Loading vehicles...</div>;
  }

  if (isError) {
    return <div className="text-center py-12 text-lg text-red-600">Failed to load vehicles.</div>;
  }

  // ✅ Only take first 3 vehicles
  const limitedVehicles = vehicles?.slice(0, 3) || [];

  return (
    <section className="py-12 bg-white">
      <h2 className="text-center text-3xl font-bold text-[#0D1C49] uppercase mb-8">
        Explore Our Fleet
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-6">
        {limitedVehicles.map((vehicle: any) => (
          <div
            key={vehicle.vehicleId}
            className="bg-gray-50 rounded-lg shadow-md overflow-hidden flex flex-col hover:shadow-xl transition-shadow duration-300"
          >
            {/* Image */}
            <div className="relative w-full h-48">
              <img
                src={
                  vehicle.imageUrl ||
                  `https://via.placeholder.com/400x250?text=${vehicle.vehicleSpec?.brand || ''}+${vehicle.vehicleSpec?.model || 'Car'}`
                }
                alt={`${vehicle.vehicleSpec?.brand || ''} ${vehicle.vehicleSpec?.model || 'Vehicle'}`}
                className="w-full h-full object-cover"
              />
              <button
                className="absolute bottom-3 right-3 bg-white text-[#001258] px-3 py-1 rounded-full text-xs font-semibold hover:bg-gray-200 transition-colors shadow-md"
                onClick={() => navigate("/explore")}
              >
                View
              </button>
            </div>

            {/* Details */}
            <div className="p-4 flex flex-col flex-grow">
              <h3 className="text-xl font-bold text-[#0F172A] mb-3 text-center">
                {vehicle.vehicleSpec?.brand} {vehicle.vehicleSpec?.model}
              </h3>

              <div className="grid grid-cols-2 gap-2 text-gray-700 text-sm mb-4">
                <div className="flex items-center space-x-2">
                  <FaGasPump className="text-red-600" />
                  <span>{vehicle.vehicleSpec?.fuelType || 'N/A'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FaCogs className="text-red-600" />
                  <span>{vehicle.vehicleSpec?.transmission || 'N/A'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FaUsers className="text-red-600" />
                  <span>{vehicle.vehicleSpec?.seatingCapacity || 'N/A'} Seats</span>
                </div>
                <div className="flex items-center space-x-2">
                  {vehicle.availability ? (
                    <>
                      <FaCheckCircle className="text-green-600" />
                      <span className="text-green-600 font-semibold">Available</span>
                    </>
                  ) : (
                    <>
                      <FaTimesCircle className="text-red-600" />
                      <span className="text-red-600 font-semibold">Not Available</span>
                    </>
                  )}
                </div>
              </div>

              <div className="mt-auto text-center">
                <span className="text-lg font-bold text-red-600 block mb-4">
                  Ksh {vehicle.rentalRate}/day
                </span>
                <button
                  className={`w-full py-2 px-4 rounded transition-colors ${
                    vehicle.availability
                      ? 'bg-red-600 hover:bg-red-700'
                      : 'bg-gray-400 cursor-not-allowed'
                  } text-white`}
                  disabled={!vehicle.availability}
                  onClick={() => navigate("/explore")}
                >
                  Book Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Fleet;
