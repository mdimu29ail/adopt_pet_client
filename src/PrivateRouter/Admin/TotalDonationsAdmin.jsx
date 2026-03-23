import React from 'react';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { FaHandHoldingHeart, FaUsers } from 'react-icons/fa';
import Loading from '../../Loading/Loading';

const TotalDonationsAdmin = () => {
  const axiosSecure = useAxiosSecure();

  const { data, isLoading, error } = useQuery({
    queryKey: ['admin-total-donations'],
    queryFn: async () => {
      const res = await axiosSecure.get('/admin/total-donations');
      return res.data;
    },
  });

  if (isLoading) return <Loading></Loading>;
  if (error)
    return (
      <p className="text-center mt-10 text-red-600 font-semibold">
        Error: {error.message}
      </p>
    );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-center mb-8 text-orange-600">
        Donation Overview
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        <div className="flex items-center gap-4 p-6 rounded-xl cursor-pointer transition-transform hover:scale-[1.03]">
          <FaHandHoldingHeart className="text-5xl text-orange-600" />
          <div>
            <h3 className="text-xl font-semibold text-orange-600">
              Total Amount Donated
            </h3>
            <p className="text-4xl font-bold text-orange-700">
              ${Number(data.total || 0).toFixed(2)}
            </p>
            <p className="text-sm font-medium text-orange-500 mt-1">
              Sum of all donations made by users
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 p-6 rounded-xl cursor-pointer transition-transform hover:scale-[1.03]">
          <FaUsers className="text-5xl text-orange-600" />
          <div>
            <h3 className="text-xl font-semibold text-orange-600">
              Total Donation Entries
            </h3>
            <p className="text-4xl font-bold text-orange-700">
              {data.count || 0}
            </p>
            <p className="text-sm font-medium text-orange-500 mt-1">
              Number of individual donation records
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TotalDonationsAdmin;
