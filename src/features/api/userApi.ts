import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../../app/store';
import { apiDomain } from '../../proxxy';



export interface User {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  contact: string;
  address: string;
  createdAt: string;
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
  id: number;
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
  userId: number | undefined;
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
      query: (userId:number) => `users/${userId}`,
      providesTags: ["user"],
    }),

    // Get all user profiles
    getAllUsersProfiles: builder.query<User[], void>({
      query: () => 'users',
      providesTags: ["users"],
    }),

    // Update a user profile
    updateUserProfile: builder.mutation({
      query: ({ userId, ...patch }) => ({
        url: `users/${userId}`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: ["user", "users"],
    }),

   
updateUserProfileImage: builder.mutation<User, { userId: number; profileUrl: string }>({
  query: ({ userId, profileUrl }) => ({
    url: `users/${userId}/profile-image`,
    method: 'PUT',
    body: { profileUrl },
  }),
  invalidatesTags: ['user'],
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

    
    getBookingById: builder.query<BookingDetails, number>({
      query: (bookingId) => `bookings/${bookingId}`,
      providesTags: (_result, _error, id) => [{ type: 'bookings', id }],
    }),
  }),
});



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
