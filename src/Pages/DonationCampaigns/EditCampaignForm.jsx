import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { motion } from 'framer-motion';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import {
  FaHandHoldingHeart,
  FaArrowLeft,
  FaCloudUploadAlt,
  FaSpinner,
  FaInfoCircle,
  FaHeading,
  FaDollarSign,
  FaCalendarAlt,
  FaUserAlt,
  FaPaw,
} from 'react-icons/fa';
import { supabase } from '../../Supabase/supabase.config';
import useAxiosSecure from '../../hooks/useAxiosSecure';

const EditDonationCampaign = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();

  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageUploading, setImageUploading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');

  // ১. ক্যাম্পেইন ডাটা লোড করা (সুপাবেস আইডি অনুযায়ী)
  useEffect(() => {
    if (!id) return;

    const fetchCampaign = async () => {
      try {
        const res = await axiosSecure.get(`/campaigns/${id}`);
        const data = res.data;
        setCampaign(data);
        setPreviewUrl(data.pet_image || '');
        setLoading(false);
      } catch (err) {
        console.error('❌ Fetch Error:', err);
        Swal.fire({
          icon: 'error',
          title: 'Load Failed',
          text: 'Could not fetch campaign details. Please try again.',
          confirmButtonColor: '#37948b',
        });
        setLoading(false);
      }
    };
    fetchCampaign();
  }, [id, axiosSecure]);

  // ২. সরাসরি সুপাবেস স্টোরেজে ইমেজ আপডেট
  const handleImageUpload = async e => {
    const file = e.target.files[0];
    if (!file) return;

    setPreviewUrl(URL.createObjectURL(file));
    setImageUploading(true);

    try {
      const fileName = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('campaign-images') // আপনার সুপাবেস বাল্কেট নাম
        .upload(`campaigns/${fileName}`, file);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('campaign-images')
        .getPublicUrl(`campaigns/${fileName}`);

      // স্টেট আপডেট করা
      setCampaign(prev => ({ ...prev, pet_image: urlData.publicUrl }));

      Swal.fire({
        icon: 'success',
        title: 'Banner Updated',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (err) {
      console.error('❌ Upload Error:', err);
      Swal.fire('Error', 'Image upload failed. Check RLS policies.', 'error');
    } finally {
      setImageUploading(false);
    }
  };

  // ৩. তথ্য আপডেট সাবমিট করা
  const handleSubmit = async e => {
    e.preventDefault();
    setUpdateLoading(true);
    const form = e.target;

    const updatedData = {
      title: form.title.value,
      short_description: form.short_description.value,
      long_description: form.long_description.value,
      max_donation: Number(form.max_donation.value),
      donated_amount: Number(form.donated_amount.value),
      end_date: form.end_date.value,
      pet_image: campaign.pet_image, // আপডেট হওয়া ইমেজ লিংক
    };

    try {
      // ব্যাকএন্ডে PATCH রিকোয়েস্ট পাঠানো হচ্ছে
      const res = await axiosSecure.patch(`/campaigns/${id}`, updatedData);

      if (res.data.success || res.data.modifiedCount > 0) {
        Swal.fire({
          icon: 'success',
          title: 'Successfully Updated!',
          text: 'Your campaign changes are now live.',
          confirmButtonColor: '#37948b',
          background: '#FFFBF7',
        });
        navigate('/dashboard/my-campaigns');
      } else {
        Swal.fire('Info', 'No changes were made to save.', 'info');
      }
    } catch (err) {
      console.error('❌ Update Failed:', err.response?.data || err.message);

      const errorMsg =
        err.response?.data?.message ||
        'Connection lost or Database restricted (RLS).';

      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: errorMsg,
        confirmButtonColor: '#37948b',
      });
    } finally {
      setUpdateLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto py-24 px-6">
        <Skeleton height={60} width="40%" borderRadius={20} className="mb-10" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <Skeleton height={400} borderRadius={40} />
          <div className="space-y-4">
            <Skeleton height={50} borderRadius={15} />
            <Skeleton height={150} borderRadius={15} />
            <Skeleton height={50} borderRadius={15} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#FFFBF7] dark:bg-gray-950 pt-28 pb-20 px-4 md:px-10 lg:px-20 font-sans">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        {/* --- Header --- */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
          <div className="text-center md:text-left">
            <Link
              to="/dashboard/my-campaigns"
              className="inline-flex items-center gap-2 text-[#37948b] font-black text-xs uppercase tracking-widest mb-4 hover:gap-3 transition-all"
            >
              <FaArrowLeft /> Back to Management
            </Link>
            <h2 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white tracking-tighter leading-tight">
              Modify <span className="text-[#37948b]">Donation Drive</span>
            </h2>
          </div>
          <div className="hidden lg:flex items-center gap-3 bg-white dark:bg-gray-900 px-6 py-3 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800">
            <div className="w-3 h-3 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-[10px] font-black uppercase text-gray-500 tracking-widest">
              Editor Mode
            </span>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 lg:grid-cols-12 gap-10"
        >
          {/* --- Left Sidebar: Media --- */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-gray-800">
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-6">
                Campaign Media
              </label>

              <div className="relative group aspect-video rounded-[2rem] border-2 border-[#37948b] overflow-hidden shadow-2xl bg-gray-50 dark:bg-gray-800">
                <img
                  src={previewUrl || 'https://via.placeholder.com/600x400'}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  alt="Banner"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center backdrop-blur-sm cursor-pointer">
                  <FaCloudUploadAlt size={40} className="text-white mb-2" />
                  <p className="text-white font-black text-[10px] uppercase tracking-widest">
                    Update Banner
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                  />
                </div>
                {imageUploading && (
                  <div className="absolute inset-0 bg-white/80 dark:bg-black/80 flex items-center justify-center z-20">
                    <FaSpinner className="animate-spin text-[#37948b] text-3xl" />
                  </div>
                )}
              </div>
              <p className="mt-4 text-[9px] font-bold text-center text-gray-400 uppercase tracking-widest italic">
                Best size: 1200 x 800 px
              </p>
            </div>

            {/* Organizer Info Card */}
            <div className="bg-gray-900 p-8 rounded-[3rem] shadow-2xl text-white relative overflow-hidden group">
              <FaPaw className="absolute -bottom-10 -right-10 text-white/5 text-[150px] rotate-12 group-hover:rotate-45 transition-transform duration-1000" />
              <div className="relative z-10">
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#37948b] mb-6 flex items-center gap-2">
                  <FaUserAlt /> Organizer Details
                </h4>
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20">
                    <FaUserAlt className="text-[#37948b]" />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-sm font-bold truncate">
                      {campaign.owner_name}
                    </p>
                    <p className="text-[10px] text-gray-400 font-medium truncate">
                      {campaign.owner_email}
                    </p>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02, backgroundColor: '#2d7a72' }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={imageUploading || updateLoading}
                  className="w-full py-5 bg-[#37948b] text-white font-black rounded-2xl shadow-xl transition-all flex items-center justify-center gap-3 text-xs uppercase tracking-widest disabled:opacity-50"
                >
                  {updateLoading ? (
                    <FaSpinner className="animate-spin text-lg" />
                  ) : (
                    <FaHandHoldingHeart className="text-lg" />
                  )}
                  {updateLoading ? 'Saving...' : 'Apply Changes'}
                </motion.button>
              </div>
            </div>
          </div>

          {/* --- Right Main Content: Form --- */}
          <div className="lg:col-span-8">
            <div className="bg-white dark:bg-gray-900 p-8 md:p-12 rounded-[3.5rem] shadow-xl border border-gray-100 dark:border-gray-800">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Headline */}
                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                    Campaign Headline
                  </label>
                  <div className="relative group">
                    <FaHeading className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#37948b] transition-colors" />
                    <input
                      name="title"
                      defaultValue={
                        campaign.title || campaign.short_description
                      }
                      required
                      className="w-full pl-14 pr-6 py-4 rounded-2xl border-2 border-gray-50 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 outline-none focus:border-[#37948b] focus:bg-white dark:focus:bg-gray-900 transition-all font-bold dark:text-white"
                    />
                  </div>
                </div>

                {/* Summary */}
                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                    Short Summary
                  </label>
                  <input
                    name="short_description"
                    defaultValue={campaign.short_description}
                    required
                    className="w-full px-6 py-4 rounded-2xl border-2 border-gray-50 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 outline-none focus:border-[#37948b] focus:bg-white dark:focus:bg-gray-900 transition-all font-bold dark:text-white"
                  />
                </div>

                {/* Donation Amounts */}
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                    Goal Amount ($)
                  </label>
                  <div className="relative group">
                    <FaDollarSign className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#37948b] transition-colors" />
                    <input
                      type="number"
                      name="max_donation"
                      defaultValue={campaign.max_donation}
                      required
                      className="w-full pl-14 pr-6 py-4 rounded-2xl border-2 border-gray-50 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 outline-none focus:border-[#37948b] focus:bg-white dark:focus:bg-gray-900 transition-all font-bold dark:text-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                    Currently Raised ($)
                  </label>
                  <div className="relative group">
                    <FaDollarSign className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#37948b] transition-colors" />
                    <input
                      type="number"
                      name="donated_amount"
                      defaultValue={campaign.donated_amount}
                      required
                      className="w-full pl-14 pr-6 py-4 rounded-2xl border-2 border-gray-50 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 outline-none focus:border-[#37948b] focus:bg-white dark:focus:bg-gray-900 transition-all font-bold dark:text-white"
                    />
                  </div>
                </div>

                {/* Deadline */}
                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                    Deadline Date
                  </label>
                  <div className="relative group">
                    <FaCalendarAlt className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#37948b] transition-colors" />
                    <input
                      type="date"
                      name="end_date"
                      defaultValue={campaign.end_date}
                      required
                      className="w-full pl-14 pr-6 py-4 rounded-2xl border-2 border-gray-50 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 outline-none focus:border-[#37948b] focus:bg-white dark:focus:bg-gray-900 transition-all font-bold dark:text-white"
                    />
                  </div>
                </div>

                {/* Long Description */}
                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <FaInfoCircle className="text-[#37948b]" /> Full Campaign
                    Story
                  </label>
                  <textarea
                    name="long_description"
                    defaultValue={campaign.long_description}
                    rows="6"
                    required
                    className="w-full px-6 py-5 rounded-[2.5rem] border-2 border-gray-50 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 outline-none focus:border-[#37948b] focus:bg-white dark:focus:bg-gray-900 transition-all font-bold dark:text-white resize-none"
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default EditDonationCampaign;
