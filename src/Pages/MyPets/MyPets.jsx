import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { motion, AnimatePresence } from 'framer-motion';
import useAuth from '../../hooks/useAuth';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import {
  FaPaw,
  FaEdit,
  FaTrash,
  FaInfoCircle,
  FaPlus,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaFingerprint,
  FaClock,
} from 'react-icons/fa';

const MyPets = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.email) return;
    const fetchMyPets = async () => {
      setLoading(true);
      try {
        const res = await axiosSecure.get('/pets');
        const myData = res.data.filter(pet => pet.owner_email === user.email);
        setPets(myData);
      } catch (error) {
        console.error('Error fetching pets:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMyPets();
  }, [user?.email, axiosSecure]);

  const handleDelete = id => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#37948b',
      cancelButtonColor: '#ef4444',
      confirmButtonText: 'Yes, delete it!',
    }).then(async result => {
      if (result.isConfirmed) {
        try {
          const res = await axiosSecure.delete(`/pets/${id}`);
          if (res.data.success) {
            Swal.fire('Deleted!', 'Pet removed.', 'success');
            setPets(prev => prev.filter(p => (p.id || p._id) !== id));
          }
        } catch (error) {
          Swal.fire('Error!', 'Failed to delete pet.', 'error');
        }
      }
    });
  };

  return (
    <div className="w-full min-h-screen bg-[#FFFBF7] dark:bg-gray-950 pt-28 pb-20 px-6 md:px-12 lg:px-20">
      <div className="max-w-7xl mx-auto">
        {/* --- Header Section --- */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#37948b]/10 text-[#37948b] font-black text-xs uppercase tracking-[0.2em] mb-4"
            >
              <FaPaw className="animate-bounce" /> Dashboard
            </motion.div>
            <h2 className="text-5xl md:text-6xl font-black text-gray-900 dark:text-white tracking-tighter leading-tight">
              My <span className="text-[#37948b]">Furry Pack</span>
            </h2>
          </div>

          <Link to="/dashboard/addPets">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-3 bg-[#37948b] text-white px-8 py-4 rounded-2xl font-black shadow-xl shadow-[#37948b33] hover:bg-[#2d7a72] transition-all"
            >
              <FaPlus /> REGISTER PET
            </motion.button>
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="aspect-square bg-white dark:bg-gray-900 rounded-[2.5rem] p-6 border border-gray-100"
              >
                <Skeleton className="h-1/2 w-full" borderRadius={30} />
                <Skeleton className="mt-6" height={30} width="60%" />
                <Skeleton className="mt-2" count={2} />
              </div>
            ))}
          </div>
        ) : (
          /* --- Grid: Strictly 3 Columns on LG --- */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            <AnimatePresence>
              {pets.map(pet => (
                <motion.div
                  key={pet.id || pet._id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  whileHover={{ y: -10 }}
                  className="relative aspect-square group bg-white dark:bg-gray-900 rounded-[3rem] p-6 shadow-xl shadow-teal-900/5 hover:shadow-[#37948b1a] border border-gray-50 dark:border-gray-800 transition-all duration-500 flex flex-col justify-between overflow-hidden"
                >
                  {/* --- Background Paw Decor --- */}
                  <FaPaw className="absolute -bottom-10 -right-10 text-[#37948b]/5 text-[150px] rotate-12 group-hover:rotate-45 transition-transform duration-1000" />

                  <div className="relative z-10 flex flex-col h-full">
                    {/* Header: Name & Status */}
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight group-hover:text-[#37948b] transition-colors truncate max-w-[150px]">
                          {pet.name}
                        </h3>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1">
                          <FaFingerprint className="text-[#37948b]" />{' '}
                          {pet.breed || 'Mixed'}
                        </p>
                      </div>
                      <div className="px-3 py-1 bg-teal-50 dark:bg-[#37948b]/20 rounded-full text-[9px] font-black text-[#37948b] uppercase border border-[#37948b]/10">
                        {pet.status || 'Available'}
                      </div>
                    </div>

                    {/* Image Section - Compact for Square Layout */}
                    <div className="relative h-28 w-full overflow-hidden rounded-2xl mb-4 border border-gray-50 dark:border-gray-800 shadow-inner">
                      <img
                        src={pet.image_url || 'https://via.placeholder.com/300'}
                        alt={pet.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    </div>

                    {/* Info Grid - More Info Added */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-[#37948b]">
                          <FaCalendarAlt size={10} />
                        </div>
                        <span className="text-[10px] font-bold text-gray-500">
                          {pet.age} Old
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-[#37948b]">
                          <FaMapMarkerAlt size={10} />
                        </div>
                        <span className="text-[10px] font-bold text-gray-500 truncate">
                          {pet.location}
                        </span>
                      </div>
                    </div>

                    {/* Footer Date */}
                    <div className="mb-4 text-[9px] font-bold text-gray-300 uppercase tracking-widest flex items-center gap-1">
                      <FaClock size={8} /> Posted:{' '}
                      {new Date(pet.created_at).toLocaleDateString()}
                    </div>

                    {/* --- Actions Section --- */}
                    <div className="mt-auto space-y-2">
                      <Link
                        to={`/dashboard/pets/${pet.id || pet._id}`}
                        className="block"
                      >
                        <button className="w-full py-2.5 bg-[#37948b] text-white font-black rounded-xl shadow-lg shadow-[#37948b33] hover:bg-[#2d7a72] transition-all text-[10px] uppercase tracking-widest flex items-center justify-center gap-2">
                          VIEW PROFILE <FaInfoCircle />
                        </button>
                      </Link>

                      <div className="grid grid-cols-2 gap-2">
                        <Link to={`/dashboard/edit-pet/${pet.id || pet._id}`}>
                          <button className="w-full py-2 bg-amber-50 dark:bg-amber-900/20 text-amber-600 rounded-xl font-black text-[9px] uppercase tracking-widest border border-amber-100 dark:border-amber-800 hover:bg-amber-500 hover:text-white transition-all">
                            EDIT
                          </button>
                        </Link>
                        <button
                          onClick={() => handleDelete(pet.id || pet._id)}
                          className="w-full py-2 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-xl font-black text-[9px] uppercase tracking-widest border border-red-100 dark:border-red-800 hover:bg-red-500 hover:text-white transition-all"
                        >
                          REMOVE
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyPets;
