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
      <div className="bg-white p-6 rounded-lg shadow-md mt-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">All Users</h2>
          <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
            {usersData.length} {usersData.length === 1 ? 'user' : 'users'}
          </span>
        </div>

        {error ? (
          <div className="text-center py-8">
            <div className="text-red-400 text-6xl mb-4">⚠️</div>
            <p className="text-red-600 font-medium">Error while fetching users. Try again.</p>
          </div>
        ) : userDataIsLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Loading users...</p>
          </div>
        ) : usersData.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">👥</div>
            <p className="text-gray-500 text-lg font-medium">No users found.</p>
            <p className="text-gray-400 text-sm">Users will appear here once they register.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-4 px-4 font-semibold text-gray-700 uppercase tracking-wider">User ID</th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-700 uppercase tracking-wider">Name</th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-700 uppercase tracking-wider">Email</th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-700 uppercase tracking-wider">Joined On</th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-700 uppercase tracking-wider">Role</th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {usersData.map((user: UserDetail, index) => (
                  <tr key={user.userId} className={`hover:bg-gray-50 transition-colors duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                    <td className="py-4 px-4 font-bold text-gray-900">#{user.userId}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={user.profileUrl || 'https://via.placeholder.com/40x40?text=U'}
                          alt={user.firstname}
                          className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                        />
                        <span className="font-semibold text-gray-900">
                          {user.firstname} {user.lastname}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-gray-700">{user.email}</td>
                    <td className="py-4 px-4 text-gray-700">
                      {new Date(user.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getUserTypeBadge(user.role ?? 'undefined')}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleModalToggle(user)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors duration-200"
                          title="Edit user"
                        >
                          <FiEdit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(user.userId)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors duration-200"
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

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md relative">
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-gray-900">Change User Type</h2>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmit();
                }}
                className="space-y-6"
              >
                <div>
                  <label
                    htmlFor="role"
                    className="block text-gray-700 font-semibold mb-2"
                  >
                    User Type
                  </label>
                  <select
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    defaultValue={selectedUser?.role || ""}
                  >
                    <option value="">Select User Type</option>
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                    <option value="disabled">Disabled</option>
                  </select>
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
