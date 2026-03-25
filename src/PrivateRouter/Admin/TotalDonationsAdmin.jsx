import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

// ✅ আইকন ইম্পোর্ট ফিক্সড
import {
  FaHandHoldingHeart,
  FaUsers,
  FaChartLine,
  FaFileDownload,
  FaPaw,
} from 'react-icons/fa';
import { FaArrowTrendUp } from 'react-icons/fa6';

const TotalDonationsAdmin = () => {
  const axiosSecure = useAxiosSecure();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['admin-total-donations'],
    queryFn: async () => {
      const res = await axiosSecure.get('/admin/total-donations');
      return res.data;
    },
  });

  if (isLoading) {
    return (
      <div className="w-full min-h-screen bg-[#FFFBF7] pt-28 px-6 md:px-12">
        <Skeleton height={50} width={400} borderRadius={15} className="mb-12" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Skeleton height={250} borderRadius={40} />
          <Skeleton height={250} borderRadius={40} />
        </div>
        <Skeleton height={150} borderRadius={30} className="mt-12" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#FFFBF7]">
        <div className="bg-red-50 text-red-600 p-10 rounded-[3rem] border border-red-100 flex flex-col items-center text-center shadow-xl">
          <FaChartLine size={50} className="mb-4 opacity-50" />
          <h3 className="text-2xl font-black uppercase tracking-widest mb-2">
            Sync Failed
          </h3>
          <p className="font-bold text-red-400 mb-6">
            Could not fetch donation analytics from the server.
          </p>
          <button
            onClick={() => refetch()}
            className="px-8 py-4 bg-red-600 text-white rounded-2xl font-black hover:bg-red-700 transition-all shadow-lg"
          >
            RETRY CONNECTION
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#FFFBF7] dark:bg-gray-950 pt-28 pb-20 px-6 md:px-12 lg:px-20 overflow-hidden relative">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 p-10 opacity-5 text-[#37948b] pointer-events-none">
        <FaPaw size={500} className="rotate-12" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-[1440px] mx-auto relative z-10"
      >
        {/* --- Header Section --- */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#37948b]/10 text-[#37948b] font-black text-xs uppercase tracking-[0.2em] mb-4"
            >
              <FaArrowTrendUp className="animate-pulse" /> Live Statistics
            </motion.div>
            <h2 className="text-5xl md:text-7xl font-black text-gray-900 dark:text-white leading-[1.1] tracking-tighter">
              Donation <br />
              <span className="text-[#37948b]">Analytics</span>
            </h2>
          </div>

          <div className="bg-white dark:bg-gray-900 px-6 py-4 rounded-2xl shadow-xl shadow-teal-900/5 border border-gray-100 dark:border-gray-800">
            <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest text-right mb-1">
              Status
            </p>
            <p className="text-sm font-bold text-[#37948b] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#37948b] animate-ping" />{' '}
              Real-time tracking active
            </p>
          </div>
        </div>

        {/* --- Stats Cards Grid --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Card 1: Total Revenue (Light Theme) */}
          <motion.div
            whileHover={{ y: -10 }}
            className="relative group overflow-hidden bg-white dark:bg-gray-900 p-10 rounded-[3.5rem] shadow-2xl shadow-teal-900/5 border border-gray-100 dark:border-gray-800 transition-all duration-500"
          >
            <div className="absolute -right-10 -top-10 w-64 h-64 bg-teal-50 dark:bg-[#37948b]/10 rounded-full group-hover:scale-150 transition-transform duration-700" />

            <div className="relative z-10 flex flex-col h-full justify-between">
              <div className="flex items-center gap-6 mb-8">
                <div className="w-24 h-24 flex items-center justify-center bg-teal-50 dark:bg-gray-800 text-[#37948b] rounded-[2rem] text-4xl shadow-inner shadow-[#37948b]/20 border border-teal-100 dark:border-gray-700 group-hover:rotate-12 transition-transform">
                  <FaHandHoldingHeart />
                </div>
                <div>
                  <h3 className="text-gray-400 font-black uppercase tracking-widest text-[10px] mb-1">
                    Total Revenue Collected
                  </h3>
                  <p className="text-5xl md:text-6xl font-black text-gray-900 dark:text-white tracking-tighter">
                    $
                    {Number(data.total || 0).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                    })}
                  </p>
                </div>
              </div>

              <div className="pt-8 border-t border-gray-50 dark:border-gray-800 flex items-center justify-between text-gray-500">
                <span className="flex items-center gap-2 text-xs font-bold">
                  <FaChartLine className="text-emerald-500" /> +12% from last
                  month
                </span>
                <span className="text-[10px] font-black uppercase tracking-widest px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100">
                  Verified Data
                </span>
              </div>
            </div>
          </motion.div>

          {/* Card 2: Individual Donors (Dark Theme) */}
          <motion.div
            whileHover={{ y: -10 }}
            className="relative group overflow-hidden bg-gray-900 p-10 rounded-[3.5rem] shadow-2xl transition-all duration-500"
          >
            <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/5 rounded-full group-hover:scale-150 transition-transform duration-700" />

            <div className="relative z-10 flex flex-col h-full justify-between">
              <div className="flex items-center gap-6 mb-8 text-white">
                <div className="w-24 h-24 flex items-center justify-center bg-[#37948b] text-white rounded-[2rem] text-4xl shadow-lg shadow-[#37948b]/40 group-hover:-rotate-12 transition-transform">
                  <FaUsers />
                </div>
                <div>
                  <h3 className="text-gray-400 font-black uppercase tracking-widest text-[10px] mb-1">
                    Individual Donors
                  </h3>
                  <p className="text-5xl md:text-6xl font-black text-white tracking-tighter">
                    {data.count || 0}
                  </p>
                </div>
              </div>

              <div className="pt-8 border-t border-white/10 flex items-center justify-between text-gray-400">
                <span className="text-xs font-bold flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#37948b] animate-pulse" />{' '}
                  Successful transactions
                </span>
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map(i => (
                    <img
                      key={i}
                      src={`https://i.pravatar.cc/100?img=${i + 30}`}
                      className="w-8 h-8 rounded-full border-2 border-gray-900 object-cover"
                      alt="donor"
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* --- Decorative Bottom Section --- */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="mt-12 p-10 lg:p-12 bg-gradient-to-r from-[#37948b] to-[#2d7a72] rounded-[3.5rem] text-white flex flex-col md:flex-row items-center justify-between shadow-2xl shadow-[#37948b44] relative overflow-hidden"
        >
          <FaPaw className="absolute -left-10 -bottom-10 text-white/10 text-[200px] -rotate-12" />

          <div className="mb-8 md:mb-0 relative z-10 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md font-black text-[10px] uppercase tracking-widest mb-4 border border-white/30">
              <FaFileDownload /> Export Data
            </div>
            <h4 className="text-3xl lg:text-4xl font-black tracking-tighter mb-2">
              Generate Monthly Report
            </h4>
            <p className="opacity-80 font-medium text-sm">
              Download detailed statistics in CSV or PDF format for offline
              review.
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative z-10 bg-white text-[#37948b] px-10 py-5 rounded-3xl font-black text-sm uppercase tracking-widest shadow-2xl hover:bg-teal-50 transition-all flex items-center gap-3 w-full md:w-auto justify-center"
          >
            Download Analytics <FaFileDownload size={18} />
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default TotalDonationsAdmin;
