import { useEffect, useState } from 'react';
import { FaCamera, FaEdit, FaTimes } from 'react-icons/fa';
import { useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { SaveIcon } from 'lucide-react';
import type { RootState } from '../../app/store';
import Swal from 'sweetalert2';
import axios from 'axios';
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
  password: string;
}

const Profile = () => {
  const preset_key = "vehicles";
  const cloud_name = "dji3abnhv";
  const navigate = useNavigate();
  const { user, isAuthenticated, role } = useSelector((state: RootState) => state.auth);
  const userId = useSelector((state: RootState) => state.auth.user?.id); // Changed to userId

  console.log(userId)

  const {
    data: userProfile,
    refetch: refetchUserProfile
  } = useGetUserByIdQuery(userId!, {
    skip: !userId,
  });

  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormValues>({
    defaultValues: {
      firstname: user?.firstname || '',
      lastname: user?.lastname || '',
      email: user?.email || '',
      address: user?.address || '',
      contact: user?.contact || '',
      password: '',
    }
  });

  const profilePicture = user?.profileUrl ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.firstname || 'User')}+${encodeURIComponent(user?.lastname || 'Profile')}&background=EF4444&color=fff&size=128`;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updateProfile, { isLoading: isUpdatingProfile }] = useUpdateUserProfileMutation();
  const [updateProfileImage, { isLoading: isUploadingImage }] = useUpdateUserProfileImageMutation();
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleModalToggle = () => {
    setIsModalOpen(!isModalOpen);
    if (!isModalOpen && user) {
      reset({
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        address: user.address || '',
        contact: user.contact || '',
        password: '',
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
      if (!userId) {
        Swal.fire('Error!', 'User ID not found. Cannot update profile.', 'error');
        return;
      }

      await updateProfile({ userId, ...data }).unwrap();
      Swal.fire('Success!', 'Profile updated successfully!', 'success');
      handleModalToggle();
      refetchUserProfile();
    } catch (error: any) {
      console.error('Failed to update profile:', error);
      Swal.fire('Error!', error?.data?.message || 'Failed to update profile. Please try again.', 'error');
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type and size
    if (!file.type.match('image.*')) {
      Swal.fire('Error!', 'Only image files are allowed.', 'error');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      Swal.fire('Error!', 'Image must be smaller than 5MB.', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', preset_key);

    try {
      Swal.fire({
        title: 'Uploading Image...',
        html: `Please wait while we upload your image.<br/><progress value="${uploadProgress}" max="100" style="width:100%"></progress>`,
        allowOutsideClick: false,
        showConfirmButton: false,
      });

      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`,
        formData,
        {
          onUploadProgress: (progressEvent) => {
            const progress = Math.round(
              (progressEvent.loaded * 100) / (progressEvent.total || 1)
            );
            setUploadProgress(progress);
            Swal.update({
              html: `Uploading... ${progress}%<br/><progress value="${progress}" max="100" style="width:100%"></progress>`
            });
          },
        }
      );

      const imageUrl = response.data.secure_url;
      
      if (!userId) {
        throw new Error('User ID not found');
      }

      await updateProfileImage({ userId, profileUrl: imageUrl }).unwrap();
      
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Profile image updated successfully!',
        timer: 2000,
        showConfirmButton: false
      });
      
      refetchUserProfile();
    } catch (error: any) {
      console.error('Failed to update profile image:', error);
      Swal.fire({
        icon: 'error',
        title: 'Upload Failed',
        text: error?.response?.data?.message || 'Failed to upload image. Please try again.',
      });
    } finally {
      setUploadProgress(0);
    }
  };

  return (
    <div className="min-h-screen text-gray-800 py-6 px-4 sm:py-10 sm:px-6 bg-white from-white to-gray-100">
      <div className="max-w-4xl mx-auto rounded-lg shadow-xl overflow-hidden bg-white border border-gray-200">
  
        {/* Header */}
        <div className="bg-[#0D1C49] text-white p-6 flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-4 shadow-md">
          <div className="relative flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            <div className="relative">
              <img
                src={userProfile?.profileUrl || profilePicture}
                alt="Profile"
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-white object-cover shadow-lg"
              />
              {uploadProgress > 0 && uploadProgress < 100 && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
                  <span className="text-white font-bold">{uploadProgress}%</span>
                </div>
              )}
            </div>
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
                {userProfile?.firstname || 'User'} {userProfile?.lastname || 'Profile'}
              </h2>
              <p className="text-gray-300 text-base sm:text-lg">{userProfile?.email}</p>
              {userProfile?.role && (
                <span className="text-sm bg-white text-[#0F172A] font-semibold px-3 py-1 rounded mt-2 inline-block">
                  {userProfile.role.charAt(0).toUpperCase() + userProfile.role.slice(1)}
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
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md transform transition-all">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-[#0F172A]">Update Profile</h2>
                <button
                  onClick={handleModalToggle}
                  className="text-gray-500 hover:text-gray-700 focus:outline-none"
                  disabled={isUpdatingProfile}
                >
                  <FaTimes className="h-6 w-6" />
                </button>
              </div>
              
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#EF4444] focus:border-transparent"
                      {...register('firstname', { required: 'First Name is required' })} 
                    />
                    {errors.firstname && <p className="text-red-500 text-xs mt-1">{errors.firstname.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#EF4444] focus:border-transparent"
                      {...register('lastname', { required: 'Last Name is required' })} 
                    />
                    {errors.lastname && <p className="text-red-500 text-xs mt-1">{errors.lastname.message}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input 
                    type="email" 
                    readOnly 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                    {...register('email')} 
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#EF4444] focus:border-transparent"
                    {...register('contact')} 
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <textarea 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#EF4444] focus:border-transparent"
                    rows={3} 
                    {...register('address')}
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <input 
                    type="password" 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#EF4444] focus:border-transparent"
                    placeholder="Enter new password (leave blank to keep current)"
                    {...register('password')} 
                  />
                  {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button 
                    type="button" 
                    onClick={handleModalToggle} 
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="px-4 py-2 bg-[#EF4444] text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                    disabled={isUpdatingProfile}
                  >
                    {isUpdatingProfile ? (
                      <span className="animate-spin">↻</span>
                    ) : (
                      <SaveIcon className="w-4 h-4" />
                    )}
                    {isUpdatingProfile ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;