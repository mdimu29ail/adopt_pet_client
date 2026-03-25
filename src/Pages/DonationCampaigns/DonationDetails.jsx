import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { motion } from 'framer-motion';
import {
  FaHeart,
  FaPaw,
  FaArrowLeft,
  FaCalendarAlt,
  FaUser,
  FaMoneyBillWave,
  FaChartLine,
  FaInfoCircle,
} from 'react-icons/fa';
import useAxios from '../../hooks/useAxios';

const DonationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const axiosPublic = useAxios();
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ ডাটা ফেচিং লজিক ফিক্স
  useEffect(() => {
    if (!id) return;

    const fetchDetails = async () => {
      setLoading(true);
      try {
        // নোট: সুপাবেসে আইডি সাধারণত UUID হয়
        const res = await axiosPublic.get(`/campaigns/${id}`);
        setCampaign(res.data);
      } catch (err) {
        console.error('❌ API Error:', err.response?.data || err.message);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Failed to load campaign details. The ID might be invalid.',
          confirmButtonColor: '#37948b',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id, axiosPublic]);

  const handleDonateClick = () => {
    if (!campaign) return;

    const goal = Number(campaign.max_donation) || 0;
    const raised = Number(campaign.donated_amount) || 0;
    const remaining = Math.max(goal - raised, 0);

    Swal.fire({
      title: 'Donation Summary',
      background: '#FFFBF7',
      color: '#2D3436',
      iconColor: '#37948b',
      html: `
        <div class="text-left space-y-3 p-2 font-sans">
          <div class="p-4 bg-teal-50 rounded-2xl border border-teal-100">
             <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Target Campaign</p>
             <p class="text-sm font-bold text-[#37948b] truncate">${campaign.title || campaign.short_description}</p>
          </div>
          <div class="grid grid-cols-2 gap-3">
             <div class="p-3 bg-gray-50 rounded-xl text-center">
                <p class="text-[9px] font-black text-gray-400 uppercase">Goal</p>
                <p class="text-sm font-black">$${goal.toLocaleString()}</p>
             </div>
             <div class="p-3 bg-gray-50 rounded-xl text-center">
                <p class="text-[9px] font-black text-gray-400 uppercase">Current</p>
                <p class="text-sm font-black text-green-600">$${raised.toLocaleString()}</p>
             </div>
          </div>
          <p class="text-center text-[11px] font-bold text-gray-500 mt-4 uppercase tracking-widest">
            Ready to help <span class="text-[#37948b]">reach the goal?</span>
          </p>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: '💳 Proceed to Payment',
      cancelButtonText: 'Not now',
      confirmButtonColor: '#37948b',
      cancelButtonColor: '#d3d3d3',
      buttonsStyling: true,
      customClass: {
        confirmButton: 'rounded-xl font-bold px-6 py-3',
        cancelButton: 'rounded-xl font-bold px-6 py-3',
      },
    }).then(result => {
      if (result.isConfirmed) {
        // সুপাবেস আইডি (id) ব্যবহার করা হচ্ছে
        navigate(`/donate/${campaign.id || id}`);
      }
    });
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-[#FFFBF7] pt-28 px-6 md:px-12 lg:px-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-7">
            <Skeleton height={450} borderRadius={40} />
          </div>
          <div className="lg:col-span-5 space-y-6">
            <Skeleton height={50} width="80%" borderRadius={15} />
            <Skeleton count={5} height={20} />
            <Skeleton height={120} borderRadius={30} />
          </div>
        </div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FFFBF7]">
        <FaPaw className="text-6xl text-gray-200 mb-4 animate-pulse" />
        <h2 className="text-2xl font-black text-gray-400 uppercase tracking-widest">
          Campaign Not Found
        </h2>
        <Link
          to="/donationCampaigns"
          className="mt-6 px-8 py-3 bg-[#37948b] text-white rounded-xl font-bold shadow-lg shadow-teal-900/20"
        >
          Back to Campaigns
        </Link>
      </div>
    );
  }

  const goal = Number(campaign.max_donation) || 0;
  const raised = Number(campaign.donated_amount) || 0;
  const remaining = Math.max(goal - raised, 0);
  const progress = Math.min(Math.round((raised / goal) * 100), 100);

  return (
    <div className="w-full min-h-screen bg-[#FFFBF7] dark:bg-gray-950 pt-28 pb-20 px-6 md:px-12 lg:px-20 overflow-hidden relative">
      {/* Background Decoration */}
      <div className="absolute top-0 right-0 p-10 opacity-5 text-[#37948b] pointer-events-none -z-0">
        <FaPaw size={500} className="rotate-12" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-[1440px] mx-auto relative z-10"
      >
        {/* --- Navigation --- */}
        <button
          onClick={() => navigate(-1)}
          className="group flex items-center gap-2 text-gray-500 font-black text-xs uppercase tracking-widest mb-10 hover:text-[#37948b] transition-all"
        >
          <FaArrowLeft className="group-hover:-translate-x-2 transition-transform" />{' '}
          Back to Drives
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* --- Left Column: Story --- */}
          <div className="lg:col-span-7 space-y-10">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="rounded-[3.5rem] overflow-hidden shadow-2xl border-[12px] border-white dark:border-gray-900 aspect-video relative group"
            >
              <img
                src={
                  campaign.pet_image || 'https://via.placeholder.com/1200x800'
                }
                alt="Campaign"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
            </motion.div>

            <div className="bg-white dark:bg-gray-900 p-8 md:p-12 rounded-[3rem] shadow-xl border border-gray-50 dark:border-gray-800">
              <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-8 flex items-center gap-3">
                <FaPaw className="text-[#37948b]" /> The Full Story
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed font-medium whitespace-pre-line">
                {campaign.long_description}
              </p>
            </div>
          </div>

          {/* --- Right Column: Donation Card --- */}
          <div className="lg:col-span-5 lg:sticky lg:top-32 space-y-8">
            <div className="bg-white dark:bg-gray-900 p-8 md:p-10 rounded-[3rem] shadow-2xl shadow-teal-900/5 border border-gray-100 dark:border-gray-800 relative overflow-hidden">
              {/* Progress Circle Badge */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-[#37948b]/10 rounded-full flex items-center justify-center">
                <div className="text-center">
                  <p className="text-xl font-black text-[#37948b]">
                    {progress}%
                  </p>
                  <p className="text-[8px] font-bold text-gray-400 uppercase tracking-tighter">
                    Funded
                  </p>
                </div>
              </div>

              <div className="mb-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-900/30 text-[#37948b] font-black text-[10px] uppercase tracking-widest mb-4">
                  <FaChartLine /> Urgent Donation Needed
                </div>
                <h1 className="text-3xl font-black text-gray-900 dark:text-white leading-tight">
                  {campaign.title || campaign.short_description}
                </h1>
              </div>

              {/* Progress Bar Area */}
              <div className="space-y-4 mb-10">
                <div className="flex justify-between items-end">
                  <p className="text-sm font-black text-gray-800 dark:text-white">
                    $${raised.toLocaleString()}{' '}
                    <span className="text-gray-400 font-bold text-[10px] uppercase ml-1">
                      Raised
                    </span>
                  </p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    Goal: $${goal.toLocaleString()}
                  </p>
                </div>
                <div className="w-full h-3 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden p-0.5">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1.5, ease: 'easeOut' }}
                    className="h-full bg-gradient-to-r from-[#37948b] to-[#4DB6AC] rounded-full"
                  />
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4 mb-10">
                <div className="p-5 bg-teal-50/50 dark:bg-teal-900/10 rounded-3xl border border-teal-100/50">
                  <FaCalendarAlt className="text-[#37948b] mb-2" />
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">
                    End Date
                  </p>
                  <p className="text-sm font-black text-gray-800 dark:text-gray-200">
                    {campaign.end_date}
                  </p>
                </div>
                <div className="p-5 bg-teal-50/50 dark:bg-teal-900/10 rounded-3xl border border-teal-100/50">
                  <FaMoneyBillWave className="text-[#37948b] mb-2" />
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">
                    Remaining
                  </p>
                  <p className="text-sm font-black text-gray-800 dark:text-gray-200">
                    $${remaining.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Organizer Card */}
              <div className="flex items-center gap-4 p-5 bg-gray-50 dark:bg-gray-800/50 rounded-3xl mb-10 border border-gray-100 dark:border-gray-800">
                <div className="w-12 h-12 rounded-2xl bg-[#37948b] flex items-center justify-center text-white shadow-lg">
                  <FaUser size={18} />
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">
                    Organizer
                  </p>
                  <p className="text-sm font-black text-gray-800 dark:text-gray-200 truncate">
                    {campaign.owner_name}
                  </p>
                </div>
              </div>

              <motion.button
                onClick={handleDonateClick}
                whileHover={{ scale: 1.02, backgroundColor: '#2d7a72' }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-6 bg-[#37948b] text-white font-black rounded-3xl shadow-xl shadow-[#37948b44] flex items-center justify-center gap-3 text-lg uppercase tracking-widest transition-all"
              >
                Donate Now <FaHeart className="animate-pulse" />
              </motion.button>
            </div>

            {/* Note */}
            <div className="p-6 bg-amber-50 dark:bg-amber-900/20 rounded-3xl border border-amber-100 flex items-start gap-4">
              <FaInfoCircle className="text-amber-500 mt-1 flex-shrink-0" />
              <p className="text-[10px] font-bold text-amber-800 dark:text-amber-200 uppercase tracking-widest leading-relaxed">
                Your donation is secure. 100% of the funds go towards the
                welfare of the pet.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default DonationDetails;
