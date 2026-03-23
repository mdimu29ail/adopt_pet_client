import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import Swal from 'sweetalert2';
import useAuth from '../../hooks/useAuth';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import useUserRole from '../../hooks/useUserRole';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const MyDonationCampaigns = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const { role } = useUserRole();
  const navigate = useNavigate();

  const {
    data: campaigns = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['myCampaigns', user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/campaigns?email=${user?.email}`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  const handleDelete = async id => {
    const confirm = await Swal.fire({
      title: 'Are you sure?',
      text: 'This campaign will be deleted permanently!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
    });

    if (confirm.isConfirmed) {
      try {
        const res = await axiosSecure.delete(`/campaigns/${id}`);
        if (res.data?.deletedCount > 0) {
          Swal.fire('Deleted!', 'The campaign has been removed.', 'success');
          refetch();
        }
      } catch (err) {
        Swal.fire('Error', 'Failed to delete campaign.', 'error');
      }
    }
  };

  if (!user) return <Skeleton height={20} count={1} />;
  if (isLoading)
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, idx) => (
          <Skeleton key={idx} height={300} />
        ))}
      </div>
    );
  if (error) return <p className="py-4">Error: {error.message}</p>;
  if (!campaigns.length) return <p>No campaigns found.</p>;

  return (
    <div className="w-full mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6 text-center">
        My Donation Campaigns
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {campaigns.map(campaign => (
          <div
            key={campaign._id}
            className="rounded-xl shadow-lg border p-4 flex flex-col justify-between"
          >
            <div>
              <div className="relative">
                <img
                  src={
                    campaign.pet_image || 'https://via.placeholder.com/400x200'
                  }
                  alt={campaign.short_description}
                  className="w-full h-30 object-cover rounded-md mb-3"
                />
                {campaign.status && (
                  <span
                    className={`absolute top-2 left-2 text-xs font-semibold px-2 py-1 rounded-full`}
                  >
                    {campaign.status}
                  </span>
                )}
              </div>

              <h3 className="text-lg font-semibold mb-1">
                {campaign.short_description}
              </h3>

              <div className="flex justify-between text-sm mb-2">
                <p>
                  Goal:{' '}
                  <span className="font-bold">${campaign.max_donation}</span>
                </p>
                <p>
                  Raised:{' '}
                  <span className="font-bold">${campaign.donated_amount}</span>
                </p>
              </div>

              <p className="text-xs mb-2">Created by: {campaign.owner_email}</p>
            </div>

            <div className="mt-4 flex justify-between items-center">
              <button
                onClick={() => navigate(`/donations/${campaign._id}`)}
                className="border px-4 py-2 rounded text-sm cursor-pointer hover:text-blue-500"
              >
                Details
              </button>

              {(role === 'admin' || campaign.owner_email === user?.email) && (
                <div className="flex gap-7">
                  <button
                    onClick={() =>
                      navigate(`/dashboard/edit-campaign/${campaign._id}`)
                    }
                    className="border px-4 py-2 rounded text-sm cursor-pointer hover:text-yellow-500"
                  >
                    Update
                  </button>

                  <button
                    onClick={() => handleDelete(campaign._id)}
                    className="border px-4 py-2 rounded text-sm cursor-pointer hover:text-red-500"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyDonationCampaigns;
