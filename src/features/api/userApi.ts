import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {apiDomain} from "../../proxxy";
import type { RootState } from '../../app/store';

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({ baseUrl: apiDomain,
    prepareHeaders:(headers,{getState})=>{
      const token = (getState() as RootState).auth.token;
      if(token){
        headers.set('Authorization',  `${token}`);
      }
      headers.set('Content-Type','application/json');
      return headers;
    }
   }),
  tagTypes: ['users', 'user'],
  endpoints: (builder) => ({
    loginUser: builder.mutation({
      query: (userLoginCredentials ) => ({
        url: 'auth/login',
        method: 'POST',
        body: userLoginCredentials,
      }),
    }),
    registerUser: builder.mutation({
      query: (userRegisterPayload)=> ({
        url: 'auth/register',
        method: 'POST',
        body: userRegisterPayload,
      }),
    }),
    getUserById: builder.query({
      query: (userId: number) => `users/${userId}`,
      providesTags: ["user",]
    }),
    getAllUsersProfiles: builder.query({
      query: () => 'users',
      providesTags: ["users"]
    }),
    getUserProfile: builder.query({
      query: (userId: number) => `users/${userId}`,  
      providesTags: ["user"]    
    }),
    updateUserProfile: builder.mutation({
      query: ({ userId, ...patch }) => ({
        url: `users/${userId}`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: ["user", "users"]
    }),
    deleteUserProfile: builder.mutation({
      query: (user_id) => ({
        url: `users/${user_id}`,
        method: 'DELETE',
      }),
  }),
}),
});



