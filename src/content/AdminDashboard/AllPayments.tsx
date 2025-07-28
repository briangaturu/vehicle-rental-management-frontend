import { useState } from "react";
import { SaveIcon } from "lucide-react";
import { FiEdit } from "react-icons/fi";
import { AiFillDelete } from "react-icons/ai";
import Swal from "sweetalert2";
import { toast, Toaster } from "sonner";
import { useForm } from "react-hook-form";
import {
  paymentsApi,
  type Payment,
  type CreatePaymentPayload,
} from "../../features/api/PaymentsApi";


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
  
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md mt-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-3">
          <h2 className="text-lg sm:text-2xl font-bold text-gray-900">All Payments</h2>
          <span className="bg-blue-100 text-blue-800 text-xs sm:text-sm font-medium px-3 py-1 rounded-full">
            {paymentsData.length} {paymentsData.length === 1 ? "payment" : "payments"}
          </span>
        </div>
  
        {/* States */}
        {error && (
          <div className="text-center py-8">
            <div className="text-red-400 text-6xl mb-4">⚠️</div>
            <p className="text-red-600 font-medium">Error occurred while fetching payments.</p>
          </div>
        )}
  
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Loading payments...</p>
          </div>
        ) : paymentsData.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-5xl sm:text-6xl mb-4">💳</div>
            <p className="text-gray-500 text-lg font-medium">No payments found.</p>
            <p className="text-gray-400 text-sm">Payments will appear here once they are processed.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs sm:text-sm">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 px-3 sm:py-4 sm:px-4">#</th>
                  <th className="text-left py-3 px-3 sm:py-4 sm:px-4">Booking ID</th>
                  <th className="text-left py-3 px-3 sm:py-4 sm:px-4">Amount</th>
                  <th className="text-left py-3 px-3 sm:py-4 sm:px-4">Status</th>
                  <th className="hidden md:table-cell text-left py-3 px-3 sm:py-4 sm:px-4">Method</th>
                  <th className="hidden md:table-cell text-left py-3 px-3 sm:py-4 sm:px-4">Date</th>
                  <th className="text-left py-3 px-3 sm:py-4 sm:px-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paymentsData.map((p, index) => (
                  <tr
                    key={p.paymentId}
                    className={`hover:bg-gray-50 transition-colors duration-200 ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                  >
                    <td className="py-3 px-3 sm:py-4 sm:px-4 font-bold">#{p.paymentId}</td>
                    <td className="py-3 px-3 sm:py-4 sm:px-4">#{p.bookingId}</td>
                    <td className="py-3 px-3 sm:py-4 sm:px-4 font-semibold text-green-600">$ {p.amount}</td>
                    <td className="py-3 px-3 sm:py-4 sm:px-4">
                      <span
                        className={`inline-block px-2 py-1 text-xs sm:text-sm rounded-full ${
                          p.paymentStatus === "Paid"
                            ? "bg-green-100 text-green-700"
                            : p.paymentStatus === "Pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {p.paymentStatus}
                      </span>
                    </td>
                    <td className="hidden md:table-cell py-3 px-3 sm:py-4 sm:px-4">
                      {p.paymentMethod || <span className="text-gray-400 italic">N/A</span>}
                    </td>
                    <td className="hidden md:table-cell py-3 px-3 sm:py-4 sm:px-4">
                      {p.createdAt
                        ? new Date(p.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })
                        : "N/A"}
                    </td>
                    <td className="py-3 px-3 sm:py-4 sm:px-4 flex gap-2">
                      <button
                        onClick={() => handleModalToggle(p)}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded"
                        title="Edit"
                      >
                        <FiEdit size={16} />
                      </button>
                      <button
                        onClick={() => deletePaymentHandler(p.paymentId)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded"
                        title="Delete"
                      >
                        <AiFillDelete size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
  
      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg sm:max-w-xl relative">
            <button
              onClick={() => handleModalToggle()}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl font-bold"
            >
              &times;
            </button>
  
            <div className="p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">
                {editingPayment ? "Edit Payment" : "Add New Payment"}
              </h3>
  
              <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-4 sm:gap-6">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Booking ID</label>
                  <input
                    type="number"
                    {...register("bookingId", { required: true })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter booking ID"
                  />
                  {errors.bookingId && (
                    <span className="text-red-500 text-xs mt-1 block">Booking ID is required</span>
                  )}
                </div>
  
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Amount</label>
                  <input
                    type="text"
                    {...register("amount", { required: true })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter amount"
                  />
                </div>
  
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Payment Status</label>
                  <select
                    {...register("paymentStatus")}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Status</option>
                    <option value="Pending">Pending</option>
                    <option value="Paid">Paid</option>
                    <option value="Failed">Failed</option>
                  </select>
                </div>
  
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Payment Method</label>
                  <input
                    type="text"
                    {...register("paymentMethod")}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Mpesa, Stripe, etc."
                  />
                </div>
  
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Transaction ID</label>
                  <input
                    type="text"
                    {...register("transactionId")}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Transaction ID"
                  />
                </div>
  
                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => handleModalToggle()}
                    className="flex-1 px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center"
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
