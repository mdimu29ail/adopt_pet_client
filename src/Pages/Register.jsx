import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaGoogle,
  FaEnvelope,
  FaLock,
  FaUser,
  FaCloudUploadAlt,
  FaArrowLeft,
  FaPaw,
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import useAuth from '../hooks/useAuth';
import useAxios from '../hooks/useAxios';
import Logo from '../Components/Logo/Logo';
import { supabase } from '../Supabase/supabase.config'; // সুপাবেস ক্লায়েন্ট ইম্পোর্ট

const Register = () => {
  const { createUser, googleLogin } = useAuth();
  const axiosPublic = useAxios();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  // ইমেজের প্রিভিউ দেখানোর জন্য
  const selectedImage = watch('image');

  const onSubmit = async data => {
    try {
      Swal.fire({
        title: 'Creating Account...',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      const imageFile = data.image[0];
      let imageUrl = '';

      // --- ১. ইমেজ আপলোড লজিক (Supabase Storage) ---
      if (imageFile) {
        const fileName = `${Date.now()}_${imageFile.name}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('user-images') // আপনার বাল্কেট নাম
          .upload(`profiles/${fileName}`, imageFile);

        if (uploadError) throw uploadError;

        // পাবলিক ইউআরএল গেট করা
        const { data: urlData } = supabase.storage
          .from('user-images')
          .getPublicUrl(`profiles/${fileName}`);

        imageUrl = urlData.publicUrl;
      }

      // --- ২. সুপাবেস অথ দিয়ে ইউজার তৈরি ---
      const { data: authData, error: authError } = await createUser(
        data.email,
        data.password,
        data.name,
        imageUrl,
      );

      if (authError) throw authError;

      // --- ৩. ডাটাবেজ (users table) এ তথ্য সেভ ---
      const userInfo = {
        name: data.name,
        email: data.email,
        image: imageUrl,
        role: 'user',
        created_at: new Date(),
      };

      const res = await axiosPublic.post('/users', userInfo);

      if (res.data.inserted) {
        Swal.fire({
          icon: 'success',
          title: 'Registration Successful!',
          text: 'Welcome to the pack!',
          confirmButtonColor: '#37948b',
        });
        navigate('/');
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message,
        confirmButtonColor: '#37948b',
      });
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-[#f8fafc] font-sans overflow-hidden">
      {/* --- Left Side: Form --- */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-white shadow-2xl z-10 overflow-y-auto">
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md py-8"
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-[#37948b] font-bold mb-4 hover:gap-3 transition-all"
          >
            <FaArrowLeft /> Home
          </Link>

          <div className="mb-6">
            <h2 className="text-4xl font-black text-gray-800 mb-2">Join Us</h2>
            <p className="text-gray-500 font-medium">
              Create a profile to start adopting pets.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Name */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">
                Full Name
              </label>
              <div className="relative group">
                <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#37948b]" />
                <input
                  type="text"
                  {...register('name', { required: 'Name is required' })}
                  placeholder="Your Name"
                  className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-100 bg-gray-50 outline-none focus:border-[#37948b] transition-all"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">
                Email
              </label>
              <div className="relative group">
                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#37948b]" />
                <input
                  type="email"
                  {...register('email', { required: 'Email is required' })}
                  placeholder="email@example.com"
                  className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-100 bg-gray-50 outline-none focus:border-[#37948b] transition-all"
                />
              </div>
            </div>

            {/* Image Upload Field */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">
                Profile Picture
              </label>
              <div className="relative">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-200 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-all">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <FaCloudUploadAlt className="w-8 h-8 mb-2 text-[#37948b]" />
                    <p className="text-sm text-gray-500">
                      {selectedImage && selectedImage[0] ? (
                        <span className="text-[#37948b] font-bold">
                          {selectedImage[0].name}
                        </span>
                      ) : (
                        'Click to upload photo'
                      )}
                    </p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    {...register('image', {
                      required: 'Profile picture is required',
                    })}
                    className="hidden"
                  />
                </label>
              </div>
              {errors.image && (
                <p className="text-xs text-red-500 font-bold">
                  {errors.image.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">
                Password
              </label>
              <div className="relative group">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#37948b]" />
                <input
                  type="password"
                  {...register('password', {
                    required: 'Required',
                    minLength: 6,
                  })}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-100 bg-gray-50 outline-none focus:border-[#37948b] transition-all"
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full py-4 bg-[#37948b] text-white font-black rounded-xl shadow-lg hover:bg-[#2d7a72] transition-all flex items-center justify-center gap-2"
            >
              Register Now <FaPaw />
            </motion.button>
          </form>

          <p className="text-center mt-6 text-sm text-gray-600 font-medium">
            Already have an account?
            <Link
              to="/login"
              className="ml-2 font-bold text-[#37948b] hover:underline"
            >
              Log In
            </Link>
          </p>
        </motion.div>
      </div>

      {/* --- Right Side: Visual --- */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#37948b] relative items-center justify-center text-white overflow-hidden">
        <div className="absolute top-0 right-0 p-10 opacity-10">
          <FaPaw className="text-[300px] rotate-12" />
        </div>
        <div className="relative z-10 max-w-md text-center">
          <Logo />
          <h1 className="text-5xl font-black mt-8 mb-6 leading-tight">
            Join the <span className="text-[#a7f3d0]">Furry Family!</span>
          </h1>
          <p className="text-teal-50 text-lg opacity-90">
            Create an account to start your journey of adopting, donating, and
            saving precious lives.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
