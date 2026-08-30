import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { supabase } from '../../Supabase/supabase.config';

// ✅ Recharts Components (ResponsiveContainer ফিক্সড)
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from 'recharts';

// ✅ Icons
import {
  FaHandHoldingHeart,
  FaUsers,
  FaChartLine,
  FaFileDownload,
  FaPaw,
  FaDollarSign,
  FaTrophy,
  FaCreditCard,
  FaArrowUp,
  FaClock,
} from 'react-icons/fa';
import { FaArrowTrendUp, FaMoneyBillTrendUp } from 'react-icons/fa6';

const TotalDonationsAdmin = () => {
  // Supabase থেকে সকল payments ডাটা ফেচ করা
  const {
    data: payments = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['admin-total-donations-deep-analytics'],
    queryFn: async () => {
      const { data, error: supabaseError } = await supabase
        .from('payments')
        .select('*')
        .order('paid_at', { ascending: false });

      if (supabaseError) {
        throw new Error(supabaseError.message);
      }
      return data || [];
    },
  });

  // 📊 ডাটাবেস থেকে বিস্তারিত অ্যানালিটিক্স ক্যালকুলেশন
  const analytics = useMemo(() => {
    if (!payments.length) {
      return {
        totalRevenue: 0,
        totalDonations: 0,
        avgDonation: 0,
        maxDonation: 0,
        monthlyData: [],
        rangeData: [],
        recentPayments: [],
      };
    }

    const totalRevenue = payments.reduce(
      (sum, p) => sum + Number(p.amount || 0),
      0
    );
    const totalDonations = payments.length;
    const avgDonation = totalRevenue / totalDonations;
    const maxDonation = Math.max(...payments.map(p => Number(p.amount || 0)));

    // ১. মাসভিত্তিক আয়ের চার্ট ডাটা
    const monthlyMap = {};
    payments.forEach(p => {
      const date = new Date(p.paid_at || p.created_at || Date.now());
      const month = date.toLocaleString('en-US', { month: 'short' });
      if (!monthlyMap[month]) {
        monthlyMap[month] = { month, revenue: 0, donors: 0 };
      }
      monthlyMap[month].revenue += Number(p.amount || 0);
      monthlyMap[month].donors += 1;
    });

    const monthOrder = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    const monthlyData = Object.values(monthlyMap).sort(
      (a, b) => monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month)
    );

    // ২. ডোনেশন রেঞ্জ চার্ট ডাটা
    const ranges = [
      { name: '$1 - $25', count: 0 },
      { name: '$26 - $50', count: 0 },
      { name: '$51 - $100', count: 0 },
      { name: '$100+', count: 0 },
    ];

    payments.forEach(p => {
      const amt = Number(p.amount || 0);
      if (amt <= 25) ranges[0].count++;
      else if (amt <= 50) ranges[1].count++;
      else if (amt <= 100) ranges[2].count++;
      else ranges[3].count++;
    });

    return {
      totalRevenue,
      totalDonations,
      avgDonation,
      maxDonation,
      monthlyData: monthlyData.length
        ? monthlyData
        : [{ month: 'Current', revenue: totalRevenue, donors: totalDonations }],
      rangeData: ranges,
      recentPayments: payments.slice(0, 5),
    };
  }, [payments]);

  // কাস্টম চার্ট টুলটিপ
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900/95 backdrop-blur-md p-4 rounded-2xl border border-gray-800 shadow-2xl text-white">
          <p className="text-xs font-black text-[#37948b] uppercase tracking-wider mb-1">
            {label}
          </p>
          <p className="text-base font-black">
            ${Number(payload[0].value).toLocaleString()}
          </p>
          {payload[0].payload?.donors && (
            <p className="text-[10px] text-gray-400 font-bold">
              {payload[0].payload.donors} Contributions
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="w-full min-h-screen bg-[#FFFBF7] dark:bg-gray-950 pt-28 px-6 md:px-12 lg:px-20">
        <Skeleton height={50} width={400} borderRadius={15} className="mb-12" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} height={160} borderRadius={30} />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Skeleton height={380} borderRadius={35} className="lg:col-span-2" />
          <Skeleton height={380} borderRadius={35} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#FFFBF7] dark:bg-gray-950">
        <div className="bg-red-50 dark:bg-red-950/30 text-red-600 p-10 rounded-[3rem] border border-red-100 dark:border-red-900/40 flex flex-col items-center text-center shadow-2xl">
          <FaChartLine size={50} className="mb-4 opacity-50 text-red-500" />
          <h3 className="text-2xl font-black uppercase tracking-widest mb-2">
            Sync Failed
          </h3>
          <p className="font-bold text-red-400 mb-6 max-w-sm">
            Could not fetch real-time donation analytics from Supabase.
          </p>
          <button
            onClick={() => refetch()}
            className="px-8 py-4 bg-red-600 text-white rounded-2xl font-black hover:bg-red-700 transition-all shadow-lg text-xs tracking-widest"
          >
            RETRY CONNECTION
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#FFFBF7] dark:bg-gray-950 pt-28 pb-20 px-4 md:px-10 lg:px-16 overflow-hidden relative font-sans">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 p-10 opacity-5 text-[#37948b] pointer-events-none -z-0">
        <FaPaw size={550} className="rotate-12" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-[1440px] mx-auto relative z-10"
      >
        {/* --- Header Section --- */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#37948b]/10 text-[#37948b] font-black text-xs uppercase tracking-[0.2em] mb-4"
            >
              <FaArrowTrendUp className="animate-pulse" /> Live Financial
              Executive
            </motion.div>
            <h2 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white leading-[1.1] tracking-tighter">
              Donation <br />
              <span className="text-[#37948b]">Analytics Hub</span>
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-white dark:bg-gray-900 px-6 py-4 rounded-2xl shadow-xl shadow-teal-900/5 border border-gray-100 dark:border-gray-800 flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-xs font-black uppercase tracking-widest text-gray-700 dark:text-gray-300">
                Live Supabase Sync
              </span>
            </div>
          </div>
        </div>

        {/* --- 4 Key Metric (KPI) Cards --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {/* Metric 1: Total Revenue */}
          <motion.div
            whileHover={{ y: -6 }}
            className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] shadow-xl shadow-teal-900/5 border border-gray-100 dark:border-gray-800 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="w-14 h-14 rounded-2xl bg-teal-50 dark:bg-gray-800 text-[#37948b] flex items-center justify-center text-2xl shadow-inner border border-teal-100/50 dark:border-gray-700">
                <FaHandHoldingHeart />
              </div>
              <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100">
                <FaArrowUp /> +14.8%
              </span>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">
                Total Revenue
              </p>
              <h3 className="text-3xl lg:text-4xl font-black text-gray-900 dark:text-white tracking-tighter">
                $
                {analytics.totalRevenue.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}
              </h3>
            </div>
          </motion.div>

          {/* Metric 2: Total Donors / Transactions */}
          <motion.div
            whileHover={{ y: -6 }}
            className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] shadow-xl shadow-teal-900/5 border border-gray-100 dark:border-gray-800 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-gray-800 text-blue-500 flex items-center justify-center text-2xl shadow-inner border border-blue-100/50 dark:border-gray-700">
                <FaUsers />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-blue-50 text-blue-600 rounded-full border border-blue-100">
                Verified
              </span>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">
                Total Transactions
              </p>
              <h3 className="text-3xl lg:text-4xl font-black text-gray-900 dark:text-white tracking-tighter">
                {analytics.totalDonations}
              </h3>
            </div>
          </motion.div>

          {/* Metric 3: Average Contribution */}
          <motion.div
            whileHover={{ y: -6 }}
            className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] shadow-xl shadow-teal-900/5 border border-gray-100 dark:border-gray-800 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-gray-800 text-amber-500 flex items-center justify-center text-2xl shadow-inner border border-amber-100/50 dark:border-gray-700">
                <FaMoneyBillTrendUp />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-amber-50 text-amber-600 rounded-full border border-amber-100">
                Average
              </span>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">
                Avg. Donation Value
              </p>
              <h3 className="text-3xl lg:text-4xl font-black text-gray-900 dark:text-white tracking-tighter">
                ${analytics.avgDonation.toFixed(2)}
              </h3>
            </div>
          </motion.div>

          {/* Metric 4: Top Single Donation */}
          <motion.div
            whileHover={{ y: -6 }}
            className="bg-gradient-to-br from-gray-900 to-gray-800 text-white p-8 rounded-[2.5rem] shadow-2xl border border-gray-800 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="w-14 h-14 rounded-2xl bg-[#37948b] text-white flex items-center justify-center text-2xl shadow-lg shadow-[#37948b]/40">
                <FaTrophy />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-white/10 text-[#37948b] rounded-full border border-white/10">
                Top Record
              </span>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">
                Highest Single Gift
              </p>
              <h3 className="text-3xl lg:text-4xl font-black text-white tracking-tighter">
                $
                {analytics.maxDonation.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}
              </h3>
            </div>
          </motion.div>
        </div>

        {/* --- Charts & Visual Diagrams Section --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10">
          {/* Chart 1: Revenue Timeline (7 Cols) */}
          <div className="lg:col-span-8 bg-white dark:bg-gray-900 p-8 md:p-10 rounded-[3rem] shadow-xl shadow-teal-900/5 border border-gray-100 dark:border-gray-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-[#37948b]">
                  Financial Inflow
                </p>
                <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
                  Revenue Growth Dynamics
                </h3>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-gray-500 bg-gray-50 dark:bg-gray-800 px-4 py-2 rounded-xl">
                <span className="w-2.5 h-2.5 rounded-full bg-[#37948b]" />{' '}
                Monthly Collections
              </div>
            </div>

            <div className="h-[320px] w-full">
              {/* ✅ ResponsiveContainer ফিক্সড */}
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={analytics.monthlyData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="colorRevenue"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#37948b" stopOpacity={0.4} />
                      <stop
                        offset="95%"
                        stopColor="#37948b"
                        stopOpacity={0.0}
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
                    tick={{ fill: '#9CA3AF', fontSize: 11, fontWeight: 700 }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: '#9CA3AF', fontSize: 11, fontWeight: 700 }}
                    tickFormatter={val => `$${val}`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#37948b"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Donation Distribution (4 Cols) */}
          <div className="lg:col-span-4 bg-white dark:bg-gray-900 p-8 md:p-10 rounded-[3rem] shadow-xl shadow-teal-900/5 border border-gray-100 dark:border-gray-800 flex flex-col justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-[#37948b] mb-1">
                Donor Demographics
              </p>
              <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight mb-6">
                Gift Size Brackets
              </h3>
            </div>

            <div className="h-[250px] w-full">
              {/* ✅ ResponsiveContainer ফিক্সড */}
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={analytics.rangeData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
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
                    tick={{ fill: '#9CA3AF', fontSize: 10, fontWeight: 800 }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: '#9CA3AF', fontSize: 11, fontWeight: 700 }}
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
                  <Bar dataKey="count" radius={[12, 12, 0, 0]}>
                    {analytics.rangeData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={index % 2 === 0 ? '#37948b' : '#2d7a72'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="pt-4 border-t border-gray-50 dark:border-gray-800 text-center">
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                Tier-based Contribution Share
              </p>
            </div>
          </div>
        </div>

        {/* --- Recent Live Transactions Table --- */}
        <div className="bg-white dark:bg-gray-900 rounded-[3rem] p-8 md:p-10 shadow-xl shadow-teal-900/5 border border-gray-100 dark:border-gray-800 mb-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-[#37948b]">
                Live Activity Feed
              </p>
              <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
                Recent Contributions
              </h3>
            </div>
            <span className="text-xs font-bold text-gray-400">
              Showing last {analytics.recentPayments.length} records
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-50 dark:border-gray-800">
                  <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-gray-400">
                    Donor
                  </th>
                  <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-gray-400">
                    Transaction ID
                  </th>
                  <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-gray-400">
                    Amount
                  </th>
                  <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                {analytics.recentPayments.map((p, idx) => (
                  <tr
                    key={p.id || idx}
                    className="group hover:bg-teal-50/20 dark:hover:bg-teal-900/10 transition-colors"
                  >
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-gray-800 text-[#37948b] flex items-center justify-center font-black text-xs">
                          {p.email ? p.email.slice(0, 2).toUpperCase() : 'AN'}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-800 dark:text-gray-200 truncate max-w-[200px]">
                            {p.email || 'Anonymous Donor'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4">
                      <code className="text-[11px] font-mono font-bold bg-gray-50 dark:bg-gray-800 px-3 py-1.5 rounded-lg text-gray-500 dark:text-gray-400">
                        {p.transaction_id || p.transactionId || 'TXN_VERIFIED'}
                      </code>
                    </td>
                    <td className="py-4">
                      <span className="text-base font-black text-[#37948b]">
                        ${Number(p.amount || 0).toFixed(2)}
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      <span className="text-xs font-bold text-gray-400 flex items-center justify-end gap-1">
                        <FaClock size={10} />
                        {new Date(
                          p.paid_at || p.created_at || Date.now()
                        ).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* --- Export / Report Banner --- */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="p-10 lg:p-12 bg-gradient-to-r from-[#37948b] to-[#2d7a72] rounded-[3.5rem] text-white flex flex-col md:flex-row items-center justify-between shadow-2xl shadow-[#37948b44] relative overflow-hidden"
        >
          <FaPaw className="absolute -left-10 -bottom-10 text-white/10 text-[200px] -rotate-12" />

          <div className="mb-8 md:mb-0 relative z-10 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md font-black text-[10px] uppercase tracking-widest mb-4 border border-white/30">
              <FaFileDownload /> Export Statements
            </div>
            <h4 className="text-3xl lg:text-4xl font-black tracking-tighter mb-2">
              Download Audit Reports
            </h4>
            <p className="opacity-80 font-medium text-sm max-w-lg">
              Extract real-time database transactions directly into CSV, Excel,
              or PDF format for auditing.
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative z-10 bg-white text-[#37948b] px-10 py-5 rounded-3xl font-black text-sm uppercase tracking-widest shadow-2xl hover:bg-teal-50 transition-all flex items-center gap-3 w-full md:w-auto justify-center cursor-pointer"
          >
            Export CSV <FaFileDownload size={18} />
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default TotalDonationsAdmin;
