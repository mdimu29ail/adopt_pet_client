import React, { useEffect, useState } from 'react';
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Link } from 'react-router';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import useUserRole from '../../hooks/useUserRole';
import useAuth from '../../hooks/useAuth';
import Loading from '../../Loading/Loading';

const PAGE_SIZE = 6;

const DonationCampaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);

  const { role, roleLoading } = useUserRole();
  const { user } = useAuth();

  const fetchCampaigns = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/campaigns?limit=${PAGE_SIZE}&skip=${
          page * PAGE_SIZE
        }`,
      );
      const newCampaigns = res.data;

      setCampaigns(prev => [...prev, ...newCampaigns]);
      setHasMore(newCampaigns.length === PAGE_SIZE);
      setPage(prev => prev + 1);
    } catch (err) {
      console.error('Fetch failed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const handleDelete = async id => {
    const confirm = window.confirm(
      'Are you sure you want to delete this campaign?',
    );
    if (!confirm) return;

    try {
      const res = await axios.delete(`http://localhost:5000/campaigns/${id}`);
      if (res.data.deletedCount > 0) {
        setCampaigns(prev => prev.filter(c => c._id !== id));
        alert('Deleted successfully');
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold mb-8 text-center text-orange-600">
        Donation Campaigns
      </h2>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="border rounded-xl p-4">
              <Skeleton height={180} />
              <Skeleton height={20} className="mt-4" />
              <Skeleton count={3} />
              <div className="flex gap-2 mt-4">
                <Skeleton height={36} width={80} />
                <Skeleton height={36} width={80} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <InfiniteScroll
          dataLength={campaigns.length}
          next={fetchCampaigns}
          hasMore={hasMore}
          loader={<Loading></Loading>}
          endMessage={<p className="text-center mt-4">No more campaigns</p>}
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-3 ">
            {campaigns.map(c => (
              <div
                key={c._id}
                className="border rounded-xl p-4 flex flex-col justify-between"
              >
                <img
                  src={c.pet_image || 'https://via.placeholder.com/600x400'}
                  alt={c.short_description}
                  className="h-40 w-full object-cover rounded-md mb-4"
                />

                <h3 className="text-lg font-semibold mb-1">
                  {c.short_description}
                </h3>

                <div className="flex justify-between">
                  <p className="text-sm">
                    Goal:{' '}
                    <strong>${Number(c.max_donation).toLocaleString()}</strong>
                  </p>
                  <p className="text-sm mb-2">
                    Raised:{' '}
                    <strong>
                      ${Number(c.donated_amount).toLocaleString()}
                    </strong>
                  </p>
                </div>

                <div className="flex justify-between flex-wrap gap-2 mt-4">
                  <Link
                    to={`/donations/${c._id}`}
                    className="border py-2 px-4 rounded text-sm text-center cursor-pointer hover:text-blue-500"
                  >
                    View
                  </Link>

                  {!roleLoading &&
                    (role === 'admin' || user?.email === c.owner_email) && (
                      <>
                        <Link
                          to={`/dashboard/edit-campaign/${c._id}`}
                          className="border py-2 px-4 rounded text-sm text-center cursor-pointer hover:text-yellow-500"
                        >
                          Edit
                        </Link>

                        {role === 'admin' && (
                          <button
                            onClick={() => handleDelete(c._id)}
                            className="border py-2 px-4 rounded text-sm cursor-pointer hover:text-red-500"
                          >
                            Delete
                          </button>
                        )}
                      </>
                    )}
                </div>
              </div>
            ))}
          </div>
        </InfiniteScroll>
      )}
    </div>
  );
};

export default DonationCampaigns;
