import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import {
  FaSearch,
  FaMapMarkerAlt,
  FaPaw,
  FaInfoCircle,
  FaEdit,
  FaTrash,
  FaCalendarAlt,
  FaPlus,
} from 'react-icons/fa';
import useUserRole from '../../hooks/useUserRole';
import useAxios from '../../hooks/useAxios'; // Using your existing hook
import useAxiosSecure from '../../hooks/useAxiosSecure';
import Swal from 'sweetalert2';

const PetListing = () => {
  const navigate = useNavigate();
  const axiosPublic = useAxios(); // Initialize using your base hook
  const axiosSecure = useAxiosSecure();
  const [role] = useUserRole();

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [pets, setPets] = useState([]);
  const [visibleCount, setVisibleCount] = useState(12);
  const [loading, setLoading] = useState(true);

  // 1. Data Fetching
  useEffect(() => {
    const fetchPets = async () => {
      setLoading(true);
      try {
        // Calling your public/base axios instance
        const res = await axiosPublic.get('/pets');

        const filtered = res.data.filter(pet => {
          const matchesSearch = pet.name
            .toLowerCase()
            .includes(search.toLowerCase());
          const matchesCategory = category === 'All' || pet.type === category;
          // Filtering out adopted pets if the backend hasn't already done so
          return matchesSearch && matchesCategory && !pet.adopted;
        });
        setPets(filtered);
      } catch (error) {
        console.error('❌ Fetch Error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPets();
  }, [search, category, axiosPublic]);

  // 2. Delete Logic
  const handleDelete = async id => {
    Swal.fire({
      title: 'Remove Pet?',
      text: 'This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#37948b',
      cancelButtonColor: '#f43f5e',
      confirmButtonText: 'Yes, delete it!',
    }).then(async result => {
      if (result.isConfirmed) {
        try {
          // Use Secure Axios for DELETE (requires admin/auth)
          const res = await axiosSecure.delete(`/pets/${id}`);
          if (res.data.success) {
            setPets(prev => prev.filter(p => p.id !== id));
            Swal.fire(
              'Deleted!',
              'The pet record has been removed.',
              'success',
            );
          }
        } catch (error) {
          Swal.fire('Error', 'Unauthorized or server error.', 'error');
        }
      }
    });
  };

  return (
    <div className="w-full min-h-screen bg-[#FFFBF7] dark:bg-gray-950 pt-28 pb-20 px-4 md:px-10">
      {/* --- Header --- */}
      <div className="max-w-[1600px] mx-auto mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#37948b]/10 text-[#37948b] font-bold text-xs uppercase tracking-widest mb-4"
          >
            <FaPaw className="animate-bounce" /> {pets.length} Pets Available
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-black text-gray-900 dark:text-white tracking-tighter">
            Adoptable <span className="text-[#37948b]">Friends</span>
          </h1>
        </div>

        {/* Search */}
        <div className="relative w-full md:max-w-md group">
          <FaSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#37948b] transition-colors" />
          <input
            type="text"
            placeholder="Search by name..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-14 pr-6 py-4 bg-white dark:bg-gray-900 rounded-2xl outline-none border-2 border-transparent focus:border-[#37948b] shadow-xl shadow-teal-900/5 transition-all font-bold text-gray-800 dark:text-white"
          />
        </div>
      </div>

      {/* --- Categories --- */}
      <div className="max-w-[1600px] mx-auto flex flex-wrap items-center justify-center gap-3 mb-16">
        {['All', 'Cat', 'Dog', 'Fish', 'Rabbit', 'Bird'].map(type => (
          <button
            key={type}
            onClick={() => {
              setCategory(type);
              setVisibleCount(12);
            }}
            className={`px-8 py-3 rounded-2xl font-black text-sm transition-all duration-300 ${
              category === type
                ? 'bg-[#37948b] text-white shadow-lg shadow-[#37948b33]'
                : 'bg-white dark:bg-gray-900 text-gray-500 border border-gray-100 dark:border-gray-800 hover:text-[#37948b]'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* --- Grid --- */}
      <div className="max-w-[1600px] mx-auto">
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8"
        >
          {loading ? (
            [...Array(10)].map((_, i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-5 shadow-sm border border-gray-100 dark:border-gray-800"
              >
                <Skeleton height={250} borderRadius={30} />
                <div className="mt-6 space-y-2">
                  <Skeleton height={25} width="70%" />
                  <Skeleton height={15} width="40%" />
                </div>
              </div>
            ))
          ) : (
            <AnimatePresence>
              {pets.slice(0, visibleCount).map(pet => (
                <motion.div
                  key={pet.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  whileHover={{ y: -8 }}
                  className="group bg-white dark:bg-gray-900 rounded-[2.5rem] p-4 shadow-xl shadow-teal-900/5 border border-transparent hover:border-[#37948b]/20 transition-all duration-500 flex flex-col"
                >
                  <div className="relative aspect-square w-full overflow-hidden rounded-[2rem] mb-6">
                    <img
                      src={pet.image_url}
                      alt={pet.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute top-4 left-4 bg-white/90 dark:bg-gray-900/80 backdrop-blur-md px-4 py-1 rounded-full text-[10px] font-black text-[#37948b] uppercase tracking-widest shadow-sm">
                      {pet.type}
                    </div>
                  </div>

                  <div className="px-2 flex-grow">
                    <h3 className="text-2xl font-black text-gray-900 dark:text-white group-hover:text-[#37948b] transition-colors truncate">
                      {pet.name}
                    </h3>
                    <div className="mt-3 space-y-2 text-sm font-bold text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-2">
                        <FaCalendarAlt className="text-[#37948b]" /> {pet.age}{' '}
                        Years
                      </div>
                      <div className="flex items-center gap-2">
                        <FaMapMarkerAlt className="text-[#37948b]" />{' '}
                        {pet.location}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 space-y-3">
                    <button
                      onClick={() => navigate(`/dashboard/pets/${pet.id}`)}
                      className="w-full py-4 bg-[#37948b] text-white font-black rounded-2xl shadow-lg shadow-[#37948b33] flex items-center justify-center gap-2 hover:brightness-110 transition-all"
                    >
                      View Details <FaInfoCircle />
                    </button>

                    {role === 'admin' && (
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() =>
                            navigate(`/dashboard/edit-pet/${pet.id}`)
                          }
                          className="py-3 bg-amber-50 dark:bg-amber-900/20 text-amber-600 rounded-xl font-bold text-[10px] flex items-center justify-center gap-2 hover:bg-amber-100 transition-all"
                        >
                          <FaEdit /> Edit
                        </button>
                        <button
                          onClick={() => handleDelete(pet.id)}
                          className="py-3 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-xl font-bold text-[10px] flex items-center justify-center gap-2 hover:bg-red-100 transition-all"
                        >
                          <FaTrash /> Delete
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </motion.div>
      </div>

      {/* --- Load More --- */}
      {!loading && visibleCount < pets.length && (
        <div className="flex justify-center mt-20">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setVisibleCount(prev => prev + 10)}
            className="flex items-center gap-3 px-12 py-5 bg-[#37948b] text-white font-black rounded-full shadow-2xl uppercase tracking-widest text-xs"
          >
            Show More <FaPlus />
          </motion.button>
        </div>
      )}
    </div>
  );
};

export default PetListing;
