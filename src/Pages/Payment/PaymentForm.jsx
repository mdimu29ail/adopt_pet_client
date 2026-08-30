import React, { useState } from 'react';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import Swal from 'sweetalert2';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../../Supabase/supabase.config';
import useAuth from '../../hooks/useAuth';
import { FaSpinner, FaLock } from 'react-icons/fa';

const PaymentForm = ({ campaign }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams(); // Campaign ID

  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [cardError, setCardError] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();

    if (!stripe || !elements) return;

    const donationAmount = parseFloat(amount);
    if (!donationAmount || donationAmount <= 0) {
      return Swal.fire(
        'Warning',
        'Please enter a valid donation amount!',
        'warning'
      );
    }

    const card = elements.getElement(CardElement);
    if (!card) return;

    setLoading(true);
    setCardError('');

    try {
      // ১. Stripe Payment Method তৈরি
      const { error: paymentMethodError, paymentMethod } =
        await stripe.createPaymentMethod({
          type: 'card',
          card,
          billing_details: {
            name:
              user?.displayName ||
              user?.user_metadata?.full_name ||
              'Anonymous Donor',
            email: user?.email || 'unknown@mail.com',
          },
        });

      if (paymentMethodError) {
        throw new Error(paymentMethodError.message);
      }

      const transactionId = paymentMethod.id; // Stripe Transaction / PaymentMethod ID

      // ২. Supabase-এর 'payments' টেবিলে ডাটা ইনসার্ট
      const newPayment = {
        donation_id: id,
        email: user?.email,
        amount: donationAmount,
        transaction_id: transactionId,
        paid_at: new Date().toISOString(),
      };

      const { error: paymentInsertError } = await supabase
        .from('payments')
        .insert([newPayment]);

      if (paymentInsertError) throw paymentInsertError;

      // ৩. Supabase-এর 'campaigns' টেবিলে donated_amount আপডেট করা
      // প্রথমে বর্তমান ক্যাম্পেইনের তথ্য আনা
      const { data: currentCampaign } = await supabase
        .from('campaigns')
        .select('donated_amount')
        .eq('id', id)
        .single();

      const newTotal =
        Number(currentCampaign?.donated_amount || 0) + donationAmount;

      await supabase
        .from('campaigns')
        .update({ donated_amount: newTotal })
        .eq('id', id);

      // ৪. সফল হলে নোটিফিকেশন দেখানো
      Swal.fire({
        icon: 'success',
        title: 'Thank You for Donating!',
        text: `Transaction ID: ${transactionId}`,
        confirmButtonColor: '#37948b',
        background: '#FFFBF7',
      });

      navigate('/dashboard/myDonations');
    } catch (err) {
      console.error('Payment Error:', err);
      setCardError(err.message);
      Swal.fire({
        icon: 'error',
        title: 'Payment Failed',
        text: err.message || 'Something went wrong!',
        confirmButtonColor: '#37948b',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 font-sans">
      {/* Donation Amount Input */}
      <div>
        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
          Donation Amount ($)
        </label>
        <input
          type="number"
          step="0.01"
          placeholder="Enter amount (e.g. 25)"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          required
          className="w-full px-6 py-4 rounded-2xl border-2 border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 outline-none focus:border-[#37948b] font-bold text-gray-800 dark:text-white transition-all text-lg"
        />
      </div>

      {/* Stripe Card Element */}
      <div>
        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
          Card Information
        </label>
        <div className="p-4 rounded-2xl border-2 border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 focus-within:border-[#37948b] transition-all">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#2D3436',
                  '::placeholder': { color: '#aab7c4' },
                },
                invalid: { color: '#ef4444' },
              },
            }}
          />
        </div>
      </div>

      {cardError && (
        <p className="text-red-500 text-xs font-bold text-center mt-2">
          {cardError}
        </p>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full py-5 bg-[#37948b] text-white font-black rounded-2xl shadow-xl hover:bg-[#2d7a72] transition-all flex items-center justify-center gap-3 uppercase text-xs tracking-widest disabled:opacity-50 mt-8 cursor-pointer"
      >
        {loading ? <FaSpinner className="animate-spin text-lg" /> : <FaLock />}
        {loading ? 'Processing...' : `Donate $${amount || '0'}`}
      </button>
    </form>
  );
};

export default PaymentForm;
