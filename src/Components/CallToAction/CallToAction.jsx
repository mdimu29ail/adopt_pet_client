import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaPaw, FaHeart, FaArrowRight, FaCheckCircle } from 'react-icons/fa';
import { BiSolidDonateHeart } from 'react-icons/bi';

const CallToAction = () => {
  return (
    <section className="relative w-full py-16 lg:py-24 bg-[#FFFBF7] dark:bg-gray-950 overflow-hidden">
      {/* --- Background Elements --- */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-64 h-64 bg-[#37948b]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="bg-white dark:bg-gray-900 rounded-[3rem] shadow-2xl shadow-teal-900/10 overflow-hidden border border-gray-100 dark:border-gray-800">
          <div className="flex flex-col lg:flex-row items-stretch">
            {/* --- Left Column: Content --- */}
            <div className="w-full lg:w-3/5 p-8 md:p-16 lg:p-20 flex flex-col justify-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-50 dark:bg-teal-900/30 text-[#37948b] font-black text-xs uppercase tracking-widest mb-6">
                  <FaPaw className="animate-bounce" /> Every Tail Deserves a
                  Home
                </div>

                <h2 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white leading-tight mb-6">
                  Ready to Meet Your <br />
                  <span className="text-[#37948b]">Furry Soulmate?</span>
                </h2>

                <p className="text-gray-600 dark:text-gray-400 text-lg md:text-xl font-medium mb-8 leading-relaxed max-w-xl">
                  A house is not a home without a pet. Join the thousands of
                  families who found unconditional love through adoption.
                </p>

                {/* List Features */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                  {[
                    'Free Health Checkup',
                    'Life-time Support',
                    'Adoption Kit',
                    'Vaccination Done',
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-bold"
                    >
                      <FaCheckCircle className="text-[#37948b]" /> {item}
                    </div>
                  ))}
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full sm:w-auto"
                  >
                    <Link
                      to="/petListing"
                      className="flex items-center justify-center gap-3 px-10 py-5 bg-[#37948b] text-white font-black rounded-2xl shadow-xl shadow-[#37948b44] hover:bg-[#2d7a72] transition-all w-full text-lg"
                    >
                      Adopt Now <FaHeart />
                    </Link>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full sm:w-auto"
                  >
                    <Link
                      to="/donationCampaigns"
                      className="flex items-center justify-center gap-3 px-10 py-5 bg-white dark:bg-gray-800 text-[#37948b] border-2 border-[#37948b] font-black rounded-2xl hover:bg-teal-50 dark:hover:bg-gray-700 transition-all w-full text-lg"
                    >
                      Support a Life <BiSolidDonateHeart size={22} />
                    </Link>
                  </motion.div>
                </div>
              </motion.div>
            </div>

            {/* --- Right Column: Image with Organic Mask --- */}
            <div className="w-full lg:w-2/5 relative min-h-[400px] lg:min-h-full overflow-hidden bg-teal-50 dark:bg-gray-800">
              <motion.img
                initial={{ scale: 1.2 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 1.5 }}
                src="https://i.ibb.co.com/tMf5Yknh/Whats-App-Image-2025-07-14-at-20-27-58-5daff0b2.jpg"
                alt="Happy Dog"
                className="absolute inset-0 w-full h-full object-cover"
              />

              {/* Organic Overlay Mask */}
              <div className="absolute inset-0 bg-[#37948b]/10 backdrop-blur-[2px]" />

              {/* Floating Badge */}
              <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md p-6 rounded-3xl shadow-2xl border border-white/50 dark:border-gray-700 text-center z-20"
              >
                <div className="w-16 h-16 bg-[#37948b] rounded-2xl flex items-center justify-center text-white mx-auto mb-4 shadow-lg shadow-[#37948b44]">
                  <FaPaw size={32} />
                </div>
                <h4 className="text-2xl font-black text-gray-900 dark:text-white leading-tight">
                  800+
                </h4>
                <p className="text-[10px] font-black uppercase tracking-widest text-[#37948b]">
                  Happy Adoptions
                </p>
              </motion.div>

              {/* Decorative Corner Shape */}
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-white dark:bg-gray-900 rounded-tr-[4rem] hidden lg:block" />
            </div>
          </div>
        </div>

        {/* --- Bottom Trust Section --- */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 flex flex-col md:flex-row items-center justify-center gap-8 text-gray-400 dark:text-gray-500 font-bold"
        >
          <div className="flex items-center gap-2">
            <FaCheckCircle className="text-[#37948b]" /> 100% Safe Process
          </div>
          <div className="hidden md:block w-2 h-2 rounded-full bg-gray-200 dark:bg-gray-800" />
          <div className="flex items-center gap-2">
            <FaCheckCircle className="text-[#37948b]" /> Verified Shelter
            Partners
          </div>
          <div className="hidden md:block w-2 h-2 rounded-full bg-gray-200 dark:bg-gray-800" />
          <div className="flex items-center gap-2 text-[#37948b]">
            <FaHeart className="animate-pulse" /> Community Driven
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CallToAction;
