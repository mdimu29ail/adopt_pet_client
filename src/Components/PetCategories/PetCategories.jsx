import React from 'react';
import { motion } from 'framer-motion';
import { PawPrint, Cat, Dog, Fish, Rabbit, Bird } from 'lucide-react';

const categories = [
  { name: 'All', icon: <PawPrint size={20} /> },
  { name: 'Dog', icon: <Dog size={20} /> },
  { name: 'Cat', icon: <Cat size={20} /> },
  { name: 'Rabbit', icon: <Rabbit size={20} /> },
  { name: 'Fish', icon: <Fish size={20} /> },
  { name: 'Bird', icon: <Bird size={20} /> },
];

const PetCategories = ({ category, setCategory }) => {
  return (
    <section className="w-full py-4 overflow-hidden">
      {/* 
          মোবাইলের জন্য এখানে 'overflow-x-auto' ব্যবহার করা হয়েছে 
          যাতে অনেকগুলো ক্যাটাগরি থাকলে স্ক্রল করা যায় 
      */}
      <div className="flex items-center lg:justify-end overflow-x-auto no-scrollbar pb-2">
        <motion.div
          layout
          className="flex items-center gap-2 p-1.5 bg-gray-100/50 dark:bg-gray-800/50 backdrop-blur-md rounded-[2rem] border border-gray-200/50 dark:border-gray-700/50 shadow-inner"
        >
          {categories.map(c => {
            const isActive = category === c.name;

            return (
              <motion.button
                key={c.name}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCategory(c.name)}
                className={`
                  relative flex items-center gap-2.5 px-6 py-3 rounded-full text-sm font-black transition-all duration-300 whitespace-nowrap
                  ${isActive ? 'text-white' : 'text-gray-500 dark:text-gray-400 hover:text-[#37948b]'}
                `}
              >
                {/* আইকন */}
                <span className="relative z-10">{c.icon}</span>

                {/* নাম */}
                <span className="relative z-10 tracking-tight capitalize">
                  {c.name}
                </span>

                {/* --- শ্লাইডিং ব্যাকগ্রাউন্ড (Magic Animation) --- */}
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-[#37948b] rounded-full shadow-lg shadow-[#37948b44]"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </motion.button>
            );
          })}
        </motion.div>
      </div>

      {/* কাস্টম স্টাইল: স্ক্রলবার হাইড করার জন্য */}
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </section>
  );
};

export default PetCategories;
