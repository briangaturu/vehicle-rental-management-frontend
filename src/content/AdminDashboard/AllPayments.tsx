// src/pages/PaymentsTable.tsx
import React, { useState } from "react";
import { useGetAllPaymentsQuery, useUpdatePaymentMutation } from "../../features/api/PaymentsApi";
import { PuffLoader } from "react-spinners";
import Swal from "sweetalert2";
import { toast, Toaster } from "sonner";

const PaymentsTable = () => {
  const { data: payments, isLoading, isError } = useGetAllPaymentsQuery();
  const [updatePayment] = useUpdatePaymentMutation();
  const [cancellingPaymentId, setCancellingPaymentId] = useState<number | null>(null);

  const handleCancelPayment = async (paymentId: number) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "This will cancel the payment.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, cancel it!",
      });

      if (result.isConfirmed) {
        await updatePayment({
          paymentId,
          paymentStatus: "Failed",
        }).unwrap();
        toast.success("Payment cancelled successfully.");
      }
    } catch (error) {
      toast.error("Failed to cancel payment.");
    } finally {
      setCancellingPaymentId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center mt-10">
        <PuffLoader color="#001258" />
      </div>
    );
  }

  if (isError) {
    return <div className="text-center text-red-600 mt-10">Failed to load payments.</div>;
  }

  return (
    <div className="p-4">
      <Toaster />
      <h2 className="text-2xl font-semibold mb-4">All Payments</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300">
          <thead className="bg-[#001258] text-white">
            <tr>
              <th className="py-2 px-4 border">#</th>
              <th className="py-2 px-4 border">Booking ID</th>
              <th className="py-2 px-4 border">Amount</th>
              <th className="py-2 px-4 border">Status</th>
              <th className="py-2 px-4 border">Method</th>
              <th className="py-2 px-4 border">Transaction ID</th>
              <th className="py-2 px-4 border">Date</th>
              <th className="py-2 px-4 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {payments?.map((payment, index) => (
              <tr key={payment.paymentId} className="text-center hover:bg-gray-100">
                <td className="py-2 px-4 border">{index + 1}</td>
                <td className="py-2 px-4 border">{payment.bookingId}</td>
                <td className="py-2 px-4 border">{payment.amount}</td>
                <td className="py-2 px-4 border">
                  <span
                    className={`px-2 py-1 rounded-full text-sm ${
                      payment.paymentStatus === "Paid"
                        ? "bg-green-200 text-green-800"
                        : payment.paymentStatus === "Pending"
                        ? "bg-yellow-200 text-yellow-800"
                        : "bg-red-200 text-red-800"
                    }`}
                  >
                    {payment.paymentStatus}
                  </span>
                </td>
                <td className="py-2 px-4 border">{payment.paymentMethod || "-"}</td>
                <td className="py-2 px-4 border">{payment.transactionId || "-"}</td>
                <td className="py-2 px-4 border">
                  {payment.createdAt ? new Date(payment.createdAt).toLocaleDateString() : "-"}
                </td>
                <td className="py-2 px-4 border">
                  {payment.paymentStatus === "Pending" ? (
                    <button
                      onClick={() => handleCancelPayment(payment.paymentId)}
                      disabled={cancellingPaymentId === payment.paymentId}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Cancel
                    </button>
                  ) : (
                    <span className="text-gray-400">N/A</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentsTable;
