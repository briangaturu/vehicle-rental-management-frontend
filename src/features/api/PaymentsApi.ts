import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../../app/store";

export interface Payment {
  paymentId: number;
  bookingId: number;
  amount: string;
  paymentStatus: "Pending" | "Paid" | "Failed";
  paymentMethod: string | null;
  transactionId: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreatePaymentPayload {
  bookingId: number;
  amount: string;
  paymentStatus?: string;
  paymentMethod: string | null;
  transactionId: string | null;
}

export interface UpdatePaymentPayload extends Partial<CreatePaymentPayload> {
  paymentId: number;
}

export const paymentsApi = createApi({
  reducerPath: "paymentsApi",
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
  tagTypes: ["payments", "payment"],
  endpoints: (builder) => ({
    getAllPayments: builder.query<Payment[], void>({
      query: () => "payments",
      providesTags: ["payments"],
    }),
    getPaymentById: builder.query<Payment, number>({
      query: (id) => `payments/${id}`,
      providesTags: (res, err, id) => [{ type: "payment", id }],
    }),
    getPaymentsByUserId: builder.query<Payment[], number>({
      query: (userId) => `payments/user/${userId}`, // ✅ corrected path
      providesTags: ["payments"],
    }),
    createPayment: builder.mutation<Payment, CreatePaymentPayload>({
      query: (payment) => ({
        url: "payments",
        method: "POST",
        body: payment,
      }),
      invalidatesTags: ["payments"],
    }),
    updatePayment: builder.mutation<Payment, UpdatePaymentPayload>({
      query: ({ paymentId, ...rest }) => ({
        url: `payments/${paymentId}`,
        method: "PUT",
        body: rest,
      }),
      invalidatesTags: ["payments", "payment"],
    }),
    deletePayment: builder.mutation<{ message: string }, number>({
      query: (paymentId) => ({
        url: `payments/${paymentId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["payments"],
    }),
    createPaymentSession: builder.mutation({
      query: (paymentPayload) => ({
        url: "payments/checkout-session",
        method: "POST",
        body: paymentPayload,
      }),
      invalidatesTags: ["payment"],
    }),
  }),
});

export const {
  useGetAllPaymentsQuery,
  useGetPaymentByIdQuery,
  useGetPaymentsByUserIdQuery, // ✅ now exported
  useCreatePaymentMutation,
  useUpdatePaymentMutation,
  useDeletePaymentMutation,
} = paymentsApi;

export default paymentsApi;
