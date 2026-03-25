import React, { useEffect, useState, useContext } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Swal from 'sweetalert2';
import { AuthContext } from '../../Auth/AuthContext';
import Container from '../../Container/Container';
import Logo from '../Logo/Logo';
import {
  FaPaw,
  FaSignOutAlt,
  FaSun,
  FaMoon,
  FaBars,
  FaTimes,
} from 'react-icons/fa';
import { MdDashboard } from 'react-icons/md'; // মডার্ন ড্যাশবোর্ড আইকন

const NavBar = () => {
  const { user, logOut } = useContext(AuthContext);
  const navigate = useNavigate();
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // ✅ ডার্ক মোড এবং লাইট মোড লজিক
  useEffect(() => {
    const html = document.documentElement;
    if (theme === 'dark') {
      html.classList.add('dark');
      html.setAttribute('data-theme', 'dark'); // DaisyUI থাকলে সুবিধা হবে
    } else {
      html.classList.remove('dark');
      html.setAttribute('data-theme', 'light');
    }
    localStorage.setItem('theme', theme);

    // স্ক্রল ডিটেকশন
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [theme]);

  const handleToggle = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  const handleSignOut = async () => {
    try {
      await logOut();
      Swal.fire({
        icon: 'success',
        title: 'Logged Out',
        text: 'Come back soon!',
        timer: 1500,
        showConfirmButton: false,
        background: theme === 'dark' ? '#1f2937' : '#ffffff',
        color: theme === 'dark' ? '#ffffff' : '#1f2937',
      });
      navigate('/login');
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Error', text: error.message });
    }
  };

  const navLinks = [
    { text: 'Home', path: '/' },
    { text: 'Pet Listing', path: '/petListing' },
    { text: 'Donation Campaigns', path: '/donationCampaigns' },
  ];

  if (user) {
    navLinks.push({ text: 'Blogs', path: '/blogs' });
    navLinks.push({ text: 'Events', path: '/events' });
  }

  return (
    <motion.div
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-lg py-2'
          : 'bg-[#FFFBF7] dark:bg-gray-950 py-4'
      }`}
    >
      <Container>
        <div className="flex items-center justify-between">
          {/* --- Logo --- */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Logo />
          </motion.div>

          {/* --- Desktop Links --- */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link, idx) => (
              <NavLink
                key={idx}
                to={link.path}
                className={({ isActive }) =>
                  `relative px-4 py-2 font-bold text-sm transition-all duration-300 ${
                    isActive
                      ? 'text-[#37948b]'
                      : 'text-gray-600 dark:text-gray-400 hover:text-[#37948b] dark:hover:text-[#37948b]'
                  }`
                }
              >
                {link.text}
                <motion.span
                  className="absolute bottom-0 left-0 w-full h-0.5 bg-[#37948b]"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                />
              </NavLink>
            ))}
          </div>

          {/* --- Right Actions --- */}
          <div className="flex items-center gap-3">
            {/* 🌗 Theme Toggle Switch */}
            {/* <motion.button
              whileTap={{ scale: 0.8, rotate: 90 }}
              onClick={handleToggle}
              className="p-2.5 rounded-full bg-gray-100 dark:bg-gray-800 text-[#37948b] transition-colors border border-gray-200 dark:border-gray-700"
              title={theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
            >
              {theme === 'dark' ? <FaSun size={18} /> : <FaMoon size={18} />}
            </motion.button> */}

            {/* Auth User */}
            {user ? (
              <div className="dropdown dropdown-end">
                <motion.div
                  tabIndex={0}
                  role="button"
                  whileHover={{ scale: 1.05 }}
                  className="avatar online"
                >
                  <div className="w-10 h-10 rounded-full ring-2 ring-[#37948b] ring-offset-2 ring-offset-white dark:ring-offset-gray-900 overflow-hidden">
                    <img
                      alt="Profile"
                      src={
                        user?.user_metadata?.avatar_url ||
                        'https://i.ibb.co/mJR657F/user-placeholder.png'
                      }
                    />
                  </div>
                </motion.div>
                <ul
                  tabIndex={0}
                  className="dropdown-content z-[1] menu p-3 shadow-2xl bg-white dark:bg-gray-800 rounded-2xl w-60 mt-4 border border-gray-100 dark:border-gray-700 transition-colors"
                >
                  <li className="mb-2 px-4 py-2 border-b dark:border-gray-700">
                    <p className="font-black text-[#37948b] truncate">
                      {user?.user_metadata?.full_name || 'Pet Lover'}
                    </p>
                    <p className="text-[10px] text-gray-400 truncate font-bold">
                      {user?.email}
                    </p>
                  </li>
                  <li>
                    <Link
                      to="/dashboard"
                      className="flex items-center gap-3 py-3 font-bold text-gray-700 dark:text-gray-200 hover:text-[#37948b] dark:hover:text-[#37948b]"
                    >
                      <MdDashboard className="text-xl" /> Dashboard
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={handleSignOut}
                      className="flex items-center gap-3 py-3 font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <FaSignOutAlt /> Log Out
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden sm:flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#37948b] text-white font-black hover:bg-[#2d7a72] shadow-lg shadow-[#37948b33] transition-all"
              >
                Join Now <FaPaw />
              </Link>
            )}

            {/* Mobile Menu Btn */}
            <button
              className="lg:hidden p-2 text-[#37948b] bg-gray-100 dark:bg-gray-800 rounded-lg"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
            </button>
          </div>
        </div>

        {/* --- Mobile Menu --- */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden mt-4 overflow-hidden bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700"
            >
              <ul className="p-4 space-y-1">
                {navLinks.map((link, idx) => (
                  <li key={idx}>
                    <NavLink
                      to={link.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        `block px-5 py-3.5 rounded-2xl font-bold transition-all ${
                          isActive
                            ? 'bg-[#37948b] text-white'
                            : 'text-gray-600 dark:text-gray-300 hover:bg-teal-50 dark:hover:bg-gray-700 hover:text-[#37948b]'
                        }`
                      }
                    >
                      {link.text}
                    </NavLink>
                  </li>
                ))}
                {!user && (
                  <li>
                    <Link
                      to="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-4 py-4 mt-2 bg-[#37948b] text-white rounded-2xl text-center font-black shadow-lg"
                    >
                      Login
                    </Link>
                  </li>
                )}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </Container>
    </motion.div>
  );
};

export default NavBar;
