import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../../app/store";

export interface Booking {
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

export interface UpdateBookingPayload extends Partial<CreateBookingPayload> {
  bookingId: number;
}


export const bookingsApi = createApi({
  reducerPath: "bookingsApi",
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
  tagTypes: ["bookings", "booking"],
  endpoints: (builder) => ({
    getAllBookings: builder.query<Booking[], void>({
      query: () => "booking",
      providesTags: ["bookings"],
    }),

    getBookingById: builder.query<Booking, number>({
      query: (bookingId) => `bookings/${bookingId}`,
      providesTags: (result, error, id) => [{ type: "booking", id }],
    }),

    getBookingsByUserId: builder.query<Booking[], number>({
      query: (userId) => `bookings/user?userId=${userId}`,
      providesTags: ["bookings"], 
    }),

    createBooking: builder.mutation<Booking, CreateBookingPayload>({
      query: (bookingData) => ({
        url: "bookings",
        method: "POST",
        body: bookingData,
      }),
      invalidatesTags: ["bookings"],
    }),

    updateBooking: builder.mutation<Booking, UpdateBookingPayload>({
      query: ({ bookingId, ...patch }) => ({
        url: `bookings/${bookingId}`,
        method: "PUT",
        body: patch,
      }),
      invalidatesTags: ["bookings", "booking"],
    }),

    deleteBooking: builder.mutation<{ message: string }, number>({
      query: (bookingId) => ({
        url: `bookings/${bookingId}`,
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
} = bookingsApi;

export default bookingsApi;
