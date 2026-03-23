import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaCloudUploadAlt,
  FaArrowLeft,
  FaCheckCircle,
} from 'react-icons/fa';
import Swal from 'sweetalert2';
import useAuth from '../hooks/useAuth';
import useAxios from '../hooks/useAxios';
import Logo from '../Components/Logo/Logo';

// Enhanced modern File Upload Component
const ImgBBUpload = ({ onUpload, isUploaded }) => {
  const [uploading, setUploading] = useState(false);
  const IMGBB_API_KEY = import.meta.env.VITE_image_upload_key;

  const handleFileChange = async e => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await fetch(
        `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
        {
          method: 'POST',
          body: formData,
        },
      );
      const data = await res.json();
      if (data.success) {
        onUpload(data.data.display_url);
      }
    } catch (err) {
      console.error('Upload error', err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-gray-700 ml-1">
        Profile Picture
      </label>
      <label
        className={`flex items-center justify-center w-full px-4 py-3 border-2 border-dashed rounded-xl cursor-pointer transition-all ${isUploaded ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-[#ff6600] bg-gray-50'}`}
      >
        <div className="flex items-center gap-3">
          {uploading ? (
            <span className="loading loading-spinner loading-sm text-[#ff6600]"></span>
          ) : isUploaded ? (
            <FaCheckCircle className="text-green-500 text-xl" />
          ) : (
            <FaCloudUploadAlt className="text-gray-400 text-xl" />
          )}
          <span
            className={`text-sm font-medium ${isUploaded ? 'text-green-600' : 'text-gray-500'}`}
          >
            {uploading
              ? 'Uploading...'
              : isUploaded
                ? 'Photo Uploaded!'
                : 'Click to upload photo'}
          </span>
        </div>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </label>
    </div>
  );
};

const Register = () => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm();
  const { createUser, updateUserProfile } = useAuth();
  const axiosInstance = useAxios();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/';

  const photoURLValue = watch('photoURL'); // To track if photo is uploaded

  const onSubmit = async data => {
    try {
      const result = await createUser(data.email, data.password);
      await updateUserProfile({
        displayName: data.name,
        photoURL: data.photoURL,
      });

      const userInfo = {
        name: data.name,
        email: data.email,
        photoURL: data.photoURL,
        role: 'user',
        created_at: new Date().toISOString(),
        last_log_in: new Date().toISOString(),
      };

      await axiosInstance.post('/users', userInfo);

      Swal.fire({
        icon: 'success',
        title: 'Account Created!',
        text: 'Welcome to our community',
        timer: 2000,
        showConfirmButton: false,
      });

      navigate(from, { replace: true });
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Oops...', text: err.message });
    }
  };

  const handlePhotoUpload = url => {
    setValue('photoURL', url, { shouldValidate: true });
  };

  return (
    <div className="flex min-h-screen w-full bg-white font-sans">
      {/* --- Left Side: Visual Branding --- */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#ff6600] relative overflow-hidden items-center justify-center p-12">
        <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-orange-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-orange-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>

        <div className="relative z-10 text-white max-w-md">
          <div className="mb-10">
            <Logo />
          </div>
          <h1 className="text-5xl font-extrabold mb-6 leading-tight">
            Start your journey <br /> with us today.
          </h1>
          <p className="text-orange-50 text-lg opacity-90">
            Create an account to unlock exclusive features, manage your
            projects, and connect with professionals worldwide.
          </p>
        </div>
      </div>

      {/* --- Right Side: Register Form --- */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-20 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Mobile Header */}
          <div className="flex items-center justify-between mb-8 lg:hidden">
            <Logo />
            <Link
              to="/"
              className="text-[#ff6600] flex items-center gap-2 font-medium text-sm"
            >
              <FaArrowLeft /> Home
            </Link>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Create Account
            </h2>
            <p className="text-gray-500">Join us and start exploring.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Name Field */}
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700 ml-1">
                Full Name
              </label>
              <div className="relative flex items-center">
                <FaUser className="absolute left-4 text-gray-400" />
                <input
                  type="text"
                  {...register('name', { required: 'Name is required' })}
                  placeholder="John Doe"
                  className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 bg-white outline-none transition-all focus:border-[#ff6600] focus:ring-4 focus:ring-orange-100 ${errors.name ? 'border-red-400' : 'border-gray-100'}`}
                />
              </div>
              {errors.name && (
                <p className="text-xs text-red-500 ml-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Custom Photo Upload */}
            <ImgBBUpload
              onUpload={handlePhotoUpload}
              isUploaded={!!photoURLValue}
            />
            <input
              type="hidden"
              {...register('photoURL', {
                required: 'Profile photo is required',
              })}
            />
            {errors.photoURL && (
              <p className="text-xs text-red-500 ml-1">
                {errors.photoURL.message}
              </p>
            )}

            {/* Email Field */}
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700 ml-1">
                Email Address
              </label>
              <div className="relative flex items-center">
                <FaEnvelope className="absolute left-4 text-gray-400" />
                <input
                  type="email"
                  {...register('email', { required: 'Email is required' })}
                  placeholder="name@email.com"
                  className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 bg-white outline-none transition-all focus:border-[#ff6600] focus:ring-4 focus:ring-orange-100 ${errors.email ? 'border-red-400' : 'border-gray-100'}`}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-500 ml-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700 ml-1">
                Password
              </label>
              <div className="relative flex items-center">
                <FaLock className="absolute left-4 text-gray-400" />
                <input
                  type="password"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: { value: 6, message: 'Minimum 6 characters' },
                  })}
                  placeholder="••••••••"
                  className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 bg-white outline-none transition-all focus:border-[#ff6600] focus:ring-4 focus:ring-orange-100 ${errors.password ? 'border-red-400' : 'border-gray-100'}`}
                />
              </div>
              {errors.password && (
                <p className="text-xs text-red-500 ml-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-[#ff6600] hover:bg-[#cc5200] text-white font-bold rounded-xl shadow-lg shadow-orange-100 transition-all transform active:scale-[0.98] mt-2"
            >
              Create Free Account
            </button>
          </form>

          <p className="text-center mt-8 text-gray-600">
            Already have an account?
            <Link
              to="/login"
              className="ml-2 font-bold text-[#ff6600] hover:underline"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
