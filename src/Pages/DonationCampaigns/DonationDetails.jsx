import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import axios from 'axios';
import Swal from 'sweetalert2';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { motion } from 'framer-motion';

const DonationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/campaigns/${id}`)
      .then(res => {
        setCampaign(res.data);
        setLoading(false);
      })
      .catch(() => {
        Swal.fire('Error', 'Failed to load campaign details', 'error');
        setLoading(false);
      });
  }, [id]);

  const handleDonateClick = () => {
    const goal = campaign.max_donation || 0;
    const raised = campaign.donated_amount || 0;
    const remaining = goal - raised;

    Swal.fire({
      title: 'Donation Summary',
      icon: 'info',
      html: `
        <div class="text-left space-y-2 text-base">
          <p><strong>Title:</strong> ${campaign.short_description}</p>
          <p><strong>Goal Amount:</strong> $${goal.toLocaleString()}</p>
          <p><strong>Raised Amount:</strong> $${raised.toLocaleString()}</p>
          <p><strong>Remaining:</strong> $${remaining.toLocaleString()}</p>
        </div>
      `,
      showDenyButton: true,
      confirmButtonText: '💳 Proceed to Payment',
      denyButtonText: 'Cancel',
      confirmButtonColor: '#ea580c',
      denyButtonColor: '#d3d3d3',
    }).then(result => {
      if (result.isConfirmed) {
        navigate(`/donate/${campaign._id || id}`);
      }
    });
  };

  if (loading) {
    return (
      <div className="w-full max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-2 gap-8">
        <Skeleton height={300} className="w-full rounded-lg" />
        <div className="space-y-4">
          <Skeleton height={30} width={250} />
          <Skeleton count={5} />
          <Skeleton height={40} width={160} />
        </div>
      </div>
    );
  }

  if (!campaign) {
    return <p className="text-center text-red-500 py-10">Campaign not found</p>;
  }

  const goal = campaign.max_donation || 0;
  const raised = campaign.donated_amount || 0;
  const remaining = goal - raised;

  return (
    <motion.div
      className="w-full max-w-6xl mx-auto px-4 py-10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="rounded-xl shadow border p-3 md:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-stretch">
          <motion.img
            src={campaign.pet_image || 'https://via.placeholder.com/600x400'}
            alt="Campaign"
            className="w-full h-96 object-cover rounded-lg shadow max-h-[400px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          />
          <div className="flex flex-col justify-between">
            <div className="space-y-4">
              <h1 className="text-3xl font-bold text-orange-600">
                {campaign.short_description}
              </h1>
              <p className="text-base  leading-relaxed">
                {campaign.long_description}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm ">
                <p>
                  <strong>Max Donation:</strong> ${goal.toLocaleString()}
                </p>
                <p>
                  <strong>Raised:</strong> ${raised.toLocaleString()}
                </p>
                <p>
                  <strong>Remaining:</strong> ${remaining.toLocaleString()}
                </p>
                <p>
                  <strong>End Date:</strong> {campaign.end_date}
                </p>
                <p>
                  <strong>Owner:</strong> {campaign.owner_name}
                </p>
                <p>
                  <strong>Email:</strong> {campaign.owner_email}
                </p>
              </div>
            </div>
            <motion.button
              onClick={handleDonateClick}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-8 w-full md:w-auto px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition duration-300 font-semibold shadow"
            >
              Donate Now
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DonationDetails;
