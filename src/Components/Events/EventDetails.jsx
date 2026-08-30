import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaArrowLeft,
  FaClock,
  FaPaw,
  FaUserTie,
  FaTicketAlt,
  FaUsers,
  FaCheckCircle,
  FaInfoCircle,
} from 'react-icons/fa';
import useAuth from '../../hooks/useAuth';
import Swal from 'sweetalert2';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { supabase } from '../../Supabase/supabase.config';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  const [regLoading, setRegLoading] = useState(false);

  // ১. সুপাবেস থেকে ইভেন্টের তথ্য ও বুকড সিট সংখ্যা আনা
  const fetchEventDetails = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);

      const { data: eventData, error: eventError } = await supabase
        .from('events')
        .select('*')
        .eq('id', id)
        .single();

      if (eventError) throw eventError;

      const { count: regCount, error: countError } = await supabase
        .from('event_registrations')
        .select('*', { count: 'exact', head: true })
        .eq('event_id', id);

      if (!countError) {
        eventData.registeredCount = regCount || 0;
      }

      setEvent(eventData);
    } catch (err) {
      console.error('Error loading details from Supabase:', err.message);
    } finally {
      setLoading(false);
    }
  };

  // ২. ইউজার ইতিমধ্যে রেজিস্টার করেছেন কি না তা চেক করা
  const checkRegistration = async () => {
    if (!user?.email || !id) return;
    try {
      const { data, error } = await supabase
        .from('event_registrations')
        .select('id')
        .eq('event_id', id)
        .eq('user_email', user.email)
        .maybeSingle();

      if (error) throw error;
      setIsRegistered(!!data);
    } catch (err) {
      console.error('Check registration error:', err.message);
    }
  };

  useEffect(() => {
    fetchEventDetails();
    if (user?.email) checkRegistration();
  }, [id, user?.email]);

  // ৩. ইভেন্টে রেজিস্ট্রেশন করা (ডুপ্লিকেট চেক ও ফিক্সড এরর হ্যান্ডলিং)
  const handleRegister = async () => {
    if (!user) {
      return Swal.fire({
        icon: 'warning',
        title: 'Login Required',
        text: 'Please login first to join this event!',
        confirmButtonColor: '#37948b',
      });
    }

    setRegLoading(true);
    try {
      const regData = {
        event_id: id,
        user_email: user.email,
        user_name:
          user?.user_metadata?.full_name || user?.displayName || 'User',
      };

      const { error } = await supabase
        .from('event_registrations')
        .insert([regData]);

      if (error) {
        // ✅ যদি ইউজার ইতিমধ্যে রেজিস্টার করা থাকে (PostgreSQL Unique Constraint Violation)
        if (
          error.code === '23505' ||
          error.message?.toLowerCase().includes('unique') ||
          error.message?.toLowerCase().includes('duplicate')
        ) {
          setIsRegistered(true); // বাটন Registered করে দেওয়া
          return Swal.fire({
            icon: 'info',
            title: 'Already Registered!',
            text: 'You have already registered for this event.',
            confirmButtonColor: '#37948b',
            background: '#FFFBF7',
          });
        }
        throw error;
      }

      Swal.fire({
        title: 'Success!',
        text: 'Your registration is confirmed!',
        icon: 'success',
        confirmButtonColor: '#37948b',
        background: '#FFFBF7',
      });

      // বাটন আপডেট
      setIsRegistered(true);

      // রিলোড ছাড়াই বুকড সিট সংখ্যা রিফ্রেশ
      fetchEventDetails(false);
    } catch (err) {
      console.error('Registration Error:', err);
      Swal.fire({
        icon: 'error',
        title: 'Registration Failed',
        text: err.message || 'Action failed. Please check permissions.',
        confirmButtonColor: '#37948b',
      });
    } finally {
      setRegLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-32 px-6   mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8">
            <Skeleton height={450} borderRadius={40} />
          </div>
          <div className="lg:col-span-4">
            <Skeleton height={400} borderRadius={40} />
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <FaPaw className="text-6xl text-gray-300 mb-4 animate-bounce" />
        <h2 className="text-3xl font-black text-gray-800 dark:text-white uppercase tracking-widest mb-4">
          Event not found!
        </h2>
        <button
          onClick={() => navigate('/events')}
          className="px-8 py-3 bg-[#37948b] text-white rounded-2xl font-bold uppercase text-xs tracking-widest cursor-pointer"
        >
          Back to Events
        </button>
      </div>
    );
  }

  // ক্যালকুলেশন
  const totalSeats = Number(event?.total_seats) || 50;
  const registeredCount = Number(event?.registeredCount) || 0;
  const spotsLeft = Math.max(totalSeats - registeredCount, 0);
  const progressWidth = Math.min((registeredCount / totalSeats) * 100, 100);

  return (
    <div className="min-h-screen bg-[#FFFBF7] dark:bg-gray-950 pt-28 pb-20 px-6 md:px-12 font-sans">
      <div className="  mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-400 font-bold mb-8 hover:text-[#37948b] transition-all uppercase text-xs tracking-widest cursor-pointer"
        >
          <FaArrowLeft /> Back to Events
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="relative rounded-[3rem] overflow-hidden shadow-2xl bg-gray-100 dark:bg-gray-800"
            >
              <img
                src={event.image_url || 'https://via.placeholder.com/800x500'}
                alt={event.title}
                className="w-full h-[480px] object-cover"
              />
              <div className="absolute top-8 left-8 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md px-6 py-3 rounded-2xl flex items-center gap-3 shadow-lg border border-white/20">
                <FaTicketAlt className="text-[#37948b]" />
                <span className="font-black text-[#37948b] text-sm">
                  {event.ticket_price > 0
                    ? `$${Number(event.ticket_price).toFixed(2)}`
                    : 'Free Entry'}
                </span>
              </div>
            </motion.div>

            <div className="mt-12">
              <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-8 tracking-tighter">
                {event.title}
              </h1>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10 pb-10 border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-teal-50 dark:bg-teal-900/20 rounded-2xl flex items-center justify-center text-[#37948b]">
                    <FaCalendarAlt size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      Date
                    </p>
                    <p className="font-bold dark:text-white text-sm">
                      {event.date}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-teal-50 dark:bg-teal-900/20 rounded-2xl flex items-center justify-center text-[#37948b]">
                    <FaMapMarkerAlt size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      Location
                    </p>
                    <p className="font-bold dark:text-white text-sm truncate max-w-[150px]">
                      {event.location}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-teal-50 dark:bg-teal-900/20 rounded-2xl flex items-center justify-center text-[#37948b]">
                    <FaUserTie size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      Organizer
                    </p>
                    <p className="font-bold dark:text-white text-sm">
                      {event.organizer_name || 'Pet Care Team'}
                    </p>
                  </div>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-lg whitespace-pre-line leading-relaxed font-medium">
                {event.description}
              </p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4">
            <div className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-gray-800 sticky top-32">
              <h3 className="text-lg font-black dark:text-white mb-8 flex justify-between items-center">
                Registration{' '}
                <span className="text-[10px] bg-teal-50 text-[#37948b] px-3 py-1 rounded-full font-black uppercase tracking-widest border border-teal-100">
                  LIVE
                </span>
              </h3>

              <div className="mb-10">
                <div className="flex justify-between text-xs font-black mb-3 text-gray-400 tracking-widest">
                  <span>BOOKED SEATS</span>
                  <span className="text-[#37948b]">
                    {registeredCount} / {totalSeats}
                  </span>
                </div>
                <div className="w-full h-3 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden p-0.5">
                  <motion.div
                    animate={{ width: `${progressWidth}%` }}
                    transition={{ duration: 1 }}
                    className="h-full bg-gradient-to-r from-[#37948b] to-[#4DB6AC] rounded-full"
                  />
                </div>
                <p className="text-[10px] text-gray-400 mt-3 font-bold uppercase tracking-widest">
                  {spotsLeft > 0
                    ? `Only ${spotsLeft} spots remaining!`
                    : 'Event is Full'}
                </p>
              </div>

              <button
                onClick={handleRegister}
                disabled={isRegistered || spotsLeft <= 0 || regLoading}
                className={`w-full py-5 rounded-2xl font-black transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-xs shadow-xl cursor-pointer ${
                  isRegistered
                    ? 'bg-emerald-50 text-emerald-600 border border-emerald-100 cursor-not-allowed'
                    : spotsLeft <= 0
                      ? 'bg-red-50 text-red-400 cursor-not-allowed'
                      : 'bg-[#37948b] text-white hover:bg-[#2d7a72] shadow-[#37948b44]'
                }`}
              >
                {regLoading ? (
                  'Processing...'
                ) : isRegistered ? (
                  <>
                    <FaCheckCircle /> You Are Registered
                  </>
                ) : spotsLeft <= 0 ? (
                  'Sold Out'
                ) : (
                  'Confirm Registration'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
