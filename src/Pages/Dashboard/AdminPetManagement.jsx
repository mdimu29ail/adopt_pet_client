import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import {
  FaPaw,
  FaCheck,
  FaTimes,
  FaEdit,
  FaTrashAlt,
  FaSearch,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaUser,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
} from 'react-icons/fa';
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { supabase } from '../../Supabase/supabase.config';

const AdminPetManagement = () => {
  const [activeTab, setActiveTab] = useState('all'); // all, pending, available, rejected
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // ১. Supabase থেকে সব পেটের ডাটা ফেচ করা
  const { data: pets = [], isLoading } = useQuery({
    queryKey: ['admin-all-pets-manage'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pets')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw new Error(error.message);
      return data || [];
    },
  });

  // ✅ ২. Approve লজিক (Status -> 'Available')
  const handleApprove = async id => {
    try {
      const { error } = await supabase
        .from('pets')
        .update({ status: 'Available' })
        .eq('id', id);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['admin-all-pets-manage'] });
      Swal.fire({
        icon: 'success',
        title: 'Pet Approved!',
        text: 'This pet is now published and available for adoption.',
        timer: 1500,
        showConfirmButton: false,
        background: '#FFFBF7',
      });
    } catch (err) {
      console.error('Approve Error:', err);
      Swal.fire('Error', err.message || 'Failed to approve pet.', 'error');
    }
  };

  // ❌ ৩. Reject লজিক (Status -> 'Rejected')
  const handleReject = async id => {
    Swal.fire({
      title: 'Reject Pet Listing?',
      text: 'This listing will be marked as rejected.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Reject it!',
      background: '#FFFBF7',
    }).then(async result => {
      if (result.isConfirmed) {
        try {
          const { error } = await supabase
            .from('pets')
            .update({ status: 'Rejected' })
            .eq('id', id);

          if (error) throw error;

          queryClient.invalidateQueries({
            queryKey: ['admin-all-pets-manage'],
          });
          Swal.fire({
            icon: 'success',
            title: 'Rejected!',
            text: 'Pet listing has been rejected.',
            confirmButtonColor: '#37948b',
          });
        } catch (err) {
          console.error('Reject Error:', err);
          Swal.fire('Error', err.message || 'Failed to reject pet.', 'error');
        }
      }
    });
  };

  // 🗑️ ৪. Delete লজিক
  const handleDelete = async id => {
    Swal.fire({
      title: 'Delete Permanently?',
      text: 'This pet listing will be completely removed from the database!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Delete!',
      background: '#FFFBF7',
    }).then(async result => {
      if (result.isConfirmed) {
        try {
          const { error } = await supabase.from('pets').delete().eq('id', id);

          if (error) throw error;

          queryClient.invalidateQueries({
            queryKey: ['admin-all-pets-manage'],
          });
          Swal.fire(
            'Deleted!',
            'Pet has been removed from database.',
            'success'
          );
        } catch (err) {
          console.error('Delete Error:', err);
          Swal.fire('Error', err.message || 'Failed to delete pet.', 'error');
        }
      }
    });
  };

  // ফিল্টারিং লজিক
  const filteredPets = pets.filter(pet => {
    const matchesSearch =
      pet.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pet.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pet.owner_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pet.location?.toLowerCase().includes(searchTerm.toLowerCase());

    const status = pet.status?.toLowerCase() || 'pending';

    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'pending') return matchesSearch && status === 'pending';
    if (activeTab === 'available')
      return matchesSearch && status === 'available';
    if (activeTab === 'rejected') return matchesSearch && status === 'rejected';
    if (activeTab === 'adopted') return matchesSearch && status === 'adopted';
    return matchesSearch;
  });

  const pendingCount = pets.filter(
    p => p.status?.toLowerCase() === 'pending'
  ).length;
  const availableCount = pets.filter(
    p => p.status?.toLowerCase() === 'available'
  ).length;
  const rejectedCount = pets.filter(
    p => p.status?.toLowerCase() === 'rejected'
  ).length;

  return (
    <div className="w-full min-h-screen bg-[#FFFBF7] dark:bg-gray-950 pt-28 pb-20 px-4 md:px-10 lg:px-16 font-sans">
      <div className="max-w-[1440px] mx-auto">
        {/* --- Header Section --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#37948b]/10 text-[#37948b] font-black text-xs uppercase tracking-[0.2em] mb-4 border border-[#37948b]/20">
              <FaPaw className="animate-bounce" /> Pet Moderation Control
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white tracking-tighter">
              Manage & Approve <span className="text-[#37948b]">Pets</span>
            </h2>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, type, email..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 outline-none focus:border-[#37948b] text-xs font-bold dark:text-white shadow-sm"
            />
          </div>
        </div>

        {/* --- Status Navigation Tabs --- */}
        <div className="flex flex-wrap items-center gap-3 mb-8">
          {[
            { id: 'all', label: 'All Listings', count: pets.length },
            {
              id: 'pending',
              label: 'Pending Approval',
              count: pendingCount,
              highlight: true,
            },
            {
              id: 'available',
              label: 'Approved (Available)',
              count: availableCount,
            },
            { id: 'rejected', label: 'Rejected', count: rejectedCount },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center gap-2.5 cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[#37948b] text-white shadow-lg shadow-[#37948b33]'
                  : 'bg-white dark:bg-gray-900 text-gray-500 border border-gray-100 dark:border-gray-800 hover:border-[#37948b]'
              }`}
            >
              {tab.label}
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] ${
                  activeTab === tab.id
                    ? 'bg-white/20 text-white'
                    : tab.highlight && tab.count > 0
                      ? 'bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-400'
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* --- Data Table --- */}
        <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-2xl shadow-teal-900/5 border border-gray-100 dark:border-gray-800 overflow-hidden">
          {isLoading ? (
            <div className="p-8 space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} height={70} borderRadius={20} />
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800">
                    <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-400">
                      Pet Info
                    </th>
                    <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-400">
                      Submitted By
                    </th>
                    <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-400">
                      Location
                    </th>
                    <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-400 text-center">
                      Status
                    </th>
                    <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">
                      Moderation Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                  <AnimatePresence mode="popLayout">
                    {filteredPets.length === 0 ? (
                      <tr>
                        <td
                          colSpan="5"
                          className="p-16 text-center text-gray-400 font-bold uppercase tracking-widest text-xs"
                        >
                          No pet records found in this category
                        </td>
                      </tr>
                    ) : (
                      filteredPets.map((pet, idx) => {
                        const status = pet.status?.toLowerCase() || 'pending';
                        const isPending = status === 'pending';
                        const isAvailable = status === 'available';
                        const isRejected = status === 'rejected';

                        return (
                          <motion.tr
                            key={pet.id}
                            layout
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="group hover:bg-teal-50/20 dark:hover:bg-teal-900/10 transition-colors"
                          >
                            {/* Pet Details */}
                            <td className="p-6">
                              <div className="flex items-center gap-4">
                                <img
                                  src={
                                    pet.image_url ||
                                    'https://via.placeholder.com/100'
                                  }
                                  alt={pet.name}
                                  className="w-14 h-14 rounded-2xl object-cover border-2 border-white dark:border-gray-700 shadow-md group-hover:scale-105 transition-transform"
                                />
                                <div>
                                  <h4 className="font-black text-gray-900 dark:text-white text-base">
                                    {pet.name}
                                  </h4>
                                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                    {pet.type} • {pet.breed || 'Mixed'} •{' '}
                                    {pet.age}
                                  </p>
                                </div>
                              </div>
                            </td>

                            {/* Owner */}
                            <td className="p-6">
                              <p className="text-xs font-bold text-gray-800 dark:text-gray-200">
                                {pet.owner_name || 'Anonymous User'}
                              </p>
                              <p className="text-[10px] text-gray-400 font-medium">
                                {pet.owner_email}
                              </p>
                            </td>

                            {/* Location */}
                            <td className="p-6">
                              <span className="text-xs font-bold text-gray-600 dark:text-gray-300 flex items-center gap-1.5 truncate max-w-[180px]">
                                <FaMapMarkerAlt
                                  className="text-[#37948b]"
                                  size={10}
                                />
                                {pet.location || 'N/A'}
                              </span>
                            </td>

                            {/* Status */}
                            <td className="p-6 text-center">
                              <span
                                className={`inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                                  isAvailable
                                    ? 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-900/40'
                                    : isPending
                                      ? 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-950/40 dark:border-amber-900/40 animate-pulse'
                                      : isRejected
                                        ? 'bg-red-50 text-red-600 border-red-200 dark:bg-red-950/40 dark:border-red-900/40'
                                        : 'bg-gray-100 text-gray-500 border-gray-200'
                                }`}
                              >
                                {isAvailable && <FaCheckCircle size={10} />}
                                {isPending && <FaClock size={10} />}
                                {isRejected && <FaTimesCircle size={10} />}
                                {pet.status || 'Pending'}
                              </span>
                            </td>

                            {/* Admin Action Buttons */}
                            <td className="p-6 text-right">
                              <div className="flex items-center justify-end gap-2">
                                {/* Approve Button */}
                                {!isAvailable && (
                                  <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => handleApprove(pet.id)}
                                    title="Approve Listing"
                                    className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all shadow-sm cursor-pointer border border-emerald-100 dark:border-emerald-900/40"
                                  >
                                    <FaCheck size={12} />
                                  </motion.button>
                                )}

                                {/* Reject Button */}
                                {!isRejected && (
                                  <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => handleReject(pet.id)}
                                    title="Reject Listing"
                                    className="p-2.5 rounded-xl bg-orange-50 dark:bg-orange-950/40 text-orange-600 hover:bg-orange-600 hover:text-white transition-all shadow-sm cursor-pointer border border-orange-100 dark:border-orange-900/40"
                                  >
                                    <FaTimes size={12} />
                                  </motion.button>
                                )}

                                {/* Edit Button */}
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() =>
                                    navigate(`/dashboard/edit-pet/${pet.id}`)
                                  }
                                  title="Edit Information"
                                  className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 hover:bg-blue-600 hover:text-white transition-all shadow-sm cursor-pointer border border-blue-100 dark:border-blue-900/40"
                                >
                                  <FaEdit size={12} />
                                </motion.button>

                                {/* Delete Button */}
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => handleDelete(pet.id)}
                                  title="Delete Permanently"
                                  className="p-2.5 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-600 hover:bg-red-600 hover:text-white transition-all shadow-sm cursor-pointer border border-red-100 dark:border-red-900/40"
                                >
                                  <FaTrashAlt size={12} />
                                </motion.button>
                              </div>
                            </td>
                          </motion.tr>
                        );
                      })
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

export default AdminPetManagement;
