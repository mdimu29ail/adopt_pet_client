import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaGoogle, FaEnvelope, FaLock, FaArrowLeft } from 'react-icons/fa';
import Swal from 'sweetalert2';
import useAuth from '../hooks/useAuth';
import useAxios from '../hooks/useAxios';
import Logo from '../Components/Logo/Logo';

const Login = () => {
  const { logIn, signinWithGoogle } = useAuth();
  const axiosInstance = useAxios();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = data => {
    logIn(data.email, data.password)
      .then(() => {
        Swal.fire({
          icon: 'success',
          title: 'Welcome Back!',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 1500,
        });
        navigate(from, { replace: true });
      })
      .catch(error => {
        Swal.fire({
          icon: 'error',
          title: 'Login failed',
          text: error.message,
        });
      });
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signinWithGoogle();
      const user = result.user;

      const userInfo = {
        name: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        role: 'user',
        created_at: new Date().toISOString(),
        last_log_in: new Date().toISOString(),
      };

      try {
        await axiosInstance.get(`/users/${user.email}`);
      } catch {
        await axiosInstance.post('/users', userInfo);
      }

      Swal.fire({
        icon: 'success',
        title: 'Logged in with Google!',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 1500,
      });

      navigate(from, { replace: true });
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'Google login failed', 'error');
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-white font-sans">
      {/* --- Left Side: Visual/Branding (Hidden on mobile) --- */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#ff6600] relative overflow-hidden items-center justify-center p-12">
        {/* Decorative Circles */}
        <div className="absolute top-[-10%] left-[-10%] w-80 h-80 bg-orange-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-80 h-80 bg-orange-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

        <div className="relative z-10 text-white max-w-md">
          <div className="mb-8">
            <Logo />
          </div>
          <h1 className="text-5xl font-extrabold mb-6 leading-tight">
            Design your world <br /> with passion.
          </h1>
          <p className="text-orange-50 text-lg">
            Join thousands of users and start your journey today. Access your
            personalized dashboard and premium features.
          </p>
        </div>
      </div>

      {/* --- Right Side: Login Form --- */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Mobile Logo & Back link */}
          <div className="flex items-center justify-between mb-8 lg:hidden">
            <Logo />
            <Link
              to="/"
              className="text-[#ff6600] flex items-center gap-2 font-medium"
            >
              <FaArrowLeft /> Home
            </Link>
          </div>

          <div className="mb-10">
            <h2 className="text-4xl font-bold text-gray-900 mb-2">
              Welcome Back
            </h2>
            <p className="text-gray-500">
              Please enter your details to sign in.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email Input */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 ml-1">
                Email Address
              </label>
              <div className="relative flex items-center">
                <FaEnvelope className="absolute left-4 text-gray-400" />
                <input
                  type="email"
                  {...register('email', { required: 'Email is required' })}
                  placeholder="name@company.com"
                  className={`w-full pl-12 pr-4 py-4 rounded-xl border-2 bg-white outline-none transition-all focus:border-[#ff6600] focus:ring-4 focus:ring-orange-100 ${
                    errors.email ? 'border-red-400' : 'border-gray-100'
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-500 mt-1 ml-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-sm font-semibold text-gray-700">
                  Password
                </label>
                <a
                  href="#"
                  className="text-xs font-bold text-[#ff6600] hover:underline"
                >
                  Forgot?
                </a>
              </div>
              <div className="relative flex items-center">
                <FaLock className="absolute left-4 text-gray-400" />
                <input
                  type="password"
                  {...register('password', {
                    required: 'Password is required',
                  })}
                  placeholder="••••••••"
                  className={`w-full pl-12 pr-4 py-4 rounded-xl border-2 bg-white outline-none transition-all focus:border-[#ff6600] focus:ring-4 focus:ring-orange-100 ${
                    errors.password ? 'border-red-400' : 'border-gray-100'
                  }`}
                />
              </div>
              {errors.password && (
                <p className="text-xs text-red-500 mt-1 ml-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-[#ff6600] hover:bg-[#cc5200] text-white font-bold rounded-xl shadow-lg shadow-orange-200 transition-all transform active:scale-[0.98]"
            >
              Sign In
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-8">
            <div className="flex-1 border-t border-gray-200"></div>
            <span className="px-4 text-sm text-gray-400 uppercase font-medium">
              Or continue with
            </span>
            <div className="flex-1 border-t border-gray-200"></div>
          </div>

          {/* Social Login */}
          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 py-4 bg-white border-2 border-gray-100 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-all active:scale-[0.98]"
          >
            <FaGoogle className="text-red-500 text-xl" />
            <span>Google Account</span>
          </button>

          <p className="text-center mt-10 text-gray-600">
            Don't have an account?
            <Link
              to="/register"
              className="ml-2 font-bold text-[#ff6600] hover:underline"
            >
              Create one for free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
