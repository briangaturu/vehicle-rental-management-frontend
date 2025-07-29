import { FiEdit } from "react-icons/fi";
import { AiFillDelete } from "react-icons/ai";
import { userApi } from "../../features/api/userApi";
import type { RootState } from "../../app/store";
import { useSelector } from "react-redux";
import { useState } from "react";
import { SaveIcon } from "lucide-react";

interface UserDetail {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  contact: string;
  address: string;
  createdAt: string;
  profileUrl?: string;
  role?: "user" | "admin" | "disabled";
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

  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

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
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md mt-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-3">
          <h2 className="text-lg sm:text-2xl font-bold text-gray-900">
            All Users
          </h2>
          <span className="bg-blue-100 text-blue-800 text-xs sm:text-sm font-medium px-3 py-1 rounded-full">
            {usersData.length} {usersData.length === 1 ? "user" : "users"}
          </span>
        </div>

        {/* Loading / Error / Empty States */}
        {error ? (
          <div className="text-center py-8">
            <div className="text-red-400 text-5xl sm:text-6xl mb-4">⚠️</div>
            <p className="text-red-600 font-medium">
              Error while fetching users. Try again.
            </p>
          </div>
        ) : userDataIsLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Loading users...</p>
          </div>
        ) : usersData.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-5xl sm:text-6xl mb-4">👥</div>
            <p className="text-gray-500 text-lg font-medium">No users found.</p>
            <p className="text-gray-400 text-sm">
              Users will appear here once they register.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            {/* Responsive Table */}
            <table className="w-full text-sm border border-[#001258] rounded-lg">
              <thead>
                <tr className="bg-[#001258]">
                  <th className="text-left py-3 px-3 font-semibold text-white uppercase tracking-wider border-b border-[#001258]">
                    User ID
                  </th>
                  <th className="text-left py-3 px-3 font-semibold text-white uppercase tracking-wider border-b border-[#001258]">
                    Name
                  </th>
                  <th className="hidden sm:table-cell text-left py-3 px-3 font-semibold text-white uppercase tracking-wider border-b border-[#001258]">
                    Email
                  </th>
                  <th className="hidden lg:table-cell text-left py-3 px-3 font-semibold text-white uppercase tracking-wider border-b border-[#001258]">
                    Joined On
                  </th>
                  <th className="text-left py-3 px-3 font-semibold text-white uppercase tracking-wider border-b border-[#001258]">
                    Role
                  </th>
                  <th className="text-left py-3 px-3 font-semibold text-white uppercase tracking-wider border-b border-[#001258]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {usersData.map((user: UserDetail, index) => (
                  <tr
                    key={user.id}
                    className={`border-b border-[#001258] transition-colors duration-200 ${
                      index % 2 === 0 ? "bg-white" : "bg-[#F3F4F6]"
                    } hover:bg-[#F3F4F6]`}
                  >
                    <td className="py-3 px-3 font-bold text-gray-900">
                      #{user.id}
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            user.profileUrl ||
                            "https://via.placeholder.com/40x40?text=U"
                          }
                          alt={user.firstname}
                          className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover border"
                        />
                        <span className="font-semibold text-gray-900 text-xs sm:text-sm">
                          {user.firstname} {user.lastname}
                        </span>
                      </div>
                    </td>
                    <td className="hidden sm:table-cell py-3 px-3 text-gray-700">
                      {user.email}
                    </td>
                    <td className="hidden lg:table-cell py-3 px-3 text-gray-700">
                      {new Date(user.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getUserTypeBadge(
                          user.role ?? "undefined"
                        )}`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleModalToggle(user)}
                          className="p-1 sm:p-2 text-[#001258] hover:bg-[#F3F4F6] hover:text-[#001258] rounded-lg"
                          title="Edit user"
                        >
                          <FiEdit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="p-1 sm:p-2 text-red-600 hover:bg-[#F3F4F6] hover:text-[#001258] rounded-lg"
                          title="Delete user"
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md sm:max-w-lg relative">
            <button
              onClick={() => handleModalToggle()}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl font-bold"
            >
              &times;
            </button>

            <div className="p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">
                Change User Type
              </h2>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmit();
                }}
                className="space-y-4"
              >
                <div>
                  <label
                    htmlFor="role"
                    className="block text-gray-700 font-semibold mb-2"
                  >
                    User Type
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    defaultValue={selectedUser?.role || ""}
                  >
                    <option value="">Select User Type</option>
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                    <option value="disabled">Disabled</option>
                  </select>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => handleModalToggle()}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center"
                  >
                    <SaveIcon size={18} className="mr-2" />
                    Save Profile
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
