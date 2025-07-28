import { useState } from "react";
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

  const [newVehicle, setNewVehicle] = useState({
    rentalRate: "",
    availability: "Available",
    vehicleSpecId: null as number | null,
  });

  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const resetForm = () => {
    setNewVehicle({
      rentalRate: "",
      availability: "Available",
      vehicleSpecId: null,
    });
    setSelectedImage(null);
    setUploadProgress(0);
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

    if (newVehicle.vehicleSpecId === null || newVehicle.vehicleSpecId <= 0) {
      toast.error("Please select a valid vehicle specification.");
      return;
    }

    let imageUrl = "";
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
      imageUrl,
      vehicleSpecId: newVehicle.vehicleSpecId,
    };

    try {
      await createVehicle(payload).unwrap();
      toast.success("Vehicle added successfully!");
      setIsModalOpen(false);
      resetForm();
      refetch();
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
      <div className="bg-white border border-gray-200 shadow-md rounded-md p-4 sm:p-6 mt-4 sm:mt-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h1 className="text-lg sm:text-2xl font-bold text-blue-950">
            All Vehicles
          </h1>
          <button
            onClick={() => {
              setIsModalOpen(true);
              resetForm();
            }}
            className="bg-blue-900 text-white px-3 py-2 sm:px-4 sm:py-2 rounded hover:bg-blue-800 text-sm sm:text-base"
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
            <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-sm text-xs sm:text-sm">
              <thead className="bg-blue-950 text-orange-400">
                <tr>
                  <th className="p-2 sm:p-3 text-left">Vehicle ID</th>
                  <th className="p-2 sm:p-3 text-left">Rental Rate</th>
                  <th className="p-2 sm:p-3 text-left">Availability</th>
                  <th className="hidden md:table-cell p-2 sm:p-3 text-left">
                    Model
                  </th>
                  <th className="hidden md:table-cell p-2 sm:p-3 text-left">
                    Brand
                  </th>
                  <th className="hidden lg:table-cell p-2 sm:p-3 text-left">
                    Color
                  </th>
                  <th className="hidden lg:table-cell p-2 sm:p-3 text-left">
                    Year
                  </th>
                  <th className="hidden xl:table-cell p-2 sm:p-3 text-left">
                    Fuel
                  </th>
                  <th className="hidden xl:table-cell p-2 sm:p-3 text-left">
                    Engine
                  </th>
                  <th className="hidden 2xl:table-cell p-2 sm:p-3 text-left">
                    Transmission
                  </th>
                  <th className="hidden 2xl:table-cell p-2 sm:p-3 text-left">
                    Seats
                  </th>
                  <th className="hidden 2xl:table-cell p-2 sm:p-3 text-left">
                    Features
                  </th>
                  <th className="p-2 sm:p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {vehicles.map((car: Vehicle) => (
                  <tr
                    key={car.vehicleId}
                    className="hover:bg-blue-50 border-t text-gray-700"
                  >
                    <td className="p-2 sm:p-3">{car.vehicleId}</td>
                    <td className="p-2 sm:p-3">KSH {car.rentalRate}</td>
                    <td className="p-2 sm:p-3">
                      {car.availability ? "Available" : "Unavailable"}
                    </td>
                    <td className="hidden md:table-cell p-2 sm:p-3">
                      {car.vehicleSpec?.model || "N/A"}
                    </td>
                    <td className="hidden md:table-cell p-2 sm:p-3">
                      {car.vehicleSpec?.brand || "N/A"}
                    </td>
                    <td className="hidden lg:table-cell p-2 sm:p-3">
                      {car.vehicleSpec?.color || "N/A"}
                    </td>
                    <td className="hidden lg:table-cell p-2 sm:p-3">
                      {car.vehicleSpec?.year || "N/A"}
                    </td>
                    <td className="hidden xl:table-cell p-2 sm:p-3">
                      {car.vehicleSpec?.fuelType || "N/A"}
                    </td>
                    <td className="hidden xl:table-cell p-2 sm:p-3">
                      {car.vehicleSpec?.engineCapacity || "N/A"}
                    </td>
                    <td className="hidden 2xl:table-cell p-2 sm:p-3">
                      {car.vehicleSpec?.transmission || "N/A"}
                    </td>
                    <td className="hidden 2xl:table-cell p-2 sm:p-3">
                      {car.vehicleSpec?.seatingCapacity || "N/A"}
                    </td>
                    <td className="hidden 2xl:table-cell p-2 sm:p-3 truncate">
                      {car.vehicleSpec?.features || "N/A"}
                    </td>
                    <td className="p-2 sm:p-3 flex gap-2">
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

      {/* Responsive Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-md sm:max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl">
            <h2 className="text-lg sm:text-xl font-bold mb-4 text-blue-900">
              Add New Vehicle
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

              <div className="col-span-1 sm:col-span-2">
                {specsLoading ? (
                  <PuffLoader size={20} color="#1e3a8a" />
                ) : specsError ? (
                  <p className="text-red-600">Error loading specs.</p>
                ) : (
                  <select
                    value={
                      newVehicle.vehicleSpecId !== null
                        ? newVehicle.vehicleSpecId
                        : ""
                    }
                    onChange={(e) =>
                      setNewVehicle({
                        ...newVehicle,
                        vehicleSpecId:
                          e.target.value === "" ? null : Number(e.target.value),
                      })
                    }
                    className="border p-2 rounded w-full"
                  >
                    <option value="">Select Vehicle Specification</option>
                    {vehicleSpecs.map((spec: VehicleSpec) => (
                      <option
                        key={spec.vehicleSpecId}
                        value={spec.vehicleSpecId}
                      >
                        {spec.brand} {spec.model} ({spec.year}) - {spec.color}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <input
                type="file"
                accept="image/*"
                onChange={(e) => setSelectedImage(e.target.files?.[0] || null)}
                className="col-span-1 sm:col-span-2 border p-2 rounded"
              />
              {selectedImage &&
                uploadProgress > 0 &&
                uploadProgress < 100 && (
                  <div className="col-span-2 text-sm text-gray-600">
                    Uploading: {uploadProgress}%
                  </div>
                )}
            </div>

            <div className="mt-6 flex flex-col sm:flex-row justify-end gap-4">
              <button
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 w-full sm:w-auto"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button
                disabled={isCreating}
                className="px-4 py-2 bg-blue-900 text-white rounded hover:bg-blue-800 w-full sm:w-auto"
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
