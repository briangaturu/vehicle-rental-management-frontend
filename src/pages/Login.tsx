// import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import loginBg from '../assets/ford-mustang-car-street-wallpaper-preview.jpg';
import lamborghiniImage from '../assets/lamborghini aventador.jpg';
import { useForm } from 'react-hook-form';
import { Toaster, toast } from 'sonner';
import { userApi } from '../features/api/userApi';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../app/store';
import { setCredentials } from '../features/auth/authSlice';

type LoginFormValues = {
  email: string;
  password: string;
};

const Login: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>();
  const [loginUser, { isLoading }] = userApi.useLoginUserMutation();

  const user = useSelector((state: RootState) => state.auth.user);

  

  const onSubmit = async (data: LoginFormValues) => {
  const loadingToastId = toast.loading("Logging in...");

  try {
  const res = await loginUser(data).unwrap();

// FIX: Parse user if it's a string
let parsedUser = res.user;
if (typeof parsedUser === "string") {
  parsedUser = JSON.parse(parsedUser);
}

dispatch(setCredentials({
  user: parsedUser,
  token: res.token,
  role: res.role,
}));


    toast.success("Login successful!", { id: loadingToastId });

    if (res.role === 'admin') {
      navigate('/admin');
    } else if (res.role === 'user') {
      navigate('/user');
    } else {
      navigate('/');
      toast.error("Login failed: Invalid user type", { id: loadingToastId });
    }

  } catch (err: any) {
    toast.error('Login failed: ' + (err.data?.message || err.message || err.error));
    toast.dismiss(loadingToastId);
  }
};

  return (
    <div
      className="min-h-screen bg-cover bg-center flex justify-center items-center p-4 relative"
      style={{ backgroundImage: `url(${loginBg})` }}
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

        {/* Right form section */}
        <div className="md:w-1/2 p-8 space-y-4 bg-gradient-to-br from-[#001258] to-[#003B7A] flex flex-col justify-center">
          <h1 className="text-center text-red-500 text-2xl font-bold">
            Welcome Back
          </h1>

          <p className="text-center text-green-300 text-lg font-semibold">
            Login to your Account
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex flex-col">
              <label htmlFor="email" className="text-white font-semibold mb-1">
                Email:
              </label>
              <input
                type="email"
                id="email"
                {...register("email", { required: true })}
                className="w-full border border-gray-300 px-4 py-2 rounded-md"
              />
              {errors.email && <p className="text-red-400 text-sm">Email is required</p>}
            </div>

            <div className="flex flex-col">
              <label htmlFor="password" className="text-white font-semibold mb-1">
                Password:
              </label>
              <input
                type="password"
                id="password"
                {...register("password", { required: true })}
                className="w-full border border-gray-300 px-4 py-2 rounded-md"
              />
              {errors.password && <p className="text-red-400 text-sm">Password is required</p>}
            </div>

            <div className="flex items-center space-x-2">
              <input type="checkbox" id="remember" className="accent-green-500" />
              <label htmlFor="remember" className="text-green-300 text-sm">
                Remember me
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-md font-semibold"
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="flex flex-col md:flex-row justify-between items-center text-sm mt-6 space-y-3 md:space-y-0 md:space-x-4">
            <p className="text-green-300">
              Don’t have an account?{' '}
              <button
                onClick={() => navigate('/signup')}
                className="bg-white text-[#0F172A] px-3 py-1 rounded-md ml-2"
              >
                Sign Up
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
  );
};

export default Login;
