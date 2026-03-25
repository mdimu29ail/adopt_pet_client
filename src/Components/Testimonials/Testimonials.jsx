import React from 'react';
import { motion } from 'framer-motion';
import { FaStar, FaQuoteLeft, FaPaw, FaHeart } from 'react-icons/fa';

const testimonials = [
  {
    name: 'Steve Johnson',
    role: 'Cat Parent',
    quote:
      'Leaving our cat for a week was stressful, but the daily updates and photos put our minds at ease. We came home to a happy and relaxed pet.',
    stars: 5,
    avatar: 'https://i.pravatar.cc/150?u=steve',
  },
  {
    name: 'Mary Williams',
    role: 'Dog Owner',
    quote:
      'Absolutely fantastic service! They took care of our energetic Golden Retriever with such love. It is clear they genuinely love animals.',
    stars: 5,
    avatar: 'https://i.pravatar.cc/150?u=mary',
  },
  {
    name: 'Scotty Miller',
    role: 'Exotic Pet Keeper',
    quote:
      'I was worried about finding someone for my bearded dragon, but they were knowledgeable and professional. Best care ever!',
    stars: 5,
    avatar: 'https://i.pravatar.cc/150?u=scotty',
  },
  {
    name: 'Jane Doe',
    role: 'Rabbit Lover',
    quote:
      'The team is incredibly patient. My bunny is very shy, but they managed to make him feel right at home. Truly the best in town!',
    stars: 5,
    avatar: 'https://i.pravatar.cc/150?u=jane',
  },
];

// একই ডাটা ডুপ্লিকেট করা হয়েছে যাতে লুপটি নিরবচ্ছিন্ন (Seamless) মনে হয়
const doubledTestimonials = [...testimonials, ...testimonials];

const TestimonialCard = ({ name, role, quote, stars, avatar }) => (
  <div className="flex-shrink-0 w-[350px] md:w-[450px] px-4">
    <div className="relative bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] shadow-xl shadow-teal-900/5 border border-gray-100 dark:border-gray-800 flex flex-col h-full group">
      <div className="absolute top-6 right-8 text-[#37948b]/5 group-hover:text-[#37948b]/10 transition-colors">
        <FaQuoteLeft size={60} />
      </div>
      <div className="relative z-10">
        <div className="flex items-center gap-4 mb-6">
          <img
            src={avatar}
            alt={name}
            className="w-14 h-14 rounded-2xl object-cover border-2 border-[#37948b]/20 p-1 bg-white"
          />
          <div>
            <h3 className="font-black text-gray-800 dark:text-white text-base tracking-tight">
              {name}
            </h3>
            <p className="text-[10px] font-bold text-[#37948b] uppercase tracking-widest">
              {role}
            </p>
          </div>
        </div>
        <p className="text-gray-500 dark:text-gray-400 font-medium leading-relaxed mb-6 italic text-sm md:text-base">
          "{quote}"
        </p>
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <FaStar key={i} className="text-[#37948b] text-xs" />
          ))}
        </div>
      </div>
    </div>
  </div>
);

function Testimonials() {
  return (
    <section className="w-full bg-[#FFFBF7] dark:bg-gray-950 py-24 overflow-hidden relative">
      {/* --- Header --- */}
      <div className="text-center mb-16 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#37948b]/10 text-[#37948b] font-black text-xs uppercase tracking-[0.2em] mb-4"
        >
          <FaHeart className="animate-pulse" /> Success Stories
        </motion.div>
        <h2 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white">
          Loved by <span className="text-[#37948b]">Pet Parents</span>
        </h2>
      </div>

      {/* --- Infinite Moving Track --- */}
      <div className="relative flex overflow-hidden">
        {/* লিনিয়ার মুভমেন্ট অ্যানিমেশন */}
        <motion.div
          className="flex"
          animate={{
            x: ['0%', '-50%'], // অর্ধেক পর্যন্ত গেলে আবার শুরুতে ফিরে আসবে লুপের জন্য
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: 'loop',
              duration: 25, // গতি কমানো বা বাড়ানোর জন্য এটি পরিবর্তন করুন
              ease: 'linear',
            },
          }}
          style={{ width: 'fit-content' }}
        >
          {doubledTestimonials.map((testimonial, index) => (
            <TestimonialCard key={index} {...testimonial} />
          ))}
        </motion.div>

        {/* সাইডের গ্র্যাডিয়েন্ট ফেড (যাতে মনে হয় কার্ডগুলো ভ্যানিশ হয়ে যাচ্ছে) */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-20 md:w-40 bg-gradient-to-r from-[#FFFBF7] dark:from-gray-950 to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-20 md:w-40 bg-gradient-to-l from-[#FFFBF7] dark:from-gray-950 to-transparent z-10" />
      </div>

      {/* Background Decor */}
      <div className="absolute -bottom-10 -right-10 text-[#37948b]/5 pointer-events-none">
        <FaPaw size={300} className="-rotate-12" />
      </div>
    </section>
  );
}

export default Testimonials;
