import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Users, ShieldCheck, Zap } from 'lucide-react';
import { FaPaw, FaQuoteLeft } from 'react-icons/fa';

const AboutUs = () => {
  // কার্ড ডাটা
  const features = [
    {
      icon: <Heart className="w-6 h-6" />,
      title: 'Pure Love',
      desc: 'Every pet is treated like family from day one.',
      color: 'text-red-500',
      bg: 'bg-red-50',
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Family First',
      desc: 'We match pets based on your lifestyle and home.',
      color: 'text-blue-500',
      bg: 'bg-blue-50',
    },
    {
      icon: <ShieldCheck className="w-6 h-6" />,
      title: 'Verified',
      desc: 'All our pets are health-checked and vaccinated.',
      color: 'text-[#37948b]',
      bg: 'bg-teal-50',
    },
  ];

  return (
    <section className="relative py-24 bg-[#FFFBF7] dark:bg-gray-950 overflow-hidden">
      {/* --- Abstract Background Shapes --- */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-30 dark:opacity-10">
        <div className="absolute top-[10%] left-[-5%] w-72 h-72 bg-[#37948b] rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] right-[-5%] w-96 h-96 bg-[#4DB6AC] rounded-full blur-[150px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-20">
          {/* --- Left Side: Multi-Image Mosaic --- */}
          <div className="w-full lg:w-1/2 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative"
            >
              {/* Main Image */}
              <div className="rounded-[4rem] rounded-br-none overflow-hidden border-[15px] border-white dark:border-gray-900 shadow-2xl relative z-10">
                <img
                  src="https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?q=80&w=2071&auto=format&fit=crop"
                  alt="Pet Love"
                  className="w-full h-[500px] object-cover"
                />
              </div>

              {/* Floating Smaller Image */}
              <motion.div
                animate={{ y: [0, 20, 0] }}
                transition={{ duration: 5, repeat: Infinity }}
                className="absolute -bottom-10 -left-6 md:-left-12 w-48 h-48 rounded-[3rem] overflow-hidden border-8 border-white dark:border-gray-900 shadow-2xl z-20 hidden md:block"
              >
                <img
                  src="https://images.unsplash.com/photo-1537151625747-7ae8a03a2156?q=80&w=1974&auto=format&fit=crop"
                  alt="Puppy"
                  className="w-full h-full object-cover"
                />
              </motion.div>

              {/* Experience Badge */}
              <motion.div
                whileHover={{ rotate: 10 }}
                className="absolute -top-6 -right-6 bg-[#37948b] text-white p-8 rounded-full shadow-2xl z-30 flex flex-col items-center justify-center text-center"
              >
                <span className="text-3xl font-black">10+</span>
                <span className="text-[10px] font-bold uppercase tracking-widest leading-none">
                  Years of <br /> Love
                </span>
              </motion.div>
            </motion.div>
          </div>

          {/* --- Right Side: Content --- */}
          <div className="w-full lg:w-1/2 space-y-10">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px w-12 bg-[#37948b]" />
                <span className="text-[#37948b] font-black uppercase text-xs tracking-[0.3em]">
                  The Heart of Pawsitive
                </span>
              </div>

              <h2 className="text-5xl md:text-6xl font-black text-gray-900 dark:text-white leading-[1.1]">
                We Bridge the Gap <br />
                Between <span className="text-[#37948b]">Hearts & Paws.</span>
              </h2>

              <p className="mt-8 text-gray-600 dark:text-gray-400 text-lg md:text-xl font-medium leading-relaxed italic">
                <FaQuoteLeft className="inline-block mr-2 text-[#37948b] opacity-20" />
                "Our mission is simple: to ensure no wagging tail or soft purr
                goes without a forever home."
              </p>
            </motion.div>

            {/* Feature Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {features.map((item, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ y: -5 }}
                  className="p-6 rounded-[2.5rem] bg-white dark:bg-gray-900 shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-50 dark:border-gray-800 flex items-start gap-4 group"
                >
                  <div
                    className={`${item.bg} ${item.color} p-4 rounded-2xl group-hover:scale-110 transition-transform`}
                  >
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-gray-800 dark:text-white mb-1">
                      {item.title}
                    </h4>
                    <p className="text-gray-500 dark:text-gray-400 text-sm font-bold leading-snug">
                      {item.desc}
                    </p>
                  </div>
                </motion.div>
              ))}

              {/* Special Action Card */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="p-6 rounded-[2.5rem] bg-[#37948b] text-white flex flex-col justify-center items-center text-center group cursor-pointer"
              >
                <Zap className="w-8 h-8 mb-2 animate-pulse text-[#a7f3d0]" />
                <h4 className="font-black text-lg">Ready to Help?</h4>
                <p className="text-[10px] uppercase font-bold tracking-widest opacity-80 mt-1">
                  Join our volunteer pack
                </p>
              </motion.div>
            </div>

            {/* Trust Footer */}
            <div className="flex items-center gap-6 pt-6 border-t border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-2">
                <FaPaw className="text-[#37948b]" />
                <span className="text-sm font-black text-gray-800 dark:text-gray-300 tracking-tight">
                  5,000+ Pets Rescued
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="text-red-500 w-4 h-4" />
                <span className="text-sm font-black text-gray-800 dark:text-gray-300 tracking-tight">
                  100% Love Guaranteed
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
