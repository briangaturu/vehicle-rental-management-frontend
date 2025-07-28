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
  useUpdateUserProfileImageMutation,
  useGetUserByIdQuery
} from '../../features/api/userApi';

interface FormValues {
  firstname: string;
  lastname: string;
  email: string;
  address: string;
  contact: string;
}

const Profile = () => {
  const preset_key = "vehicles";
  const cloud_name = "dji3abnhv";
  const navigate = useNavigate();
  const { user, isAuthenticated, role } = useSelector((state: RootState) => state.auth);
  const userId = useSelector((state: RootState) => state.auth.user?.id);

  const {
    data: userProfile,
  } = useGetUserByIdQuery(parseInt(userId as string), {
    skip: !userId || isNaN(parseInt(userId as string)),
  });

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

      await updateProfile({ userId, ...data, password: user.password }).unwrap();
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
    <div className="min-h-screen text-gray-800 py-6 px-4 sm:py-10 sm:px-6 bg-white from-white to-gray-100">
    <div className="max-w-4xl mx-auto rounded-lg shadow-xl overflow-hidden bg-white border border-gray-200">
  
      {/* Header */}
      <div className="bg-[#0D1C49] text-white p-6 flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-4 shadow-md">
        <div className="relative flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
          <img
            src={user?.profileUrl || profilePicture}
            alt="Profile"
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-white object-cover shadow-lg"
          />
          <label
            htmlFor="profile-picture-upload"
            className="absolute bottom-0 right-0 sm:static sm:ml-4 bg-[#EF4444] p-2 rounded-full cursor-pointer hover:opacity-90 transition duration-200 shadow-md"
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
            <h2 className="text-2xl sm:text-4xl font-extrabold mb-1">
              {user?.firstname || 'User'} {user?.lastname || 'Profile'}
            </h2>
            <p className="text-gray-300 text-base sm:text-lg">{user?.email}</p>
            {user?.role && (
              <span className="text-sm bg-white text-[#0F172A] font-semibold px-3 py-1 rounded mt-2 inline-block">
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </span>
            )}
          </div>
        </div>
        <button
          className="btn bg-red-500 hover:bg-blue-900 text-white font-bold py-2 px-6 rounded-lg shadow-md transition duration-200 flex items-center justify-center gap-2 w-full sm:w-auto"
          onClick={handleModalToggle}
          disabled={isUpdatingProfile || isUploadingImage}
        >
          <FaEdit className="text-lg" /> Edit Profile
        </button>
      </div>
  
      {/* Info */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 text-center md:text-left">
        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 shadow-sm">
          <h3 className="text-xl sm:text-2xl font-bold mb-4 text-[#0D1C49] border-b pb-2 border-gray-300">Personal Information</h3>
          <div className="space-y-3 text-gray-700">
            <p><span className="font-semibold text-[#EF4444]">First Name:</span> {userProfile?.firstname || 'N/A'}</p>
            <p><span className="font-semibold text-[#EF4444]">Last Name:</span> {userProfile?.lastname || 'N/A'}</p>
            <p><span className="font-semibold text-[#EF4444]">Email:</span> {userProfile?.email || 'N/A'}</p>
            <p><span className="font-semibold text-[#EF4444]">Contact:</span> {userProfile?.contact || 'N/A'}</p>
            <p><span className="font-semibold text-[#EF4444]">Address:</span> {userProfile?.address || 'N/A'}</p>
          </div>
        </div>
  
        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 shadow-sm">
          <h3 className="text-xl sm:text-2xl font-bold mb-4 text-[#0D1C49] border-b pb-2 border-gray-300">Security Settings</h3>
          <p className="mb-4 text-gray-700">
            <span className="font-semibold text-[#EF4444]">Password:</span> ********
          </p>
          <button
            className="btn bg-[#EF4444] hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors duration-200 w-full sm:w-auto"
            disabled
          >
            Change Password
          </button>
        </div>
      </div>
    </div>
  
    {/* Modal */}
    {isModalOpen && (
      <div className="modal modal-open flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="modal-box bg-white p-6 sm:p-8 rounded-lg shadow-xl relative w-[90%] max-w-lg text-gray-800">
          <button
            className="btn btn-sm btn-circle absolute right-4 top-4 bg-gray-200 hover:bg-gray-300 text-gray-700"
            onClick={handleModalToggle}
            disabled={isUpdatingProfile}
          >
            ✕
          </button>
          <div className="flex justify-center items-center mb-6">
            <h2 className="text-xl sm:text-3xl font-bold text-[#0F172A]">Edit Your Profile</h2>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              <input type="text" className="input input-bordered w-full" {...register('firstname', { required: 'First Name is required' })} />
              {errors.firstname && <p className="text-red-500 text-sm mt-1">{errors.firstname.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <input type="text" className="input input-bordered w-full" {...register('lastname', { required: 'Last Name is required' })} />
              {errors.lastname && <p className="text-red-500 text-sm mt-1">{errors.lastname.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" readOnly className="input input-bordered w-full bg-gray-100 text-gray-500 cursor-not-allowed" {...register('email')} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact</label>
              <input type="text" className="input input-bordered w-full" {...register('contact')} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <textarea className="textarea textarea-bordered w-full" rows={3} {...register('address')}></textarea>
            </div>
            <div className="flex flex-col sm:flex-row justify-end gap-3">
              <button type="button" onClick={handleModalToggle} className="btn bg-gray-400 hover:bg-gray-500 text-white w-full sm:w-auto">
                <FaTimes /> Cancel
              </button>
              <button type="submit" className="btn bg-[#EF4444] hover:bg-red-700 text-white w-full sm:w-auto" disabled={isUpdatingProfile}>
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
