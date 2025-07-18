import React, { useState } from "react";
import { FiEdit } from "react-icons/fi";
import { AiFillDelete } from "react-icons/ai";
import {
  useGetAllVehiclesQuery,
  useCreateVehicleMutation,
  useDeleteVehicleMutation,
} from "../../features/api/vehiclesApi";
import { PuffLoader } from "react-spinners";
import Swal from "sweetalert2";
import { toast, Toaster } from "sonner";

export interface Vehicle {
  vehicleId: number;
  rentalRate: number;
  availability: boolean; // backend returns boolean
  vehicleSpecId: number;
  vehicleSpec?: {
    manufacturer?: string;
    model?: string;
    color?: string;
    year?: number;
    fuelType?: string;
    engineCapacity?: string;
    transmission?: string;
    seatingCapacity?: number;
    features?: string;
    // brand?: string; // We expect this on the backend due to the error, but it's not in the UI
  };
}

export const AllVehicles = () => {
  const {
    data: vehicles = [],
    error,
    isLoading,
    refetch,
  } = useGetAllVehiclesQuery();
  const [createVehicle, { isLoading: isCreating }] = useCreateVehicleMutation();
  const [deleteVehicle, { isLoading: isDeleting }] = useDeleteVehicleMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [newVehicle, setNewVehicle] = useState({
    rentalRate: "",
    availability: "Available", // UI text; convert before send
    model: "",
    manufacturer: "", // REQUIRED by backend (and we'll use this for 'brand' temporarily)
    color: "",
    year: "",
    fuelType: "", // Will be dropdown
    engineCapacity: "",
    transmission: "", // Will be dropdown
    seatingCapacity: "",
    features: "",
  });

  const resetForm = () =>
    setNewVehicle({
      rentalRate: "",
      availability: "Available",
      model: "",
      manufacturer: "",
      color: "",
      year: "",
      fuelType: "", // Reset to default empty or a specific initial option
      engineCapacity: "",
      transmission: "", // Reset to default empty or a specific initial option
      seatingCapacity: "",
      features: "",
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
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteVehicle(vehicleId).unwrap();
          toast.success(`Vehicle ID ${vehicleId} deleted successfully!`);
          refetch();
        } catch (err: any) {
          console.error("Vehicle deletion failed:", err);
          toast.error(
            typeof err?.data?.error === "string"
              ? err.data.error
              : "Error deleting vehicle"
          );
        }
      }
    });
  };

  const handleAddVehicle = async () => {
    // Basic client-side checks
    if (!newVehicle.rentalRate || isNaN(Number(newVehicle.rentalRate))) {
      toast.error("Rental rate required and must be a number.");
      return;
    }
    if (!newVehicle.model.trim()) {
      toast.error("Model required.");
      return;
    }
    if (!newVehicle.manufacturer.trim()) {
      toast.error("Manufacturer is required.");
      return;
    }
    if (!newVehicle.year || isNaN(Number(newVehicle.year))) {
      toast.error("Year required and must be a number.");
      return;
    }
    if (!newVehicle.fuelType.trim()) {
      toast.error("Fuel Type required.");
      return;
    }
    if (!newVehicle.transmission.trim()) {
      toast.error("Transmission required.");
      return;
    }

    // Prepare payload
    const payload = {
      rentalRate: Number(newVehicle.rentalRate),
      availability: newVehicle.availability === "Available",
      vehicleSpec: {
        manufacturer: newVehicle.manufacturer.trim(),
        model: newVehicle.model.trim(),
        color: newVehicle.color.trim(),
        year: Number(newVehicle.year),
        fuelType: newVehicle.fuelType.trim(),
        engineCapacity: newVehicle.engineCapacity.trim(),
        transmission: newVehicle.transmission.trim(),
        seatingCapacity: Number(newVehicle.seatingCapacity) || 0,
        features: newVehicle.features.trim(),
        brand: newVehicle.manufacturer.trim(), // ⭐ ADDED: Sending manufacturer as brand for backend compatibility
      },
    };

    try {
      await createVehicle(payload).unwrap();
      toast.success("Vehicle added successfully!");
      setIsModalOpen(false);
      resetForm();
      refetch(); // Refresh list
    } catch (err: any) {
      console.error("Vehicle creation failed:", err);
      toast.error(
        typeof err?.data?.error === "string"
          ? err.data.error
          : "Error adding vehicle"
      );
    }
  };

  // Define options for dropdowns
  const fuelTypeOptions = ["Petrol", "Diesel", "Electric", "Hybrid"];
  const transmissionOptions = ["Manual", "Automatic"];

  return (
    <>
      <Toaster richColors position="top-right" />
      <div className="bg-white border border-gray-200 shadow-md rounded-md p-6 mt-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-blue-950">All Vehicles</h1>
          <button
            onClick={() => {
              setIsModalOpen(true);
              resetForm(); // Reset form when opening modal for new entry
            }}
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
                  <th className="p-3 text-left">Rental Rate</th>
                  <th className="p-3 text-left">Availability</th>
                  <th className="p-3 text-left">Model</th>
                  <th className="p-3 text-left">Manufacturer</th>
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
                    <td className="p-3">{car.vehicleId}</td>
                    <td className="p-3">KSH {car.rentalRate}</td>
                    <td className="p-3">
                      {car.availability ? "Available" : "Unavailable"}
                    </td>
                    <td className="p-3">{car.vehicleSpec?.model || "N/A"}</td>
                    <td className="p-3">
                      {car.vehicleSpec?.manufacturer || "N/A"}
                    </td>
                    <td className="p-3">{car.vehicleSpec?.color || "N/A"}</td>
                    <td className="p-3">{car.vehicleSpec?.year || "N/A"}</td>
                    <td className="p-3">{car.vehicleSpec?.fuelType || "N/A"}</td>
                    <td className="p-3">
                      {car.vehicleSpec?.engineCapacity || "N/A"}
                    </td>
                    <td className="p-3">
                      {car.vehicleSpec?.transmission || "N/A"}
                    </td>
                    <td className="p-3">
                      {car.vehicleSpec?.seatingCapacity || "N/A"}
                    </td>
                    <td
                      className="p-3 max-w-xs truncate"
                      title={car.vehicleSpec?.features}
                    >
                      {car.vehicleSpec?.features || "N/A"}
                    </td>
                    <td className="p-3 flex gap-2">
                      <button className="btn btn-sm border-blue-700 text-blue-700 hover:bg-blue-700 hover:text-white">
                        <FiEdit />
                      </button>
                      <button
                        className="btn btn-sm border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
                        onClick={() => handleDelete(car.vehicleId)}
                        disabled={isDeleting}
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

      {/* Add Vehicle Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[600px] max-h-[90vh] overflow-y-auto shadow-xl">
            <h2 className="text-xl font-bold mb-4 text-blue-900">
              Add New Vehicle
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <input
                type="number"
                placeholder="Rental Rate"
                value={newVehicle.rentalRate}
                onChange={(e) =>
                  setNewVehicle({ ...newVehicle, rentalRate: e.target.value })
                }
                className="border p-2 rounded"
              />
              <select
                value={newVehicle.availability}
                onChange={(e) =>
                  setNewVehicle({ ...newVehicle, availability: e.target.value })
                }
                className="border p-2 rounded"
              >
                <option value="Available">Available</option>
                <option value="Unavailable">Unavailable</option>
              </select>

              <input
                type="text"
                placeholder="Model"
                value={newVehicle.model}
                onChange={(e) =>
                  setNewVehicle({ ...newVehicle, model: e.target.value })
                }
                className="border p-2 rounded"
              />
              <input
                type="text"
                placeholder="Manufacturer"
                value={newVehicle.manufacturer}
                onChange={(e) =>
                  setNewVehicle({
                    ...newVehicle,
                    manufacturer: e.target.value,
                  })
                }
                className="border p-2 rounded"
              />

              <input
                type="text"
                placeholder="Color"
                value={newVehicle.color}
                onChange={(e) =>
                  setNewVehicle({ ...newVehicle, color: e.target.value })
                }
                className="border p-2 rounded"
              />
              <input
                type="number"
                placeholder="Year"
                value={newVehicle.year}
                onChange={(e) =>
                  setNewVehicle({ ...newVehicle, year: e.target.value })
                }
                className="border p-2 rounded"
              />
              {/* Fuel Type Dropdown */}
              <select
                value={newVehicle.fuelType}
                onChange={(e) =>
                  setNewVehicle({ ...newVehicle, fuelType: e.target.value })
                }
                className="border p-2 rounded"
              >
                <option value="">Select Fuel Type</option>
                {fuelTypeOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>

              <input
                type="text"
                placeholder="Engine Capacity (e.g., 2.0L, 2000cc)"
                value={newVehicle.engineCapacity}
                onChange={(e) =>
                  setNewVehicle({
                    ...newVehicle,
                    engineCapacity: e.target.value,
                  })
                }
                className="border p-2 rounded"
              />
              {/* Transmission Dropdown */}
              <select
                value={newVehicle.transmission}
                onChange={(e) =>
                  setNewVehicle({
                    ...newVehicle,
                    transmission: e.target.value,
                  })
                }
                className="border p-2 rounded"
              >
                <option value="">Select Transmission</option>
                {transmissionOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>

              <input
                type="number"
                placeholder="Seating Capacity"
                value={newVehicle.seatingCapacity}
                onChange={(e) =>
                  setNewVehicle({
                    ...newVehicle,
                    seatingCapacity: e.target.value,
                  })
                }
                className="border p-2 rounded"
              />
              <textarea
                placeholder="Features (e.g., Turbocharged, AWD, GPS)"
                value={newVehicle.features}
                onChange={(e) =>
                  setNewVehicle({ ...newVehicle, features: e.target.value })
                }
                className="border p-2 rounded col-span-2"
              />
            </div>

            <div className="mt-6 flex justify-end gap-4">
              <button
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button
                disabled={isCreating}
                className="px-4 py-2 bg-blue-900 text-white rounded hover:bg-blue-800 disabled:opacity-50"
                onClick={handleAddVehicle}
              >
                {isCreating ? "Saving..." : "Add Vehicle"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AllVehicles;