import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  FaGoogle,
  FaEnvelope,
  FaLock,
  FaArrowLeft,
  FaPaw,
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import useAuth from '../hooks/useAuth';
import useAxios from '../hooks/useAxios';
import Logo from '../Components/Logo/Logo';

const Login = () => {
  const { signIn, googleLogin } = useAuth();
  const axiosPublic = useAxios();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // --- Login Handler ---
  const onSubmit = async data => {
    try {
      const { error } = await signIn(data.email, data.password);
      if (error) throw error;

      Swal.fire({
        icon: 'success',
        title: 'Welcome Back!',
        text: 'Ready to help some paws?',
        timer: 2000,
        showConfirmButton: false,
        background: '#ffffff',
        color: '#1a202c',
        confirmButtonColor: '#37948b',
      });
      navigate(from, { replace: true });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: error.message,
        confirmButtonColor: '#37948b',
      });
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { error } = await googleLogin();
      if (error) throw error;
    } catch (error) {
      Swal.fire('Error', 'Google login failed', 'error');
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-[#f8fafc] font-sans overflow-hidden">
      {/* --- Left Side: Visual/Branding (Visible on LG) --- */}
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="hidden lg:flex lg:w-1/2 bg-[#37948b] relative overflow-hidden items-center justify-center p-12"
      >
        {/* Animated Background Blobs */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 45, 0] }}
          transition={{ duration: 15, repeat: Infinity }}
          className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-white/10 rounded-full blur-[80px]"
        />
        <motion.div
          animate={{ scale: [1, 1.3, 1], rotate: [0, -45, 0] }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-white/5 rounded-full blur-[100px]"
        />

        <div className="relative z-10 text-white text-center max-w-lg">
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="mb-10 flex justify-center cursor-pointer"
          >
            <Logo />
          </motion.div>
          <h1 className="text-6xl font-black mb-6 leading-tight tracking-tight">
            Hello <span className="text-[#a7f3d0]">Hooman!</span>
          </h1>
          <p className="text-teal-50 text-xl font-medium opacity-90 leading-relaxed">
            Your furry friends missed you. Log in to continue your journey of
            saving lives and spreading love.
          </p>

          <motion.div
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="mt-16 flex justify-center text-7xl text-white/20"
          >
            <FaPaw />
          </motion.div>
        </div>
      </motion.div>

      {/* --- Right Side: Login Form --- */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 bg-white">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full max-w-md"
        >
          {/* Mobile Back Link */}
          <div className="flex items-center justify-between mb-10 lg:hidden">
            <Logo />
            <Link
              to="/"
              className="text-[#37948b] flex items-center gap-2 font-black text-sm uppercase tracking-widest"
            >
              <FaArrowLeft /> Home
            </Link>
          </div>

          <div className="mb-12 text-center lg:text-left">
            <h2 className="text-5xl font-black text-gray-900 mb-4 tracking-tighter">
              Login
            </h2>
            <p className="text-gray-500 font-semibold text-lg">
              Enter your credentials to access your account.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email Input */}
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] ml-1">
                Email Address
              </label>
              <div className="relative group">
                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#37948b] transition-colors" />
                <input
                  type="email"
                  {...register('email', { required: 'Email is required' })}
                  placeholder="email@example.com"
                  className={`w-full pl-12 pr-4 py-4 rounded-2xl border-2 bg-gray-50/50 outline-none transition-all focus:border-[#37948b] focus:bg-white focus:ring-4 focus:ring-teal-50 ${
                    errors.email ? 'border-red-400' : 'border-gray-100'
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-500 font-bold mt-1 ml-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">
                  Password
                </label>
                <Link
                  to="/forgot"
                  className="text-xs font-black text-[#37948b] hover:underline"
                >
                  Forgot?
                </Link>
              </div>
              <div className="relative group">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#37948b] transition-colors" />
                <input
                  type="password"
                  {...register('password', {
                    required: 'Password is required',
                  })}
                  placeholder="••••••••"
                  className={`w-full pl-12 pr-4 py-4 rounded-2xl border-2 bg-gray-50/50 outline-none transition-all focus:border-[#37948b] focus:bg-white focus:ring-4 focus:ring-teal-50 ${
                    errors.password ? 'border-red-400' : 'border-gray-100'
                  }`}
                />
              </div>
              {errors.password && (
                <p className="text-xs text-red-500 font-bold mt-1 ml-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <motion.button
              whileHover={{ scale: 1.02, backgroundColor: '#2d7a72' }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full py-4 bg-[#37948b] text-white font-black rounded-2xl shadow-xl shadow-[#37948b33] transition-all flex items-center justify-center gap-3 text-lg"
            >
              Sign In <FaPaw className="text-sm" />
            </motion.button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-10">
            <div className="flex-1 border-t-2 border-gray-50"></div>
            <span className="px-4 text-[10px] text-gray-400 uppercase font-black tracking-[0.3em]">
              Or use social
            </span>
            <div className="flex-1 border-t-2 border-gray-100"></div>
          </div>

          {/* Social Login */}
          <motion.button
            whileHover={{ y: -3, boxShadow: '0 10px 20px rgba(0,0,0,0.05)' }}
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-4 py-4 bg-white border-2 border-gray-100 rounded-2xl font-bold text-gray-700 hover:border-[#37948b] transition-all"
          >
            <FaGoogle className="text-red-500 text-xl" />
            <span>Continue with Google</span>
          </motion.button>

          <p className="text-center mt-12 text-gray-500 font-bold">
            Don't have an account?
            <Link
              to="/register"
              className="ml-2 font-black text-[#37948b] hover:text-[#2d7a72] underline transition-colors"
            >
              Sign up for free
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
