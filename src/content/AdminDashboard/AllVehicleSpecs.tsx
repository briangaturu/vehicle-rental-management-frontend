import React, { useState, useEffect } from "react";
import { FiEdit } from "react-icons/fi";
import { AiFillDelete } from "react-icons/ai";
import { PuffLoader } from "react-spinners";
import Swal from "sweetalert2";
import { toast, Toaster } from "sonner";

import {
  useGetAllVehicleSpecsQuery,
  useCreateVehicleSpecMutation,
  useUpdateVehicleSpecMutation,
  useDeleteVehicleSpecMutation,
  type VehicleSpec, 
  type CreateVehicleSpecPayload, 
  type UpdateVehicleSpecPayload,
} from "../../features/api/vehicleSpecsApi"; 

export const AllVehicleSpecs = () => {
  const {
    data: vehicleSpecs = [],
    error,
    isLoading,
    refetch,
  } = useGetAllVehicleSpecsQuery();
  const [createVehicleSpec, { isLoading: isCreating }] = useCreateVehicleSpecMutation();
  const [updateVehicleSpec, { isLoading: isUpdating }] = useUpdateVehicleSpecMutation();
  const [deleteVehicleSpec, { isLoading: isDeleting }] = useDeleteVehicleSpecMutation();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentSpec, setCurrentSpec] = useState<VehicleSpec | null>(null);

  // State for new spec form - NOW USES 'manufacturer'
  const [newSpecForm, setNewSpecForm] = useState<CreateVehicleSpecPayload>({
    manufacturer: "", // Changed from 'brand' to 'manufacturer'
    model: "",
    year: new Date().getFullYear(), // Default to current year
    fuelType: "",
    engineCapacity: "",
    transmission: "",
    seatingCapacity: 5, // Default value
    color: "",
    features: "",
  });

  // State for edit spec form - NOW USES 'manufacturer'
  const [editSpecForm, setEditSpecForm] = useState<UpdateVehicleSpecPayload>({
    manufacturer: "", // Changed from 'brand' to 'manufacturer'
    model: "",
    year: undefined,
    fuelType: "",
    engineCapacity: "",
    transmission: "",
    seatingCapacity: undefined,
    color: "",
    features: "",
  });

  // Reset add form
  const resetAddForm = () => {
    setNewSpecForm({
      manufacturer: "", // Changed from 'brand' to 'manufacturer'
      model: "",
      year: new Date().getFullYear(),
      fuelType: "",
      engineCapacity: "",
      transmission: "",
      seatingCapacity: 5,
      color: "",
      features: "",
    });
  };

  useEffect(() => {
    if (currentSpec) {
      setEditSpecForm({
        manufacturer: currentSpec.manufacturer, 
        model: currentSpec.model,
        year: currentSpec.year,
        fuelType: currentSpec.fuelType,
        engineCapacity: currentSpec.engineCapacity,
        transmission: currentSpec.transmission,
        seatingCapacity: currentSpec.seatingCapacity,
        color: currentSpec.color,
        features: currentSpec.features,
      });
    } else {
      // Reset edit form if no spec is selected
      setEditSpecForm({
        manufacturer: "", // Changed from 'brand' to 'manufacturer'
        model: "",
        year: undefined,
        fuelType: "",
        engineCapacity: "",
        transmission: "",
        seatingCapacity: undefined,
        color: "",
        features: "",
      });
    }
  }, [currentSpec]);

  const handleDelete = (specId: number) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This vehicle specification will be deleted permanently.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteVehicleSpec(specId).unwrap();
          toast.success(`Vehicle Spec ID ${specId} deleted successfully!`);
          refetch(); // Refetch all specs after deletion
        } catch (err: any) {
          console.error("Vehicle spec deletion failed:", err);
          toast.error(
            typeof err?.data?.error === "string"
              ? err.data.error
              : "Error deleting vehicle spec"
          );
        }
      }
    });
  };

  const handleCreateSpec = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic client-side validation for required fields - NOW USES 'manufacturer'
    const requiredFields: (keyof CreateVehicleSpecPayload)[] = [
      "manufacturer", "model", "year", "fuelType", "engineCapacity",
      "transmission", "seatingCapacity", "color", "features"
    ];
    for (const field of requiredFields) {
      if (typeof newSpecForm[field] === 'string' && !newSpecForm[field].trim()) {
        toast.error(`Please fill in the '${field}' field.`);
        return;
      }
      if (typeof newSpecForm[field] === 'number' && (newSpecForm[field] === null || newSpecForm[field] === undefined)) {
         toast.error(`Please fill in the '${field}' field.`);
         return;
      }
    }

    if (newSpecForm.year <= 1900 || newSpecForm.year > new Date().getFullYear() + 5) { // Allow up to 5 years into the future
      toast.error("Please enter a valid year.");
      return;
    }
    if (newSpecForm.seatingCapacity <= 0) {
      toast.error("Seating capacity must be a positive number.");
      return;
    }

    try {
      // Payload sent to backend now correctly contains 'manufacturer'
      await createVehicleSpec(newSpecForm).unwrap();
      toast.success("Vehicle Specification added successfully! 🎉");
      setIsAddModalOpen(false);
      resetAddForm();
      refetch(); // Refetch all specs after creation
    } catch (err: any) {
      console.error("Vehicle spec creation failed:", err);
      toast.error(
        typeof err?.data?.error === "string"
          ? err.data.error
          : "Error adding vehicle specification"
      );
    }
  };

  const handleUpdateSpec = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentSpec?.vehicleSpecId) {
      toast.error("No vehicle specification selected for update.");
      return;
    }

    // Filter out undefined/empty string fields from editSpecForm to send partial update
    // Ensure 'manufacturer' is correctly handled here
    const dataToUpdate: UpdateVehicleSpecPayload = Object.fromEntries(
      Object.entries(editSpecForm).filter(([_, value]) => value !== undefined && (typeof value === 'string' ? value.trim() !== '' : true))
    ) as UpdateVehicleSpecPayload;

    if (Object.keys(dataToUpdate).length === 0) {
      toast.error("No changes detected to update.");
      return;
    }

    if (dataToUpdate.year !== undefined && (dataToUpdate.year <= 1900 || dataToUpdate.year > new Date().getFullYear() + 5)) {
      toast.error("Please enter a valid year.");
      return;
    }
    if (dataToUpdate.seatingCapacity !== undefined && dataToUpdate.seatingCapacity <= 0) {
      toast.error("Seating capacity must be a positive number.");
      return;
    }

    try {
      // Payload sent to backend now correctly contains 'manufacturer'
      await updateVehicleSpec({ id: currentSpec.vehicleSpecId, data: dataToUpdate }).unwrap();
      toast.success(`Vehicle Spec ID ${currentSpec.vehicleSpecId} updated successfully! ✅`);
      setIsEditModalOpen(false);
      setCurrentSpec(null);
      refetch(); // Refetch all specs after update
    } catch (err: any) {
      console.error("Vehicle spec update failed:", err);
      toast.error(
        typeof err?.data?.error === "string"
          ? err.data.error
          : "Error updating vehicle specification"
      );
    }
  };

  const openEditModal = (spec: VehicleSpec) => {
    setCurrentSpec(spec);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setCurrentSpec(null);
    // Ensure this reset matches the types
    setEditSpecForm({
      manufacturer: "", // Ensure manufacturer is cleared
      model: "",
      year: undefined,
      fuelType: "",
      engineCapacity: "",
      transmission: "",
      seatingCapacity: undefined,
      color: "",
      features: "",
    });
  };

  const fuelTypeOptions = ["Petrol", "Diesel", "Electric", "Hybrid"];
  const transmissionOptions = ["Manual", "Automatic"];

  return (
    <>
      <Toaster richColors position="top-right" />
      <div className="bg-white border border-gray-200 shadow-md rounded-md p-6 mt-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-blue-950">All Vehicle Specifications</h1>
          <button
            onClick={() => {
              setIsAddModalOpen(true);
              resetAddForm();
            }}
            className="bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-800"
          >
            + Add New Spec
          </button>
        </div>

        {error && (
          <p className="text-red-600 font-semibold text-center">
            Error occurred while fetching vehicle specifications.
          </p>
        )}

        {isLoading ? (
          <div className="flex justify-center">
            <PuffLoader color="#1e3a8a" />
          </div>
        ) : vehicleSpecs.length === 0 ? (
          <p className="text-gray-600 font-semibold text-center">
            No vehicle specifications found.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-sm">
              <thead className="bg-blue-950 text-orange-400">
                <tr>
                  <th className="p-3 text-left">ID</th>
                  <th className="p-3 text-left">Manufacturer</th> {/* Changed from 'Brand' to 'Manufacturer' */}
                  <th className="p-3 text-left">Model</th>
                  <th className="p-3 text-left">Year</th>
                  <th className="p-3 text-left">Color</th>
                  <th className="p-3 text-left">Fuel Type</th>
                  <th className="p-3 text-left">Engine</th>
                  <th className="p-3 text-left">Transmission</th>
                  <th className="p-3 text-left">Seats</th>
                  <th className="p-3 text-left">Features</th>
                  <th className="p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {vehicleSpecs.map((spec) => (
                  <tr key={spec.vehicleSpecId} className="hover:bg-blue-50 border-t">
                    <td className="p-3">{spec.vehicleSpecId}</td>
                    <td className="p-3">{spec.manufacturer}</td> {/* Display spec.manufacturer */}
                    <td className="p-3">{spec.model}</td>
                    <td className="p-3">{spec.year}</td>
                    <td className="p-3">{spec.color}</td>
                    <td className="p-3">{spec.fuelType}</td>
                    <td className="p-3">{spec.engineCapacity}</td>
                    <td className="p-3">{spec.transmission}</td>
                    <td className="p-3">{spec.seatingCapacity}</td>
                    <td className="p-3 truncate" title={spec.features}>
                      {spec.features}
                    </td>
                    <td className="p-3 flex gap-2">
                      <button
                        className="text-blue-700 hover:bg-blue-100 p-1 rounded"
                        onClick={() => openEditModal(spec)}
                      >
                        <FiEdit />
                      </button>
                      <button
                        className="text-red-600 hover:bg-red-100 p-1 rounded"
                        onClick={() => handleDelete(spec.vehicleSpecId)}
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

      {/* Add Vehicle Spec Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[600px] max-h-[90vh] overflow-y-auto shadow-xl">
            <h2 className="text-xl font-bold mb-4 text-blue-900">Add New Vehicle Specification</h2>
            <form onSubmit={handleCreateSpec} className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Manufacturer" // Changed from 'Brand' to 'Manufacturer'
                value={newSpecForm.manufacturer}
                onChange={(e) => setNewSpecForm({ ...newSpecForm, manufacturer: e.target.value })}
                className="border p-2 rounded"
                required
              />
              <input
                type="text"
                placeholder="Model"
                value={newSpecForm.model}
                onChange={(e) => setNewSpecForm({ ...newSpecForm, model: e.target.value })}
                className="border p-2 rounded"
                required
              />
              <input
                type="number"
                placeholder="Year"
                value={newSpecForm.year}
                onChange={(e) => setNewSpecForm({ ...newSpecForm, year: Number(e.target.value) })}
                className="border p-2 rounded"
                required
              />
              <input
                type="text"
                placeholder="Color"
                value={newSpecForm.color}
                onChange={(e) => setNewSpecForm({ ...newSpecForm, color: e.target.value })}
                className="border p-2 rounded"
                required
              />
              <select
                value={newSpecForm.fuelType}
                onChange={(e) => setNewSpecForm({ ...newSpecForm, fuelType: e.target.value })}
                className="border p-2 rounded"
                required
              >
                <option value="">Select Fuel Type</option>
                {fuelTypeOptions.map(option => <option key={option} value={option}>{option}</option>)}
              </select>
              <input
                type="text"
                placeholder="Engine Capacity (e.g., 2.0L)"
                value={newSpecForm.engineCapacity}
                onChange={(e) => setNewSpecForm({ ...newSpecForm, engineCapacity: e.target.value })}
                className="border p-2 rounded"
                required
              />
              <select
                value={newSpecForm.transmission}
                onChange={(e) => setNewSpecForm({ ...newSpecForm, transmission: e.target.value })}
                className="border p-2 rounded"
                required
              >
                <option value="">Select Transmission</option>
                {transmissionOptions.map(option => <option key={option} value={option}>{option}</option>)}
              </select>
              <input
                type="number"
                placeholder="Seating Capacity"
                value={newSpecForm.seatingCapacity}
                onChange={(e) => setNewSpecForm({ ...newSpecForm, seatingCapacity: Number(e.target.value) })}
                className="border p-2 rounded"
                required
              />
              <textarea
                placeholder="Features (comma-separated)"
                value={newSpecForm.features}
                onChange={(e) => setNewSpecForm({ ...newSpecForm, features: e.target.value })}
                className="border p-2 rounded col-span-2"
                rows={3}
                required
              />

              <div className="mt-6 flex justify-end gap-4 col-span-2">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                  onClick={() => setIsAddModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="px-4 py-2 bg-blue-900 text-white rounded hover:bg-blue-800 disabled:opacity-50"
                >
                  {isCreating ? "Saving..." : "Add Spec"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Vehicle Spec Modal */}
      {isEditModalOpen && currentSpec && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[600px] max-h-[90vh] overflow-y-auto shadow-xl">
            <h2 className="text-xl font-bold mb-4 text-blue-900">Edit Vehicle Specification (ID: {currentSpec.vehicleSpecId})</h2>
            <form onSubmit={handleUpdateSpec} className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Manufacturer" // Changed from 'Brand' to 'Manufacturer'
                value={editSpecForm.manufacturer || ''}
                onChange={(e) => setEditSpecForm({ ...editSpecForm, manufacturer: e.target.value })}
                className="border p-2 rounded"
              />
              <input
                type="text"
                placeholder="Model"
                value={editSpecForm.model || ''}
                onChange={(e) => setEditSpecForm({ ...editSpecForm, model: e.target.value })}
                className="border p-2 rounded"
              />
              <input
                type="number"
                placeholder="Year"
                value={editSpecForm.year || ''}
                onChange={(e) => setEditSpecForm({ ...editSpecForm, year: Number(e.target.value) })}
                className="border p-2 rounded"
              />
              <input
                type="text"
                placeholder="Color"
                value={editSpecForm.color || ''}
                onChange={(e) => setEditSpecForm({ ...editSpecForm, color: e.target.value })}
                className="border p-2 rounded"
              />
              <select
                value={editSpecForm.fuelType || ''}
                onChange={(e) => setEditSpecForm({ ...editSpecForm, fuelType: e.target.value })}
                className="border p-2 rounded"
              >
                <option value="">Select Fuel Type</option>
                {fuelTypeOptions.map(option => <option key={option} value={option}>{option}</option>)}
              </select>
              <input
                type="text"
                placeholder="Engine Capacity (e.g., 2.0L)"
                value={editSpecForm.engineCapacity || ''}
                onChange={(e) => setEditSpecForm({ ...editSpecForm, engineCapacity: e.target.value })}
                className="border p-2 rounded"
              />
              <select
                value={editSpecForm.transmission || ''}
                onChange={(e) => setEditSpecForm({ ...editSpecForm, transmission: e.target.value })}
                className="border p-2 rounded"
              >
                <option value="">Select Transmission</option>
                {transmissionOptions.map(option => <option key={option} value={option}>{option}</option>)}
              </select>
              <input
                type="number"
                placeholder="Seating Capacity"
                value={editSpecForm.seatingCapacity || ''}
                onChange={(e) => setEditSpecForm({ ...editSpecForm, seatingCapacity: Number(e.target.value) })}
                className="border p-2 rounded"
              />
              <textarea
                placeholder="Features (comma-separated)"
                value={editSpecForm.features || ''}
                onChange={(e) => setEditSpecForm({ ...editSpecForm, features: e.target.value })}
                className="border p-2 rounded col-span-2"
                rows={3}
              />

              <div className="mt-6 flex justify-end gap-4 col-span-2">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                  onClick={closeEditModal}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-4 py-2 bg-blue-900 text-white rounded hover:bg-blue-800 disabled:opacity-50"
                >
                  {isUpdating ? "Updating..." : "Update Spec"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AllVehicleSpecs;