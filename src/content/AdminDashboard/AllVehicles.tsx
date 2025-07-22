import React, { useState } from "react";
import { FiEdit } from "react-icons/fi";
import { AiFillDelete } from "react-icons/ai";
import {
  useGetAllVehiclesQuery,
  useCreateVehicleMutation,
  useDeleteVehicleMutation,
  useGetAllVehicleSpecsQuery,
} from "../../features/api/vehiclesApi";
import { PuffLoader } from "react-spinners";
import Swal from "sweetalert2";
import { toast, Toaster } from "sonner";
import axios from "axios";

import { type Vehicle, type VehicleSpec } from "../../features/api/vehiclesApi";

export const AllVehicles = () => {
  const preset_key = "vehicles";
  const cloud_name = "dji3abnhv";
  const cloudinaryType = "image";

  const {
    data: vehicles = [],
    error,
    isLoading,
    refetch,
  } = useGetAllVehiclesQuery();
  const {
    data: vehicleSpecs = [],
    error: specsError,
    isLoading: specsLoading,
  } = useGetAllVehicleSpecsQuery();

  const [createVehicle, { isLoading: isCreating }] = useCreateVehicleMutation();
  const [deleteVehicle, { isLoading: isDeleting }] = useDeleteVehicleMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // State for the new vehicle form data (excluding the file)
  const [newVehicle, setNewVehicle] = useState({
    rentalRate: "",
    availability: "Available",
    vehicleSpecId: null as number | null, // Initialize as null or number
  });

  // State specifically for the selected image file
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const resetForm = () => {
    setNewVehicle({
      rentalRate: "",
      availability: "Available",
      vehicleSpecId: null,
    });
    setSelectedImage(null); // Reset the selected image file
    setUploadProgress(0); // Reset upload progress
  };

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
    if (!newVehicle.rentalRate || isNaN(Number(newVehicle.rentalRate))) {
      toast.error("Rental rate required and must be a number.");
      return;
    }
    // Validate that a vehicle spec has been selected and is a valid ID
    if (newVehicle.vehicleSpecId === null || newVehicle.vehicleSpecId <= 0) {
      toast.error("Please select a valid vehicle specification.");
      return;
    }

    let imageUrl = "";

    // Only attempt image upload if a file is selected
    if (selectedImage) {
      const cloudFormData = new FormData();
      cloudFormData.append("file", selectedImage);
      cloudFormData.append("upload_preset", preset_key);

      try {
        const uploadRes = await axios.post(
          `https://api.cloudinary.com/v1_1/${cloud_name}/${cloudinaryType}/upload`,
          cloudFormData,
          {
            onUploadProgress: (progressEvent) => {
              const percent = Math.round(
                (progressEvent.loaded * 100) / (progressEvent.total || 1)
              );
              setUploadProgress(percent);
            },
          }
        );
        imageUrl = uploadRes.data.secure_url;
      } catch (uploadErr) {
        toast.error("Image upload failed");
        console.error("Cloudinary error:", uploadErr);
        return;
      }
    }

    const payload = {
      rentalRate: Number(newVehicle.rentalRate),
      availability: newVehicle.availability === "Available",
      imageUrl, // This will be an empty string if no image was selected/uploaded
      vehicleSpecId: newVehicle.vehicleSpecId, // This is already a number or null
    };
    console.log("Payload being sent:", payload);
  console.log("Type of rentalRate:", typeof payload.rentalRate, "Value:", payload.rentalRate);
  console.log("Type of vehicleSpecId:", typeof payload.vehicleSpecId, "Value:", payload.vehicleSpecId);

    try {
      await createVehicle(payload).unwrap();
      toast.success("Vehicle added successfully!");
      setIsModalOpen(false);
      resetForm(); // Reset form fields and image state
      refetch(); // Refetch vehicles to show the new one
    } catch (err: any) {
      console.error("Vehicle creation failed:", err);
      toast.error(
        typeof err?.data?.error === "string"
          ? err.data.error
          : "Error adding vehicle"
      );
    }
  };

  return (
    <>
      <Toaster richColors position="top-right" />
      <div className="bg-white border border-gray-200 shadow-md rounded-md p-6 mt-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-blue-950">All Vehicles</h1>
          <button
            onClick={() => {
              setIsModalOpen(true);
              resetForm(); // Ensure form is clean when opening
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
                  <tr key={car.vehicleId} className="hover:bg-blue-50 border-t">
                    <td className="p-3">{car.vehicleId}</td>
                    <td className="p-3">KSH {car.rentalRate}</td>
                    <td className="p-3">
                      {car.availability ? "Available" : "Unavailable"}
                    </td>
                    <td className="p-3">{car.vehicleSpec?.model || "N/A"}</td>
                    <td className="p-3">{car.vehicleSpec?.brand || "N/A"}</td>
                    <td className="p-3">{car.vehicleSpec?.color || "N/A"}</td>
                    <td className="p-3">{car.vehicleSpec?.year || "N/A"}</td>
                    <td className="p-3">{car.vehicleSpec?.fuelType || "N/A"}</td>
                    <td className="p-3">{car.vehicleSpec?.engineCapacity || "N/A"}</td>
                    <td className="p-3">{car.vehicleSpec?.transmission || "N/A"}</td>
                    <td className="p-3">{car.vehicleSpec?.seatingCapacity || "N/A"}</td>
                    <td className="p-3 truncate" title={car.vehicleSpec?.features}>
                      {car.vehicleSpec?.features || "N/A"}
                    </td>
                    <td className="p-3 flex gap-2">
                      <button className="text-blue-700 hover:bg-blue-100 p-1 rounded">
                        <FiEdit />
                      </button>
                      <button
                        className="text-red-600 hover:bg-red-100 p-1 rounded"
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
            <h2 className="text-xl font-bold mb-4 text-blue-900">Add New Vehicle</h2>

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

              {/* Dropdown for Vehicle Specification ID */}
              <div className="col-span-2">
                {specsLoading ? (
                  <PuffLoader size={20} color="#1e3a8a" />
                ) : specsError ? (
                  <p className="text-red-600">Error loading specs.</p>
                ) : (
                  <select
                    value={newVehicle.vehicleSpecId !== null ? newVehicle.vehicleSpecId : ""}
                    onChange={(e) =>
                      setNewVehicle({
                        ...newVehicle,
                        vehicleSpecId: e.target.value === "" ? null : Number(e.target.value),
                      })
                    }
                    className="border p-2 rounded w-full"
                  >
                    <option value="">Select Vehicle Specification</option>
                    {vehicleSpecs.map((spec: VehicleSpec) => (
                      <option key={spec.vehicleSpecId} value={spec.vehicleSpecId}>
                        {spec.brand} {spec.model} ({spec.year}) - {spec.color}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* File input for image upload, now using selectedImage state */}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setSelectedImage(e.target.files?.[0] || null)}
                className="col-span-2 border p-2 rounded"
              />
              {selectedImage && uploadProgress > 0 && uploadProgress < 100 && (
                <div className="col-span-2 text-sm text-gray-600">
                  Uploading: {uploadProgress}%
                </div>
              )}
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