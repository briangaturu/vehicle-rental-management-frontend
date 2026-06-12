import { useState } from "react";
import { paymentsApi } from "../../features/api/PaymentsApi";

interface Props {
  amount: number;
  bookingId: number | null;
  userId: number | undefined;
}

export const PaymentButton = ({ amount, bookingId, userId }: Props) => {
  const [method, setMethod] = useState<"stripe" | "mpesa" | null>(null);
  const [phone, setPhone] = useState("");
  const [mpesaSuccess, setMpesaSuccess] = useState(false);

  const [createPaymentSession, { isLoading: stripeLoading }] =
    paymentsApi.useCreatePaymentSessionMutation();
  const [initiateMpesaPayment, { isLoading: mpesaLoading }] =
    paymentsApi.useInitiateMpesaPaymentMutation();

  const handleStripe = async () => {
    if (!userId || !bookingId) return;
    try {
      const session = await createPaymentSession({
        amount,
        userId,
        bookingId,
        method: "stripe",
      }).unwrap();
      window.open(session.url, "_blank");
    } catch (err: any) {
      console.error("Stripe failed:", err);
    }
  };

  const handleMpesa = async () => {
    if (!userId || !bookingId || !phone) return;
    try {
      await initiateMpesaPayment({
        amount,
        userId,
        bookingId,
        phone: `254${phone}`,
      }).unwrap();
      setMpesaSuccess(true);
    } catch (err: any) {
      console.error("M-Pesa failed:", err);
    }
  };

  // If no method selected yet, show method selection
  if (!method) {
    return (
      <div className="flex flex-col gap-3">
        <p className="text-sm font-medium text-gray-700 text-center mb-2">Choose payment method</p>
        <button
          onClick={() => setMethod("mpesa")}
          className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 text-left"
        >
          <span className="text-2xl">📱</span>
          <div>
            <p className="text-sm font-medium">M-Pesa</p>
            <p className="text-xs text-gray-500">STK push to your phone</p>
          </div>
        </button>
        <button
          onClick={() => setMethod("stripe")}
          className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 text-left"
        >
          <span className="text-2xl">💳</span>
          <div>
            <p className="text-sm font-medium">Card</p>
            <p className="text-xs text-gray-500">Visa, Mastercard via Stripe</p>
          </div>
        </button>
      </div>
    );
  }

  // M-Pesa flow
  if (method === "mpesa" && !mpesaSuccess) {
    return (
      <div className="flex flex-col gap-3">
        <button onClick={() => setMethod(null)} className="text-xs text-gray-500 hover:underline text-left">
          ← Back
        </button>
        <p className="text-sm font-medium">M-Pesa payment</p>
        <div className="flex border rounded-lg overflow-hidden">
          <span className="px-3 bg-gray-50 text-gray-500 text-sm flex items-center border-r">+254</span>
          <input
            type="tel"
            placeholder="7XX XXX XXX"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="flex-1 px-3 py-2 text-sm outline-none"
          />
        </div>
        <button
          onClick={handleMpesa}
          disabled={mpesaLoading || !phone}
          className="w-full py-2 bg-green-700 text-white text-sm rounded-lg hover:bg-green-800 disabled:opacity-50"
        >
          {mpesaLoading ? "Sending..." : "Send STK push"}
        </button>
      </div>
    );
  }

  // M-Pesa success
  if (method === "mpesa" && mpesaSuccess) {
    return (
      <p className="text-sm text-green-600 font-medium text-center py-4">
        ✅ STK push sent — check your phone to complete payment.
      </p>
    );
  }

  // Stripe flow
  if (method === "stripe") {
    return (
      <div className="flex flex-col gap-3">
        <button onClick={() => setMethod(null)} className="text-xs text-gray-500 hover:underline text-left">
          ← Back
        </button>
        <p className="text-sm font-medium">Card payment</p>
        <p className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
          🔒 You'll be redirected to Stripe's secure checkout.
        </p>
        <button
          onClick={handleStripe}
          disabled={stripeLoading || !userId || !bookingId}
          className="w-full py-2 bg-orange-600 text-white text-sm rounded-lg hover:bg-orange-700 disabled:opacity-50"
        >
          {stripeLoading ? "Redirecting..." : "Continue to card payment"}
        </button>
      </div>
    );
  }

  return null;
};