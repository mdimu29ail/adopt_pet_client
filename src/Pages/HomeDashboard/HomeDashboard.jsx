import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import {
  FaPaw,
  FaBullhorn,
  FaCheckCircle,
  FaHeart,
  FaArrowRight,
  FaChartPie,
  FaUserShield,
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import useAuth from '../../hooks/useAuth';

const DashboardHome = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  // ১. পেট ডাটা ফেচিং
  const { data: pets = [], isLoading: petsLoading } = useQuery({
    queryKey: ['admin-pets'],
    queryFn: async () => {
      const res = await axiosSecure.get('/pets');
      return res.data;
    },
  });

  // ২. ক্যাম্পেইন ডাটা ফেচিং
  const { data: campaigns = [], isLoading: campaignsLoading } = useQuery({
    queryKey: ['admin-campaigns'],
    queryFn: async () => {
      const res = await axiosSecure.get('/campaigns');
      return res.data;
    },
  });

  if (petsLoading || campaignsLoading) {
    return (
      <div className="p-8 w-full max-w-[1440px] mx-auto">
        <Skeleton height={60} width={400} className="mb-10" borderRadius={20} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} height={160} borderRadius={30} />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <Skeleton height={400} borderRadius={40} />
          <Skeleton height={400} borderRadius={40} />
        </div>
      </div>
    );
  }

  // লজিক ও স্ট্যাটস ক্যালকুলেশন
  const availablePets =
    pets?.filter(p => p.status?.toLowerCase() === 'available') || [];
  const activeCampaigns = campaigns?.filter(c => !c.is_paused) || [];
  const totalDonations = campaigns?.reduce(
    (sum, c) => sum + (Number(c.donated_amount) || 0),
    0,
  );

  const stats = [
    {
      label: 'Total Pets',
      value: pets?.length || 0,
      icon: <FaPaw />,
      color: 'bg-[#37948b]',
      lightColor: 'bg-teal-50',
    },
    {
      label: 'Available',
      value: availablePets?.length || 0,
      icon: <FaCheckCircle />,
      color: 'bg-[#4DB6AC]',
      lightColor: 'bg-emerald-50',
    },
    {
      label: 'Donations',
      value: `$${totalDonations.toLocaleString()}`,
      icon: <FaHeart />,
      color: 'bg-rose-500',
      lightColor: 'bg-rose-50',
    },
    {
      label: 'Live Drives',
      value: activeCampaigns?.length || 0,
      icon: <FaBullhorn />,
      color: 'bg-amber-500',
      lightColor: 'bg-amber-50',
    },
  ];

  return (
    <div className="min-h-screen w-full bg-[#FFFBF7] dark:bg-gray-950 p-6 md:p-12 lg:px-16 pt-28 md:pt-12 font-sans">
      <div className="max-w-[1440px] mx-auto">
        {/* --- Header Section --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="flex items-center gap-3 text-[#37948b] font-black uppercase tracking-[0.3em] text-xs mb-3">
              <FaUserShield size={18} /> Admin Control Panel
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white tracking-tighter">
              Hello,{' '}
              <span className="text-[#37948b]">
                {user?.user_metadata?.full_name?.split(' ')[0] || 'Admin'}!
              </span>
            </h2>
          </motion.div>

          <div className="bg-white dark:bg-gray-900 p-4 rounded-3xl shadow-xl shadow-teal-900/5 flex items-center gap-4 border border-gray-100 dark:border-gray-800">
            <div className="w-12 h-12 rounded-2xl bg-[#37948b] flex items-center justify-center text-white shadow-lg">
              <FaChartPie size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase">
                System Status
              </p>
              <p className="text-sm font-bold text-green-500">
                All Systems Operational
              </p>
            </div>
          </div>
        </div>

        {/* --- Stats Grid --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {stats.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -10 }}
              className="p-8 bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-xl shadow-teal-900/5 border border-gray-100 dark:border-gray-800 relative overflow-hidden group transition-all duration-500"
            >
              <div
                className={`absolute -right-4 -top-4 w-24 h-24 ${item.color} opacity-5 rounded-full group-hover:scale-150 transition-transform duration-700`}
              ></div>

              <div
                className={`w-14 h-14 rounded-2xl ${item.lightColor} dark:bg-gray-800 flex items-center justify-center text-2xl mb-6 shadow-sm group-hover:rotate-12 transition-transform`}
              >
                <span
                  style={{ color: item.color.includes('#') ? item.color : '' }}
                  className={
                    !item.color.includes('#')
                      ? item.color.replace('bg-', 'text-')
                      : ''
                  }
                >
                  {item.icon}
                </span>
              </div>

              <h3 className="text-gray-400 dark:text-gray-500 font-black uppercase tracking-widest text-[10px] mb-1">
                {item.label}
              </h3>
              <p className="text-4xl font-black text-gray-900 dark:text-white">
                {item.value}
              </p>
            </motion.div>
          ))}
        </div>

        {/* --- Main Content Area --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Recent Entries Card */}
          <motion.section
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="lg:col-span-8 bg-white dark:bg-gray-900 p-8 md:p-12 rounded-[3.5rem] shadow-2xl shadow-teal-900/5 border border-gray-100 dark:border-gray-800"
          >
            <div className="flex items-center justify-between mb-10">
              <h3 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-3">
                <FaPaw className="text-[#37948b]" /> Recent{' '}
                <span className="text-[#37948b]">Adoptions</span>
              </h3>
              <Link
                to="/dashboard/mypets"
                className="group flex items-center gap-2 bg-teal-50 dark:bg-gray-800 px-5 py-2.5 rounded-2xl text-[#37948b] font-black text-xs uppercase tracking-widest hover:bg-[#37948b] hover:text-white transition-all"
              >
                View Library{' '}
                <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="space-y-4">
              {pets?.slice(0, 5).map(pet => (
                <motion.div
                  key={pet.id}
                  whileHover={{ x: 10 }}
                  className="p-5 bg-gray-50/50 dark:bg-gray-800/50 rounded-3xl flex items-center gap-6 border border-transparent hover:border-teal-100 dark:hover:border-teal-900 transition-all duration-300"
                >
                  <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-lg border-2 border-white dark:border-gray-700">
                    <img
                      src={pet.image_url || 'https://via.placeholder.com/100'}
                      alt={pet.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-black text-gray-800 dark:text-white text-lg tracking-tight">
                      {pet.name}
                    </h4>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        {pet.type}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-gray-300" />
                      <span
                        className={`px-3 py-0.5 rounded-full text-[9px] font-black uppercase ${pet.status?.toLowerCase() === 'available' ? 'bg-green-100 text-green-600' : 'bg-rose-100 text-rose-600'}`}
                      >
                        {pet.status}
                      </span>
                    </div>
                  </div>
                  <div className="hidden sm:block text-right pr-4">
                    <p className="text-[10px] font-black text-gray-400 uppercase mb-1">
                      Created At
                    </p>
                    <p className="text-xs font-bold text-gray-600 dark:text-gray-300">
                      {new Date(pet.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Quick Actions / Shortcuts Sidebar */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-gray-900 p-10 rounded-[3.5rem] shadow-2xl text-white relative overflow-hidden group">
              <FaPaw className="absolute -bottom-10 -right-10 text-white/5 text-[200px] rotate-12 group-hover:rotate-45 transition-transform duration-1000" />
              <div className="relative z-10">
                <h3 className="text-2xl font-black mb-4">
                  Grow the <br />
                  Community
                </h3>
                <p className="text-gray-400 text-sm font-medium mb-10 leading-relaxed">
                  Every new listing helps a pet find their forever home faster.
                </p>
                <Link to="/dashboard/addPets">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full py-4 bg-[#37948b] text-white font-black rounded-2xl shadow-xl shadow-teal-900/40 hover:bg-[#2d7a72] transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-xs"
                  >
                    Register New Pet <FaPaw />
                  </motion.button>
                </Link>
              </div>
            </div>

            <div className="bg-teal-50 dark:bg-teal-900/20 p-8 rounded-[3rem] border border-teal-100 dark:border-teal-800/30">
              <h4 className="font-black text-[#37948b] uppercase tracking-[0.2em] text-[10px] mb-6">
                Live Campaign Summary
              </h4>
              <div className="space-y-6">
                {campaigns?.slice(0, 2).map(camp => (
                  <div key={camp.id} className="space-y-2">
                    <div className="flex justify-between items-center text-xs font-bold">
                      <span className="text-gray-700 dark:text-gray-300 truncate max-w-[150px]">
                        {camp.title}
                      </span>
                      <span className="text-[#37948b]">
                        ${camp.donated_amount}
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-white dark:bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#37948b]"
                        style={{
                          width: `${(camp.donated_amount / camp.max_donation) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
