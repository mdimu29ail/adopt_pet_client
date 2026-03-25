import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import useAuth from '../../hooks/useAuth';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import {
  FaPaw,
  FaArrowLeft,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaFingerprint,
  FaHeart,
  FaInfoCircle,
  FaUserAlt,
} from 'react-icons/fa';

const PetDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPet = async () => {
      try {
        const res = await axiosSecure.get(`/pets/${id}`);
        setPet(res.data);
      } catch (err) {
        setError('Could not load pet details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchPet();
  }, [id, axiosSecure]);

  const isOwner = user?.email === pet?.owner_email;

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-[#FFFBF7] pt-28 px-6 md:px-12 lg:px-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
          <Skeleton height={500} borderRadius={40} />
          <div className="space-y-6">
            <Skeleton height={60} width="70%" borderRadius={20} />
            <div className="grid grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} height={100} borderRadius={25} />
              ))}
            </div>
            <Skeleton count={5} />
          </div>
        </div>
      </div>
    );
  }

  if (error || !pet) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FFFBF7] p-6">
        <FaPaw className="text-6xl text-gray-200 mb-4" />
        <h3 className="text-2xl font-black text-gray-400 uppercase tracking-widest">
          {error || 'Pet Not Found'}
        </h3>
        <button
          onClick={() => navigate(-1)}
          className="mt-6 text-[#37948b] font-bold underline"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#FFFBF7] dark:bg-gray-950 pt-28 pb-20 px-6 md:px-12 lg:px-20">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        {/* --- Back Button --- */}
        <button
          onClick={() => navigate(-1)}
          className="group flex items-center gap-2 text-gray-500 font-black text-xs uppercase tracking-widest mb-10 hover:text-[#37948b] transition-all"
        >
          <FaArrowLeft className="group-hover:-translate-x-2 transition-transform" />{' '}
          Back to Gallery
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* --- Left Column: Media --- */}
          <div className="lg:col-span-6 relative">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="rounded-[3rem] overflow-hidden shadow-2xl border-[12px] border-white dark:border-gray-900"
            >
              <img
                src={pet.image_url || 'https://via.placeholder.com/800x800'}
                alt={pet.name}
                className="w-full h-[500px] md:h-[650px] object-cover"
              />
            </motion.div>

            {/* Floating Status Badge */}
            <div className="absolute top-8 left-8 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md px-6 py-2 rounded-full shadow-xl border border-white/20">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs font-black text-[#37948b] uppercase tracking-widest">
                  {pet.status || 'Available'}
                </span>
              </div>
            </div>
          </div>

          {/* --- Right Column: Content --- */}
          <div className="lg:col-span-6 space-y-10">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#37948b]/10 text-[#37948b] font-black text-[10px] uppercase tracking-[0.2em] mb-4">
                <FaHeart /> Ready for a new home
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-gray-900 dark:text-white tracking-tighter leading-none mb-6">
                I'm <span className="text-[#37948b]">{pet.name}</span>
              </h1>

              {/* Info Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[
                  { icon: <FaPaw />, label: 'Type', value: pet.type },
                  {
                    icon: <FaFingerprint />,
                    label: 'Breed',
                    value: pet.breed || 'Mixed',
                  },
                  {
                    icon: <FaCalendarAlt />,
                    label: 'Age',
                    value: `${pet.age} Old`,
                  },
                  {
                    icon: <FaMapMarkerAlt />,
                    label: 'Location',
                    value: pet.location || 'Not Specified',
                  },
                  {
                    icon: <FaUserAlt />,
                    label: 'Added By',
                    value: pet.owner_name?.split(' ')[0] || 'Member',
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-white dark:bg-gray-900 p-5 rounded-[2rem] shadow-xl shadow-teal-900/5 border border-gray-50 dark:border-gray-800"
                  >
                    <div className="text-[#37948b] mb-3 text-lg">
                      {item.icon}
                    </div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                      {item.label}
                    </p>
                    <p className="text-sm font-black text-gray-800 dark:text-gray-200 truncate">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Description Section */}
            <div className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] shadow-xl shadow-teal-900/5 border border-gray-50 dark:border-gray-800 relative">
              <FaInfoCircle
                className="absolute top-8 right-8 text-teal-50 dark:text-gray-800"
                size={40}
              />
              <h3 className="text-xl font-black text-gray-900 dark:text-white mb-4">
                About Me
              </h3>
              <p className="text-gray-500 dark:text-gray-400 font-medium leading-relaxed italic">
                "
                {pet.description ||
                  `Hello! I'm a lovable ${pet.type} waiting for my forever family. I promise to bring joy and lots of tail wags to your home.`}
                "
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
              {isOwner ? (
                <div className="w-full p-6 bg-amber-50 dark:bg-amber-900/20 rounded-[2rem] border border-amber-100 dark:border-amber-800 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500 flex items-center justify-center text-white shadow-lg shadow-amber-200">
                    <FaInfoCircle size={20} />
                  </div>
                  <p className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-widest">
                    You are the owner of this pet listing.
                  </p>
                </div>
              ) : (
                <Link
                  to={`/dashboard/adopt/${pet.id || pet._id}`}
                  className="w-full"
                >
                  <motion.button
                    whileHover={{ scale: 1.02, backgroundColor: '#2d7a72' }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-6 bg-[#37948b] text-white font-black rounded-3xl shadow-2xl shadow-[#37948b44] flex items-center justify-center gap-3 text-lg uppercase tracking-widest"
                  >
                    Adopt {pet.name} <FaHeart />
                  </motion.button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Decorative Background Paw */}
      <div className="fixed -bottom-20 -right-20 text-[#37948b]/5 pointer-events-none -z-10">
        <FaPaw size={500} className="-rotate-12" />
      </div>
    </div>
  );
};

export default PetDetails;
