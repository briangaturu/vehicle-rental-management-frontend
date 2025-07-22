import { useEffect, useState } from 'react';
import { FaCamera, FaEdit, FaTimes } from 'react-icons/fa';
import { useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { SaveIcon } from 'lucide-react';
import type { RootState } from '../../app/store';
import Swal from 'sweetalert2';
import {
  useUpdateUserProfileMutation,
  useUpdateUserProfileImageMutation
} from '../../features/api/userApi';

interface FormValues {
  firstname: string;
  lastname: string;
  email: string;
  address: string;
  contact: string;
}

const Profile = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, role } = useSelector((state: RootState) => state.auth);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormValues>({
    defaultValues: {
      firstname: user?.firstname || '',
      lastname: user?.lastname || '',
      email: user?.email || '',
      address: user?.address || '',
      contact: user?.contact || '',
    }
  });

  const profilePicture = user?.profileUrl ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.firstname || 'User')}+${encodeURIComponent(user?.lastname || 'Profile')}&background=EF4444&color=fff&size=128`;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updateProfile, { isLoading: isUpdatingProfile }] = useUpdateUserProfileMutation();
  const [updateProfileImage, { isLoading: isUploadingImage }] = useUpdateUserProfileImageMutation();

  const handleModalToggle = () => {
    setIsModalOpen(!isModalOpen);
    if (!isModalOpen && user) {
      reset({
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        address: user.address || '',
        contact: user.contact || '',
      });
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else if (role === 'user') {
      navigate('/user/profile');
    }
  }, [isAuthenticated, role, navigate]);

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      const userId = user?.userId;
      if (!userId) {
        Swal.fire('Error!', 'User ID not found. Cannot update profile.', 'error');
        return;
      }

      await updateProfile({ userId, ...data, password:user.password }).unwrap();
      Swal.fire('Success!', 'Profile updated successfully!', 'success');
      handleModalToggle();
    } catch (error: any) {
      console.error('Failed to update profile:', error);
      Swal.fire('Error!', error?.data?.message || 'Failed to update profile. Please try again.', 'error');
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      Swal.fire({
        title: 'Uploading Image...',
        text: 'Please wait, your profile picture is being uploaded.',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      try {
        const userId = user?.userId;
        if (!userId) {
          Swal.fire('Error!', 'User ID not found for image upload.', 'error');
          return;
        }

        const temporaryProfileUrl = URL.createObjectURL(file);

        await updateProfileImage({ userId, profileUrl: temporaryProfileUrl }).unwrap();
        Swal.fire('Success!', 'Profile image updated successfully!', 'success');
      } catch (error: any) {
        console.error('Failed to update profile image:', error);
        Swal.fire('Error!', error?.data?.message || 'Failed to upload image. Please try again.', 'error');
      }
    }
  };

  return (
    <div className="min-h-screen text-gray-800 py-10 px-5 bg-gradient-to-br from-white to-red-50">
      <div className="max-w-4xl mx-auto rounded-lg shadow-xl overflow-hidden bg-white border border-gray-200">

        {/* Header */}
        <div className="bg-red-700 text-white p-6 flex flex-col md:flex-row items-center justify-between shadow-md">
          <div className="relative flex items-center gap-4 mb-4 md:mb-0">
            <img
              src={user?.profileUrl || profilePicture}
              alt="Profile"
              className="w-28 h-28 rounded-full border-4 border-orange-400 object-cover shadow-lg"
            />
            <label
              htmlFor="profile-picture-upload"
              className="absolute bottom-0 right-0 md:right-auto md:left-20 bg-orange-500 p-2 rounded-full cursor-pointer hover:bg-orange-600 transition-colors duration-200 shadow-md"
              title="Change Profile Picture"
            >
              <FaCamera className="text-white text-lg" />
              <input
                type="file"
                id="profile-picture-upload"
                className="hidden"
                onChange={handleImageUpload}
                accept="image/*"
                disabled={isUploadingImage}
              />
            </label>
            <div>
              <h2 className="text-4xl font-extrabold mb-1">
                {user?.firstname || 'User'} {user?.lastname || 'Profile'}
              </h2>
              <p className="text-red-200 text-lg">{user?.email}</p>
              {user?.role && (
                <span className="badge badge-lg bg-red-200 text-red-800 font-semibold mt-2">
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </span>
              )}
            </div>
          </div>
          <button
            className="btn bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-6 rounded-lg shadow-md transition-colors duration-200 flex items-center gap-2"
            onClick={handleModalToggle}
            disabled={isUpdatingProfile || isUploadingImage}
          >
            <FaEdit className="text-lg" /> Edit Profile
          </button>
        </div>

        {/* Profile Info */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 shadow-sm">
            <h3 className="text-2xl font-bold mb-4 text-red-700 border-b pb-2 border-red-200">Personal Information</h3>
            <div className="space-y-3 text-gray-700">
              <p><span className="font-semibold text-red-600">First Name:</span> {user?.firstname || 'N/A'}</p>
              <p><span className="font-semibold text-red-600">Last Name:</span> {user?.lastname || 'N/A'}</p>
              <p><span className="font-semibold text-red-600">Email:</span> {user?.email || 'N/A'}</p>
              <p><span className="font-semibold text-red-600">Contact:</span> {user?.contact || 'N/A'}</p>
              <p><span className="font-semibold text-red-600">Address:</span> {user?.address || 'N/A'}</p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 shadow-sm">
            <h3 className="text-2xl font-bold mb-4 text-red-700 border-b pb-2 border-red-200">Security Settings</h3>
            <p className="mb-4 text-gray-700">
              <span className="font-semibold text-red-600">Password:</span> ********
            </p>
            <button
              className="btn bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors duration-200"
              disabled
            >
              Change Password
            </button>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {isModalOpen && (
        <div className="modal modal-open flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="modal-box bg-white p-8 rounded-lg shadow-xl relative max-w-lg w-full text-gray-800">
            <button
              className="btn btn-sm btn-circle absolute right-4 top-4 bg-gray-200 hover:bg-gray-300 text-gray-700"
              onClick={handleModalToggle}
              disabled={isUpdatingProfile}
            >
              ✕
            </button>
            <div className="flex justify-center items-center mb-6">
              <h2 className="text-3xl font-bold text-red-700">Edit Your Profile</h2>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input
                  type="text"
                  className="input input-bordered w-full text-gray-800"
                  {...register('firstname', { required: 'First Name is required' })}
                />
                {errors.firstname && <p className="text-red-500 text-sm mt-1">{errors.firstname.message}</p>}
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input
                  type="text"
                  className="input input-bordered w-full text-gray-800"
                  {...register('lastname', { required: 'Last Name is required' })}
                />
                {errors.lastname && <p className="text-red-500 text-sm mt-1">{errors.lastname.message}</p>}
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  readOnly
                  className="input input-bordered w-full bg-gray-100 text-gray-500 cursor-not-allowed"
                  {...register('email')}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact</label>
                <input
                  type="text"
                  className="input input-bordered w-full text-gray-800"
                  {...register('contact')}
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <textarea
                  className="textarea textarea-bordered w-full text-gray-800"
                  rows={3}
                  {...register('address')}
                ></textarea>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={handleModalToggle}
                  className="btn bg-red-500 hover:bg-red-600 text-white font-bold shadow-md transition-colors duration-200 flex items-center gap-2"
                >
                  <FaTimes /> Cancel
                </button>
                <button
                  type="submit"
                  className="btn bg-red-600 hover:bg-red-700 text-white font-bold shadow-md transition-colors duration-200 flex items-center gap-2"
                  disabled={isUpdatingProfile}
                >
                  <SaveIcon className="w-4 h-4" /> {isUpdatingProfile ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
