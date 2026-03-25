import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Swal from 'sweetalert2';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

// ✅ এখানে FaCheckCircle আইকনটি মিসিং ছিল, এখন যোগ করা হয়েছে
import {
  FaPaw,
  FaCheck,
  FaCheckCircle,
  FaTrashAlt,
  FaEnvelope,
  FaPhoneAlt,
  FaClock,
  FaShieldAlt,
  FaUserCircle,
} from 'react-icons/fa';
import useAxiosSecure from '../../hooks/useAxiosSecure';

const PendingPets = () => {
  const axiosSecure = useAxiosSecure();
  const [adoptions, setAdoptions] = useState([]);
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [adoptionsRes, petsRes] = await Promise.all([
        axiosSecure.get('/adoptions'),
        axiosSecure.get('/pets'),
      ]);
      setAdoptions(adoptionsRes.data || []);
      setPets(petsRes.data || []);
    } catch (err) {
      console.error('Failed to load data:', err);
      Swal.fire('Error', 'Failed to load adoption requests.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [axiosSecure]);

  const getPetInfo = petId => {
    return pets.find(p => (p.id || p._id) === petId) || {};
  };

  // ✅ Approve Request
  const handleActivate = async id => {
    try {
      const res = await axiosSecure.patch(`/adoptions/${id}`, {
        status: 'Accepted',
      });

      if (res.data.success || res.status === 200) {
        Swal.fire({
          icon: 'success',
          title: 'Approved!',
          text: 'The adoption request has been accepted.',
          confirmButtonColor: '#37948b',
          background: '#FFFBF7',
        });

        setAdoptions(prev =>
          prev.map(ad =>
            ad.id === id || ad._id === id ? { ...ad, status: 'Accepted' } : ad,
          ),
        );
      }
    } catch (err) {
      Swal.fire(
        'Error',
        'Could not approve adoption. Check permissions.',
        'error',
      );
    }
  };

  // ✅ Reject/Delete Request
  const handleDelete = async id => {
    const result = await Swal.fire({
      title: 'Reject Request?',
      text: 'This application will be permanently deleted!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#d3d3d3',
      confirmButtonText: 'Yes, Reject it!',
      background: '#FFFBF7',
    });

    if (result.isConfirmed) {
      try {
        const res = await axiosSecure.delete(`/adoptions/${id}`);
        if (res.data.success || res.status === 200) {
          Swal.fire({
            icon: 'success',
            title: 'Rejected!',
            text: 'Adoption request has been removed.',
            confirmButtonColor: '#37948b',
          });
          setAdoptions(prev => prev.filter(ad => (ad.id || ad._id) !== id));
        }
      } catch (err) {
        Swal.fire('Error', 'Failed to delete request.', 'error');
      }
    }
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-[#FFFBF7] pt-28 px-6 md:px-12">
        <Skeleton height={50} width={400} borderRadius={20} className="mb-10" />
        <div className="bg-white rounded-[3rem] p-8 shadow-xl">
          <Skeleton height={60} count={6} className="mb-4" borderRadius={15} />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#FFFBF7] dark:bg-gray-950 pt-28 pb-20 px-4 md:px-10 lg:px-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-[1440px] mx-auto"
      >
        {/* --- Header Section --- */}
        <div className="mb-12 text-center lg:text-left flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#37948b]/10 text-[#37948b] font-black text-xs uppercase tracking-[0.2em] mb-4"
            >
              <FaShieldAlt className="animate-pulse" /> Admin Command Center
            </motion.div>
            <h2 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white leading-tight tracking-tighter">
              Adoption <span className="text-[#37948b]">Requests</span>
            </h2>
          </div>

          <div className="bg-white dark:bg-gray-900 px-6 py-4 rounded-2xl shadow-xl shadow-teal-900/5 border border-gray-100 dark:border-gray-800 flex items-center gap-4">
            <div className="w-10 h-10 bg-orange-100 flex items-center justify-center rounded-xl text-orange-500">
              <FaClock size={20} />
            </div>
            <div className="text-left">
              <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">
                Pending Applications
              </p>
              <p className="text-xl font-black text-gray-800 dark:text-white leading-none">
                {
                  adoptions.filter(
                    ad => ad.status?.toLowerCase() !== 'accepted',
                  ).length
                }
              </p>
            </div>
          </div>
        </div>

        {/* --- Data Table --- */}
        {adoptions.length === 0 ? (
          <div className="text-center py-32 bg-white dark:bg-gray-900 rounded-[3rem] shadow-xl border-2 border-dashed border-gray-100 dark:border-gray-800">
            <div className="w-24 h-24 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaPaw className="text-[#37948b] text-4xl opacity-50" />
            </div>
            <h3 className="text-2xl font-black text-gray-400 uppercase tracking-widest">
              No pending requests
            </h3>
            <p className="text-gray-500 font-medium mt-2">
              All caught up! New adoption applications will appear here.
            </p>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-900 rounded-[3rem] shadow-2xl shadow-teal-900/5 border border-gray-100 dark:border-gray-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-800/50">
                    <th className="p-6 md:p-8 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                      Applicant Details
                    </th>
                    <th className="p-6 md:p-8 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                      Requested Pet
                    </th>
                    <th className="p-6 md:p-8 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 text-center">
                      Status
                    </th>
                    <th className="p-6 md:p-8 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 text-right">
                      Admin Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                  <AnimatePresence>
                    {adoptions.map((ad, index) => {
                      const pet = getPetInfo(ad.petId || ad.pet_id);
                      const isAccepted =
                        ad.status?.toLowerCase() === 'accepted';

                      return (
                        <motion.tr
                          key={ad._id || ad.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 10 }}
                          transition={{ delay: index * 0.05 }}
                          className="group hover:bg-teal-50/30 dark:hover:bg-teal-900/10 transition-colors"
                        >
                          <td className="p-6 md:p-8">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-2xl bg-[#37948b]/10 flex items-center justify-center text-[#37948b]">
                                <FaUserCircle size={24} />
                              </div>
                              <div>
                                <p className="font-black text-gray-800 dark:text-white text-sm mb-1">
                                  {ad.user_name ||
                                    ad.name ||
                                    'Anonymous Applicant'}
                                </p>
                                <div className="space-y-0.5">
                                  <p className="text-[10px] font-bold text-gray-500 flex items-center gap-1.5">
                                    <FaEnvelope className="text-[#37948b]" />{' '}
                                    {ad.user_email || ad.email}
                                  </p>
                                  <p className="text-[10px] font-bold text-gray-500 flex items-center gap-1.5">
                                    <FaPhoneAlt className="text-[#37948b]" />{' '}
                                    {ad.phone}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </td>

                          <td className="p-6 md:p-8">
                            <div className="flex items-center gap-4">
                              <img
                                src={
                                  pet.image_url ||
                                  'https://via.placeholder.com/100'
                                }
                                className="w-12 h-12 rounded-xl object-cover border-2 border-white shadow-sm group-hover:scale-110 transition-transform"
                                alt="pet"
                              />
                              <div>
                                <p className="font-black text-gray-800 dark:text-white text-sm mb-0.5">
                                  {pet.name || 'Unknown Pet'}
                                </p>
                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                                  {pet.type || 'N/A'}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="p-6 md:p-8 text-center">
                            <span
                              className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm ${
                                isAccepted
                                  ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                  : 'bg-amber-50 text-amber-600 border-amber-100'
                              }`}
                            >
                              {/* ✅ এখানেই সমস্যাটি ছিল, এখন FaCheckCircle কাজ করবে */}
                              {isAccepted ? <FaCheckCircle /> : <FaClock />}
                              {ad.status || 'Pending'}
                            </span>
                          </td>

                          <td className="p-6 md:p-8 text-right">
                            <div className="flex items-center justify-end gap-3">
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleActivate(ad._id || ad.id)}
                                disabled={isAccepted}
                                className={`px-4 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-2 ${
                                  isAccepted
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                                    : 'bg-[#37948b] text-white hover:bg-[#2d7a72] shadow-lg shadow-teal-900/20'
                                }`}
                              >
                                <FaCheck />{' '}
                                {isAccepted ? 'Approved' : 'Approve'}
                              </motion.button>

                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleDelete(ad._id || ad.id)}
                                className="px-4 py-2.5 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white border border-red-100 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-2"
                              >
                                <FaTrashAlt /> Reject
                              </motion.button>
                            </div>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </motion.div>

      <div className="fixed -bottom-20 -right-20 text-[#37948b]/5 pointer-events-none -z-10">
        <FaPaw size={500} className="-rotate-12" />
      </div>
    </div>
  );
};

export default PendingPets;
