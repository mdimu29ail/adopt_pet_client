import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { FaPaw, FaCheckCircle, FaCalendarAlt, FaHeart } from 'react-icons/fa';
import { Link } from 'react-router-dom';

function PetSittingHero() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <SkeletonTheme baseColor="#e0e0e0" highlightColor="#f5f5f5">
        <div className="w-full bg-[#FFFBF7] py-20 px-6 md:px-20">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="w-full lg:w-1/2 space-y-6">
              <Skeleton height={20} width={150} borderRadius={20} />
              <Skeleton height={60} width="80%" />
              <Skeleton height={30} width="60%" />
              <Skeleton count={3} />
              <Skeleton height={50} width={200} borderRadius={15} />
            </div>
            <div className="w-full lg:w-1/2">
              <Skeleton height={500} borderRadius={50} />
            </div>
          </div>
        </div>
      </SkeletonTheme>
    );
  }

  return (
    <section className="w-full bg-[#FFFBF7] dark:bg-gray-950 py-20 lg:py-32 overflow-hidden relative">
      {/* --- Background Decorative Elements --- */}
      <div className="absolute top-0 right-0 p-10 opacity-5 text-[#37948b] hidden lg:block">
        <FaPaw size={300} className="rotate-12" />
      </div>

      <div className="w-full max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          {/* --- Left Column: Content --- */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full lg:w-1/2 space-y-8 text-center lg:text-left order-2 lg:order-1"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#37948b]/10 text-[#37948b] font-black text-xs uppercase tracking-[0.2em]">
              <FaHeart className="animate-pulse" /> Premium Care for Your Pets
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-8xl font-black text-gray-900 dark:text-white leading-[1.05] tracking-tighter">
              Professional <br />
              <span className="text-[#37948b]">Pet Sitting</span>
            </h1>

            <h3 className="text-xl md:text-2xl font-bold text-gray-700 dark:text-gray-300">
              For Cats, Dogs & Exotic Pets*
            </h3>

            <p className="text-gray-500 dark:text-gray-400 text-lg md:text-xl font-medium leading-relaxed max-w-xl mx-auto lg:mx-0">
              We provide professional and loving care for your pets while you're
              away. Whether it's a weekend trip or a long vacation, your furry
              friends are in safe hands.
            </p>

            {/* Feature List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
              {[
                'Certified Pet Sitters',
                'Real-time Photo Updates',
                'Emergency Vet Access',
                'Personalized Care Plans',
              ].map((feature, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-center lg:justify-start gap-2 text-gray-700 dark:text-gray-200 font-bold"
                >
                  <FaCheckCircle className="text-[#37948b]" /> {feature}
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-5 pt-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto px-10 py-5 bg-[#37948b] text-white font-black rounded-2xl shadow-xl shadow-[#37948b44] flex items-center justify-center gap-3 text-lg"
              >
                Book a Sitter <FaCalendarAlt />
              </motion.button>

              <Link
                to="/contact"
                className="text-gray-500 dark:text-gray-400 font-black hover:text-[#37948b] transition-colors uppercase tracking-widest text-sm"
              >
                Learn More
              </Link>
            </div>
          </motion.div>

          {/* --- Right Column: Image Mosaic --- */}
          <div className="w-full lg:w-1/2 order-1 lg:order-2">
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 1 }}
              className="relative"
            >
              {/* Main Styled Image */}
              <div className="rounded-[4rem] rounded-bl-none overflow-hidden border-[15px] border-white dark:border-gray-800 shadow-2xl relative z-10">
                <img
                  src="https://i.ibb.co/hpPvVnQ/Whats-App-Image-2025-07-15-at-01-03-51-4c809265.jpg"
                  alt="Pet Sitting Service"
                  className="w-full h-[400px] md:h-[550px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#37948b]/20 to-transparent" />
              </div>

              {/* Floating Review Card */}
              <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="absolute -bottom-10 -left-6 md:-left-12 z-20 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl p-6 rounded-[2.5rem] shadow-2xl border border-white/50 dark:border-gray-700 max-w-[260px]"
              >
                <div className="flex items-center gap-1 mb-2">
                  {[1, 2, 3, 4, 5].map(i => (
                    <FaHeart key={i} className="text-[#37948b] text-xs" />
                  ))}
                </div>
                <p className="text-gray-800 dark:text-white font-black italic text-sm leading-relaxed">
                  "They treated my Rex like their own child! Highly
                  recommended."
                </p>
                <p className="mt-3 text-[10px] font-black uppercase text-[#37948b] tracking-widest">
                  — Sarah J. (Dog Mom)
                </p>
              </motion.div>

              {/* Background Shapes */}
              <div className="absolute -top-10 -right-10 w-64 h-64 bg-[#37948b]/10 rounded-full blur-3xl -z-10" />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default PetSittingHero;
