import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import useAuth from '../../hooks/useAuth';
import useUserRole from '../../hooks/useUserRole';
import { FaShieldAlt, FaLock, FaPaw, FaCircleNotch } from 'react-icons/fa';

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // আপনার অন্যান্য কম্পোনেন্টে useUserRole একটি Array রিটার্ন করেছে, তাই এখানে Array Destructuring ব্যবহার করা হলো
  const [role, isRoleLoading] = useUserRole();
  const location = useLocation();

  // --- 🛡️ Premium Security Loading Screen ---
  if (loading || isRoleLoading) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#FFFBF7] dark:bg-gray-950 relative overflow-hidden">
        {/* Animated Background Radar/Blobs */}
        <motion.div
          animate={{ scale: [1, 1.5, 1], opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 md:w-96 md:h-96 bg-[#37948b] rounded-full blur-[80px]"
        />

        <div className="relative z-10 flex flex-col items-center">
          {/* Security Icon Animation */}
          <div className="relative mb-8 flex items-center justify-center">
            {/* Outer Spinning Ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0 rounded-full border-[3px] border-dashed border-[#37948b]/40 w-32 h-32 -m-4"
            />
            {/* Inner Pulsing Shield */}
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-24 h-24 bg-white dark:bg-gray-900 rounded-full shadow-2xl flex items-center justify-center border border-teal-50 dark:border-gray-800"
            >
              <FaShieldAlt className="text-5xl text-[#37948b]" />
            </motion.div>
            {/* Small floating lock */}
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -top-2 -right-2 bg-amber-400 text-white p-2 rounded-xl shadow-lg"
            >
              <FaLock size={12} />
            </motion.div>
          </div>

          {/* Text Animation */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h3 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white tracking-tighter flex items-center justify-center gap-3">
              Verifying <span className="text-[#37948b]">Access</span>
              <FaCircleNotch className="animate-spin text-[#37948b] text-xl" />
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-xs md:text-sm mt-3 font-bold uppercase tracking-widest flex items-center justify-center gap-2">
              <FaPaw className="text-[#37948b]" /> Secure Admin Portal
            </p>
          </motion.div>
        </div>

        {/* Bottom Loading Bar */}
        <div className="absolute bottom-0 left-0 w-full h-1.5 bg-gray-100 dark:bg-gray-900">
          <motion.div
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="h-full bg-gradient-to-r from-[#37948b] to-[#4DB6AC]"
          />
        </div>
      </div>
    );
  }

  // --- 🚫 Unauthorized Redirection ---
  if (!user || role !== 'admin') {
    return (
      <Navigate to="/forbidden" state={{ from: location.pathname }} replace />
    );
  }

  // --- ✅ Authorized Render ---
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  );
};

export default AdminRoute;
