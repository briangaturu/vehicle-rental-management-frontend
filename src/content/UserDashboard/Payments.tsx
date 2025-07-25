import React from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../app/store";
import { useGetPaymentsByUserIdQuery } from "../../features/api/PaymentsApi";

const Payments: React.FC = () => {
  const userFromRedux = useSelector((state: RootState) => state.auth.user);
  const storedUser = sessionStorage.getItem("user");
  const user = userFromRedux || (storedUser ? JSON.parse(storedUser) : null);
  const userId = user?.id;

  const {
    data: payments = [],
    isLoading,
    isError,
    error,
  } = useGetPaymentsByUserIdQuery(userId, {
    skip: !userId,
  });

  if (!userId) {
    return <p className="text-red-500">User not logged in.</p>;
  }

  if (isLoading) {
    return <p className="text-gray-600">Loading payments...</p>;
  }

  if (isError) {
    const errMsg =
      (error as any)?.data?.error || "Failed to fetch payments";
    return <p className="text-red-500">{errMsg}</p>;
  }

  if (!Array.isArray(payments)) {
    return <p className="text-red-500">Payments data format is invalid.</p>;
  }

  return (
    <div className="bg-white p-6 rounded shadow mt-8">
      <h2 className="text-2xl font-bold mb-4">My Payments</h2>

      {payments.length === 0 ? (
        <p className="text-gray-500">No payments found.</p>
      ) : (
        <table className="w-full text-sm">
          <thead className="text-left text-gray-600">
            <tr>
              <th>Payment ID</th>
              <th>Booking ID</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Method</th>
              <th>Transaction ID</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment.paymentId} className="border-t">
                <td>{payment.paymentId}</td>
                <td>{payment.bookingId}</td>
                <td>${payment.amount}</td>
                <td
                  className={[
                    payment.paymentStatus === "Paid" &&
                      "text-green-600 font-semibold",
                    payment.paymentStatus === "Pending" &&
                      "text-yellow-600 font-semibold",
                    payment.paymentStatus === "Failed" &&
                      "text-red-600 font-semibold",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  {payment.paymentStatus}
                </td>
                <td>{payment.paymentMethod || "-"}</td>
                <td>{payment.transactionId || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Payments;
