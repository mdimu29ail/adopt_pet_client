import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Swal from 'sweetalert2';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import {
  FaCreditCard,
  FaLock,
  FaPaw,
  FaSpinner,
  FaExclamationTriangle,
} from 'react-icons/fa';

import useAuth from '../../hooks/useAuth';
import useAxiosSecure from '../../hooks/useAxiosSecure';

const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { id } = useParams();
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);

  // ক্যাম্পেইন তথ্য আনা
  const { isLoading, data: donationInfo = {} } = useQuery({
    queryKey: ['donations', id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/campaigns/${id}`);
      return res.data;
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton height={50} borderRadius={15} />
        <Skeleton height={60} borderRadius={15} />
      </div>
    );
  }

  // ✅ অ্যামাউন্ট নাম্বার হিসেবে নিশ্চিত করা
  const amount = parseFloat(donationInfo.max_donation) || 0;
  const amountInCents = Math.round(amount * 100);

  const handleSubmit = async e => {
    e.preventDefault();
    if (!stripe || !elements) return;

    const card = elements.getElement(CardElement);
    if (!card) return;

    // ✅ পেমেন্ট ইনটেন্ট পাঠানোর আগে চেক (Stripe minimum is $0.50)
    if (amountInCents < 50) {
      setError('Minimum donation amount must be at least $0.50');
      return;
    }

    setProcessing(true);
    setError('');

    try {
      // ১. পেমেন্ট ইনটেন্ট তৈরি করা
      // এখানে ডাটা পাঠানোর সময় কী (key) চেক করুন আপনার ব্যাকএন্ডের সাথে মিল আছে কি না
      const res = await axiosSecure.post('/create-payment-intent', {
        amountInCents: amountInCents,
      });

      const clientSecret = res.data.clientSecret;

      // ২. কার্ড পেমেন্ট কনফার্ম করা
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card,
          billing_details: {
            name:
              user?.user_metadata?.full_name ||
              user?.displayName ||
              'Anonymous',
            email: user?.email || 'anonymous@example.com',
          },
        },
      });

      if (result.error) {
        setError(result.error.message);
        setProcessing(false);
        return;
      }

      if (result.paymentIntent.status === 'succeeded') {
        const transactionId = result.paymentIntent.id;

        // ৩. সুপাবেসে পেমেন্ট রেকর্ড সেভ করা
        const paymentData = {
          donation_id: id,
          email: user?.email,
          amount: amount,
          transaction_id: transactionId,
          payment_method: 'card',
          paid_at: new Date().toISOString(),
        };

        const paymentRes = await axiosSecure.post('/payments', paymentData);

        if (paymentRes.data.insertedId) {
          Swal.fire({
            icon: 'success',
            title: 'Donation Received!',
            text: `Thank you for supporting ${donationInfo.title || 'the pet'}!`,
            confirmButtonColor: '#37948b',
            background: '#FFFBF7',
          });
          navigate('/dashboard/myDonations');
        }
      }
    } catch (err) {
      // ✅ বিস্তারিত এরর মেসেজ দেখা
      const serverError = err.response?.data?.message || err.message;
      setError('Payment failed: ' + serverError);
      console.error('Payment Error Log:', err.response?.data);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="w-full">
      <div className="bg-teal-50 dark:bg-teal-900/20 p-5 rounded-2xl mb-8 border border-teal-100 dark:border-teal-800/30 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-black text-[#37948b] uppercase tracking-widest">
            Contributing to
          </p>
          <h4 className="text-lg font-black text-gray-800 dark:text-white truncate max-w-[200px]">
            {donationInfo.title || donationInfo.short_description}
          </h4>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
            Amount
          </p>
          <h4 className="text-2xl font-black text-[#37948b]">
            ${amount.toLocaleString()}
          </h4>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-2">
          <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
            <FaCreditCard className="text-[#37948b]" /> Card Details
          </label>

          <div className="p-5 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border-2 border-transparent focus-within:border-[#37948b] transition-all">
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#1a202c',
                    fontFamily: 'Quicksand, sans-serif',
                    fontWeight: '700',
                    '::placeholder': { color: '#a0aec0' },
                  },
                  invalid: { color: '#ef4444' },
                },
              }}
            />
          </div>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 p-4 bg-red-50 text-red-600 rounded-xl border border-red-100"
            >
              <FaExclamationTriangle className="flex-shrink-0" />
              <p className="text-xs font-bold">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={!stripe || processing || amount <= 0}
          className="w-full py-5 bg-[#37948b] text-white font-black rounded-2xl shadow-xl shadow-[#37948b44] flex items-center justify-center gap-3 disabled:opacity-50 text-lg uppercase tracking-widest transition-all"
        >
          {processing ? (
            <FaSpinner className="animate-spin text-2xl" />
          ) : (
            <>
              Confirm Donation <FaPaw />
            </>
          )}
        </motion.button>
      </form>
    </div>
  );
};

export default PaymentForm;
