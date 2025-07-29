import React, { useState } from "react";
import {
  useGetAllLocationsQuery,
  useCreateLocationMutation,
  type CreateLocationPayload,
} from "../../features/api/locationApi";
import { PuffLoader } from "react-spinners";
import { toast, Toaster } from "sonner";

const LocationsPage: React.FC = () => {
  const { data: locations, isLoading, isError } = useGetAllLocationsQuery();
  const [createLocation] = useCreateLocationMutation();

  const [formData, setFormData] = useState<CreateLocationPayload>({
    name: "",
    address: "",
    contact: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await createLocation(formData).unwrap();
      toast.success(result.message);
      setFormData({ name: "", address: "", contact: "" });
    } catch (err) {
      toast.error("Failed to add location");
      console.error(err);
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <Toaster position="top-right" />

      <h2 className="text-2xl font-bold mb-4">Manage Locations</h2>

      {/* Add Location Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded px-6 pt-4 pb-6 mb-6 space-y-4"
      >
        <h3 className="text-xl font-semibold">Add New Location</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            name="name"
            placeholder="Location Name"
            value={formData.name}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            required
          />
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            required
          />
          <input
            type="text"
            name="contact"
            placeholder="Contact"
            value={formData.contact}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded mt-2"
        >
          Add Location
        </button>
      </form>

      {/* Locations Table */}
      <h3 className="text-xl font-semibold mb-2">All Locations</h3>

      {isLoading ? (
        <div className="flex justify-center mt-10">
          <PuffLoader color="#1E3A8A" />
        </div>
      ) : isError ? (
        <p className="text-red-500">Error fetching locations.</p>
      ) : locations && locations.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border">#</th>
                <th className="py-2 px-4 border">Name</th>
                <th className="py-2 px-4 border">Address</th>
                <th className="py-2 px-4 border">Contact</th>
              </tr>
            </thead>
            <tbody>
              {locations.map((loc, index) => (
                <tr key={loc.locationId} className="border-t">
                  <td className="py-2 px-4 border">{index + 1}</td>
                  <td className="py-2 px-4 border">{loc.name}</td>
                  <td className="py-2 px-4 border">{loc.address}</td>
                  <td className="py-2 px-4 border">{loc.contact}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No locations available.</p>
      )}
    </div>
  );
};

export default LocationsPage;
