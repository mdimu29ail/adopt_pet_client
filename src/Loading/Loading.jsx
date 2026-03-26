import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPaw, FaHeart } from 'react-icons/fa';

const Loading = () => {
  // Particles animation for floating hearts
  const heartParticles = Array.from({ length: 8 });

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-[#f8fafc]">
      {/* 1. Animated Mesh Gradient Background */}
      <div className="absolute inset-0 z-0">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            backgroundColor: ['#37948b', '#6ee7b7', '#37948b'],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
          className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full opacity-20 blur-[120px]"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [0, -90, 0],
            backgroundColor: ['#a7f3d0', '#37948b', '#a7f3d0'],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
          className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] rounded-full opacity-30 blur-[120px]"
        />
      </div>

      {/* 2. Glassmorphism Content Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative z-10 p-12 rounded-[4rem] bg-white/40 backdrop-blur-3xl border border-white/50 shadow-[0_32px_64px_-15px_rgba(0,0,0,0.1)] flex flex-col items-center"
      >
        {/* 3. Central Animated Paw with Glow */}
        <div className="relative mb-12">
          {/* Outer Glow Ring */}
          <motion.div
            animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 bg-[#37948b] rounded-full blur-2xl"
          />

          {/* Main Paw Icon */}
          <motion.div
            animate={{ y: [0, -15, 0], rotate: [0, 5, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="relative z-10 w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-inner"
          >
            <FaPaw className="text-5xl text-[#37948b]" />
          </motion.div>

          {/* Floating Hearts around the Paw */}
          {heartParticles.map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 0, x: 0 }}
              animate={{
                opacity: [0, 1, 0],
                y: -100,
                x: (i % 2 === 0 ? 40 : -40) * Math.random(),
              }}
              transition={{
                duration: 2 + Math.random(),
                repeat: Infinity,
                delay: i * 0.4,
              }}
              className="absolute top-1/2 left-1/2 text-[#37948b]/40 text-xl"
            >
              <FaHeart />
            </motion.div>
          ))}
        </div>

        {/* 4. Elegant Typography */}
        <div className="text-center space-y-4">
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-4xl font-black text-gray-900 tracking-tighter"
          >
            Preparing <span className="text-[#37948b]">Love...</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-gray-500 font-medium tracking-[0.2em] text-[10px] uppercase"
          >
            Finding the best friends for you
          </motion.p>

          {/* Modern Slim Progress Bar */}
          <div className="w-48 h-1.5 bg-gray-200/50 rounded-full mt-8 overflow-hidden relative">
            <motion.div
              initial={{ left: '-100%' }}
              animate={{ left: '100%' }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="absolute inset-y-0 w-24 bg-gradient-to-r from-transparent via-[#37948b] to-transparent"
            />
          </div>
        </div>
      </motion.div>

      {/* Background Decorative Text */}
      <div className="absolute bottom-10 left-10 opacity-[0.03] select-none pointer-events-none">
        <h1 className="text-[10rem] font-black leading-none">ADOPT</h1>
      </div>
    </div>
  );
};

export default Loading;
