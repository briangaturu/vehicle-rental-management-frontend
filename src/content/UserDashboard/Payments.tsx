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
    <div className="bg-white p-6 rounded-lg shadow-md mt-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">My Payments</h2>
        <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
          {payments.length} {payments.length === 1 ? 'payment' : 'payments'}
        </span>
      </div>

      {payments.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-gray-400 text-6xl mb-4">💳</div>
          <p className="text-gray-500 text-lg">No payments found.</p>
          <p className="text-gray-400 text-sm">Your payment history will appear here.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-4 px-4 font-semibold text-gray-700 uppercase tracking-wider">Payment ID</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700 uppercase tracking-wider">Booking ID</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700 uppercase tracking-wider">Amount</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700 uppercase tracking-wider">Method</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700 uppercase tracking-wider">Transaction ID</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {payments.map((payment, index) => (
                <tr key={payment.paymentId} className={`hover:bg-gray-50 transition-colors duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                  <td className="py-4 px-4 font-medium text-gray-900">#{payment.paymentId}</td>
                  <td className="py-4 px-4 text-gray-700">#{payment.bookingId}</td>
                  <td className="py-4 px-4 font-semibold text-gray-900">${payment.amount}</td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      payment.paymentStatus === "Paid" 
                        ? "bg-green-100 text-green-800" 
                        : payment.paymentStatus === "Pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : payment.paymentStatus === "Failed"
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-100 text-gray-800"
                    }`}>
                      {payment.paymentStatus}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-gray-700">
                    {payment.paymentMethod || (
                      <span className="text-gray-400 italic">-</span>
                    )}
                  </td>
                  <td className="py-4 px-4 text-gray-700 font-mono text-xs">
                    {payment.transactionId || (
                      <span className="text-gray-400 italic">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Payments;
