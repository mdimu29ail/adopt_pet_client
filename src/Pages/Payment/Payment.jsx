import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import React from 'react';
import { motion } from 'framer-motion';
import PaymentForm from './PaymentForm';
import { FaPaw, FaLock, FaShieldAlt, FaCreditCard } from 'react-icons/fa';

// Stripe Initialize
const stripePromise = loadStripe(import.meta.env.VITE_Publishable_key);

const Payment = () => {
  return (
    <div className="min-h-screen w-full bg-[#FFFBF7] dark:bg-gray-950 pt-28 pb-20 px-6 md:px-12 lg:px-20 overflow-hidden relative">
      {/* --- Background Decorations --- */}
      <div className="absolute top-0 right-0 p-10 opacity-5 text-[#37948b] pointer-events-none">
        <FaPaw size={400} className="rotate-12" />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* --- Page Header --- */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#37948b]/10 text-[#37948b] font-black text-xs uppercase tracking-[0.2em] mb-4"
          >
            <FaShieldAlt className="animate-pulse" /> Secure Checkout
          </motion.div>

          <h2 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white leading-tight tracking-tighter">
            Complete Your <br />
            <span className="text-[#37948b]">Donation</span>
          </h2>

          <p className="text-gray-500 font-bold mt-4 max-w-lg mx-auto">
            Your support provides medical care, food, and shelter for pets in
            need. Thank you for being a hero!
          </p>
        </div>

        {/* --- Payment Card Container --- */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white dark:bg-gray-900 rounded-[3rem] shadow-2xl shadow-teal-900/5 border border-gray-100 dark:border-gray-800 p-8 md:p-12"
        >
          {/* Trust Badge Bar */}
          <div className="flex flex-wrap items-center justify-center gap-6 mb-10 pb-8 border-b border-gray-50 dark:border-gray-800">
            <div className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest">
              <FaLock className="text-[#37948b]" /> 256-bit SSL Secure
            </div>
            <div className="hidden sm:block w-1 h-1 rounded-full bg-gray-200" />
            <div className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest">
              <FaCreditCard className="text-[#37948b]" /> Stripe Integrated
            </div>
          </div>

          {/* Stripe Elements Wrapper */}
          <div className="max-w-xl mx-auto">
            <Elements stripe={stripePromise}>
              <PaymentForm />
            </Elements>
          </div>

          {/* Security Footer */}
          <div className="mt-12 p-6 bg-teal-50 dark:bg-teal-900/20 rounded-[2rem] flex flex-col items-center text-center gap-3 border border-teal-100 dark:border-teal-800/30">
            <div className="flex items-center gap-2 text-[#37948b] font-black text-sm uppercase tracking-widest">
              <FaShieldAlt /> Trusted & Verified
            </div>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold leading-relaxed uppercase tracking-wider">
              We do not store your card details. All transactions are encrypted
              and processed securely by Stripe.
            </p>
          </div>
        </motion.div>

        {/* Support Note */}
        <p className="mt-10 text-center text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-relaxed">
          Need help? Contact us at{' '}
          <span className="text-[#37948b]">drdanger219@gmail.com</span>
        </p>
      </div>
    </div>
  );
};

export default Payment;
