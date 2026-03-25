import React, { useEffect, useState } from 'react';
import PetCategories from './PetCategories';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { FaPaw, FaArrowRight, FaSearch, FaMapMarkerAlt } from 'react-icons/fa';
import useAxios from '../../hooks/useAxios';

const PetList = () => {
  const [category, setCategory] = useState('All');
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const axiosPublic = useAxios();
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    axiosPublic
      .get('/pets')
      .then(res => {
        setPets(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching pets:', err);
        setLoading(false);
      });
  }, [axiosPublic]);

  const handleViewDetails = id => {
    navigate(`/dashboard/pets/${id}`);
  };

  const filteredPets =
    category === 'All' ? pets : pets.filter(pet => pet.type === category);

  const petsToShow = showAll ? filteredPets : filteredPets.slice(0, 10); // ১০টি ডিফল্ট দেখাবে

  // এনিমেশন ভেরিয়েন্ট
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 },
    },
  };

  const cardVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <section className="w-full bg-[#FFFBF7] dark:bg-gray-950 py-20 px-6 md:px-12 lg:px-16 xl:px-20">
      <div className="w-full">
        {/* --- Header & Categories --- */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#37948b]/10 text-[#37948b] font-black text-xs uppercase tracking-[0.2em] mb-4"
            >
              <FaPaw className="animate-bounce" /> Our Furry Residents
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-7xl font-black text-gray-900 dark:text-white leading-[1.1]"
            >
              Find Your <br />
              <span className="text-[#37948b]">Furry Mate</span>
            </motion.h2>
          </div>

          <div className="w-full lg:w-auto">
            <PetCategories
              category={category}
              setCategory={cat => {
                setCategory(cat);
                setShowAll(false);
              }}
            />
          </div>
        </div>

        {/* --- Pets Grid (Full Width & Dynamic Columns) --- */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 xl:gap-8"
        >
          {loading ? (
            // --- Premium Skeleton Loader ---
            Array.from({ length: 10 }).map((_, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-5 border border-gray-100 dark:border-gray-800"
              >
                <Skeleton height={220} borderRadius={30} />
                <div className="mt-5 space-y-3">
                  <Skeleton height={28} width="70%" />
                  <Skeleton height={20} width="40%" />
                  <Skeleton height={50} borderRadius={18} />
                </div>
              </div>
            ))
          ) : (
            <AnimatePresence mode="popLayout">
              {petsToShow.map(pet => (
                <motion.div
                  key={pet.id || pet._id}
                  variants={cardVariants}
                  layout
                  whileHover={{ y: -12 }}
                  className="group bg-white dark:bg-gray-900 rounded-[2.5rem] p-4 shadow-xl shadow-teal-900/5 hover:shadow-[#37948b1a] border border-transparent hover:border-[#37948b]/20 transition-all duration-500 relative flex flex-col h-full"
                >
                  {/* Image Container with Overlay */}
                  <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[2rem]">
                    <img
                      src={pet.image_url}
                      alt={pet.name}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />

                    {/* Status Badge */}
                    <div className="absolute top-4 left-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black text-[#37948b] shadow-lg uppercase tracking-widest border border-white/20">
                      {pet.status || 'Available'}
                    </div>

                    {/* Quick Info Overlay on Hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#37948b]/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
                      <p className="text-white text-xs font-bold flex items-center gap-1">
                        <FaMapMarkerAlt /> California, USA
                      </p>
                    </div>
                  </div>

                  {/* Content Area */}
                  <div className="mt-6 px-2 flex flex-col flex-grow">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-2xl font-black text-gray-800 dark:text-white group-hover:text-[#37948b] transition-colors truncate">
                        {pet.name}
                      </h3>
                      <div className="bg-teal-50 dark:bg-gray-800 p-2 rounded-xl text-[#37948b]">
                        <FaPaw size={14} />
                      </div>
                    </div>

                    <div className="flex items-center gap-3 mb-6">
                      <span className="text-[10px] uppercase font-black tracking-widest text-gray-400 dark:text-gray-500">
                        {pet.type}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-gray-300" />
                      <span className="text-[10px] uppercase font-black tracking-widest text-gray-400 dark:text-gray-500 truncate">
                        {pet.breed || 'Mixed'}
                      </span>
                    </div>

                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleViewDetails(pet.id || pet._id)}
                      className="mt-auto w-full py-4 bg-[#37948b] text-white font-black rounded-2xl shadow-xl shadow-[#37948b33] flex items-center justify-center gap-2 group/btn hover:bg-[#2d7a72] transition-all overflow-hidden relative"
                    >
                      <span className="z-10 flex items-center gap-2">
                        Details{' '}
                        <FaArrowRight className="group-hover/btn:translate-x-1 transition-transform" />
                      </span>
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </motion.div>

        {/* --- Empty State --- */}
        {!loading && petsToShow.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-32 flex flex-col items-center"
          >
            <div className="bg-teal-50 dark:bg-gray-900 w-24 h-24 rounded-full flex items-center justify-center mb-6 border border-[#37948b]/20">
              <FaSearch className="text-[#37948b] text-4xl" />
            </div>
            <h3 className="text-3xl font-black text-gray-800 dark:text-white mb-2">
              No Paws Found Here
            </h3>
            <p className="text-gray-500 dark:text-gray-400 font-bold max-w-sm">
              We couldn't find any pets in this category. Try exploring another
              one!
            </p>
          </motion.div>
        )}

        {/* --- Load More Section --- */}
        {!loading && filteredPets.length > 10 && (
          <div className="text-center mt-20 relative">
            <div className="absolute top-1/2 left-0 w-full h-px bg-gray-100 dark:bg-gray-800 -z-10" />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAll(!showAll)}
              className="px-12 py-5 bg-[#37948b] text-white font-black rounded-full shadow-2xl shadow-[#37948b44] hover:bg-[#2d7a72] transition-all uppercase tracking-widest text-xs"
            >
              {showAll
                ? 'Collapse List'
                : `Explore More (+${filteredPets.length - 10})`}
            </motion.button>
          </div>
        )}
      </div>
    </section>
  );
};

export default PetList;
