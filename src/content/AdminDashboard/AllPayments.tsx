import { useState } from "react";
import { SaveIcon } from "lucide-react";
import { FaTimes } from "react-icons/fa";
import { FiEdit } from "react-icons/fi";
import { AiFillDelete } from "react-icons/ai";
import { PuffLoader } from "react-spinners";
import Swal from "sweetalert2";
import { toast, Toaster } from "sonner";
import { useForm } from "react-hook-form";
import {
  paymentsApi,
  type Payment,
  type CreatePaymentPayload,
} from "../../features/api/PaymentsApi";

const statusBadgeColors: Record<string, string> = {
  Paid: "bg-green-600 text-white",
  Pending: "bg-yellow-500 text-white",
  Failed: "bg-red-600 text-white",
};

export const AllPayments = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPayment, setEditingPayment] = useState<Payment | null>(null);

  const {
    data: paymentsData = [],
    isLoading,
    error,
  } = paymentsApi.useGetAllPaymentsQuery();

  const [createPayment] = paymentsApi.useCreatePaymentMutation();
  const [updatePayment] = paymentsApi.useUpdatePaymentMutation();
  const [deletePayment] = paymentsApi.useDeletePaymentMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreatePaymentPayload>();

  const handleModalToggle = (payment?: Payment) => {
    if (payment) {
      setEditingPayment(payment);
      reset(payment);
    } else {
      setEditingPayment(null);
      reset();
    }
    setIsModalOpen(!isModalOpen);
  };

  const onSubmit = async (data: CreatePaymentPayload) => {
    const loadingToast = toast.loading(
      editingPayment ? "Updating Payment..." : "Creating Payment..."
    );

    try {
      if (editingPayment) {
        await updatePayment({
          paymentId: editingPayment.paymentId,
          ...data,
        }).unwrap();
        toast.success("Payment updated successfully!", { id: loadingToast });
      } else {
        await createPayment(data).unwrap();
        toast.success("Payment created successfully!", { id: loadingToast });
      }
      handleModalToggle();
    } catch (err: any) {
      toast.error(err?.data?.error || "Something went wrong", {
        id: loadingToast,
      });
    }
  };

  const deletePaymentHandler = (paymentId: number) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This payment will be deleted permanently.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deletePayment(paymentId).unwrap();
          toast.success("Payment deleted successfully!");
        } catch (error: any) {
          toast.error(error?.data?.error || "Failed to delete payment.");
        }
      }
    });
  };

  return (
    <>
      <Toaster richColors position="top-right" />
      
      <div className="bg-white p-6 rounded-lg shadow-md mt-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">All Payments</h2>
          <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
            {paymentsData.length} {paymentsData.length === 1 ? 'payment' : 'payments'}
          </span>
        </div>



        {error && (
          <div className="text-center py-8">
            <div className="text-red-400 text-6xl mb-4">⚠️</div>
            <p className="text-red-600 font-medium">Error occurred while fetching payments.</p>
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Loading payments...</p>
          </div>
        ) : paymentsData.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">💳</div>
            <p className="text-gray-500 text-lg font-medium">No payments found.</p>
            <p className="text-gray-400 text-sm">Payments will appear here once they are processed.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-4 px-4 font-semibold text-gray-700 uppercase tracking-wider">#</th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-700 uppercase tracking-wider">Booking ID</th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-700 uppercase tracking-wider">Amount</th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-700 uppercase tracking-wider">Method</th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-700 uppercase tracking-wider">Date</th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paymentsData.map((p, index) => (
                  <tr key={p.paymentId} className={`hover:bg-gray-50 transition-colors duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                    <td className="py-4 px-4 font-bold text-gray-900">#{p.paymentId}</td>
                    <td className="py-4 px-4 text-gray-700">#{p.bookingId}</td>
                    <td className="py-4 px-4 font-semibold text-green-600">$ {p.amount}</td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        p.paymentStatus === 'Paid' 
                          ? 'bg-green-100 text-green-800' 
                          : p.paymentStatus === 'Pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : p.paymentStatus === 'Failed'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {p.paymentStatus}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-gray-700">
                      {p.paymentMethod || (
                        <span className="text-gray-400 italic">N/A</span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-gray-700">
                      {p.createdAt
                        ? new Date(p.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })
                        : (
                          <span className="text-gray-400 italic">N/A</span>
                        )}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleModalToggle(p)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors duration-200"
                          title="Edit payment"
                        >
                          <FiEdit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deletePaymentHandler(p.paymentId)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors duration-200"
                          title="Delete payment"
                        >
                          <AiFillDelete className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg relative">
            <button
              onClick={() => handleModalToggle()}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl font-bold"
            >
              &times;
            </button>

            <div className="p-6">
              <div className="flex items-center mb-6">
                <div className="bg-blue-100 p-2 rounded-lg mr-3">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  {editingPayment ? "Edit Payment" : "Add New Payment"}
                </h3>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Booking ID
                  </label>
                  <input
                    type="number"
                    {...register("bookingId", { required: true })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Enter booking ID"
                  />
                  {errors.bookingId && (
                    <span className="text-red-500 text-xs mt-1 block">
                      Booking ID is required
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Amount
                  </label>
                  <input
                    type="text"
                    {...register("amount", { required: true })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Enter amount"
                  />
                  {errors.amount && (
                    <span className="text-red-500 text-xs mt-1 block">
                      Amount is required
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Payment Status
                  </label>
                  <select
                    {...register("paymentStatus")}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  >
                    <option value="">Select Status</option>
                    <option value="Pending">Pending</option>
                    <option value="Paid">Paid</option>
                    <option value="Failed">Failed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Payment Method
                  </label>
                  <input
                    type="text"
                    {...register("paymentMethod")}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Mpesa, Stripe, etc."
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Transaction ID
                  </label>
                  <input
                    type="text"
                    {...register("transactionId")}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Transaction ID"
                  />
                </div>

                <div className="flex gap-3 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => handleModalToggle()}
                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="flex-1 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center"
                  >
                    <SaveIcon size={18} className="mr-2" />
                    {editingPayment ? "Update" : "Save"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
