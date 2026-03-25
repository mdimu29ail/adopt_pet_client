import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaPaw } from 'react-icons/fa';

const Logo = () => {
  return (
    <Link
      to="/"
      className="flex items-center gap-2 group cursor-pointer no-underline"
    >
      {/* --- Animated Icon Box --- */}
      <motion.div
        whileHover={{
          rotate: [0, -15, 15, -15, 0],
          scale: 1.1,
        }}
        transition={{ duration: 0.5 }}
        className="relative p-2.5 bg-[#37948b] rounded-2xl shadow-lg shadow-[#37948b33] flex items-center justify-center"
      >
        <FaPaw className="text-white text-2xl md:text-3xl" />

        {/* Decorative Ring */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 border-2 border-white/30 rounded-2xl"
        />
      </motion.div>

      {/* --- Text Brand Section --- */}
      <div className="flex flex-col -space-y-1.5">
        <motion.span
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-2xl md:text-3xl font-black text-gray-800 dark:text-white tracking-tighter"
        >
          Paws<span className="text-[#37948b]">itive</span>
        </motion.span>

        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ delay: 0.3 }}
          className="text-[10px] md:text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-[0.2em] ml-0.5"
        >
          Pet Adoption
        </motion.span>
      </div>
    </Link>
  );
};

export default Logo;
