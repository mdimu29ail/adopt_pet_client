import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import Swal from 'sweetalert2';
import {
  FaUserShield,
  FaSearch,
  FaUserEdit,
  FaTrashAlt,
  FaUserCircle,
  FaUserTag,
  FaPaw,
} from 'react-icons/fa';
import moment from 'moment';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

import useAxiosSecure from '../../hooks/useAxiosSecure';

const MakeAdmin = () => {
  const [search, setSearch] = useState('');
  const axiosSecure = useAxiosSecure();

  // ১. ইউজার ডাটা ফেচিং
  const {
    data: users = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const res = await axiosSecure.get('/users');
      return res.data;
    },
    staleTime: 1000 * 60 * 5,
  });

  // ২. সার্চ ফিল্টারিং
  const filteredUsers = useMemo(() => {
    const s = search.toLowerCase().trim();
    return users.filter(user => {
      const name = (user.name || '').toLowerCase();
      const email = (user.email || '').toLowerCase();
      return name.includes(s) || email.includes(s);
    });
  }, [search, users]);

  // ৩. রোল পরিবর্তন লজিক
  const toggleRole = async (email, currentRole) => {
    const isPromote = currentRole !== 'admin';

    const result = await Swal.fire({
      title: isPromote ? 'Promote to Admin?' : 'Demote to User?',
      text: `Are you sure you want to change the role for ${email}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: isPromote ? '#37948b' : '#f59e0b',
      cancelButtonColor: '#ef4444',
      confirmButtonText: isPromote ? 'Yes, Promote' : 'Yes, Demote',
      background: '#FFFBF7',
    });

    if (!result.isConfirmed) return;

    try {
      const res = await axiosSecure.patch('/users/role', {
        email,
        role: isPromote ? 'admin' : 'user',
      });

      if (res.data.success) {
        Swal.fire({
          icon: 'success',
          title: 'Role Updated!',
          text: `${email} is now ${isPromote ? 'an Admin' : 'a standard User'}.`,
          confirmButtonColor: '#37948b',
        });
        refetch();
      }
    } catch (err) {
      Swal.fire('Error', 'Failed to update role. Permission denied.', 'error');
    }
  };

  if (isLoading) {
    return (
      <div className="w-full min-h-screen bg-[#FFFBF7] pt-28 px-6 md:px-12">
        <Skeleton height={50} width={400} borderRadius={20} className="mb-10" />
        <div className="bg-white rounded-[2.5rem] p-8 shadow-xl">
          <Skeleton height={40} count={8} className="mb-4" borderRadius={12} />
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
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#37948b]/10 text-[#37948b] font-black text-xs uppercase tracking-[0.2em] mb-4"
            >
              <FaUserShield className="animate-pulse" /> Access Control
            </motion.div>
            <h2 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white leading-tight tracking-tighter">
              User <span className="text-[#37948b]">Management</span>
            </h2>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:max-w-md group">
            <FaSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#37948b] transition-colors" />
            <input
              type="text"
              placeholder="Search by email or name..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-14 pr-6 py-4 bg-white dark:bg-gray-900 rounded-2xl outline-none border-2 border-transparent focus:border-[#37948b] shadow-xl shadow-teal-900/5 transition-all font-bold text-gray-700 dark:text-white"
            />
          </div>
        </div>

        {/* --- Table Container --- */}
        <div className="bg-white dark:bg-gray-900 rounded-[3rem] shadow-2xl shadow-teal-900/5 border border-gray-100 dark:border-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800/50">
                  <th className="p-8 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                    User Details
                  </th>
                  <th className="p-8 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                    Current Role
                  </th>
                  <th className="p-8 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                    Last Active
                  </th>
                  <th className="p-8 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                <AnimatePresence>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user, index) => (
                      <motion.tr
                        key={user.id || user._id || user.email}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="group hover:bg-teal-50/30 dark:hover:bg-teal-900/10 transition-colors"
                      >
                        {/* User Info */}
                        <td className="p-8">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-gray-800 flex items-center justify-center text-[#37948b] shadow-sm">
                              {user.image ? (
                                <img
                                  src={user.image}
                                  className="w-full h-full rounded-2xl object-cover"
                                />
                              ) : (
                                <FaUserCircle size={24} />
                              )}
                            </div>
                            <div>
                              <p className="font-black text-gray-800 dark:text-white text-base leading-none mb-1">
                                {user.name || 'Anonymous User'}
                              </p>
                              <p className="text-xs font-bold text-gray-400">
                                {user.email}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Role Badge */}
                        <td className="p-8">
                          <span
                            className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                              user.role === 'admin'
                                ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                : 'bg-gray-100 text-gray-500 border-gray-200'
                            }`}
                          >
                            {user.role || 'user'}
                          </span>
                        </td>

                        {/* Updated At */}
                        <td className="p-8 text-sm font-bold text-gray-500 dark:text-gray-400">
                          {user.updated_at || user.updatedAt
                            ? moment(
                                user.updated_at || user.updatedAt,
                              ).fromNow()
                            : 'Never'}
                        </td>

                        {/* Action Buttons */}
                        <td className="p-8 text-right">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => toggleRole(user.email, user.role)}
                            className={`px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-md ${
                              user.role === 'admin'
                                ? 'bg-amber-500 text-white hover:bg-amber-600'
                                : 'bg-[#37948b] text-white hover:bg-[#2d7a72]'
                            }`}
                          >
                            {user.role === 'admin'
                              ? 'Demote User'
                              : 'Make Admin'}
                          </motion.button>
                        </td>
                      </motion.tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="p-20 text-center">
                        <FaPaw
                          size={50}
                          className="mx-auto text-gray-100 mb-4"
                        />
                        <p className="text-gray-400 font-bold uppercase tracking-widest">
                          No users match your search
                        </p>
                      </td>
                    </tr>
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default MakeAdmin;
