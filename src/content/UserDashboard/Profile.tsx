import { useEffect, useState } from 'react';
import { FaCamera, FaEdit, FaTimes, FaKey } from 'react-icons/fa';
import { useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { useForm, type SubmitHandler } from 'react-hook-form';
import type { RootState } from '../../app/store';
import { SaveIcon } from 'lucide-react';
import axios from 'axios';

interface FormValues {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  address: string;
  contact: string;
}

const UserProfile = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

  const [profileData, setProfileData] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const profilePicture = user?.profileUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(
    `${user?.firstName || ""} ${user?.lastName || ""}`
  )}&background=ef4444&color=fff&size=128`;

  const handleModalToggle = () => {
    setIsModalOpen(!isModalOpen);
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      fetchUserData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const fetchUserData = async () => {
    try {
      const userId = user?.id || user?.userId;
const { data } = await axios.get(`/api/users/${userId}`);

      setProfileData(data);
    } catch (error) {
      console.error("Failed to fetch user:", error);
    }
  };

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>();

  useEffect(() => {
    if (profileData) {
      reset({
        firstName: profileData.firstname,
        lastName: profileData.lastname,
        email: profileData.email,
        password: profileData.password,
        address: profileData.address,
        contact: profileData.contact,
      });
    }
  }, [profileData, reset]);

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      setLoading(true);
      const payload = {
        firstname: data.firstName,
        lastname: data.lastName,
        email: data.email,
        password: data.password,
        userId: user?.userId,
        address: data.address,
        contact: data.contact,
      };

      const res = await axios.put(`/api/users/${user?.id}`, payload);
      console.log("User updated:", res.data);
      setIsModalOpen(false);
      fetchUserData();

    } catch (error: any) {
      console.error("Update failed:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!profileData) {
    return (
      <div className="p-10 text-center text-gray-300">Loading profile...</div>
    );
  }

  return (
    <div className="min-h-screen text-white py-10 px-5 bg-white">
      <div className="max-w-4xl mx-auto rounded-lg shadow-lg p-5 bg-red-600">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row items-center justify-between border-b border-gray-700 pb-5 mb-5">
          <div className="relative flex items-center gap-4 mb-4 md:mb-0">
            <img
              src={profilePicture}
              alt="Profile"
              className="w-24 h-24 rounded-full border-4 border-[#0F172A] object-cover"
            />
            <label className="absolute bottom-0 bg-[#0F172A] p-2 rounded-full cursor-pointer">
              <FaCamera />
              <input type="file" className="hidden" />
            </label>
            <div>
              <h2 className="text-3xl font-bold">
                {profileData.firstname} {profileData.lastname}
              </h2>
              <p className="text-gray-400">{profileData.email}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              className="flex items-center gap-2 px-4 py-2 rounded bg-[#0F172A] hover:bg-[#dc2626] transition"
              onClick={handleModalToggle}
            >
              <FaEdit /> Edit Profile
            </button>
            <button
              className="flex items-center gap-2 px-4 py-2 rounded bg-[#0F172A] hover:bg-[#dc2626] transition"
            >
              <FaKey /> Change Password
            </button>
          </div>
        </div>

        {/* DETAILS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#0F172A] rounded-lg p-7">
            <h3 className="text-2xl font-bold mb-3 text-white">Personal Information</h3>
            <p className="mb-2">
              <span className="font-bold text-white">First Name:</span> {profileData.firstname}
            </p>
            <p className="mb-2">
              <span className="font-bold text-white">Last Name:</span> {profileData.lastname}
            </p>
            <p className="mb-2">
              <span className="font-bold text-white">Address:</span> {profileData.address}
            </p>
            <p className="mb-2">
              <span className="font-bold text-white">Contact:</span> {profileData.contact}
            </p>
          </div>
        </div>
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-[#1E293B] p-8 rounded-lg w-full max-w-md">
            <h2 className="text-2xl font-bold text-[#ef4444] mb-6 text-center">
              Edit Profile
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-[#ef4444]">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  className="input w-full text-gray-900"
                  {...register('firstName', { required: 'First name is required' })}
                />
                {errors.firstName && (
                  <p className="text-red-500 text-sm">{errors.firstName.message}</p>
                )}
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-[#ef4444]">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  className="input w-full text-gray-900"
                  {...register('lastName', { required: 'Last name is required' })}
                />
                {errors.lastName && (
                  <p className="text-red-500 text-sm">{errors.lastName.message}</p>
                )}
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[#ef4444]">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  disabled
                  className="input w-full bg-gray-800 border-gray-700 text-white"
                  {...register('email', { required: 'Email is required' })}
                />
              </div>
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-[#ef4444]">
                  Address
                </label>
                <input
                  type="text"
                  id="address"
                  className="input w-full text-gray-900"
                  {...register('address', { required: 'Address is required' })}
                />
                {errors.address && (
                  <p className="text-red-500 text-sm">{errors.address.message}</p>
                )}
              </div>
              <div>
                <label htmlFor="contact" className="block text-sm font-medium text-[#ef4444]">
                  Contact
                </label>
                <input
                  type="text"
                  id="contact"
                  className="input w-full text-gray-900"
                  {...register('contact', { required: 'Contact is required' })}
                />
                {errors.contact && (
                  <p className="text-red-500 text-sm">{errors.contact.message}</p>
                )}
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-[#ef4444]">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  className="input w-full text-gray-900"
                  {...register('password', { required: 'Password is required' })}
                />
                {errors.password && (
                  <p className="text-red-500 text-sm">{errors.password.message}</p>
                )}
              </div>

              <div className="flex justify-end mt-6">
                <button
                  type="button"
                  onClick={handleModalToggle}
                  className="btn btn-error mr-2 flex items-center gap-2"
                >
                  <FaTimes /> Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary flex items-center gap-2 bg-[#ef4444] hover:bg-[#dc2626] border-none"
                  disabled={loading}
                >
                  <SaveIcon size={16} /> {loading ? 'Saving...' : 'Save Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
