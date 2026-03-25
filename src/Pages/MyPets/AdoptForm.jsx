import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import useAuth from '../../hooks/useAuth';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import {
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaEnvelope,
  FaUser,
  FaPaw,
  FaPaperPlane,
  FaHeart,
} from 'react-icons/fa';

const AdoptForm = () => {
  const { id } = useParams(); // Pet ID
  const { user } = useAuth();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();

  const [formData, setFormData] = useState({
    phone: '',
    address: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!user) {
      Swal.fire({
        icon: 'error',
        title: 'Authentication Required',
        text: 'Please login to submit an adoption request.',
        confirmButtonColor: '#37948b',
      });
      return;
    }

    // ডাটাবেজের কলামের সাথে হুবহু মিল রাখা হয়েছে
    const adoptionData = {
      pet_id: id,
      user_name:
        user?.user_metadata?.full_name || user?.displayName || 'Anonymous',
      user_email: user?.email,
      phone: formData.phone,
      address: formData.address,
      message: formData.message,
      status: 'pending',
      created_at: new Date().toISOString(),
    };

    try {
      setLoading(true);
      const res = await axiosSecure.post('/adoptions', adoptionData);

      // ✅ মঙ্গোডিবি (insertedId) এবং সুপাবেস (success) দুটোর জন্যই ফিক্স
      if (res.data?.insertedId || res.data?.success || res.status === 201) {
        Swal.fire({
          icon: 'success',
          title: 'Request Submitted!',
          text: 'The owner will review your application soon.',
          showConfirmButton: false,
          timer: 2500,
          background: '#FFFBF7',
        });
        navigate('/dashboard/adoptions');
      } else {
        throw new Error('Insertion failed on the server.');
      }
    } catch (error) {
      console.error('❌ Submission error:', error.response?.data || error);
      Swal.fire({
        icon: 'error',
        title: 'Submission Failed',
        text:
          error.response?.data?.message ||
          'Check your database permissions or network.',
        confirmButtonColor: '#37948b',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#FFFBF7] dark:bg-gray-950 pt-28 pb-20 px-6 md:px-12 lg:px-20 overflow-hidden relative">
      {/* --- Background Decor --- */}
      <div className="absolute top-0 right-0 p-10 opacity-5 text-[#37948b] pointer-events-none">
        <FaPaw size={400} className="rotate-12" />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* --- Page Header --- */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#37948b]/10 text-[#37948b] font-black text-xs uppercase tracking-[0.2em] mb-4"
          >
            <FaHeart className="animate-pulse" /> Adoption Application
          </motion.div>
          <h2 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white leading-tight tracking-tighter">
            Submit Your <span className="text-[#37948b]">Request</span>
          </h2>
          <p className="text-gray-500 font-bold mt-4 max-w-lg mx-auto italic">
            "By adopting, you are not only giving a pet a home, you are giving
            them a new life."
          </p>
        </div>

        {/* --- Form Container --- */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-900 rounded-[3rem] shadow-2xl shadow-teal-900/5 border border-gray-100 dark:border-gray-800 p-8 md:p-12"
        >
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {/* Read-Only Info Section */}
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                  Full Name
                </label>
                <div className="relative">
                  <FaUser className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" />
                  <input
                    type="text"
                    value={
                      user?.user_metadata?.full_name || user?.displayName || ''
                    }
                    readOnly
                    className="w-full pl-12 pr-6 py-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border-2 border-transparent text-gray-400 font-bold cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                  Email Address
                </label>
                <div className="relative">
                  <FaEnvelope className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" />
                  <input
                    type="email"
                    value={user?.email || ''}
                    readOnly
                    className="w-full pl-12 pr-6 py-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border-2 border-transparent text-gray-400 font-bold cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="p-6 bg-teal-50 dark:bg-teal-900/20 rounded-[2rem] border border-teal-100 dark:border-teal-800/30">
                <h4 className="font-black text-[#37948b] text-sm uppercase tracking-widest mb-3 flex items-center gap-2">
                  <FaPaw /> Next Steps
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-bold leading-relaxed">
                  Once submitted, the pet owner will receive your contact
                  details and message. They will reach out to you via phone or
                  email for a meet-and-greet.
                </p>
              </div>
            </div>

            {/* Editable Info Section */}
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                  Phone Number
                </label>
                <div className="relative group">
                  <FaPhoneAlt className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#37948b] transition-colors" />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="e.g. +880 1XXX-XXXXXX"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full pl-12 pr-6 py-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border-2 border-transparent focus:border-[#37948b] focus:bg-white dark:focus:bg-gray-900 transition-all font-bold dark:text-white outline-none"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                  Current Address
                </label>
                <div className="relative group">
                  <FaMapMarkerAlt className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#37948b] transition-colors" />
                  <input
                    type="text"
                    name="address"
                    placeholder="Street, City, Country"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full pl-12 pr-6 py-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border-2 border-transparent focus:border-[#37948b] focus:bg-white dark:focus:bg-gray-900 transition-all font-bold dark:text-white outline-none"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                  Message to Owner
                </label>
                <textarea
                  name="message"
                  placeholder="Tell them why you're a good fit for this pet..."
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border-2 border-transparent focus:border-[#37948b] focus:bg-white dark:focus:bg-gray-900 transition-all font-bold dark:text-white outline-none resize-none"
                  rows={4}
                  required
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02, backgroundColor: '#2d7a72' }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full py-5 bg-[#37948b] text-white font-black rounded-2xl shadow-xl shadow-[#37948b33] flex items-center justify-center gap-3 transition-all uppercase tracking-widest text-xs disabled:opacity-70"
              >
                {loading ? (
                  <FaPaw className="animate-spin text-lg" />
                ) : (
                  <FaPaperPlane className="text-lg" />
                )}
                {loading ? 'Submitting Request...' : 'Send Application'}
              </motion.button>
            </div>
          </form>
        </motion.div>

        {/* --- Footer Note --- */}
        <p className="mt-10 text-center text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-relaxed">
          Secure Application Portal. Your privacy is our priority.
        </p>
      </div>
    </div>
  );
};

export default AdoptForm;
