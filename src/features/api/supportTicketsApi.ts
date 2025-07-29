import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../../app/store';
import { apiDomain } from '../../proxxy';

export interface Ticket {
  ticketId: number;
  subject: string;
  description: string;
  userId: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateTicketPayload {
  subject: string;
  description: string;
  userId: number;
}

export interface UpdateTicketPayload extends Partial<CreateTicketPayload> {
  ticketId: number;
  adminResponse?: string;
}

export const supportTicketsApi = createApi({
  reducerPath: "supportTicketsApi",
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
  refetchOnReconnect: true,
  refetchOnMountOrArgChange: true,
  tagTypes: ['tickets', 'ticket'],
  endpoints: (builder) => ({
    getAllTickets: builder.query<Ticket[], void>({
      query: () => 'ticket',
      providesTags: ['tickets'],
    }),

    getTicketById: builder.query<Ticket, number>({
      query: (ticketId) => `ticket/${ticketId}`,
      providesTags: (_result, _error, id) => [{ type: 'ticket', id }],
    }),

    getTicketsByUserId: builder.query<Ticket[], number>({
      query: (userId) => `ticket/user/${userId}`,
      providesTags: ['tickets'],
    }),

    createTicket: builder.mutation<Ticket, CreateTicketPayload>({
      query: (ticketData) => ({
        url: 'ticket',
        method: 'POST',
        body: ticketData,
      }),
      invalidatesTags: ['tickets'],
    }),

    updateTicket: builder.mutation<Ticket, UpdateTicketPayload>({
      query: ({ ticketId, ...patch }) => ({
        url: `ticket/${ticketId}`,
        method: 'PATCH',
        body: patch,
      }),
      invalidatesTags: ['tickets', 'ticket'],
    }),

    deleteTicket: builder.mutation<{ message: string }, number>({
      query: (ticketId) => ({
        url: `ticket/${ticketId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['tickets'],
    }),
  }),
});

export const {
  useGetAllTicketsQuery,
  useGetTicketByIdQuery,
  useGetTicketsByUserIdQuery,
  useCreateTicketMutation,
  useUpdateTicketMutation,
  useDeleteTicketMutation,
} = supportTicketsApi;

export default supportTicketsApi;
