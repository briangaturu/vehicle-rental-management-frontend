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

  const [newSpecForm, setNewSpecForm] = useState<CreateVehicleSpecPayload>({
    manufacturer: "",
    model: "",
    year: new Date().getFullYear(),
    fuelType: "",
    engineCapacity: "",
    transmission: "",
    seatingCapacity: 5,
    color: "",
    features: "",
  });

  const [editSpecForm, setEditSpecForm] = useState<UpdateVehicleSpecPayload>({
    manufacturer: "",
    model: "",
    year: undefined,
    fuelType: "",
    engineCapacity: "",
    transmission: "",
    seatingCapacity: undefined,
    color: "",
    features: "",
  });

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
    }
  }, [currentSpec]);

  const resetAddForm = () => {
    setNewSpecForm({
      manufacturer: "",
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
          refetch();
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

    const requiredFields: (keyof CreateVehicleSpecPayload)[] = [
      "manufacturer", "model", "year", "fuelType", "engineCapacity",
      "transmission", "seatingCapacity", "color", "features"
    ];
    for (const field of requiredFields) {
      if (typeof newSpecForm[field] === 'string' && !newSpecForm[field].trim()) {
        toast.error(`Please fill in the '${field}' field.`);
        return;
      }
    }

    if (newSpecForm.year < 1900 || newSpecForm.year > new Date().getFullYear() + 5) {
      toast.error("Please enter a valid year.");
      return;
    }

    try {
      await createVehicleSpec(newSpecForm).unwrap();
      toast.success("Vehicle Specification added successfully!");
      setIsAddModalOpen(false);
      resetAddForm();
      refetch();
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

    const dataToUpdate: UpdateVehicleSpecPayload = Object.fromEntries(
      Object.entries(editSpecForm).filter(([_, value]) => value !== undefined && (typeof value === 'string' ? value.trim() !== '' : true))
    ) as UpdateVehicleSpecPayload;

    if (Object.keys(dataToUpdate).length === 0) {
      toast.error("No changes detected to update.");
      return;
    }

    try {
      await updateVehicleSpec({ id: currentSpec.vehicleSpecId, data: dataToUpdate }).unwrap();
      toast.success(`Vehicle Spec ID ${currentSpec.vehicleSpecId} updated successfully!`);
      setIsEditModalOpen(false);
      setCurrentSpec(null);
      refetch();
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
    setEditSpecForm({
      manufacturer: "",
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
            onClick={() => { setIsAddModalOpen(true); resetAddForm(); }}
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
          <div className="flex justify-center"><PuffLoader color="#1e3a8a" /></div>
        ) : vehicleSpecs.length === 0 ? (
          <p className="text-gray-600 font-semibold text-center">No vehicle specifications found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-sm">
              <thead className="bg-blue-950 text-orange-400">
                <tr>
                  <th className="p-3 text-left">ID</th>
                  <th className="p-3 text-left">Manufacturer</th>
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
                    <td className="p-3">{spec.manufacturer}</td>
                    <td className="p-3">{spec.model}</td>
                    <td className="p-3">{spec.year}</td>
                    <td className="p-3">{spec.color}</td>
                    <td className="p-3">{spec.fuelType}</td>
                    <td className="p-3">{spec.engineCapacity}</td>
                    <td className="p-3">{spec.transmission}</td>
                    <td className="p-3">{spec.seatingCapacity}</td>
                    <td className="p-3 truncate" title={spec.features}>{spec.features}</td>
                    <td className="p-3 flex gap-2">
                      <button className="text-blue-700 hover:bg-blue-100 p-1 rounded" onClick={() => openEditModal(spec)}>
                        <FiEdit />
                      </button>
                      <button className="text-red-600 hover:bg-red-100 p-1 rounded" onClick={() => handleDelete(spec.vehicleSpecId)} disabled={isDeleting}>
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl">
            <div className="flex justify-between items-center border-b p-4">
              <h2 className="text-xl font-semibold text-blue-950">Add New Vehicle Specification</h2>
              <button onClick={() => setIsAddModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                &times;
              </button>
            </div>
            <form onSubmit={handleCreateSpec} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Manufacturer*</label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded"
                    value={newSpecForm.manufacturer}
                    onChange={(e) => setNewSpecForm({ ...newSpecForm, manufacturer: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Model*</label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded"
                    value={newSpecForm.model}
                    onChange={(e) => setNewSpecForm({ ...newSpecForm, model: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Year*</label>
                  <input
                    type="number"
                    className="w-full p-2 border border-gray-300 rounded"
                    value={newSpecForm.year}
                    onChange={(e) => setNewSpecForm({ ...newSpecForm, year: parseInt(e.target.value) || 0 })}
                    min="1900"
                    max={new Date().getFullYear() + 5}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Color*</label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded"
                    value={newSpecForm.color}
                    onChange={(e) => setNewSpecForm({ ...newSpecForm, color: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fuel Type*</label>
                  <select
                    className="w-full p-2 border border-gray-300 rounded"
                    value={newSpecForm.fuelType}
                    onChange={(e) => setNewSpecForm({ ...newSpecForm, fuelType: e.target.value })}
                    required
                  >
                    <option value="">Select Fuel Type</option>
                    {fuelTypeOptions.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Engine Capacity*</label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded"
                    value={newSpecForm.engineCapacity}
                    onChange={(e) => setNewSpecForm({ ...newSpecForm, engineCapacity: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Transmission*</label>
                  <select
                    className="w-full p-2 border border-gray-300 rounded"
                    value={newSpecForm.transmission}
                    onChange={(e) => setNewSpecForm({ ...newSpecForm, transmission: e.target.value })}
                    required
                  >
                    <option value="">Select Transmission</option>
                    {transmissionOptions.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Seating Capacity*</label>
                  <input
                    type="number"
                    className="w-full p-2 border border-gray-300 rounded"
                    value={newSpecForm.seatingCapacity}
                    onChange={(e) => setNewSpecForm({ ...newSpecForm, seatingCapacity: parseInt(e.target.value) || 0 })}
                    min="1"
                    max="20"
                    required
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Features*</label>
                <textarea
                  className="w-full p-2 border border-gray-300 rounded"
                  rows={3}
                  value={newSpecForm.features}
                  onChange={(e) => setNewSpecForm({ ...newSpecForm, features: e.target.value })}
                  required
                />
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-900 text-white rounded hover:bg-blue-800 disabled:opacity-50"
                  disabled={isCreating}
                >
                  {isCreating ? "Adding..." : "Add Specification"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Vehicle Spec Modal */}
      {isEditModalOpen && currentSpec && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl">
            <div className="flex justify-between items-center border-b p-4">
              <h2 className="text-xl font-semibold text-blue-950">Edit Vehicle Specification</h2>
              <button onClick={closeEditModal} className="text-gray-500 hover:text-gray-700">
                &times;
              </button>
            </div>
            <form onSubmit={handleUpdateSpec} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Manufacturer</label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded"
                    value={editSpecForm.manufacturer}
                    onChange={(e) => setEditSpecForm({ ...editSpecForm, manufacturer: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded"
                    value={editSpecForm.model}
                    onChange={(e) => setEditSpecForm({ ...editSpecForm, model: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                  <input
                    type="number"
                    className="w-full p-2 border border-gray-300 rounded"
                    value={editSpecForm.year || ''}
                    onChange={(e) => setEditSpecForm({ ...editSpecForm, year: parseInt(e.target.value) || undefined })}
                    min="1900"
                    max={new Date().getFullYear() + 5}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded"
                    value={editSpecForm.color}
                    onChange={(e) => setEditSpecForm({ ...editSpecForm, color: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fuel Type</label>
                  <select
                    className="w-full p-2 border border-gray-300 rounded"
                    value={editSpecForm.fuelType}
                    onChange={(e) => setEditSpecForm({ ...editSpecForm, fuelType: e.target.value })}
                  >
                    <option value="">Select Fuel Type</option>
                    {fuelTypeOptions.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Engine Capacity</label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded"
                    value={editSpecForm.engineCapacity}
                    onChange={(e) => setEditSpecForm({ ...editSpecForm, engineCapacity: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Transmission</label>
                  <select
                    className="w-full p-2 border border-gray-300 rounded"
                    value={editSpecForm.transmission}
                    onChange={(e) => setEditSpecForm({ ...editSpecForm, transmission: e.target.value })}
                  >
                    <option value="">Select Transmission</option>
                    {transmissionOptions.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Seating Capacity</label>
                  <input
                    type="number"
                    className="w-full p-2 border border-gray-300 rounded"
                    value={editSpecForm.seatingCapacity || ''}
                    onChange={(e) => setEditSpecForm({ ...editSpecForm, seatingCapacity: parseInt(e.target.value) || undefined })}
                    min="1"
                    max="20"
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Features</label>
                <textarea
                  className="w-full p-2 border border-gray-300 rounded"
                  rows={3}
                  value={editSpecForm.features}
                  onChange={(e) => setEditSpecForm({ ...editSpecForm, features: e.target.value })}
                />
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-900 text-white rounded hover:bg-blue-800 disabled:opacity-50"
                  disabled={isUpdating}
                >
                  {isUpdating ? "Updating..." : "Update Specification"}
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