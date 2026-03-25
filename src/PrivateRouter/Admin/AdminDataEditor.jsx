import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import useUserRole from '../../hooks/useUserRole';
import {
  FaUsers,
  FaPaw,
  FaHeart,
  FaDonate,
  FaCreditCard,
  FaTrashAlt,
  FaEdit,
  FaSync,
  FaDatabase,
} from 'react-icons/fa';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const AdminDataEditor = () => {
  const axiosSecure = useAxiosSecure();
  const [role, roleLoading] = useUserRole(); // Array destructuring for your custom hook

  const [activeTab, setActiveTab] = useState('users');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    users: [],
    pets: [],
    adoptions: [],
    campaigns: [],
    payments: [],
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [usersRes, petsRes, adoptionsRes, campaignsRes, paymentsRes] =
        await Promise.all([
          axiosSecure.get('/admin/users'),
          axiosSecure.get('/admin/pets'),
          axiosSecure.get('/admin/adoptions'), // নিশ্চিত করুন এই রুটগুলো ব্যাকএন্ডে আছে
          axiosSecure.get('/admin/campaigns'),
          axiosSecure.get('/admin/payments'), // অথবা শুধু '/payments' যদি অ্যাডমিন রুট না থাকে
        ]);
      setData({
        users: usersRes.data || [],
        pets: petsRes.data || [],
        adoptions: adoptionsRes.data || [],
        campaigns: campaignsRes.data || [],
        payments: paymentsRes.data || [],
      });
    } catch (err) {
      console.error('Fetch error:', err);
      Swal.fire({
        icon: 'error',
        title: 'Sync Failed',
        text: 'Could not load admin data from the server.',
        confirmButtonColor: '#37948b',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (role === 'admin') fetchData();
  }, [role]);

  if (roleLoading) {
    return (
      <div className="min-h-screen w-full bg-[#FFFBF7] pt-28 px-6 md:px-12">
        <Skeleton height={50} width={400} borderRadius={15} className="mb-10" />
        <div className="flex gap-4 mb-8">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} height={50} width={120} borderRadius={20} />
          ))}
        </div>
        <Skeleton height={400} borderRadius={40} />
      </div>
    );
  }

  if (role !== 'admin') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FFFBF7] p-6 text-center">
        <FaDatabase className="text-6xl text-red-200 mb-4 animate-pulse" />
        <h2 className="text-3xl font-black text-red-500 uppercase tracking-widest">
          Access Denied
        </h2>
        <p className="text-gray-500 font-bold mt-2">
          You do not have permission to view this page.
        </p>
      </div>
    );
  }

  const tabs = [
    {
      id: 'users',
      label: 'Users',
      icon: <FaUsers />,
      count: data.users.length,
    },
    { id: 'pets', label: 'Pets', icon: <FaPaw />, count: data.pets.length },
    {
      id: 'adoptions',
      label: 'Adoptions',
      icon: <FaHeart />,
      count: data.adoptions.length,
    },
    {
      id: 'campaigns',
      label: 'Campaigns',
      icon: <FaDonate />,
      count: data.campaigns.length,
    },
    {
      id: 'payments',
      label: 'Payments',
      icon: <FaCreditCard />,
      count: data.payments.length,
    },
  ];

  // Helper to render table headers
  const renderHeaders = () => {
    const headers = {
      users: ['User Info', 'Role', 'Joined Date', 'Actions'],
      pets: ['Pet Details', 'Species', 'Added By', 'Actions'],
      adoptions: ['Applicant', 'Target Pet', 'Status', 'Actions'],
      campaigns: ['Campaign Title', 'Goal', 'Deadline', 'Actions'],
      payments: ['Transaction ID', 'Donor', 'Amount', 'Date'],
    };

    return (
      <tr>
        <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-tl-3xl">
          #
        </th>
        {headers[activeTab].map((h, i) => (
          <th
            key={h}
            className={`p-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 bg-gray-50 dark:bg-gray-800/50 ${i === headers[activeTab].length - 1 ? 'rounded-tr-3xl text-right' : 'text-left'}`}
          >
            {h}
          </th>
        ))}
      </tr>
    );
  };

  return (
    <div className="w-full min-h-screen bg-[#FFFBF7] dark:bg-gray-950 pt-28 pb-20 px-4 md:px-10 lg:px-16 overflow-hidden relative">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 p-10 opacity-5 text-[#37948b] pointer-events-none -z-0">
        <FaDatabase size={400} className="rotate-12" />
      </div>

      <div className="max-w-[1440px] mx-auto relative z-10">
        {/* --- Header Section --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#37948b]/10 text-[#37948b] font-black text-xs uppercase tracking-[0.2em] mb-4"
            >
              <FaDatabase className="animate-pulse" /> Central Database
            </motion.div>
            <h2 className="text-5xl md:text-6xl font-black text-gray-900 dark:text-white leading-tight tracking-tighter">
              Data <span className="text-[#37948b]">Editor</span>
            </h2>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={fetchData}
            disabled={loading}
            className="flex items-center gap-3 bg-white dark:bg-gray-900 text-[#37948b] px-8 py-4 rounded-2xl font-black shadow-xl border-2 border-[#37948b] hover:bg-teal-50 dark:hover:bg-gray-800 transition-all uppercase tracking-widest text-xs disabled:opacity-50"
          >
            <FaSync className={loading ? 'animate-spin' : ''} />{' '}
            {loading ? 'Syncing...' : 'Sync Database'}
          </motion.button>
        </div>

        {/* --- Modern Tabs Navigation --- */}
        <div className="flex flex-wrap items-center gap-3 mb-10 overflow-x-auto no-scrollbar pb-2">
          {tabs.map(tab => (
            <motion.button
              key={tab.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex items-center gap-2.5 px-6 py-3.5 rounded-full font-black text-xs uppercase tracking-widest transition-all duration-300 whitespace-nowrap shadow-sm
                ${
                  activeTab === tab.id
                    ? 'bg-[#37948b] text-white shadow-lg shadow-[#37948b44]'
                    : 'bg-white dark:bg-gray-900 text-gray-500 hover:text-[#37948b] border border-gray-100 dark:border-gray-800 hover:bg-teal-50 dark:hover:bg-gray-800'
                }
              `}
            >
              <span className="text-lg">{tab.icon}</span>
              {tab.label}
              <span
                className={`ml-2 px-2 py-0.5 rounded-full text-[9px] ${activeTab === tab.id ? 'bg-white/20' : 'bg-gray-100 dark:bg-gray-800'}`}
              >
                {tab.count}
              </span>
            </motion.button>
          ))}
        </div>

        {/* --- Data Table Card --- */}
        <div className="bg-white dark:bg-gray-900 rounded-[3rem] shadow-2xl shadow-teal-900/5 border border-gray-100 dark:border-gray-800 overflow-hidden">
          {loading ? (
            <div className="p-10 space-y-6">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} height={60} borderRadius={15} />
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>{renderHeaders()}</thead>
                <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                  <AnimatePresence mode="wait">
                    {data[activeTab].length === 0 ? (
                      <motion.tr
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <td colSpan="5" className="p-20 text-center">
                          <FaDatabase className="mx-auto text-6xl text-gray-100 dark:text-gray-800 mb-6" />
                          <h3 className="text-xl font-black text-gray-400 uppercase tracking-widest">
                            No Records Found
                          </h3>
                        </td>
                      </motion.tr>
                    ) : (
                      data[activeTab].map((item, idx) => (
                        <motion.tr
                          key={item.id || item._id || idx}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className="group hover:bg-teal-50/30 dark:hover:bg-teal-900/10 transition-colors"
                        >
                          <td className="p-6 text-sm font-black text-gray-400">
                            {idx + 1}
                          </td>

                          {/* --- Users Row --- */}
                          {activeTab === 'users' && (
                            <>
                              <td className="p-6">
                                <div className="flex items-center gap-4">
                                  <img
                                    src={
                                      item.image ||
                                      'https://via.placeholder.com/100'
                                    }
                                    className="w-10 h-10 rounded-xl object-cover bg-gray-100"
                                    alt="user"
                                  />
                                  <div>
                                    <p className="font-black text-gray-800 dark:text-white leading-none mb-1">
                                      {item.name || 'Unnamed'}
                                    </p>
                                    <p className="text-[10px] font-bold text-gray-400">
                                      {item.email}
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td className="p-6">
                                <span
                                  className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${item.role === 'admin' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-gray-100 text-gray-500 border-gray-200'}`}
                                >
                                  {item.role || 'user'}
                                </span>
                              </td>
                              <td className="p-6 text-sm font-bold text-gray-500">
                                {item.created_at
                                  ? new Date(
                                      item.created_at,
                                    ).toLocaleDateString()
                                  : 'N/A'}
                              </td>
                            </>
                          )}

                          {/* --- Pets Row --- */}
                          {activeTab === 'pets' && (
                            <>
                              <td className="p-6">
                                <div className="flex items-center gap-4">
                                  <img
                                    src={
                                      item.image_url ||
                                      'https://via.placeholder.com/100'
                                    }
                                    className="w-12 h-12 rounded-2xl object-cover shadow-sm"
                                    alt="pet"
                                  />
                                  <p className="font-black text-gray-800 dark:text-white">
                                    {item.name}
                                  </p>
                                </div>
                              </td>
                              <td className="p-6 text-xs font-black uppercase tracking-widest text-gray-500">
                                {item.type}
                              </td>
                              <td className="p-6 text-sm font-bold text-gray-500">
                                {item.owner_name ||
                                  item.owner_email ||
                                  'System'}
                              </td>
                            </>
                          )}

                          {/* --- Adoptions Row --- */}
                          {activeTab === 'adoptions' && (
                            <>
                              <td className="p-6 font-black text-gray-800 dark:text-white">
                                {item.user_name || item.name || 'Anonymous'}
                              </td>
                              <td className="p-6 text-xs font-bold text-gray-500">
                                {item.pet_id || item.petId}
                              </td>
                              <td className="p-6">
                                <span
                                  className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${item.status?.toLowerCase() === 'accepted' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}
                                >
                                  {item.status || 'Pending'}
                                </span>
                              </td>
                            </>
                          )}

                          {/* --- Campaigns Row --- */}
                          {activeTab === 'campaigns' && (
                            <>
                              <td className="p-6 font-black text-gray-800 dark:text-white truncate max-w-[200px]">
                                {item.title || item.short_description}
                              </td>
                              <td className="p-6 font-black text-[#37948b]">
                                ${Number(item.max_donation).toLocaleString()}
                              </td>
                              <td className="p-6 text-sm font-bold text-gray-500">
                                {item.end_date}
                              </td>
                            </>
                          )}

                          {/* --- Payments Row --- */}
                          {activeTab === 'payments' && (
                            <>
                              <td className="p-6 font-mono text-[11px] font-bold text-gray-400 bg-gray-50 dark:bg-gray-800 px-3 py-1 rounded-lg w-fit block mt-4">
                                {item.transaction_id || item.transactionId}
                              </td>
                              <td className="p-6 text-sm font-bold text-gray-600 dark:text-gray-300">
                                {item.email}
                              </td>
                              <td className="p-6 font-black text-[#37948b] text-lg">
                                ${Number(item.amount).toFixed(2)}
                              </td>
                              <td className="p-6 text-right text-xs font-bold text-gray-400">
                                {new Date(
                                  item.paid_at || item.paid_at_string,
                                ).toLocaleDateString()}
                              </td>
                            </>
                          )}

                          {/* --- Global Actions (For all except payments) --- */}
                          {activeTab !== 'payments' && (
                            <td className="p-6 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-gray-800 text-amber-500 flex items-center justify-center hover:bg-amber-500 hover:text-white transition-all shadow-sm"
                                >
                                  <FaEdit size={14} />
                                </motion.button>
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  className="w-10 h-10 rounded-xl bg-red-50 dark:bg-gray-800 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-sm"
                                >
                                  <FaTrashAlt size={14} />
                                </motion.button>
                              </div>
                            </td>
                          )}
                        </motion.tr>
                      ))
                    )}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDataEditor;
