import React, { useState } from 'react';
import { FaGithub, FaPaw } from 'react-icons/fa';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import { supabase } from '../Supabase/supabase.config';

const GithubLogin = () => {
  const [loading, setLoading] = useState(false);

  const handleGithubLogin = async () => {
    if (loading) return;
    setLoading(true);

    try {
      // সুপাবেস দিয়ে গিটহাব লগইন লজিক
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: window.location.origin, // লগইন শেষে এই সাইটেই ফিরবে
        },
      });

      if (error) throw error;

      // নোট: সুপাবেস অটোমেটিক রিডাইরেক্ট করে, তাই সাকসেস মেসেজ রিডাইরেক্টের পর আসবে
    } catch (error) {
      console.error('Github Login Error:', error.message);

      // যদি একই ইমেইল দিয়ে অন্য একাউন্ট থাকে
      if (error.message.includes('Account exists with different credential')) {
        Swal.fire({
          icon: 'info',
          title: 'Account Conflict',
          text: 'An account with this email already exists. Please try logging in with Google or Email.',
          confirmButtonColor: '#37948b',
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Login Error',
          text: error.message,
          confirmButtonColor: '#37948b',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.button
      whileHover={{
        scale: 1.02,
        backgroundColor: '#2d7a72',
        boxShadow: '0px 10px 20px rgba(55, 148, 139, 0.2)',
      }}
      whileTap={{ scale: 0.98 }}
      onClick={handleGithubLogin}
      disabled={loading}
      className="flex items-center justify-center w-full p-4 space-x-4 border-2 border-[#37948b] rounded-2xl bg-[#37948b] text-white font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
    >
      {loading ? (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        >
          <FaPaw className="text-2xl" />
        </motion.div>
      ) : (
        <FaGithub
          size="24px"
          className="group-hover:rotate-12 transition-transform"
        />
      )}

      <span className="tracking-wide">
        {loading ? 'Connecting to GitHub...' : 'Continue with GitHub'}
      </span>
    </motion.button>
  );
};

export default GithubLogin;
