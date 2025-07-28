import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../../app/store";
import { apiDomain } from "../../proxxy";

export interface Booking {
  bookingStatus: string;
  bookingId: number;
  bookingDate: string;
  returnDate: string;
  totalAmount: number;
  vehicleId: number;
  locationId: number;
  userId: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateBookingPayload {
  bookingDate: string;
  returnDate: string;
  totalAmount: number;
  vehicleId: number;
  locationId: number;
  userId: number;
}

export interface CheckAvailabilityPayload {
  vehicleId: number;
  bookingDate: string;
  returnDate: string;
}

export interface AvailabilityResponse {
  available?: boolean;
  isAvailable?: boolean;
  message: string;
  conflictingBookings?: any[];
  debug?: any;
}

export interface UpdateBookingPayload extends Partial<CreateBookingPayload> {
  bookingId: number;
}


export const bookingsApi = createApi({
  reducerPath: "bookingsApi",
  baseQuery: fetchBaseQuery({
    baseUrl:apiDomain,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set("Authorization", `${token}`);
      }
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  tagTypes: ["bookings", "booking"],
  endpoints: (builder) => ({
    getAllBookings: builder.query<Booking[], void>({
      query: () => "booking",
      providesTags: ["bookings"],
    }),

    getBookingById: builder.query<Booking, number>({
      query: (bookingId) => `booking/${bookingId}`, // Changed from 'bookings' to 'booking' for consistency
      providesTags: (_result, _error, id) => [{ type: "booking", id }],
    }),

    getBookingsByUserId: builder.query<Booking[], number>({
      query: (userId) => `booking/user/${userId}`, // Changed from 'bookings/user?userId=' to 'booking/user/' for consistency with your route
      providesTags: ["bookings"],
    }),

    // New endpoint to check vehicle availability
    checkVehicleAvailability: builder.mutation<AvailabilityResponse, CheckAvailabilityPayload>({
      query: (availabilityData) => ({
        url: "booking/check-availability",
        method: "POST",
        body: availabilityData,
      }),
    }),

    createBooking: builder.mutation<Booking, CreateBookingPayload>({
      query: (bookingData) => ({
        url: "booking", // **THIS IS THE KEY CHANGE: Changed from "bookings" to "booking"**
        method: "POST",
        body: bookingData,
      }),
      invalidatesTags: ["bookings"],
    }),

    updateBooking: builder.mutation<Booking, UpdateBookingPayload>({
      query: ({ bookingId, ...patch }) => ({
        url: `booking/${bookingId}`, // Changed from 'bookings' to 'booking' for consistency
        method: "PUT",
        body: patch,
      }),
      invalidatesTags: ["bookings", "booking"],
    }),

    getMonthlyBookingTrends: builder.query<
  { month: string; count: number }[],
  void
>({
  query: () => 'booking/stats/monthly',
}),


    deleteBooking: builder.mutation<{ message: string }, number>({
      query: (bookingId) => ({
        url: `booking/${bookingId}`, // Changed from 'bookings' to 'booking' for consistency
        method: "DELETE",
      }),
      invalidatesTags: ["bookings"],
    }),
  }),
});

export const {
  useGetAllBookingsQuery,
  useGetBookingByIdQuery,
  useCreateBookingMutation,
  useGetBookingsByUserIdQuery,
  useUpdateBookingMutation,
  useDeleteBookingMutation,
  useGetMonthlyBookingTrendsQuery,
  useCheckVehicleAvailabilityMutation,
} = bookingsApi;

export default bookingsApi;