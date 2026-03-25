import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { motion } from 'framer-motion';
import useAuth from '../../hooks/useAuth';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { supabase } from '../../Supabase/supabase.config';
import {
  FaHandHoldingHeart,
  FaDollarSign,
  FaCalendarAlt,
  FaFileAlt,
  FaCloudUploadAlt,
  FaSpinner,
  FaUser,
  FaPaw,
  FaHeading,
} from 'react-icons/fa';

const CreateCampaign = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const handleImageChange = e => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async data => {
    if (!imageFile) {
      return Swal.fire(
        'Warning',
        'Please upload a campaign banner!',
        'warning',
      );
    }

    setLoading(true);

    try {
      // ১. সুপাবেস স্টোরেজে ইমেজ আপলোড
      const fileName = `${Date.now()}_${imageFile.name.replace(/\s+/g, '_')}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('campaign-images')
        .upload(`campaigns/${fileName}`, imageFile);

      if (uploadError) throw new Error('Storage Error: ' + uploadError.message);

      const { data: urlData } = supabase.storage
        .from('campaign-images')
        .getPublicUrl(`campaigns/${fileName}`);

      const pet_image = urlData.publicUrl;

      // ২. ডাটা অবজেক্ট তৈরি (SQL কলামের সাথে হুবহু মিল রেখে)
      const campaign = {
        title: data.title,
        short_description: data.short_description,
        long_description: data.long_description,
        max_donation: parseFloat(data.max_donation),
        donated_amount: 0,
        pet_image: pet_image,
        end_date: data.end_date,
        owner_email: user?.email,
        owner_name:
          user?.user_metadata?.full_name || user?.displayName || 'Anonymous',
        is_paused: false, // ডিফল্ট ভ্যালু
        created_at: new Date().toISOString(),
      };

      // ৩. ব্যাকএন্ডে রিকোয়েস্ট পাঠানো
      const res = await axiosSecure.post('/campaigns', campaign);

      if (res.data.insertedId) {
        Swal.fire({
          icon: 'success',
          title: 'Campaign Launched!',
          text: 'The pets are thankful for your support.',
          showConfirmButton: false,
          timer: 2000,
          background: '#FFFBF7',
        });
        reset();
        setPreview('');
        setImageFile(null);
        navigate('/dashboard/my-campaigns');
      }
    } catch (error) {
      console.error('❌ Error Details:', error);
      Swal.fire({
        icon: 'error',
        title: 'Launch Failed',
        text:
          error.response?.data?.message ||
          error.message ||
          'Check your internet or database permissions.',
        confirmButtonColor: '#37948b',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#FFFBF7] dark:bg-gray-950 pt-28 pb-20 px-4 md:px-10 lg:px-20 font-sans">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        <div className="mb-12 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#37948b]/10 text-[#37948b] font-black text-xs uppercase tracking-[0.2em] mb-4">
            <FaHandHoldingHeart className="animate-pulse" /> Support a Cause
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white leading-tight tracking-tighter">
            Launch a <br />
            <span className="text-[#37948b]">Donation Drive</span>
          </h2>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 lg:grid-cols-12 gap-10"
        >
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white dark:bg-gray-900 p-8 md:p-12 rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-gray-800">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                    Headline
                  </label>
                  <div className="relative">
                    <FaHeading className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" />
                    <input
                      type="text"
                      {...register('title', { required: 'Title is required' })}
                      placeholder="e.g. Save Buddy"
                      className="w-full pl-14 pr-6 py-4 rounded-2xl border-2 border-gray-50 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 outline-none focus:border-[#37948b] font-bold dark:text-white transition-all"
                    />
                  </div>
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                    Summary
                  </label>
                  <input
                    type="text"
                    {...register('short_description', { required: true })}
                    placeholder="Short description"
                    className="w-full px-6 py-4 rounded-2xl border-2 border-gray-50 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 outline-none focus:border-[#37948b] font-bold dark:text-white transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                    Goal ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    {...register('max_donation', { required: true })}
                    className="w-full px-6 py-4 rounded-2xl border-2 border-gray-50 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 outline-none focus:border-[#37948b] font-bold dark:text-white transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    {...register('end_date', { required: true })}
                    className="w-full px-6 py-4 rounded-2xl border-2 border-gray-50 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 outline-none focus:border-[#37948b] font-bold dark:text-white transition-all"
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                    Detailed Story
                  </label>
                  <textarea
                    rows="6"
                    {...register('long_description', { required: true })}
                    className="w-full px-6 py-5 rounded-[2rem] border-2 border-gray-50 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 outline-none focus:border-[#37948b] font-bold dark:text-white resize-none"
                  ></textarea>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-gray-800">
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-6">
                Banner Image
              </label>
              <div
                className={`relative group w-full aspect-video rounded-[2rem] border-2 border-dashed flex items-center justify-center overflow-hidden transition-all ${preview ? 'border-[#37948b]' : 'border-gray-200'}`}
              >
                {preview ? (
                  <img
                    src={preview}
                    className="w-full h-full object-cover"
                    alt="preview"
                  />
                ) : (
                  <div className="text-center">
                    <FaCloudUploadAlt
                      size={40}
                      className="mx-auto mb-2 text-[#37948b]"
                    />
                    <p className="text-[10px] font-black uppercase text-gray-400">
                      Upload Banner
                    </p>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>
            </div>

            <div className="bg-gray-900 p-8 rounded-[3rem] shadow-2xl text-white">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-[#37948b] mb-4">
                Account
              </h4>
              <div className="flex items-center gap-3 mb-8">
                <img
                  src={
                    user?.user_metadata?.avatar_url ||
                    'https://i.ibb.co/mJR657F/user-placeholder.png'
                  }
                  className="w-10 h-10 rounded-xl"
                  alt="avatar"
                />
                <p className="text-sm font-bold truncate">{user?.email}</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={loading}
                className="w-full py-5 bg-[#37948b] text-white font-black rounded-2xl shadow-xl hover:bg-[#2d7a72] transition-all flex items-center justify-center gap-3 disabled:opacity-50 uppercase text-xs tracking-widest"
              >
                {loading ? (
                  <FaSpinner className="animate-spin" />
                ) : (
                  <FaHandHoldingHeart />
                )}
                {loading ? 'Processing...' : 'Launch Drive'}
              </motion.button>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default CreateCampaign;
