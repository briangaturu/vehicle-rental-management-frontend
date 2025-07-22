import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import type { RootState } from "../../app/store";

interface Payment {
  id: number;
  bookingId: number;
  amount: string;
  paymentStatus: string;
  paymentMethod: string | null;
  transactionId: string | null;
}

const Payments: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  
  const userFromRedux = useSelector(
    (state: RootState) => state.auth.user
  );

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        let user = userFromRedux;

        
        if (!user) {
          const storedUser = sessionStorage.getItem("user");
          if (storedUser) {
            user = JSON.parse(storedUser);
          }
        }

        if (!user || !user.id) {
          setError("User not logged in.");
          setLoading(false);
          return;
        }

        const userId = user.id;
        const response = await axios.get(`/api/payments/user/${userId}`);
        console.log("Payments API response:", response.data);

    
        const paymentList = Array.isArray(response.data)
          ? response.data
          : response.data?.payments || [];

        setPayments(paymentList);
      } catch (err: any) {
        console.error(err);
        setError(err.response?.data?.error || "Failed to fetch payments");
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [userFromRedux]);

  if (loading) {
    return <p className="text-gray-600">Loading payments...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  
  if (!Array.isArray(payments)) {
    return (
      <p className="text-red-500">
        Payments data format is invalid.
      </p>
    );
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
              <tr key={payment.id} className="border-t">
                <td>{payment.id}</td>
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
