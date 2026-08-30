import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import useUserRole from '../../hooks/useUserRole';
import { supabase } from '../../Supabase/supabase.config';

// ✅ Recharts Components
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

// ✅ Icons
import {
  FaPaw,
  FaBullhorn,
  FaCheckCircle,
  FaHeart,
  FaArrowRight,
  FaUserShield,
  FaPlus,
  FaClock,
  FaPercentage,
  FaCalendarAlt,
  FaHandsHelping,
  FaEnvelope,
  FaCheckSquare,
  FaSquare,
  FaCoins,
  FaMapMarkerAlt,
  FaShieldAlt,
  FaBolt,
  FaUser,
  FaHandHoldingHeart,
  FaDollarSign,
} from 'react-icons/fa';

const COLORS = [
  '#37948b',
  '#4DB6AC',
  '#F59E0B',
  '#EF4444',
  '#8B5CF6',
  '#EC4899',
];

const DashboardHome = () => {
  const { user } = useAuth();
  const [role, roleLoading] = useUserRole();

  // অ্যাডমিন ইন্টারঅ্যাক্টিভ টাস্ক স্টেট
  const [tasks, setTasks] = useState([
    { id: 1, text: 'Review pending adoption requests', done: false },
    {
      id: 2,
      text: 'Verify vaccination records for newly added pets',
      done: true,
    },
    {
      id: 3,
      text: 'Follow up with active medical donation drives',
      done: false,
    },
    {
      id: 4,
      text: 'Publish upcoming community pet adoption fair',
      done: false,
    },
  ]);

  const toggleTask = id => {
    setTasks(prev =>
      prev.map(t => (t.id === id ? { ...t, done: !t.done } : t))
    );
  };

  // ১. পেট ডাটা ফেচিং (Supabase)
  const { data: pets = [], isLoading: petsLoading } = useQuery({
    queryKey: ['admin-pets-home'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pets')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) return [];
      return data || [];
    },
  });

  // ২. ক্যাম্পেইন ডাটা ফেচিং (Supabase)
  const { data: campaigns = [], isLoading: campaignsLoading } = useQuery({
    queryKey: ['admin-campaigns-home'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) return [];
      return data || [];
    },
  });

  // ৩. অ্যাডপশন আবেদন ডাটা ফেচিং (Supabase)
  const { data: adoptions = [], isLoading: adoptionsLoading } = useQuery({
    queryKey: ['admin-adoptions-home'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('adoptions')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) return [];
      return data || [];
    },
  });

  // ৪. আসন্ন ইভেন্ট ডাটা ফেচিং (Supabase)
  const { data: events = [], isLoading: eventsLoading } = useQuery({
    queryKey: ['admin-events-home'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true })
        .limit(3);
      if (error) return [];
      return data || [];
    },
  });

  // ৫. পেমেন্ট ও ডোনেশন ডাটা ফেচিং (Supabase - আসল মোট টাকা হিসাবের জন্য)
  const { data: payments = [], isLoading: paymentsLoading } = useQuery({
    queryKey: ['admin-payments-home'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .order('paid_at', { ascending: false });
      if (error) return [];
      return data || [];
    },
  });

  // 📊 মোট টাকা ও বিস্তারিত অ্যানালিটিক্স ক্যালকুলেশন
  const analytics = useMemo(() => {
    // ✅ ১. মোট ডোনেশনের টাকা (payments টেবিল থেকে প্রতিটি ট্রানজেকশনের আসল যোগফল)
    const totalDonations = payments.reduce(
      (sum, p) => sum + Number(p.amount || 0),
      0
    );

    // ইউজারের নিজস্ব ডোনেশন (শুধুমাত্র বর্তমান ইউজারের দেওয়া টাকা)
    const myPayments = payments.filter(p => p.email === user?.email);
    const myTotalDonated = myPayments.reduce(
      (sum, p) => sum + Number(p.amount || 0),
      0
    );

    const totalPets = pets.length;
    const availablePets = pets.filter(
      p => p.status?.toLowerCase() === 'available'
    ).length;
    const adoptedPets = pets.filter(
      p => p.status?.toLowerCase() === 'adopted'
    ).length;
    const adoptionRate =
      totalPets > 0 ? Math.round((adoptedPets / totalPets) * 100) : 0;
    const activeCampaigns = campaigns.filter(c => !c.is_paused).length;
    const pendingAdoptions = adoptions.filter(
      a => a.status?.toLowerCase() === 'pending'
    ).length;

    // ইউজার নিজস্ব তথ্য
    const myPets = pets.filter(p => p.owner_email === user?.email);
    const myAdoptions = adoptions.filter(a => a.user_email === user?.email);
    const myApprovedAdoptions = myAdoptions.filter(
      a =>
        a.status?.toLowerCase() === 'accepted' ||
        a.status?.toLowerCase() === 'approved'
    ).length;

    // পাই চার্ট: স্পিসিস ডাইভারসিটি
    const typeMap = {};
    pets.forEach(p => {
      const t = p.type || 'Other';
      typeMap[t] = (typeMap[t] || 0) + 1;
    });
    const speciesData = Object.keys(typeMap).map(key => ({
      name: key,
      value: typeMap[key],
    }));

    // বার চার্ট: ক্যাম্পেইন ফান্ডিং ডাটা
    const campaignChartData = campaigns.slice(0, 5).map(c => ({
      name: c.title?.length > 14 ? `${c.title.substring(0, 14)}...` : c.title,
      Raised: Number(c.donated_amount || 0),
      Goal: Number(c.max_donation || 0),
    }));

    // এরিয়া চার্ট: মান্থলি ট্রেন্ড ডাটা
    const monthlyActivityData = [
      { month: 'Jan', Intakes: 8, Adoptions: 4 },
      { month: 'Feb', Intakes: 12, Adoptions: 7 },
      { month: 'Mar', Intakes: 15, Adoptions: 11 },
      { month: 'Apr', Intakes: 18, Adoptions: 14 },
      {
        month: 'May',
        Intakes: Math.max(totalPets, 20),
        Adoptions: Math.max(adoptedPets, 16),
      },
    ];

    return {
      totalDonations,
      myTotalDonated,
      totalPets,
      availablePets,
      adoptedPets,
      adoptionRate,
      activeCampaigns,
      pendingAdoptions,
      speciesData: speciesData.length
        ? speciesData
        : [{ name: 'Dogs', value: 1 }],
      campaignChartData,
      monthlyActivityData,
      myPets,
      myAdoptions,
      myApprovedAdoptions,
      myPayments,
    };
  }, [pets, campaigns, adoptions, payments, user?.email]);

  const isLoadingAll =
    roleLoading ||
    petsLoading ||
    campaignsLoading ||
    adoptionsLoading ||
    eventsLoading ||
    paymentsLoading;

  if (isLoadingAll) {
    return (
      <div className="p-8 w-full max-w-[1440px] mx-auto pt-28">
        <Skeleton height={60} width={400} className="mb-10" borderRadius={20} />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} height={140} borderRadius={25} />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          <Skeleton height={380} borderRadius={35} className="lg:col-span-8" />
          <Skeleton height={380} borderRadius={35} className="lg:col-span-4" />
        </div>
      </div>
    );
  }

  const isAdmin = role === 'admin';

  // -------------------------------------------------------------
  // ১. অ্যাডমিন KPI মেট্রিক্স (মোট ডোনেশনের টাকাসহ)
  // -------------------------------------------------------------
  const adminStats = [
    {
      label: 'Total Raised Funds',
      value: `$${analytics.totalDonations.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, // 💰 মোট টাকা
      icon: <FaHeart />,
      color: 'text-rose-500',
      bg: 'bg-rose-50 dark:bg-rose-950/40',
      border: 'border-rose-100 dark:border-rose-900/30',
    },
    {
      label: 'Total Residents',
      value: analytics.totalPets,
      icon: <FaPaw />,
      color: 'text-[#37948b]',
      bg: 'bg-teal-50 dark:bg-teal-950/40',
      border: 'border-teal-100 dark:border-teal-900/30',
    },
    {
      label: 'Adopted Pets',
      value: analytics.adoptedPets,
      icon: <FaCheckCircle />,
      color: 'text-emerald-500',
      bg: 'bg-emerald-50 dark:bg-emerald-950/40',
      border: 'border-emerald-100 dark:border-emerald-900/30',
    },
    {
      label: 'Pending Requests',
      value: analytics.pendingAdoptions,
      icon: <FaClock />,
      color: 'text-amber-500',
      bg: 'bg-amber-50 dark:bg-amber-950/40',
      border: 'border-amber-100 dark:border-amber-900/30',
    },
    {
      label: 'Active Drives',
      value: analytics.activeCampaigns,
      icon: <FaBullhorn />,
      color: 'text-indigo-500',
      bg: 'bg-indigo-50 dark:bg-indigo-950/40',
      border: 'border-indigo-100 dark:border-indigo-900/30',
    },
    {
      label: 'Adoption Rate',
      value: `${analytics.adoptionRate}%`,
      icon: <FaPercentage />,
      color: 'text-cyan-500',
      bg: 'bg-cyan-50 dark:bg-cyan-950/40',
      border: 'border-cyan-100 dark:border-cyan-900/30',
    },
  ];

  // -------------------------------------------------------------
  // ২. সাধারণ ইউজার KPI মেট্রিক্স (তার নিজের ডোনেশন সহ)
  // -------------------------------------------------------------
  const userStats = [
    {
      label: 'My Total Donated',
      value: `$${analytics.myTotalDonated.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, // 💰 ইউজারের নিজের দেওয়া টাকা
      icon: <FaHandHoldingHeart />,
      color: 'text-rose-500',
      bg: 'bg-rose-50 dark:bg-rose-950/40',
      border: 'border-rose-100 dark:border-rose-900/30',
    },
    {
      label: 'My Listed Pets',
      value: analytics.myPets.length,
      icon: <FaPaw />,
      color: 'text-[#37948b]',
      bg: 'bg-teal-50 dark:bg-teal-950/40',
      border: 'border-teal-100 dark:border-teal-900/30',
    },
    {
      label: 'My Applications',
      value: analytics.myAdoptions.length,
      icon: <FaHandsHelping />,
      color: 'text-amber-500',
      bg: 'bg-amber-50 dark:bg-amber-950/40',
      border: 'border-amber-100 dark:border-amber-900/30',
    },
    {
      label: 'Approved Adoptions',
      value: analytics.myApprovedAdoptions,
      icon: <FaCheckCircle />,
      color: 'text-emerald-500',
      bg: 'bg-emerald-50 dark:bg-emerald-950/40',
      border: 'border-emerald-100 dark:border-emerald-900/30',
    },
  ];

  return (
    <div className="min-h-screen w-full bg-[#FFFBF7] dark:bg-gray-950 p-6 md:p-12 lg:px-16 pt-28 md:pt-14 font-sans selection:bg-[#37948b] selection:text-white">
      <div className="max-w-[1440px] mx-auto">
        {/* --- Header Section --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#37948b]/10 text-[#37948b] font-black text-xs uppercase tracking-[0.2em] mb-3 border border-[#37948b]/20">
              {isAdmin ? (
                <>
                  <FaShieldAlt size={14} /> Executive Admin Command Center
                </>
              ) : (
                <>
                  <FaUser size={14} /> Pet Guardian Workspace
                </>
              )}
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white tracking-tighter">
              Welcome back,{' '}
              <span className="text-[#37948b]">
                {user?.user_metadata?.full_name?.split(' ')[0] ||
                  user?.displayName ||
                  'Friend'}
                !
              </span>
            </h2>
          </motion.div>

          {/* Quick Action Shortcuts */}
          <div className="flex flex-wrap items-center gap-3">
            <Link to="/dashboard/addPets">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="bg-[#37948b] text-white px-6 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-[#37948b33] hover:bg-[#2d7a72] transition-all flex items-center gap-2 cursor-pointer"
              >
                <FaPlus /> {isAdmin ? 'Register Pet' : 'List a Pet'}
              </motion.button>
            </Link>
            <Link
              to={isAdmin ? '/dashboard/total-donations' : '/donationCampaigns'}
            >
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-800 px-6 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest hover:border-[#37948b] transition-all flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <FaDollarSign className="text-rose-500" />{' '}
                {isAdmin ? 'Donation Analytics' : 'Donate Now'}
              </motion.button>
            </Link>
          </div>
        </div>

        {/* --- KPI Metrics (এখানে মোট টাকা সহ সব কার্ড রেন্ডার হবে) --- */}
        <div
          className={`grid gap-5 mb-12 ${isAdmin ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-6' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'}`}
        >
          {(isAdmin ? adminStats : userStats).map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -5 }}
              className={`p-6 rounded-[2rem] bg-white dark:bg-gray-900 shadow-xl shadow-teal-900/5 border ${item.border} flex flex-col justify-between transition-all`}
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-12 h-12 rounded-2xl ${item.bg} flex items-center justify-center text-xl shadow-inner ${item.color}`}
                >
                  {item.icon}
                </div>
              </div>
              <div>
                <h3 className="text-gray-400 dark:text-gray-500 font-black uppercase tracking-widest text-[9px] mb-1">
                  {item.label}
                </h3>
                <p className="text-2xl lg:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                  {item.value}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ========================================================= */}
        {/* 🛡️ সেকশন ১: অ্যাডমিনদের জন্য এক্সক্লুসিভ গ্রাফ ও মেট্রিক্স */}
        {/* ========================================================= */}
        {isAdmin && (
          <>
            {/* Chart Row: Growth Flow & Species Donut */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="lg:col-span-8 bg-white dark:bg-gray-900 p-8 md:p-10 rounded-[3rem] shadow-xl shadow-teal-900/5 border border-gray-100 dark:border-gray-800"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-[#37948b]">
                      Growth Analytics
                    </p>
                    <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
                      Platform Pet Inflow vs Adoptions
                    </h3>
                  </div>
                  <div className="flex items-center gap-4 text-xs font-bold text-gray-500">
                    <span className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-full bg-[#37948b]" /> New
                      Pets
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-full bg-amber-500" />{' '}
                      Adoptions
                    </span>
                  </div>
                </div>

                <div className="h-[280px] w-full">
                  <Responsive width="100%" height="100%">
                    <AreaChart
                      data={analytics.monthlyActivityData}
                      margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient
                          id="colorIntakes"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#37948b"
                            stopOpacity={0.35}
                          />
                          <stop
                            offset="95%"
                            stopColor="#37948b"
                            stopOpacity={0}
                          />
                        </linearGradient>
                        <linearGradient
                          id="colorAdoptions"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#F59E0B"
                            stopOpacity={0.35}
                          />
                          <stop
                            offset="95%"
                            stopColor="#F59E0B"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="#88888815"
                      />
                      <XAxis
                        dataKey="month"
                        tickLine={false}
                        axisLine={false}
                        tick={{
                          fill: '#9CA3AF',
                          fontSize: 11,
                          fontWeight: 700,
                        }}
                      />
                      <YAxis
                        tickLine={false}
                        axisLine={false}
                        tick={{
                          fill: '#9CA3AF',
                          fontSize: 11,
                          fontWeight: 700,
                        }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#111827',
                          borderRadius: '1rem',
                          border: 'none',
                          color: '#fff',
                          fontWeight: 'bold',
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="Intakes"
                        stroke="#37948b"
                        strokeWidth={3}
                        fill="url(#colorIntakes)"
                      />
                      <Area
                        type="monotone"
                        dataKey="Adoptions"
                        stroke="#F59E0B"
                        strokeWidth={3}
                        fill="url(#colorAdoptions)"
                      />
                    </AreaChart>
                  </Responsive>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="lg:col-span-4 bg-white dark:bg-gray-900 p-8 md:p-10 rounded-[3rem] shadow-xl shadow-teal-900/5 border border-gray-100 dark:border-gray-800 flex flex-col justify-between"
              >
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#37948b] mb-1">
                    Biodiversity
                  </p>
                  <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
                    Species Diversity
                  </h3>
                </div>

                <div className="h-[210px] w-full my-auto">
                  <Responsive width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={analytics.speciesData}
                        cx="50%"
                        cy="50%"
                        innerRadius={52}
                        outerRadius={80}
                        paddingAngle={6}
                        dataKey="value"
                      >
                        {analytics.speciesData.map((_, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#111827',
                          borderRadius: '1rem',
                          border: 'none',
                          color: '#fff',
                          fontWeight: 'bold',
                        }}
                      />
                    </PieChart>
                  </Responsive>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3 pt-4 border-t border-gray-50 dark:border-gray-800">
                  {analytics.speciesData.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-1.5 text-xs font-bold text-gray-600 dark:text-gray-300"
                    >
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                      />
                      <span>
                        {item.name} ({item.value})
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Campaign Target Completion & Admin Milestone Gauges */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
              <div className="lg:col-span-7 bg-white dark:bg-gray-900 p-8 md:p-10 rounded-[3rem] shadow-xl shadow-teal-900/5 border border-gray-100 dark:border-gray-800">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-[#37948b]">
                      Fundraising
                    </p>
                    <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
                      Campaign Target Completion
                    </h3>
                  </div>
                  <span className="text-xs font-bold text-gray-400">
                    Top 5 Campaigns
                  </span>
                </div>

                <div className="h-[250px] w-full">
                  <Responsive width="100%" height="100%">
                    <BarChart
                      data={analytics.campaignChartData}
                      margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="#88888815"
                      />
                      <XAxis
                        dataKey="name"
                        tickLine={false}
                        axisLine={false}
                        tick={{
                          fill: '#9CA3AF',
                          fontSize: 10,
                          fontWeight: 700,
                        }}
                      />
                      <YAxis
                        tickLine={false}
                        axisLine={false}
                        tick={{
                          fill: '#9CA3AF',
                          fontSize: 10,
                          fontWeight: 700,
                        }}
                        tickFormatter={v => `$${v}`}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#111827',
                          borderRadius: '1rem',
                          border: 'none',
                          color: '#fff',
                          fontWeight: 'bold',
                        }}
                      />
                      <Bar
                        dataKey="Raised"
                        fill="#37948b"
                        radius={[6, 6, 0, 0]}
                      />
                      <Bar
                        dataKey="Goal"
                        fill="#e5e7eb"
                        radius={[6, 6, 0, 0]}
                      />
                    </BarChart>
                  </Responsive>
                </div>
              </div>

              <div className="lg:col-span-5 bg-white dark:bg-gray-900 p-8 md:p-10 rounded-[3rem] shadow-xl shadow-teal-900/5 border border-gray-100 dark:border-gray-800 flex flex-col justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#37948b] mb-1">
                    Target Goals
                  </p>
                  <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight mb-6">
                    Shelter & Adoption Milestones
                  </h3>
                </div>

                <div className="space-y-6 my-auto">
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-2">
                      <span className="text-gray-700 dark:text-gray-300">
                        Annual Adoption Goal (500 Pets)
                      </span>
                      <span className="text-[#37948b] font-black">
                        {Math.min(analytics.adoptedPets * 2, 100)}%
                      </span>
                    </div>
                    <div className="w-full h-3 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden p-0.5">
                      <div
                        className="h-full bg-[#37948b] rounded-full"
                        style={{
                          width: `${Math.min(analytics.adoptedPets * 2, 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-2">
                      <span className="text-gray-700 dark:text-gray-300">
                        Shelter Care Capacity
                      </span>
                      <span className="text-amber-500 font-black">
                        {Math.min(
                          Math.round((analytics.totalPets / 100) * 100),
                          100
                        )}
                        %
                      </span>
                    </div>
                    <div className="w-full h-3 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden p-0.5">
                      <div
                        className="h-full bg-amber-500 rounded-full"
                        style={{
                          width: `${Math.min(Math.round((analytics.totalPets / 100) * 100), 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-50 dark:border-gray-800 flex items-center justify-between text-[11px] font-bold text-gray-400">
                  <span className="flex items-center gap-1">
                    <FaBolt className="text-amber-500" /> Operational Efficiency
                  </span>
                  <span className="text-emerald-500 font-black">Optimal</span>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ========================================================= */}
        {/* 🐶 সেকশন ২: সাধারণ ইউজার ও অ্যাডমিনের যৌথ/পারসোনাল হাব */}
        {/* ========================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {/* Card 1: Upcoming Community Events */}
          <div className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] shadow-xl shadow-teal-900/5 border border-gray-100 dark:border-gray-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                  <FaCalendarAlt className="text-[#37948b]" /> Upcoming Events
                </h3>
                <Link
                  to="/events"
                  className="text-[10px] font-black uppercase text-[#37948b] hover:underline"
                >
                  View All
                </Link>
              </div>

              <div className="space-y-4">
                {events.length > 0 ? (
                  events.map(ev => (
                    <div
                      key={ev.id}
                      className="p-4 bg-gray-50/50 dark:bg-gray-800/40 rounded-2xl flex items-start gap-4"
                    >
                      <div className="p-3 bg-teal-50 dark:bg-gray-800 rounded-xl text-[#37948b] text-center min-w-[50px]">
                        <p className="text-xs font-black uppercase">
                          {new Date(ev.date || Date.now()).toLocaleString(
                            'en-US',
                            { month: 'short' }
                          )}
                        </p>
                        <p className="text-base font-black leading-none">
                          {new Date(ev.date || Date.now()).getDate()}
                        </p>
                      </div>
                      <div className="overflow-hidden flex-1">
                        <h4 className="font-black text-sm text-gray-800 dark:text-white truncate">
                          {ev.title}
                        </h4>
                        <p className="text-[10px] text-gray-400 font-bold flex items-center gap-1 mt-1 truncate">
                          <FaMapMarkerAlt /> {ev.location}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs font-bold text-gray-400 py-6 text-center">
                    No upcoming events
                  </p>
                )}
              </div>
            </div>

            <Link to="/events" className="block mt-6">
              <button className="w-full py-3 bg-teal-50 dark:bg-gray-800 text-[#37948b] rounded-xl font-black text-xs uppercase tracking-widest hover:bg-[#37948b] hover:text-white transition-all cursor-pointer">
                Explore Events Schedule
              </button>
            </Link>
          </div>

          {/* Card 2: Adoptions */}
          <div className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] shadow-xl shadow-teal-900/5 border border-gray-100 dark:border-gray-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                  <FaHandsHelping className="text-[#37948b]" />{' '}
                  {isAdmin ? 'Pending Inquiries' : 'My Applications'}
                </h3>
                <span className="px-2.5 py-0.5 bg-amber-50 dark:bg-amber-950/40 text-amber-600 rounded-full font-black text-[10px]">
                  {isAdmin
                    ? `${analytics.pendingAdoptions} Pending`
                    : `${analytics.myAdoptions.length} Submitted`}
                </span>
              </div>

              <div className="space-y-3">
                {(isAdmin ? adoptions : analytics.myAdoptions)
                  .slice(0, 3)
                  .map((ad, idx) => (
                    <div
                      key={ad.id || idx}
                      className="p-4 bg-gray-50/50 dark:bg-gray-800/40 rounded-2xl flex items-center justify-between"
                    >
                      <div className="overflow-hidden">
                        <p className="text-xs font-bold text-gray-800 dark:text-gray-200 truncate">
                          {ad.user_name || 'Pet Applicant'}
                        </p>
                        <p className="text-[10px] text-gray-400 font-medium truncate flex items-center gap-1">
                          <FaEnvelope size={8} /> {ad.user_email}
                        </p>
                      </div>
                      <span className="px-3 py-1 bg-amber-100/60 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 rounded-xl text-[9px] font-black uppercase">
                        {ad.status || 'Pending'}
                      </span>
                    </div>
                  ))}
                {!isAdmin && analytics.myAdoptions.length === 0 && (
                  <p className="text-xs font-bold text-gray-400 py-6 text-center">
                    You have no active adoption requests
                  </p>
                )}
              </div>
            </div>

            <Link
              to={
                isAdmin
                  ? '/dashboard/manage-pets'
                  : '/dashboard/adoption-request'
              }
              className="block mt-6"
            >
              <button className="w-full py-3 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-[#37948b] hover:text-white transition-all cursor-pointer">
                {isAdmin ? 'Review Applications' : 'View My Requests'}
              </button>
            </Link>
          </div>

          {/* Card 3: Live Donations (আসল মোট ডোনেশন ও ডোনারদের তালিকা) */}
          <div className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] shadow-xl shadow-teal-900/5 border border-gray-100 dark:border-gray-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                  <FaCoins className="text-rose-500" />{' '}
                  {isAdmin ? 'Live Donor Feed' : 'My Contributions'}
                </h3>
                <Link
                  to={isAdmin ? '/dashboard' : '/dashboard/my-donations'}
                  className="text-[10px] font-black uppercase text-[#37948b] hover:underline"
                >
                  Ledger
                </Link>
              </div>

              <div className="space-y-3">
                {(isAdmin ? payments : analytics.myPayments)
                  .slice(0, 3)
                  .map((p, idx) => (
                    <div
                      key={p.id || idx}
                      className="p-3.5 bg-gray-50/50 dark:bg-gray-800/40 rounded-2xl flex items-center justify-between"
                    >
                      <div className="overflow-hidden">
                        <p className="text-xs font-bold text-gray-800 dark:text-gray-200 truncate">
                          {p.email || 'Anonymous'}
                        </p>
                        <p className="text-[10px] text-gray-400 font-mono font-medium">
                          {new Date(
                            p.paid_at || Date.now()
                          ).toLocaleDateString()}
                        </p>
                      </div>
                      <span className="text-sm font-black text-[#37948b]">
                        +${Number(p.amount || 0).toFixed(2)}
                      </span>
                    </div>
                  ))}
                {!isAdmin && analytics.myPayments.length === 0 && (
                  <p className="text-xs font-bold text-gray-400 py-6 text-center">
                    You haven't made any donations yet
                  </p>
                )}
              </div>
            </div>

            <Link
              to={isAdmin ? '/dashboard' : '/donationCampaigns'}
              className="block mt-6"
            >
              <button className="w-full py-3 bg-teal-50 dark:bg-gray-800 text-[#37948b] rounded-xl font-black text-xs uppercase tracking-widest hover:bg-[#37948b] hover:text-white transition-all cursor-pointer">
                {isAdmin ? 'Donation Analytics' : 'Support a Drive'}
              </button>
            </Link>
          </div>
        </div>

        {/* --- Bottom Row: Pet Inventory & Workflow --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Newly Registered Pets */}
          <div className="lg:col-span-7 bg-white dark:bg-gray-900 p-8 md:p-10 rounded-[3rem] shadow-xl shadow-teal-900/5 border border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-[#37948b]">
                  {isAdmin ? 'Platform Inventory' : 'My Listings'}
                </p>
                <h3 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                  <FaPaw className="text-[#37948b]" />{' '}
                  {isAdmin ? 'Recently Registered Pets' : 'Pets Added By Me'}
                </h3>
              </div>
              <Link
                to="/dashboard/mypets"
                className="text-xs font-black uppercase text-[#37948b] hover:underline flex items-center gap-1"
              >
                View All <FaArrowRight size={10} />
              </Link>
            </div>

            <div className="space-y-4">
              {(isAdmin ? pets : analytics.myPets).slice(0, 4).map(pet => (
                <div
                  key={pet.id}
                  className="p-4 bg-gray-50/50 dark:bg-gray-800/40 rounded-2xl flex items-center justify-between gap-4 border border-transparent hover:border-teal-100 dark:hover:border-teal-900/40 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={pet.image_url || 'https://via.placeholder.com/100'}
                      alt={pet.name}
                      className="w-12 h-12 rounded-xl object-cover shadow-sm border border-white dark:border-gray-700"
                    />
                    <div>
                      <h4 className="font-black text-gray-800 dark:text-white text-base">
                        {pet.name}
                      </h4>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        {pet.type} • {pet.breed || 'Mixed'}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${pet.status?.toLowerCase() === 'available' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100'}`}
                  >
                    {pet.status || 'Available'}
                  </span>
                </div>
              ))}
              {!isAdmin && analytics.myPets.length === 0 && (
                <p className="text-xs font-bold text-gray-400 py-6 text-center">
                  You haven't listed any pets for adoption yet
                </p>
              )}
            </div>
          </div>

          {/* Right: Admin Tasks or User Guidance Card */}
          <div className="lg:col-span-5 bg-white dark:bg-gray-900 p-8 md:p-10 rounded-[3rem] shadow-xl shadow-teal-900/5 border border-gray-100 dark:border-gray-800 flex flex-col justify-between">
            {isAdmin ? (
              <>
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-[#37948b]">
                        Workflow
                      </p>
                      <h3 className="text-2xl font-black text-gray-900 dark:text-white">
                        Admin Daily Tasks
                      </h3>
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-teal-50 dark:bg-gray-800 text-[#37948b] rounded-full">
                      {tasks.filter(t => t.done).length} / {tasks.length} Done
                    </span>
                  </div>

                  <div className="space-y-3">
                    {tasks.map(task => (
                      <div
                        key={task.id}
                        onClick={() => toggleTask(task.id)}
                        className={`p-4 rounded-2xl flex items-center gap-3 cursor-pointer transition-all ${
                          task.done
                            ? 'bg-teal-50/40 dark:bg-teal-950/20 text-gray-400 line-through'
                            : 'bg-gray-50/70 dark:bg-gray-800/40 text-gray-800 dark:text-gray-200 hover:border-teal-100'
                        }`}
                      >
                        {task.done ? (
                          <FaCheckSquare className="text-[#37948b] text-base flex-shrink-0" />
                        ) : (
                          <FaSquare className="text-gray-300 dark:text-gray-600 text-base flex-shrink-0" />
                        )}
                        <span className="text-xs font-bold select-none">
                          {task.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-50 dark:border-gray-800 mt-6 flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase text-gray-400">
                    System Sync
                  </span>
                  <span className="text-xs font-bold text-emerald-500 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />{' '}
                    All Systems Online
                  </span>
                </div>
              </>
            ) : (
              <div className="flex flex-col justify-between h-full">
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-teal-50 dark:bg-gray-800 text-[#37948b] flex items-center justify-center text-2xl mb-6 shadow-inner">
                    <FaPaw />
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-3">
                    Adopt, Don't Shop!
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 text-xs font-medium leading-relaxed mb-6">
                    Every rescue pet deserves a loving home. Track your adoption
                    applications, manage pet listings, or support active
                    veterinary donation drives directly from this dashboard.
                  </p>
                </div>
                <Link to="/petListing">
                  <button className="w-full py-4 bg-[#37948b] text-white font-black rounded-2xl text-xs uppercase tracking-widest hover:bg-[#2d7a72] transition-all shadow-lg cursor-pointer">
                    Browse All Rescue Pets
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
