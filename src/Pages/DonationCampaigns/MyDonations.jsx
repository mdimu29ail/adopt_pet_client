import React from 'react';
import { useQuery } from '@tanstack/react-query';
import useAuth from '../../hooks/useAuth';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import Loading from '../../Loading/Loading';

const MyDonations = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const {
    data: payments = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['payments', user?.email],
    queryFn: async () => {
      if (!user?.email) return [];
      console.log('Fetching donations for:', user.email);
      const res = await axiosSecure.get(
        `/payments?email=${encodeURIComponent(user.email)}`
      );
      console.log('Donations fetched:', res.data);
      return res.data;
    },
    enabled: !!user?.email,
  });

  if (!user) return <p>Loading user info...</p>;

  if (isLoading) return <Loading></Loading>;

  if (error) {
    const message = error?.message || JSON.stringify(error);
    return <p className="text-red-600">Error loading donations: {message}</p>;
  }

  if (!payments.length) return <p>No donations found.</p>;

  // Calculate total amount donated
  const totalAmount = payments.reduce(
    (sum, donation) => sum + Number(donation.amount || 0),
    0
  );

  return (
    <div className="w-full mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">My Donations</h2>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 p-2">Transaction ID</th>

            <th className="border border-gray-300 p-2">Payment Method</th>
            <th className="border border-gray-300 p-2">Paid At</th>
            <th className="border border-gray-300 p-2">Amount (USD)</th>
          </tr>
        </thead>
        <tbody>
          {payments.map(
            ({ _id, transactionId, amount, paymentMethod, paid_at_string }) => (
              <tr key={_id} className="text-center">
                <td className="border border-gray-300 p-2 font-mono">
                  {transactionId || 'N/A'}
                </td>

                <td className="border border-gray-300 p-2">
                  {Array.isArray(paymentMethod)
                    ? paymentMethod.join(', ')
                    : paymentMethod || 'N/A'}
                </td>
                <td className="border border-gray-300 p-2">
                  {paid_at_string
                    ? new Date(paid_at_string).toLocaleString()
                    : 'N/A'}
                </td>
                <td className="border border-gray-300 p-2">
                  ${Number(amount || 0).toFixed(2)}
                </td>
              </tr>
            )
          )}
        </tbody>
        <tfoot>
          <tr className="font-bold ">
            <td className="border  p-2 text-right" colSpan={3}>
              Total:
            </td>
            <td className="border border-gray-300 p-2">
              ${totalAmount.toFixed(2)}
            </td>
            <td className="border border-gray-300 p-2" colSpan={2}></td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default MyDonations;
