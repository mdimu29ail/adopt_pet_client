import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import useAuth from '../../hooks/useAuth';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import Loading from '../../Loading/Loading';
import {
  FaHistory,
  FaHandHoldingHeart,
  FaCreditCard,
  FaClock,
  FaDollarSign,
  FaPaw,
} from 'react-icons/fa';

const MyDonations = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const {
    data: payments = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['my-donations', user?.email],
    queryFn: async () => {
      if (!user?.email) return [];
      // ব্যাকএন্ড থেকে পেমেন্ট হিস্ট্রি আনা হচ্ছে
      const res = await axiosSecure.get(
        `/payments?email=${encodeURIComponent(user.email)}`,
      );
      return res.data;
    },
    enabled: !!user?.email,
  });

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading />
      </div>
    );

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="bg-red-50 text-red-600 p-6 rounded-[2rem] border border-red-100 font-bold text-center italic">
          ⚠️ Failed to load donation data. Please check your Supabase columns.
        </div>
      </div>
    );
  }

  const totalAmount = payments.reduce(
    (sum, donation) => sum + Number(donation.amount || 0),
    0,
  );

  return (
    <div className="w-full min-h-screen bg-[#FFFBF7] dark:bg-gray-950 pt-28 pb-20 px-4 md:px-10 lg:px-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-[1440px] mx-auto"
      >
        {/* --- Header --- */}
        <div className="flex flex-col lg:flex-row justify-between items-center gap-8 mb-16">
          <div className="text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#37948b]/10 text-[#37948b] font-black text-xs uppercase tracking-[0.2em] mb-4"
            >
              <FaHistory /> Donation Dashboard
            </motion.div>
            <h2 className="text-5xl md:text-7xl font-black text-gray-900 dark:text-white tracking-tighter">
              Contribution <span className="text-[#37948b]">Logs</span>
            </h2>
          </div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] shadow-2xl shadow-teal-900/5 border border-gray-100 dark:border-gray-800 flex items-center gap-6 min-w-[320px]"
          >
            <div className="w-16 h-16 rounded-2xl bg-[#37948b] flex items-center justify-center text-white shadow-lg">
              <FaHandHoldingHeart size={30} />
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                Total Donated
              </p>
              <h3 className="text-4xl font-black text-gray-900 dark:text-white">
                ${totalAmount.toLocaleString()}
              </h3>
            </div>
          </motion.div>
        </div>

        {/* --- Table --- */}
        {payments.length === 0 ? (
          <div className="text-center py-32 bg-white dark:bg-gray-900 rounded-[3rem] shadow-xl border-2 border-dashed border-gray-100">
            <FaPaw className="mx-auto text-6xl text-gray-100 mb-6" />
            <h3 className="text-2xl font-black text-gray-400 uppercase tracking-widest">
              No donations found
            </h3>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-900 rounded-[3rem] shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-800/50">
                    <th className="p-8 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                      Transaction Details
                    </th>
                    <th className="p-8 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                      Amount
                    </th>
                    <th className="p-8 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                      Date
                    </th>
                    <th className="p-8 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 text-right">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                  {payments.map((p, index) => (
                    <tr
                      key={p.id}
                      className="group hover:bg-teal-50/30 dark:hover:bg-teal-900/10 transition-colors"
                    >
                      <td className="p-8">
                        <div className="flex items-center gap-4">
                          <FaCreditCard className="text-gray-300" />
                          <div>
                            <p className="font-mono text-sm font-bold text-gray-700 dark:text-gray-300">
                              {p.transaction_id}
                            </p>
                            <p className="text-[10px] font-black text-gray-400 uppercase">
                              Ref ID: {p.donation_id?.slice(0, 8)}...
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-8">
                        <div className="flex items-center gap-1 text-[#37948b] font-black text-xl">
                          <FaDollarSign size={14} />{' '}
                          <span>{Number(p.amount).toFixed(2)}</span>
                        </div>
                      </td>
                      <td className="p-8 text-sm font-bold text-gray-500">
                        <div className="flex items-center gap-2">
                          <FaClock className="text-[#37948b]" size={12} />
                          {new Date(p.paid_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </div>
                      </td>
                      <td className="p-8 text-right">
                        <span className="bg-green-50 text-green-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-green-100">
                          Success
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default MyDonations;
