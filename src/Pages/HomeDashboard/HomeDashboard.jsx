import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Skeleton from 'react-loading-skeleton';
import { motion } from 'framer-motion';
import 'react-loading-skeleton/dist/skeleton.css';

const DashboardHome = () => {
  // Fetch pets
  const {
    data: pets,
    isLoading: petsLoading,
    error: petsError,
  } = useQuery({
    queryKey: ['pets'],
    queryFn: async () => {
      const res = await axios.get('http://localhost:5000/pets');
      return res.data;
    },
  });

  // Fetch campaigns
  const {
    data: campaigns,
    isLoading: campaignsLoading,
    error: campaignsError,
  } = useQuery({
    queryKey: ['campaigns'],
    queryFn: async () => {
      const res = await axios.get('http://localhost:5000/campaigns');
      return res.data;
    },
  });

  if (petsLoading || campaignsLoading) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <Skeleton height={40} width={250} className="mb-6" />
        <div className="grid grid-cols-2 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="border p-4 rounded-xl">
              <Skeleton height={30} width={80} />
              <Skeleton height={25} width={60} className="mt-2" />
            </div>
          ))}
        </div>
        <Skeleton height={30} width={200} className="mb-4" />
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center gap-4 mb-4">
            <Skeleton circle width={60} height={60} />
            <div>
              <Skeleton width={120} height={20} />
              <Skeleton width={160} height={15} className="mt-2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (petsError || campaignsError)
    return (
      <p className="text-center text-red-600 mt-10">
        Error loading dashboard data.
      </p>
    );

  const activePets = pets?.filter(pet => pet.status === 'available') || [];
  const activeCampaigns = campaigns?.filter(c => c.status === 'active') || [];

  return (
    <motion.div
      className="p-6 max-w-4xl mx-auto"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h2 className="text-3xl font-bold text-center mb-10">Dashboard Home</h2>

      <div className="grid grid-cols-2 gap-6 mb-10">
        {[
          { label: 'Total Pets', value: pets.length },
          { label: 'Active Pets', value: activePets.length },
          { label: 'Total Campaigns', value: campaigns.length },
          { label: 'Active Campaigns', value: activeCampaigns.length },
        ].map((item, i) => (
          <motion.div
            key={i}
            className="p-6 border rounded-xl text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
          >
            <h3 className="text-lg font-semibold">{item.label}</h3>
            <p className="text-4xl font-bold mt-2">{item.value}</p>
          </motion.div>
        ))}
      </div>

      <section>
        <h3 className="text-2xl font-semibold mb-6">Recent Pets</h3>
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 gap-6"
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
        >
          {pets.slice(0, 6).map((pet, i) => (
            <motion.div
              key={pet._id}
              className="border rounded-lg p-4 flex items-center gap-4"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              <img
                src={pet.image_url || 'https://via.placeholder.com/100x100'}
                alt={pet.name}
                className="w-20 h-20 object-cover rounded-md"
              />
              <div>
                <h4 className="font-semibold text-lg">{pet.name}</h4>
                <p className="text-sm">Type: {pet.type}</p>
                <p className="text-sm">Status: {pet.status}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>
    </motion.div>
  );
};

export default DashboardHome;
