import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaPaw,
  FaShieldAlt,
  FaLock,
  FaArrowLeft,
  FaHome,
  FaExclamationTriangle,
} from 'react-icons/fa';

const Forbidden = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-[#FFFBF7] dark:bg-gray-950 flex items-center justify-center p-6 font-sans relative overflow-hidden">
      {/* --- Background Floating Paw Decor --- */}
      <div className="absolute top-1/2 -left-20 -translate-y-1/2 text-[#37948b]/5 pointer-events-none -z-0">
        <FaPaw size={500} className="-rotate-12" />
      </div>
      <div className="absolute top-10 right-10 text-[#37948b]/5 pointer-events-none -z-0">
        <FaPaw size={350} className="rotate-45" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="max-w-xl w-full bg-white dark:bg-gray-900 p-8 sm:p-14 rounded-[3.5rem] shadow-2xl shadow-teal-900/5 border border-gray-100 dark:border-gray-800 text-center relative z-10"
      >
        {/* --- Top Badge --- */}
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-50 dark:bg-red-950/40 text-red-500 font-black text-xs uppercase tracking-[0.2em] mb-8 border border-red-100 dark:border-red-900/30"
        >
          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
          403 • Access Restricted
        </motion.div>

        {/* --- Animated Shield / Lock Graphic --- */}
        <div className="relative w-32 h-32 mx-auto mb-8 flex items-center justify-center">
          <motion.div
            animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            className="w-full h-full rounded-[2.5rem] bg-gradient-to-tr from-[#37948b]/20 to-red-500/10 flex items-center justify-center border border-[#37948b]/20 shadow-inner"
          >
            <FaShieldAlt className="text-6xl text-[#37948b]" />
            <FaLock className="text-xl text-red-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mt-1" />
          </motion.div>
        </div>

        {/* --- Headings --- */}
        <h1 className="text-4xl sm:text-5xl font-black text-gray-900 dark:text-white tracking-tighter leading-tight mb-4">
          Restricted <span className="text-[#37948b]">Territory!</span>
        </h1>

        <p className="text-gray-500 dark:text-gray-400 font-medium text-base sm:text-lg leading-relaxed mb-10 max-w-md mx-auto">
          Woof! You don't have the secret paw-pass to enter this area. Only
          authorized pet guardians are allowed.
        </p>

        {/* --- Action Buttons --- */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto px-8 py-4 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-100 dark:hover:bg-gray-700 transition-all flex items-center justify-center gap-2 border border-gray-200 dark:border-gray-700 cursor-pointer"
          >
            <FaArrowLeft /> Go Back
          </button>

          <Link to="/" className="w-full sm:w-auto">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="w-full sm:w-auto px-8 py-4 bg-[#37948b] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-[#37948b33] hover:bg-[#2d7a72] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <FaHome /> Back to Safety
            </motion.button>
          </Link>
        </div>

        {/* --- Security Subtext --- */}
        <div className="mt-10 pt-6 border-t border-gray-50 dark:border-gray-800 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
          <FaPaw className="text-[#37948b]" /> Pet Care & Adoption Security
          Guard
        </div>
      </motion.div>
    </div>
  );
};

export default Forbidden;
