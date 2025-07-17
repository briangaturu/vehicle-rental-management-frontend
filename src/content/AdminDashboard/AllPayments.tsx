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
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-blue-950">All Payments</h2>
        <button
          onClick={() => handleModalToggle()}
          className="btn bg-orange-500 hover:bg-orange-600 text-white"
        >
          Add Payment
        </button>
      </div>

      {error && (
        <p className="text-red-600 font-semibold">
          Error occurred while fetching payments.
        </p>
      )}

      {isLoading ? (
        <div className="flex justify-center">
          <PuffLoader color="#2563eb" />
        </div>
      ) : paymentsData.length === 0 ? (
        <p className="text-gray-500">No payments found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-sm">
            <thead className="bg-blue-950 text-orange-400">
              <tr>
                <th className="p-3 text-left">#</th>
                <th className="p-3 text-left">Booking ID</th>
                <th className="p-3 text-left">Amount</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Method</th>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paymentsData.map((p) => (
                <tr
                  key={p.paymentId}
                  className="hover:bg-blue-50 border-t border-gray-200"
                >
                  <td className="p-3">{p.paymentId}</td>
                  <td className="p-3 text-orange-500">{p.bookingId}</td>
                  <td className="p-3 text-green-600 font-semibold">
                    KSH {p.amount}
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded text-xs font-bold ${statusBadgeColors[p.paymentStatus]}`}
                    >
                      {p.paymentStatus}
                    </span>
                  </td>
                  <td className="p-3">{p.paymentMethod || "N/A"}</td>
                  <td className="p-3">
                    {p.createdAt
                      ? new Date(p.createdAt).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td className="p-3 flex gap-2">
                    <button
                      className="btn btn-sm btn-outline border-blue-700 text-blue-700 hover:bg-blue-700 hover:text-white"
                      onClick={() => handleModalToggle(p)}
                    >
                      <FiEdit />
                    </button>
                    <button
                      className="btn btn-sm btn-outline border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
                      onClick={() => deletePaymentHandler(p.paymentId)}
                    >
                      <AiFillDelete />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box bg-white border p-6 w-full max-w-lg">
            <h3 className="text-2xl font-bold text-blue-950 mb-4">
              {editingPayment ? "Edit Payment" : "Add New Payment"}
            </h3>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-blue-950">
                    Booking ID
                  </label>
                  <input
                    type="number"
                    {...register("bookingId", { required: true })}
                    className="input input-bordered w-full"
                    placeholder="Enter booking ID"
                  />
                  {errors.bookingId && (
                    <span className="text-red-500 text-xs">
                      Booking ID is required
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-blue-950">
                    Amount
                  </label>
                  <input
                    type="text"
                    {...register("amount", { required: true })}
                    className="input input-bordered w-full"
                    placeholder="Enter amount"
                  />
                  {errors.amount && (
                    <span className="text-red-500 text-xs">
                      Amount is required
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-blue-950">
                    Payment Status
                  </label>
                  <select
                    {...register("paymentStatus")}
                    className="select select-bordered w-full"
                  >
                    <option value="">Select Status</option>
                    <option value="Pending">Pending</option>
                    <option value="Paid">Paid</option>
                    <option value="Failed">Failed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-blue-950">
                    Payment Method
                  </label>
                  <input
                    type="text"
                    {...register("paymentMethod")}
                    className="input input-bordered w-full"
                    placeholder="Mpesa, Stripe, etc."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-blue-950">
                    Transaction ID
                  </label>
                  <input
                    type="text"
                    {...register("transactionId")}
                    className="input input-bordered w-full"
                    placeholder="Transaction ID"
                  />
                </div>
              </div>

              <div className="flex justify-end mt-4">
                <button
                  type="button"
                  onClick={() => handleModalToggle()}
                  className="btn btn-error text-white mr-2"
                >
                  <FaTimes /> Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <SaveIcon /> {editingPayment ? "Update" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
