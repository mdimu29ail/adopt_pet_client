import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import useAuth from '../hooks/useAuth';
import { FaPaw } from 'react-icons/fa';
import { MdSecurity } from 'react-icons/md';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // --- মডার্ন ব্র্যান্ডেড লোডিং স্ক্রিন ---
  if (loading) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#FFFBF7] relative overflow-hidden">
        {/* ব্যাকগ্রাউন্ড ডেকোরেশন (Animated Blobs) */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-[#FF8A65] rounded-full blur-[100px]"
        />
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 5, repeat: Infinity, delay: 1 }}
          className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-[#4DB6AC] rounded-full blur-[100px]"
        />

        <div className="relative z-10 flex flex-col items-center">
          {/* লোডিং এনিমেশন আইকন */}
          <div className="relative mb-8">
            {/* আউটার স্পিনিং রিং */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className="w-24 h-24 border-4 border-dashed border-[#FF8A65] rounded-full"
            />

            {/* ইনার বাউন্সি থাবা (Paw) */}
            <motion.div
              animate={{ y: [0, -10, 0], scale: [1, 1.1, 1] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            >
              <FaPaw className="text-4xl text-[#FF8A65]" />
            </motion.div>
          </div>

          {/* টেক্সট এনিমেশন */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h3 className="text-2xl font-bold text-[#2D3436] tracking-tight flex items-center justify-center gap-2">
              <MdSecurity className="text-[#4DB6AC]" />
              Securing <span className="text-[#FF8A65]">Session...</span>
            </h3>
            <p className="text-gray-500 text-sm mt-3 font-medium tracking-wide">
              Preparing a cozy place for you and the pets!
            </p>
          </motion.div>
        </div>

        {/* বটম প্রোগ্রেস বার */}
        <div className="absolute bottom-0 left-0 w-full h-1.5 bg-gray-100">
          <motion.div
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="h-full bg-gradient-to-r from-[#FF8A65] to-[#4DB6AC]"
          />
        </div>
      </div>
    );
  }

  // যদি ইউজার লগইন না থাকে
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // সফলভাবে লগইন থাকলে কন্টেন্ট দেখাবে (সাথে একটি ফেইড-ইন এনিমেশন)
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

export default PrivateRoute;
