// ... (same imports as before)
import React, { useState } from "react";
import { FiEdit } from "react-icons/fi";
import { AiFillDelete } from "react-icons/ai";
import { useGetAllVehiclesQuery } from "../../features/api/vehiclesApi";
import { PuffLoader } from "react-spinners";
import Swal from "sweetalert2";
import { toast, Toaster } from "sonner";

export interface Vehicle {
  vehicleId: number;
  rentalRate: number;
  availability: string;
  vehicleSpecId: number;
  vehicleSpec?: {
    model?: string;
    brand?: string;
    color?: string;
    year?: number;
    fuelType?: string;
    engineCapacity?: string;
    transmission?: string;
    seatingCapacity?: number;
    features?: string;
  };
}

export const AllVehicles = () => {
  const { data: vehicles = [], error, isLoading } = useGetAllVehiclesQuery();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [newVehicle, setNewVehicle] = useState({
    rentalRate: "",
    availability: "Available",
    model: "",
    brand: "",
    color: "",
    year: "",
  });

  const handleDelete = (vehicleId: number) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This vehicle will be deleted permanently.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        // Call your delete API mutation here
        toast.success(`Vehicle ID ${vehicleId} deleted successfully!`);
      }
    });
  };

  const handleAddVehicle = async () => {
    const payload = {
      rentalRate: Number(newVehicle.rentalRate),
      availability: newVehicle.availability,
      vehicleSpec: {
        model: newVehicle.model,
        brand: newVehicle.brand,
        color: newVehicle.color,
        year: Number(newVehicle.year),
      },
    };

    try {
      const response = await fetch("http://localhost:5000/api/vehicles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Failed to add vehicle");

      toast.success("Vehicle added successfully!");
      setIsModalOpen(false);
      setNewVehicle({
        rentalRate: "",
        availability: "Available",
        model: "",
        brand: "",
        color: "",
        year: "",
      });
    } catch (error) {
      toast.error("Error adding vehicle");
      console.error(error);
    }
  };

  return (
    <>
      <Toaster richColors position="top-right" />
      <div className="bg-white border border-gray-200 shadow-md rounded-md p-6 mt-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-blue-950">All Vehicles</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-800"
          >
            + Add Vehicle
          </button>
        </div>

        {error && (
          <p className="text-red-600 font-semibold text-center">
            Error occurred while fetching vehicles.
          </p>
        )}

        {isLoading ? (
          <div className="flex justify-center">
            <PuffLoader color="#1e3a8a" />
          </div>
        ) : vehicles.length === 0 ? (
          <p className="text-gray-600 font-semibold text-center">
            No vehicles found.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-sm">
              <thead className="bg-blue-950 text-orange-400">
                <tr>
                  <th className="p-3 text-left">Vehicle ID</th>
                  <th className="p-3 text-left">Rental Rate (KSH)</th>
                  <th className="p-3 text-left">Availability</th>
                  <th className="p-3 text-left">Model</th>
                  <th className="p-3 text-left">Brand</th>
                  <th className="p-3 text-left">Color</th>
                  <th className="p-3 text-left">Year</th>
                  <th className="p-3 text-left">Fuel Type</th>
                  <th className="p-3 text-left">Engine</th>
                  <th className="p-3 text-left">Transmission</th>
                  <th className="p-3 text-left">Seats</th>
                  <th className="p-3 text-left">Features</th>
                  <th className="p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {vehicles.map((car: Vehicle) => (
                  <tr
                    key={car.vehicleId}
                    className="hover:bg-blue-50 border-t border-gray-200"
                  >
                    <td className="p-3 text-gray-700">{car.vehicleId}</td>
                    <td className="p-3 text-gray-700">KSH {car.rentalRate}</td>
                    <td className="p-3 text-gray-700">{car.availability}</td>
                    <td className="p-3 text-gray-700">{car.vehicleSpec?.model || "N/A"}</td>
                    <td className="p-3 text-gray-700">{car.vehicleSpec?.brand || "N/A"}</td>
                    <td className="p-3 text-gray-700">{car.vehicleSpec?.color || "N/A"}</td>
                    <td className="p-3 text-gray-700">{car.vehicleSpec?.year || "N/A"}</td>
                    <td className="p-3 text-gray-700">{car.vehicleSpec?.fuelType || "N/A"}</td>
                    <td className="p-3 text-gray-700">{car.vehicleSpec?.engineCapacity || "N/A"}</td>
                    <td className="p-3 text-gray-700">{car.vehicleSpec?.transmission || "N/A"}</td>
                    <td className="p-3 text-gray-700">{car.vehicleSpec?.seatingCapacity || "N/A"}</td>
                    <td className="p-3 text-gray-700 max-w-xs truncate" title={car.vehicleSpec?.features}>
                      {car.vehicleSpec?.features || "N/A"}
                    </td>
                    <td className="p-3 flex gap-2">
                      <button className="btn btn-sm border-blue-700 text-blue-700 hover:bg-blue-700 hover:text-white">
                        <FiEdit />
                      </button>
                      <button
                        className="btn btn-sm border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
                        onClick={() => handleDelete(car.vehicleId)}
                      >
                        <AiFillDelete />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Vehicle Modal remains unchanged... */}
    </>
  );
};

export default AllVehicles;
