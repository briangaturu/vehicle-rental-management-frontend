import React from 'react';
import { useNavigate } from 'react-router-dom';
import signupBg from '../assets/ford-mustang-car-street-wallpaper-preview.jpg';
import lamborghiniImage from '../assets/lamborghini aventador.jpg';
import { userApi } from '../features/api/userApi';
import { Toaster, toast } from "sonner";
import { useForm } from "react-hook-form";
import Navbar from '../components/Navbar'; 

type UserRegisterFormValues = {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  userId: string;
  contact: string;
  address: string;
};

const SignUp: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<UserRegisterFormValues>();
  const [registerUser, { isLoading }] = userApi.useRegisterUserMutation();
  const navigate = useNavigate();

  const onSubmit = async (data: UserRegisterFormValues) => {
    const loadingToastId = toast.loading("Creating Account...");
    try {
      const res = await registerUser(data).unwrap();
      toast.success(res?.message || "Account created!", { id: loadingToastId });
      navigate('/login');
    } catch (err: any) {
      console.error("Registration error:", err);
      toast.error(
        'Failed to Register: ' +
          (err?.data?.message || err?.message || err?.error || JSON.stringify(err))
      );
      toast.dismiss(loadingToastId);
    }
  };

  return (
    <>
      <Navbar />
      <div
        className="min-h-screen bg-cover bg-center flex justify-center items-center p-4 pt-24 relative"
        style={{ backgroundImage: `url(${signupBg})` }}
      >
        <Toaster />
        <div className="absolute inset-0 bg-black opacity-50"></div>

        <div className="relative bg-white border-2 border-blue-500 rounded-lg w-full max-w-5xl flex flex-col md:flex-row overflow-hidden shadow-lg min-h-[600px]">
          {/* Left image section */}
          <div className="md:w-1/2 relative flex justify-center items-center p-8 bg-gradient-to-br from-[#001258] to-[#003B7A]">
            <div className="absolute inset-0 bg-black opacity-20 rounded-tr-lg rounded-br-lg"></div>
            <img
              src={lamborghiniImage}
              alt="Car"
              className="relative w-80 h-auto rounded-md shadow-lg z-10"
            />
          </div>

          
          <div className="md:w-1/2 p-8 space-y-4 bg-gradient-to-br from-[#001258] to-[#003B7A] flex flex-col justify-center">
            <h2 className="text-center text-red-500 text-2xl font-bold">SIGN UP</h2>

            <p className="text-center text-green-300 text-lg mb-4">Create an account</p>

            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              <input
                {...register("firstname", { required: true })}
                type="text"
                placeholder="First Name"
                className="w-full bg-[#0F1A3A] border border-blue-400 placeholder-blue-300 text-white px-4 py-2 rounded-md"
              />
              <input
                {...register("lastname", { required: true })}
                type="text"
                placeholder="Last Name"
                className="w-full bg-[#0F1A3A] border border-blue-400 placeholder-blue-300 text-white px-4 py-2 rounded-md"
              />
              <input
                {...register("email", { required: true })}
                type="email"
                placeholder="Email"
                className="w-full bg-[#0F1A3A] border border-blue-400 placeholder-blue-300 text-white px-4 py-2 rounded-md"
              />
              <input
                {...register("contact", { required: true })}
                type="text"
                placeholder="Contact"
                className="w-full bg-[#0F1A3A] border border-blue-400 placeholder-blue-300 text-white px-4 py-2 rounded-md"
              />
              <input
                {...register("address", { required: true })}
                type="text"
                placeholder="Address"
                className="w-full bg-[#0F1A3A] border border-blue-400 placeholder-blue-300 text-white px-4 py-2 rounded-md"
              />
              <input
                {...register("userId", { required: true, valueAsNumber: true })}
                type="number"
                placeholder="User ID"
                className="w-full bg-[#0F1A3A] border border-blue-400 placeholder-blue-300 text-white px-4 py-2 rounded-md"
              />
              <input
                {...register("password", { required: true })}
                type="password"
                placeholder="Password"
                className="w-full bg-[#0F1A3A] border border-blue-400 placeholder-blue-300 text-white px-4 py-2 rounded-md"
              />

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-md font-semibold"
              >
                {isLoading ? 'Signing Up...' : 'Sign Up'}
              </button>
            </form>

            <div className="flex flex-col md:flex-row justify-between items-center text-sm mt-6 space-y-3 md:space-y-0 md:space-x-4">
              <p className="text-green-300">
                Already have an account?{' '}
                <button
                  onClick={() => navigate('/login')}
                  className="bg-white text-[#0F172A] px-3 py-1 rounded-md ml-2"
                >
                  Login
                </button>
              </p>
              <button
                onClick={() => navigate('/')}
                className="bg-gray-200 hover:bg-gray-300 text-[#0F172A] px-4 py-1 rounded-md"
              >
                Home
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUp;
