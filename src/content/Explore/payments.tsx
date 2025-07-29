import { paymentsApi } from "../../features/api/PaymentsApi";

interface Props {
  amount: number;
  bookingId: number | null;
  userId:number | undefined;
}

export const StripeCheckoutButton = ({ amount, bookingId,userId }: Props) => {
  const [createPaymentSession, { isLoading }] = paymentsApi.useCreatePaymentSessionMutation();

  const handleClick = async () => {
    try {
      const response = await createPaymentSession({ amount, bookingId,userId }).unwrap();
      if (response.url) {
        window.location.href = response.url;
      } else {
        alert("Failed to start payment.");
      }
    } catch (error) {
      console.error("Payment session error:", error);
      alert("Error initiating payment.");
    }
  };

  return (
    <button
      onClick={handleClick}
      className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 disabled:opacity-50"
      disabled={isLoading}
    >
      {isLoading ? "Processing..." : "Pay"}
    </button>
  );
};