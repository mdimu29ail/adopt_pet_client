import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import Swal from 'sweetalert2';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

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
      <div className="max-w-md mx-auto mt-12 p-6 bg-white rounded-xl shadow-lg">
        <Skeleton height={200} className="mb-4 rounded-lg" />
      </div>
    );
  }

  const amount = donationInfo.max_donation || 0;

  const amountInCents = Math.round(amount * 100);

  const handleSubmit = async e => {
    e.preventDefault();
    if (!stripe || !elements) return;

    const card = elements.getElement(CardElement);
    if (!card) return;

    const { error: createPaymentError } = await stripe.createPaymentMethod({
      type: 'card',
      card,
    });

    if (createPaymentError) {
      setError(createPaymentError.message);
      return;
    }

    setError('');

    try {
      const res = await axiosSecure.post('/create-payment-intent', {
        amountInCents,
      });

      const clientSecret = res.data.clientSecret;

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card,
          billing_details: {
            name: user?.displayName || 'Anonymous',
            email: user?.email || 'anonymous@example.com',
          },
        },
      });

      if (result.error) {
        setError(result.error.message);
        return;
      }

      if (result.paymentIntent.status === 'succeeded') {
        const transactionId = result.paymentIntent.id;

        const paymentData = {
          donationId: id,
          email: user?.email,
          amount,
          transactionId,
          paymentMethod: result.paymentIntent.payment_method_types,
        };

        const paymentRes = await axiosSecure.post('/payments', paymentData);

        if (paymentRes.data.insertedId) {
          await Swal.fire({
            icon: 'success',
            title: 'Payment Successful!',
            html: `<strong>Transaction ID:</strong> <code>${transactionId}</code>`,
            confirmButtonText: 'Go to My Donations',
          });

          navigate('/dashboard/myDonations');
        } else {
          setError('Failed to record payment in database.');
        }
      }
    } catch (err) {
      setError('Payment failed: ' + err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-semibold mb-6 text-center">
        Complete Your Donation
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <CardElement
          className="p-3 border border-gray-300 rounded"
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#32325d',
                '::placeholder': {
                  color: '#a0aec0',
                },
              },
              invalid: {
                color: '#fa755a',
              },
            },
          }}
        />
        <button
          type="submit"
          disabled={!stripe}
          className="w-full bg-blue-600 text-white font-semibold py-3 rounded hover:bg-blue-700 transition"
        >
          Pay ${amount.toFixed(2)}
        </button>
        {error && <p className="text-red-600 text-center">{error}</p>}
      </form>
    </div>
  );
};

export default PaymentForm;
