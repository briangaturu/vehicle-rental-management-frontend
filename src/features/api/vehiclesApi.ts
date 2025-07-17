// src/features/api/vehiclesApi.ts

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { apiDomain } from "../../proxxy";
import type { RootState } from '../../app/store';

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
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateVehiclePayload {
  rentalRate: number;
  availability: string;
  vehicleSpecId: number;
}

export interface UpdateVehiclePayload {
  rentalRate: number;
  availability: string;
  vehicleSpecId: number;
}

export const vehicleApi = createApi({
  reducerPath: 'vehicleApi',
  baseQuery: fetchBaseQuery({
    baseUrl: apiDomain,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set('Authorization', `${token}`);
      }
      headers.set('Content-Type', 'application/json');
      return headers;
    }
  }),
  tagTypes: ['vehicles', 'vehicle'],
  endpoints: (builder) => ({
    getAllVehicles: builder.query<Vehicle[], void>({
      query: () => 'vehicles',
      providesTags: ['vehicles'],
    }),
    getVehicleById: builder.query<Vehicle, number>({
      query: (vehicleId) => `vehicles/${vehicleId}`,
      providesTags: (result, error, id) => [{ type: 'vehicle', id }],
    }),
    createVehicle: builder.mutation<Vehicle, CreateVehiclePayload>({
      query: (vehicleData) => ({
        url: 'vehicles',
        method: 'POST',
        body: vehicleData,
      }),
      invalidatesTags: ['vehicles'],
    }),
    updateVehicle: builder.mutation<Vehicle, { vehicleId: number; data: UpdateVehiclePayload }>({
      query: ({ vehicleId, data }) => ({
        url: `vehicles/${vehicleId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'vehicle', id: arg.vehicleId },
        'vehicles'
      ],
    }),
    deleteVehicle: builder.mutation<{ message: string }, number>({
      query: (vehicleId) => ({
        url: `vehicles/${vehicleId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['vehicles'],
    }),
  }),
});

export const {
  useGetAllVehiclesQuery,
  useGetVehicleByIdQuery,
  useCreateVehicleMutation,
  useUpdateVehicleMutation,
  useDeleteVehicleMutation,
} = vehicleApi;

export default vehicleApi;
