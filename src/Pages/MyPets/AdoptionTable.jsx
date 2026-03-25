import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaPaw,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaInfoCircle,
  FaClock,
  FaCheckCircle,
} from 'react-icons/fa';
import useAuth from '../../hooks/useAuth';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const AdoptionTable = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [adoptions, setAdoptions] = useState([]);
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);

  // ১. ইউজারের পাঠানো রিকোয়েস্টগুলো আনা
  const fetchUserAdoptions = async () => {
    if (!user?.email) return;
    try {
      const res = await axiosSecure.get(`/adoptions?email=${user.email}`);
      setAdoptions(res.data || []);
    } catch (err) {
      console.error('Failed to load adoptions:', err);
    }
  };

  // ২. পেটের তথ্য আনা (ম্যাপিং এর জন্য)
  const fetchPets = async () => {
    try {
      const res = await axiosSecure.get('/pets');
      setPets(res.data || []);
    } catch (err) {
      console.error('Failed to load pets:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserAdoptions();
    fetchPets();
  }, [user, axiosSecure]);

  // হেল্পার: আইডি দিয়ে পেটের ডাটা বের করা
  const getPetInfo = petId => {
    return pets.find(p => (p.id || p._id) === petId) || {};
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-[#FFFBF7] pt-28 px-6">
        <Skeleton height={50} width={300} borderRadius={15} className="mb-10" />
        <Skeleton height={400} borderRadius={30} />
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
        <div className="mb-12 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#37948b]/10 text-[#37948b] font-black text-xs uppercase tracking-[0.2em] mb-4">
            <FaClock className="animate-pulse" /> Tracking Center
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white leading-tight tracking-tighter">
            Adoption <br />
            <span className="text-[#37948b]">Applications</span>
          </h2>
          <p className="text-gray-500 font-bold mt-2 uppercase tracking-widest text-xs">
            Total Requests Sent: {adoptions.length}
          </p>
        </div>

        {/* --- Table Section --- */}
        {adoptions.length === 0 ? (
          <div className="text-center py-32 bg-white dark:bg-gray-900 rounded-[3rem] shadow-xl border-2 border-dashed border-gray-100 dark:border-gray-800">
            <FaPaw className="mx-auto text-6xl text-gray-100 mb-6" />
            <h3 className="text-2xl font-black text-gray-400 uppercase tracking-widest">
              No requests found
            </h3>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-900 rounded-[3rem] shadow-2xl shadow-teal-900/5 border border-gray-100 dark:border-gray-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-800/50">
                    <th className="p-8 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                      Pet Info
                    </th>
                    <th className="p-8 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                      Your Contact
                    </th>
                    <th className="p-8 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 text-center">
                      Status
                    </th>
                    <th className="p-8 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 text-right">
                      Applied Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                  <AnimatePresence>
                    {adoptions.map((ad, index) => {
                      const pet = getPetInfo(ad.pet_id || ad.petId);
                      return (
                        <motion.tr
                          key={ad.id || ad._id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="group hover:bg-teal-50/30 dark:hover:bg-teal-900/10 transition-colors"
                        >
                          {/* Pet Info */}
                          <td className="p-8">
                            <div className="flex items-center gap-4">
                              <img
                                src={
                                  pet.image_url ||
                                  'https://via.placeholder.com/100'
                                }
                                className="w-14 h-14 rounded-2xl object-cover border-2 border-white shadow-md group-hover:scale-110 transition-transform"
                                alt="pet"
                              />
                              <div>
                                <p className="font-black text-gray-800 dark:text-white text-base leading-none mb-1">
                                  {pet.name || 'Unknown'}
                                </p>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                                  <FaPaw className="text-[#37948b]" />{' '}
                                  {pet.type || 'N/A'}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Contact Info */}
                          <td className="p-8">
                            <div className="space-y-1">
                              <p className="text-xs font-bold text-gray-600 dark:text-gray-300 flex items-center gap-2">
                                <FaPhoneAlt className="text-[#37948b] text-[10px]" />{' '}
                                {ad.phone}
                              </p>
                              <p className="text-[11px] font-medium text-gray-400 flex items-center gap-2 truncate max-w-[150px]">
                                <FaMapMarkerAlt className="text-[#37948b] text-[10px]" />{' '}
                                {ad.address}
                              </p>
                            </div>
                          </td>

                          {/* Status Badge */}
                          <td className="p-8 text-center">
                            <div className="flex justify-center">
                              <span
                                className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm ${
                                  ad.status?.toLowerCase() === 'active' ||
                                  ad.status?.toLowerCase() === 'adopted'
                                    ? 'bg-green-50 text-green-600 border-green-100'
                                    : 'bg-amber-50 text-amber-600 border-amber-100'
                                }`}
                              >
                                {ad.status || 'pending'}
                              </span>
                            </div>
                          </td>

                          {/* Date */}
                          <td className="p-8 text-right">
                            <p className="text-xs font-black text-gray-700 dark:text-gray-300">
                              {new Date(
                                ad.created_at || ad.createdAt,
                              ).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })}
                            </p>
                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">
                              Submitted at{' '}
                              {new Date(
                                ad.created_at || ad.createdAt,
                              ).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </p>
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

        <div className="mt-8 flex items-center gap-3 p-6 bg-teal-50 dark:bg-teal-900/20 rounded-[2rem] border border-teal-100 dark:border-teal-800/30 max-w-fit mx-auto lg:mx-0">
          <FaInfoCircle className="text-[#37948b]" />
          <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
            Requests are usually reviewed within 3-5 business days by the pet
            owners.
          </p>
        </div>
      </motion.div>

      {/* Decorative Background Decoration */}
      <div className="fixed -bottom-20 -right-20 text-[#37948b]/5 pointer-events-none -z-10">
        <FaPaw size={500} className="-rotate-12" />
      </div>
    </div>
  );
};

export default AdoptionTable;
