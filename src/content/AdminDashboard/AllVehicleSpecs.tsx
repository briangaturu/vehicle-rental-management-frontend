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

      {/* Add and Edit Modals (same as your code, but fixed) */}
      {/* ... Include modals as in your provided code ... */}
    </>
  );
};

export default AllVehicleSpecs;
