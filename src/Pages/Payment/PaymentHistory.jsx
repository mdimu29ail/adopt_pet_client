import React from 'react';
import { useQuery } from '@tanstack/react-query';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

import useAuth from '../../hooks/useAuth';
import useAxiosSecure from '../../hooks/useAxiosSecure';

const formatDate = iso => new Date(iso).toLocaleString();

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
      <div className="max-w-5xl mx-auto mt-8 p-4">
        <Skeleton height={40} count={1} className="mb-4" />
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} height={32} className="mb-2" />
        ))}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto shadow-md rounded-xl">
      <table className="table w-full">
        <thead className="text-sm font-semibold">
          <tr>
            <th>#</th>
            <th>Parcel ID</th>
            <th>Amount</th>
            <th>Transaction</th>
            <th>Paid At</th>
          </tr>
        </thead>
        <tbody>
          {payments?.length > 0 ? (
            payments.map((p, index) => (
              <tr key={p.transactionId}>
                <td>{index + 1}</td>
                <td className="truncate" title={p.parcelId}>
                  {p.parcelId}
                </td>
                <td>৳{p.amount}</td>
                <td className="font-mono text-sm" title={p.transactionId}>
                  {p.transactionId?.slice(0, 12)}...
                </td>
                <td>{formatDate(p.paid_at_string)}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center py-6 text-gray-500">
                No payment history found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PaymentHistory;
