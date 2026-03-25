import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import {
  FaHistory,
  FaPaw,
  FaClock,
  FaCreditCard,
  FaDollarSign,
  FaExternalLinkAlt,
} from 'react-icons/fa';

import useAuth from '../../hooks/useAuth';
import useAxiosSecure from '../../hooks/useAxiosSecure';

const formatDate = iso => {
  if (!iso) return 'N/A';
  return new Date(iso).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const PaymentHistory = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { isPending, data: payments = [] } = useQuery({
    queryKey: ['payments', user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/payments?email=${user?.email}`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  if (isPending) {
    return (
      <div className="w-full min-h-screen bg-[#FFFBF7] pt-28 px-6 md:px-12">
        <Skeleton height={50} width={300} borderRadius={15} className="mb-10" />
        <div className="bg-white rounded-[2rem] p-8 shadow-xl">
          <Skeleton height={40} count={6} className="mb-4" borderRadius={10} />
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
        <div className="mb-12 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#37948b]/10 text-[#37948b] font-black text-xs uppercase tracking-[0.2em] mb-4">
            <FaHistory className="animate-pulse" /> Financial Logs
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white leading-tight tracking-tighter">
            Donation <br />
            <span className="text-[#37948b]">History</span>
          </h2>
          <p className="text-gray-500 font-bold mt-2 uppercase tracking-widest text-xs">
            Total Contributions: {payments.length}
          </p>
        </div>

        {/* --- Table Container --- */}
        <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-2xl shadow-teal-900/5 border border-gray-100 dark:border-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800/50">
                  <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                    #
                  </th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                    Campaign / ID
                  </th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                    Amount
                  </th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                    Transaction ID
                  </th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 text-right">
                    Paid At
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                {payments.length > 0 ? (
                  payments.map((p, index) => (
                    <motion.tr
                      key={p.transaction_id || p.transactionId}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="group hover:bg-teal-50/50 dark:hover:bg-teal-900/10 transition-colors"
                    >
                      <td className="p-6 text-sm font-black text-gray-400">
                        {index + 1}
                      </td>
                      <td className="p-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-gray-800 flex items-center justify-center text-[#37948b]">
                            <FaPaw size={14} />
                          </div>
                          <div>
                            <p className="text-sm font-black text-gray-800 dark:text-white truncate max-w-[150px]">
                              {p.donationId ||
                                p.donation_id ||
                                'Global Support'}
                            </p>
                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                              Donation drive
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-6">
                        <div className="flex items-center gap-1 text-[#37948b] font-black text-lg">
                          <FaDollarSign size={14} />
                          <span>{p.amount}</span>
                        </div>
                      </td>
                      <td className="p-6">
                        <div className="flex items-center gap-2">
                          <code className="bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-lg text-[11px] font-bold text-gray-500 dark:text-gray-400">
                            {p.transaction_id || p.transactionId}
                          </code>
                          <FaCreditCard className="text-gray-300" size={12} />
                        </div>
                      </td>
                      <td className="p-6 text-right">
                        <div className="flex flex-col items-end">
                          <div className="flex items-center gap-2 text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                            <FaClock className="text-[#37948b]" size={10} />
                            {formatDate(p.paid_at || p.paid_at_string)}
                          </div>
                          <span className="text-[9px] font-black text-green-500 uppercase tracking-widest bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded-md">
                            Verified
                          </span>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="p-20 text-center">
                      <div className="flex flex-col items-center">
                        <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center mb-4 text-gray-300">
                          <FaHistory size={32} />
                        </div>
                        <h3 className="text-xl font-black text-gray-400 uppercase tracking-widest">
                          No History Found
                        </h3>
                        <p className="text-gray-400 text-sm mt-2">
                          Any donations you make will appear here.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* --- Export / Footer Action --- */}
        <div className="mt-8 flex justify-end">
          <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-[#37948b] transition-colors">
            <FaExternalLinkAlt /> Download Statements
          </button>
        </div>
      </motion.div>

      {/* Decorative Decoration */}
      <div className="fixed -bottom-20 -right-20 text-[#37948b]/5 pointer-events-none -z-10">
        <FaPaw size={500} className="-rotate-12" />
      </div>
    </div>
  );
};

export default PaymentHistory;
