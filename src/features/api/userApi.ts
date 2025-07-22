import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../../app/store';



export interface User {
  userId: number;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  contact: string;
  address: string;
  profileUrl?: string;
  role?: 'user' | 'admin' | 'disabled';
  bookings?: any[]; 
  supportTickets?: any[]; 
}

export interface CreateUserPayload {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  contact: string;
  address: string;
  profileUrl?: string;
  role?: 'user' | 'admin' | 'disabled';
}

export interface UpdateUserPayload {
  userId: number;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  contact: string;
  address: string;
}

export interface BookingDetails {
  bookingId: number;
  vehicleId: number;
  userId: number;
  startDate: string;
  endDate: string;
  totalCost: number;
}

export interface CreateBookingPayload {
  vehicleId: number;
  userId: number;
  startDate: string;
  endDate: string;
  totalCost: number;
}



export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:5000/api/',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['users', 'user', 'bookings'],
  endpoints: (builder) => ({
    // Auth endpoints
    loginUser: builder.mutation<{ token: string; role: string; user: User }, { email: string; password: string }>({
      query: (credentials) => ({
        url: 'auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),

    registerUser: builder.mutation<string, CreateUserPayload>({
      query: (user) => ({
        url: 'auth/register',
        method: 'POST',
        body: user,
      }),
    }),

    // Get single user by ID
    getUserById: builder.query<User, number>({
      query: (userId) => `users/${userId}`,
      providesTags: ["user"],
    }),

    // Get all user profiles
    getAllUsersProfiles: builder.query<User[], void>({
      query: () => 'users',
      providesTags: ["users"],
    }),

    // Update a user profile
    updateUserProfile: builder.mutation<string, UpdateUserPayload>({
      query: ({ userId, ...patch }) => ({
        url: `users/${userId}`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: ["user", "users"],
    }),

    // Profile image update (optional usage)
    updateUserProfileImage: builder.mutation<
      string,
      { userId: number; profileUrl: string }
    >({
      query: ({ userId, profileUrl }) => ({
        url: `users/${userId}`,
        method: 'PUT',
        body: { profileUrl },
      }),
      invalidatesTags: ['user', 'users'],
    }),

    // Delete user
    deleteUserProfile: builder.mutation<string, number>({
      query: (userId) => ({
        url: `users/${userId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['user', 'users'],
    }),

    // Create a booking
    createBooking: builder.mutation<BookingDetails, CreateBookingPayload>({
      query: (bookingDetails) => ({
        url: 'bookings',
        method: 'POST',
        body: bookingDetails,
      }),
      invalidatesTags: ['bookings'],
    }),

    // Get booking by ID
    getBookingById: builder.query<BookingDetails, number>({
      query: (bookingId) => `bookings/${bookingId}`,
      providesTags: (result, error, id) => [{ type: 'bookings', id }],
    }),
  }),
});

// ======================
// Hooks
// ======================

export const {
  useLoginUserMutation,
  useRegisterUserMutation,
  useGetUserByIdQuery,
  useGetAllUsersProfilesQuery,
  useUpdateUserProfileMutation,
  useUpdateUserProfileImageMutation,
  useDeleteUserProfileMutation,
  useCreateBookingMutation,
  useGetBookingByIdQuery,
} = userApi;
