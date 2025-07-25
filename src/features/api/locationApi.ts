import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../../app/store";

// Location Types
export interface Location {
  locationId: number;
  name: string;
  address: string;
  contact: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateLocationPayload {
  name: string;
  address: string;
  contact: string;
}

export interface UpdateLocationPayload extends Partial<CreateLocationPayload> {
  locationId: number;
}

// RTK Query API Slice
export const locationsApi = createApi({
  reducerPath: "locationsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api/",
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set("Authorization", `${token}`);
      }
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  tagTypes: ["locations", "location"],
  endpoints: (builder) => ({
    getAllLocations: builder.query<Location[], void>({
      query: () => "location",
      providesTags: ["locations"],
    }),

    getLocationById: builder.query<Location, number>({
      query: (locationId) => `location/${locationId}`,
      providesTags: (_result, _error, id) => [{ type: "location", id }],
    }),

    getLocationByName: builder.query<Location[], string>({
      query: (name) => `location-search?name=${encodeURIComponent(name)}`,
      providesTags: ["locations"],
    }),

    createLocation: builder.mutation<{ message: string }, CreateLocationPayload>({
      query: (locationData) => ({
        url: "location",
        method: "POST",
        body: locationData,
      }),
      invalidatesTags: ["locations"],
    }),

    updateLocation: builder.mutation<{ message: string }, UpdateLocationPayload>({
      query: ({ locationId, ...patch }) => ({
        url: `location/${locationId}`,
        method: "PUT",
        body: patch,
      }),
      invalidatesTags: ["locations", "location"],
    }),

    deleteLocation: builder.mutation<{ message: string }, number>({
      query: (locationId) => ({
        url: `location/${locationId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["locations"],
    }),
  }),
});

export const {
  useGetAllLocationsQuery,
  useGetLocationByIdQuery,
  useGetLocationByNameQuery,
  useCreateLocationMutation,
  useUpdateLocationMutation,
  useDeleteLocationMutation,
} = locationsApi;

export default locationsApi;
