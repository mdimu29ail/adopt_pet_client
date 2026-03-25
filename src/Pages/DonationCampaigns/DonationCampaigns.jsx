import React, { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import {
  FaEdit,
  FaTrash,
  FaEye,
  FaHandHoldingHeart,
  FaPaw,
  FaPlus,
  FaCalendarAlt,
  FaUserCircle,
  FaClock,
} from 'react-icons/fa';
import Swal from 'sweetalert2';
import useUserRole from '../../hooks/useUserRole';
import useAuth from '../../hooks/useAuth';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import Loading from '../../Loading/Loading';
import { supabase } from '../../Supabase/supabase.config';

const PAGE_SIZE = 8;

const DonationCampaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);

  const [role, roleLoading] = useUserRole();
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const fetchCampaigns = async () => {
    try {
      const from = page * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) throw error;

      if (data) {
        setCampaigns(prev => [...prev, ...data]);
        setHasMore(data.length === PAGE_SIZE);
        setPage(prev => prev + 1);
      }
    } catch (err) {
      console.error('Fetch failed:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  // বাকি দিন গণনা করার ফাংশন
  const getDaysLeft = date => {
    const today = new Date();
    const end = new Date(date);
    const diffTime = end - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? `${diffDays} days left` : 'Expired';
  };

  const handleDelete = async id => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This campaign will be permanently deleted!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#37948b',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then(async result => {
      if (result.isConfirmed) {
        try {
          const { error } = await supabase
            .from('campaigns')
            .delete()
            .eq('id', id);
          if (error) throw error;
          setCampaigns(prev => prev.filter(c => c.id !== id));
          Swal.fire('Deleted!', 'Campaign removed.', 'success');
        } catch (err) {
          Swal.fire('Error', 'Failed to delete campaign.', 'error');
        }
      }
    });
  };

  return (
    <div className="min-h-screen w-full bg-[#FFFBF7] dark:bg-gray-950 pt-28 pb-20 px-6 md:px-12 lg:px-20 font-sans">
      <div className="w-full">
        {/* --- Header Section --- */}
        <div className="mb-16 flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#37948b]/10 text-[#37948b] font-black text-xs uppercase tracking-[0.2em] mb-4"
            >
              <FaHandHoldingHeart className="animate-pulse" /> Support Our Furry
              Friends
            </motion.div>
            <h2 className="text-5xl md:text-7xl font-black text-gray-900 dark:text-white leading-[1.1] tracking-tighter">
              Active <br />
              <span className="text-[#37948b]">Donation Drives</span>
            </h2>
          </div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link to="/dashboard/createDonation">
              <button className="bg-[#37948b] text-white px-10 py-5 rounded-2xl font-black shadow-2xl shadow-[#37948b33] hover:bg-[#2d7a72] transition-all flex items-center gap-3 text-lg">
                <FaPlus /> Start a Campaign
              </button>
            </Link>
          </motion.div>
        </div>

        {loading && campaigns.length === 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-5 border border-gray-100 dark:border-gray-800"
              >
                <Skeleton height={200} borderRadius={30} />
                <div className="mt-6 space-y-3">
                  <Skeleton height={25} width="80%" />
                  <Skeleton height={50} borderRadius={20} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <InfiniteScroll
            dataLength={campaigns.length}
            next={fetchCampaigns}
            hasMore={hasMore}
            loader={
              <div className="flex justify-center my-16">
                <Loading />
              </div>
            }
            endMessage={
              <div className="text-center py-20 text-gray-400 font-bold uppercase tracking-widest text-xs">
                That's all for now ✨
              </div>
            }
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8">
              {campaigns.map(c => {
                const progress = Math.min(
                  Math.round((c.donated_amount / c.max_donation) * 100),
                  100,
                );
                const daysLeft = getDaysLeft(c.end_date);

                return (
                  <motion.div
                    key={c.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ y: -12 }}
                    className="group bg-white dark:bg-gray-900 rounded-[2.5rem] overflow-hidden shadow-xl shadow-teal-900/5 hover:shadow-[#37948b1a] border border-transparent hover:border-[#37948b]/20 transition-all duration-500 flex flex-col h-full p-4"
                  >
                    {/* Image Area */}
                    <div className="relative aspect-square w-full overflow-hidden rounded-[2rem]">
                      <img
                        src={
                          c.pet_image || 'https://via.placeholder.com/600x400'
                        }
                        alt="pet"
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute top-4 left-4 bg-white/90 dark:bg-gray-900/80 backdrop-blur-md px-4 py-1.5 rounded-full text-[9px] font-black text-[#37948b] shadow-lg border border-white/20 uppercase">
                        {c.is_paused ? 'Paused' : 'Active'}
                      </div>
                    </div>

                    <div className="p-4 flex flex-col flex-grow">
                      <h3 className="text-xl font-black text-gray-800 dark:text-white mb-2 line-clamp-1 group-hover:text-[#37948b] transition-colors">
                        {c.title || c.short_description}
                      </h3>

                      {/* Organizer & Deadline - New Info Added */}
                      <div className="flex flex-col gap-2 mb-6">
                        <div className="flex items-center gap-2 text-gray-400 font-bold text-[10px] uppercase tracking-widest">
                          <FaUserCircle className="text-[#37948b]" />
                          <span className="truncate">
                            {c.owner_name || 'Anonymous'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-400 font-bold text-[10px] uppercase tracking-widest">
                          <FaClock
                            className={
                              daysLeft === 'Expired'
                                ? 'text-red-500'
                                : 'text-[#37948b]'
                            }
                          />
                          <span
                            className={
                              daysLeft === 'Expired' ? 'text-red-500' : ''
                            }
                          >
                            {daysLeft}
                          </span>
                        </div>
                      </div>

                      {/* Progress Section */}
                      <div className="space-y-2 mb-8">
                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-400">
                          <span>
                            ${Number(c.donated_amount).toLocaleString()} Raised
                          </span>
                          <span>{progress}%</span>
                        </div>
                        <div className="w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${progress}%` }}
                            transition={{ duration: 1, ease: 'easeOut' }}
                            className="h-full bg-gradient-to-r from-[#37948b] to-[#4DB6AC]"
                          ></motion.div>
                        </div>
                        <p className="text-[9px] font-bold text-gray-400 text-right uppercase tracking-tighter">
                          Goal: ${Number(c.max_donation).toLocaleString()}
                        </p>
                      </div>

                      {/* Action Buttons - Button style kept SAME as requested */}
                      <div className="mt-auto flex items-center gap-2 pt-4 border-t border-gray-50 dark:border-gray-800">
                        <Link
                          to={`/donations/${c.id}`}
                          className="flex-1 flex items-center justify-center gap-2 py-4 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-2xl font-black text-xs hover:bg-[#37948b] hover:text-white transition-all uppercase tracking-widest"
                        >
                          <FaEye /> View
                        </Link>

                        {!roleLoading &&
                          (role === 'admin' ||
                            user?.email === c.owner_email) && (
                            <div className="flex gap-2">
                              <Link
                                to={`/dashboard/edit-campaign/${c.id}`}
                                className="p-4 bg-amber-50 dark:bg-amber-900/20 text-amber-600 rounded-2xl hover:bg-amber-500 hover:text-white transition-all shadow-sm"
                              >
                                <FaEdit />
                              </Link>
                              {role === 'admin' && (
                                <button
                                  onClick={() => handleDelete(c.id)}
                                  className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-2xl hover:bg-red-500 hover:text-white transition-all shadow-sm"
                                >
                                  <FaTrash />
                                </button>
                              )}
                            </div>
                          )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </InfiniteScroll>
        )}
      </div>
    </div>
  );
};

export default DonationCampaigns;
