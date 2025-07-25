import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { apiDomain } from '../../proxxy';
import type { RootState } from '../../app/store';

export interface VehicleSpec {
  vehicleSpecId: number;
  model: string;
  manufacturer: string;
  color: string;
  year: number;
  fuelType: string;
  engineCapacity: string;
  transmission: string;
  seatingCapacity: number;
  features: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateVehicleSpecPayload {
  model: string;
  manufacturer: string;
  color: string;
  year: number;
  fuelType: string;
  engineCapacity: string;
  transmission: string;
  seatingCapacity: number;
  features: string;
}

export interface UpdateVehicleSpecPayload {
  model?: string;
  manufacturer?: string;
  color?: string;
  year?: number;
  fuelType?: string;
  engineCapacity?: string;
  transmission?: string;
  seatingCapacity?: number;
  features?: string;
}

export const vehicleSpecsApi = createApi({
  reducerPath: 'vehicleSpecsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: apiDomain,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set('Authorization', `${token}`);
      }
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['VehicleSpecs'],

  endpoints: (builder) => ({
    getAllVehicleSpecs: builder.query<VehicleSpec[], void>({
      query: () => 'vehicleSpecs',
      providesTags: ['VehicleSpecs'],
    }),

    getVehicleSpecById: builder.query<VehicleSpec, number>({
      query: (id) => `vehicleSpecs/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'VehicleSpecs', id }],
    }),

    getVehicleSpecsByManufacturer: builder.query<VehicleSpec[], string>({
      query: (manufacturer) => `vehicleSpecs-search?manufacturer=${manufacturer}`,
      providesTags: (_result, _error, _manufacturer) => [
        { type: 'VehicleSpecs', id: 'LIST' },
      ],
    }),

    createVehicleSpec: builder.mutation<VehicleSpec, CreateVehicleSpecPayload>({
      query: (newSpec) => ({
        url: 'vehicleSpecs',
        method: 'POST',
        body: newSpec,
      }),
      invalidatesTags: ['VehicleSpecs'],
    }),

    updateVehicleSpec: builder.mutation<VehicleSpec, { id: number; data: UpdateVehicleSpecPayload }>({
      query: ({ id, data }) => ({
        url: `vehicleSpecs/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: 'VehicleSpecs', id: arg.id },
        'VehicleSpecs',
      ],
    }),

    deleteVehicleSpec: builder.mutation<{ message: string }, number>({
      query: (id) => ({
        url: `vehicleSpecs/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['VehicleSpecs'],
    }),
  }),
});

export const {
  useGetAllVehicleSpecsQuery,
  useGetVehicleSpecByIdQuery,
  useGetVehicleSpecsByManufacturerQuery,
  useCreateVehicleSpecMutation,
  useUpdateVehicleSpecMutation,
  useDeleteVehicleSpecMutation,
} = vehicleSpecsApi;

export default vehicleSpecsApi;
