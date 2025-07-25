import { FiEdit } from "react-icons/fi";
import { AiFillDelete } from "react-icons/ai";
import { userApi } from "../../features/api/userApi";
import type { RootState } from "../../app/store";
import { useSelector } from "react-redux";
import { PuffLoader } from "react-spinners";
import { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { SaveIcon } from "lucide-react";

interface UserDetail {
   userId: number;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  contact: string;
  address: string;
  createdAt: string;
  profileUrl?: string;
  role?: 'user' | 'admin' | 'disabled';
  bookings?: any[]; 
  supportTickets?: any[]; 
}

const getUserTypeBadge = (userType: string) => {
  switch (userType) {
    case "admin":
      return "bg-green-100 text-green-700";
    case "disabled":
      return "bg-red-100 text-red-700";
    case "user":
      return "bg-yellow-100 text-yellow-700";
    default:
      return "bg-blue-100 text-blue-700";
  }
};

export const AllUsers = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserDetail | null>(null);

  const { isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );

  const {
    data: usersData = [],
    isLoading: userDataIsLoading,
    error,
  } = userApi.useGetAllUsersProfilesQuery(undefined, {
    skip: !isAuthenticated,
  });

  const handleModalToggle = (user?: UserDetail) => {
    setSelectedUser(user || null);
    setIsModalOpen(!isModalOpen);
  };

  const handleDelete = (userId: number) => {
    console.log("Delete user with ID:", userId);
    // integrate your delete API here
  };

  const handleSubmit = async () => {
    console.log("Submit user type change for user:", selectedUser);
    setIsModalOpen(false);
  };

  return (
    <>
      <h1 className="text-2xl font-bold text-center mb-6 text-orange-500">
        All Users
      </h1>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm border border-gray-300">
          <thead className="bg-orange-100 text-blue-950">
            <tr>
              <th className="p-3 border border-gray-300 text-left w-16">User ID</th>
              <th className="p-3 border border-gray-300 text-left w-56">Name</th>
              <th className="p-3 border border-gray-300 text-left w-64">Email</th>
              <th className="p-3 border border-gray-300 text-left w-40">Joined On</th>
              <th className="p-3 border border-gray-300 text-left w-28">Role</th>
              <th className="p-3 border border-gray-300 text-center w-32">Actions</th>
            </tr>
          </thead>
          <tbody>
            {error ? (
              <tr>
                <td
                  colSpan={6}
                  className="text-center text-red-600 font-semibold p-4"
                >
                  Error while fetching users. Try again.
                </td>
              </tr>
            ) : userDataIsLoading ? (
              <tr>
                <td colSpan={6} className="text-center p-4">
                  <PuffLoader color="#0aff13" />
                </td>
              </tr>
            ) : usersData.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="text-center text-gray-500 font-semibold p-4"
                >
                  No users found.
                </td>
              </tr>
            ) : (
              usersData.map((user: UserDetail) => (
                <tr
                  key={user.userId}
                  className="hover:bg-blue-100 transition-colors"
                >
                  <td className="p-3 border border-gray-300">
                    {user.userId}
                  </td>
                  <td className="p-3 border border-gray-300">
                    <div className="flex items-center gap-3">
                      <img
                        src={user.profileUrl}
                        alt={user.firstname}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <span className="font-semibold text-orange-500">
                        {user.firstname} {user.lastname}
                      </span>
                    </div>
                  </td>
                  <td className="p-3 border border-gray-300 text-blue-950">
                    {user.email}
                  </td>
                  <td className="p-3 border border-gray-300 text-gray-700">
                    {new Date(user.createdAt).toLocaleString()}
                  </td>
                  <td className="p-3 border border-gray-300">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${getUserTypeBadge(
                        user.role ?? 'undefined'
                      )}`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="p-3 border border-gray-300 text-center">
                    <button
                      onClick={() => handleModalToggle(user)}
                      className="btn btn-xs btn-outline text-blue-700 border-blue-700 hover:bg-blue-700 hover:text-white mr-2"
                    >
                      <FiEdit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(user.userId)}
                      className="btn btn-xs btn-outline text-red-600 border-red-600 hover:bg-red-600 hover:text-white"
                    >
                      <AiFillDelete size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box w-96 max-w-full bg-white border-2 border-orange-300">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-orange-500">
                Change User Type
              </h2>
              <button
                className="text-gray-600 hover:text-red-500"
                onClick={() => handleModalToggle()}
              >
                <FaTimes size={20} />
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
            >
              <div className="mb-4">
                <label
                  htmlFor="role"
                  className="block text-sm font-medium text-orange-500 mb-1"
                >
                  User Type
                </label>
                <select
                  className="select select-bordered w-full border-orange-300 text-blue-950"
                  defaultValue={selectedUser?.role || ""}
                >
                  <option value="">Select UserType</option>
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                  <option value="disabled">Disabled</option>
                </select>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => handleModalToggle()}
                  className="btn btn-error mr-2"
                >
                  <FaTimes /> Cancel
                </button>
                <button type="submit" className="btn bg-blue-700 text-white hover:bg-blue-800">
                  <SaveIcon size={16} /> Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
