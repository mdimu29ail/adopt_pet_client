import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { motion, AnimatePresence } from 'framer-motion';
import useAuth from '../../hooks/useAuth';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import useUserRole from '../../hooks/useUserRole';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import {
  FaPaw,
  FaEdit,
  FaTrash,
  FaEye,
  FaPlus,
  FaChartLine,
  FaPause,
  FaPlay,
} from 'react-icons/fa';

const MyDonationCampaigns = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [role] = useUserRole();
  const navigate = useNavigate();

  const {
    data: campaigns = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['myCampaigns', user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/campaigns?email=${user?.email}`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  // ✅ ফিক্সড ডিলিট লজিক
  const handleDelete = async id => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This campaign will be gone forever!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#37948b',
      cancelButtonColor: '#ef4444',
      confirmButtonText: 'Yes, delete it!',
      background: '#FFFBF7',
    });

    if (result.isConfirmed) {
      try {
        // ব্যাকএন্ডে রিকোয়েস্ট পাঠানো হচ্ছে
        const res = await axiosSecure.delete(`/campaigns/${id}`);

        // সুপাবেস বা কাস্টম ব্যাকএন্ডের সাকসেস চেক
        if (res.data.success || res.status === 200) {
          Swal.fire({
            title: 'Deleted!',
            text: 'Campaign removed successfully.',
            icon: 'success',
            confirmButtonColor: '#37948b',
          });
          refetch(); // লিস্ট রিফ্রেশ করা
        }
      } catch (err) {
        console.error('Delete Error:', err);
        Swal.fire(
          'Error',
          'Could not delete. Check your permissions.',
          'error',
        );
      }
    }
  };

  // ✅ ক্যাম্পেইন পজ/রিজিউম লজিক (অতিরিক্ত সুবিধা)
  const togglePause = async (id, currentStatus) => {
    try {
      await axiosSecure.patch(`/campaigns/${id}`, {
        is_paused: !currentStatus,
      });
      refetch();
    } catch (err) {
      Swal.fire('Error', 'Failed to update status', 'error');
    }
  };

  if (isLoading) {
    return (
      <div className="w-full min-h-screen bg-[#FFFBF7] pt-28 px-6 md:px-12">
        <Skeleton height={50} width={300} borderRadius={15} className="mb-10" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-[2.5rem] p-6 shadow-xl border border-gray-100"
            >
              <Skeleton height={180} borderRadius={30} />
              <Skeleton className="mt-6" height={25} width="70%" />
              <Skeleton className="mt-4" height={15} count={2} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#FFFBF7] dark:bg-gray-950 pt-28 pb-20 px-6 md:px-12 lg:px-20">
      <div className="max-w-[1440px] mx-auto">
        {/* --- Header --- */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#37948b]/10 text-[#37948b] font-black text-xs uppercase tracking-[0.2em] mb-4"
            >
              <FaChartLine /> Fundraising Dashboard
            </motion.div>
            <h2 className="text-5xl md:text-6xl font-black text-gray-900 dark:text-white leading-tight tracking-tighter">
              My <span className="text-[#37948b]">Campaigns</span>
            </h2>
          </div>
          <Link to="/dashboard/createDonation">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-3 bg-[#37948b] text-white px-8 py-4 rounded-2xl font-black shadow-xl shadow-[#37948b33] hover:bg-[#2d7a72] transition-all"
            >
              <FaPlus /> START CAMPAIGN
            </motion.button>
          </Link>
        </div>

        {campaigns.length === 0 ? (
          <div className="text-center py-32 bg-white dark:bg-gray-900 rounded-[3rem] shadow-xl border-2 border-dashed border-gray-100 dark:border-gray-800">
            <FaPaw className="mx-auto text-6xl text-gray-100 mb-6" />
            <h3 className="text-2xl font-black text-gray-400 uppercase tracking-widest">
              No campaigns found
            </h3>
            <Link
              to="/dashboard/createDonation"
              className="text-[#37948b] font-bold underline mt-4 inline-block"
            >
              Start your first one
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            <AnimatePresence>
              {campaigns.map(campaign => {
                const progress = Math.min(
                  Math.round(
                    (campaign.donated_amount / campaign.max_donation) * 100,
                  ),
                  100,
                );
                const isPaused = campaign.is_paused;

                return (
                  <motion.div
                    key={campaign.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    whileHover={{ y: -10 }}
                    className="group bg-white dark:bg-gray-900 rounded-[2.5rem] p-4 shadow-xl shadow-teal-900/5 hover:shadow-[#37948b1a] border border-transparent hover:border-[#37948b]/20 transition-all duration-500 flex flex-col h-full"
                  >
                    {/* Image Area */}
                    <div className="relative h-48 overflow-hidden rounded-[2rem] mb-6">
                      <img
                        src={
                          campaign.pet_image ||
                          'https://via.placeholder.com/400x200'
                        }
                        alt="pet"
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div
                        className={`absolute top-4 left-4 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${isPaused ? 'bg-red-500 text-white border-red-400' : 'bg-white/80 text-[#37948b] border-white/20'}`}
                      >
                        {isPaused ? 'Paused' : `${progress}% Funded`}
                      </div>
                    </div>

                    <div className="px-2 flex-grow">
                      <h3 className="text-xl font-black text-gray-900 dark:text-white group-hover:text-[#37948b] transition-colors mb-4 line-clamp-1">
                        {campaign.title || campaign.short_description}
                      </h3>
                      <div className="space-y-2 mb-6">
                        <div className="flex justify-between text-[10px] font-black uppercase text-gray-400 tracking-widest">
                          <span>Raised: ${campaign.donated_amount}</span>
                          <span>Goal: ${campaign.max_donation}</span>
                        </div>
                        <div className="w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            className="h-full bg-gradient-to-r from-[#37948b] to-[#4DB6AC]"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Actions Area */}
                    <div className="mt-auto space-y-3">
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => navigate(`/donations/${campaign.id}`)}
                          className="py-3 bg-gray-50 dark:bg-gray-800 text-gray-500 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#37948b] hover:text-white transition-all"
                        >
                          <FaEye /> View
                        </button>
                        <button
                          onClick={() => togglePause(campaign.id, isPaused)}
                          className={`py-3 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${isPaused ? 'bg-green-50 text-green-600 hover:bg-green-600 hover:text-white' : 'bg-amber-50 text-amber-600 hover:bg-amber-600 hover:text-white'}`}
                        >
                          {isPaused ? (
                            <>
                              <FaPlay /> Resume
                            </>
                          ) : (
                            <>
                              <FaPause /> Pause
                            </>
                          )}
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() =>
                            navigate(`/dashboard/edit-campaign/${campaign.id}`)
                          }
                          className="py-3 bg-blue-50 dark:bg-gray-800 text-blue-600 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-blue-600 hover:text-white transition-all"
                        >
                          <FaEdit /> Edit
                        </button>
                        <button
                          onClick={() => handleDelete(campaign.id)}
                          className="py-3 bg-red-50 dark:bg-gray-800 text-red-500 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-red-500 hover:text-white transition-all"
                        >
                          <FaTrash /> Delete
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
      <div className="fixed -bottom-20 -right-20 text-[#37948b]/5 pointer-events-none -z-10">
        <FaPaw size={500} />
      </div>
    </div>
  );
};

export default MyDonationCampaigns;
