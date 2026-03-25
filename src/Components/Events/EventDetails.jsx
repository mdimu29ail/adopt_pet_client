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
import useAxios from '../../hooks/useAxios';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import useAuth from '../../hooks/useAuth';
import Swal from 'sweetalert2';
import Skeleton from 'react-loading-skeleton';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const axiosPublic = useAxios();
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  const [regLoading, setRegLoading] = useState(false);

  useEffect(() => {
    fetchEventDetails();
    if (user?.email) checkRegistration();
  }, [id, user]);

  // ডাটা ফেচ করার ফাংশন
  const fetchEventDetails = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      const res = await axiosPublic.get(`/events/${id}`);
      console.log('Fresh Event Data:', res.data); // কনসোলে ডাটা চেক করুন
      setEvent(res.data);
    } catch (err) {
      console.error('Error loading details:', err);
    } finally {
      setLoading(false);
    }
  };

  const checkRegistration = async () => {
    try {
      const res = await axiosSecure.get(
        `/event-registrations/check?event_id=${id}&email=${user.email}`,
      );
      setIsRegistered(res.data.isRegistered);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRegister = async () => {
    if (!user) return Swal.fire('Login!', 'Please login first', 'warning');

    setRegLoading(true);
    try {
      const regData = {
        event_id: id,
        user_email: user.email,
        user_name: user.displayName || 'User',
      };

      const res = await axiosSecure.post('/event-registrations', regData);

      if (res.data.success) {
        Swal.fire({
          title: 'Success!',
          text: 'Registration confirmed!',
          icon: 'success',
          confirmButtonColor: '#37948b',
        });

        // বাটন আপডেট
        setIsRegistered(true);

        // ✅ এখানে লোডিং ছাড়াই বুকড সিটস আপডেট হবে
        fetchEventDetails(false);
      }
    } catch (err) {
      Swal.fire(
        'Error',
        err.response?.data?.message || 'Action failed',
        'error',
      );
    } finally {
      setRegLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-32 px-6 max-w-7xl mx-auto">
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

  if (!event)
    return (
      <div className="text-center py-40 font-black text-2xl">
        Event not found!
      </div>
    );

  // ক্যালকুলেশন ফিক্স (UI Safety)
  const totalSeats = Number(event?.total_seats) || 50;
  const registeredCount = Number(event?.registeredCount) || 0;
  const spotsLeft = totalSeats - registeredCount;
  const progressWidth = Math.min((registeredCount / totalSeats) * 100, 100);

  return (
    <div className="min-h-screen bg-[#FFFBF7] dark:bg-gray-950 pt-28 pb-20 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-400 font-bold mb-8 hover:text-[#37948b] transition-all uppercase text-xs tracking-widest"
        >
          <FaArrowLeft /> Back to Events
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative rounded-[3rem] overflow-hidden shadow-2xl"
            >
              <img
                src={event.image_url}
                alt=""
                className="w-full h-[500px] object-cover"
              />
              <div className="absolute top-8 left-8 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md px-6 py-3 rounded-2xl flex items-center gap-3">
                <FaTicketAlt className="text-[#37948b]" />
                <span className="font-black text-[#37948b]">
                  {event.ticket_price > 0
                    ? `$${event.ticket_price}`
                    : 'Free Entry'}
                </span>
              </div>
            </motion.div>

            <div className="mt-12">
              <h1 className="text-5xl font-black text-gray-900 dark:text-white mb-8 tracking-tighter">
                {event.title}
              </h1>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10 pb-10 border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-teal-50 dark:bg-teal-900/20 rounded-xl flex items-center justify-center text-[#37948b]">
                    <FaCalendarAlt />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase">
                      Date
                    </p>
                    <p className="font-bold dark:text-white">{event.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-teal-50 dark:bg-teal-900/20 rounded-xl flex items-center justify-center text-[#37948b]">
                    <FaMapMarkerAlt />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase">
                      Location
                    </p>
                    <p className="font-bold dark:text-white truncate">
                      {event.location}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-teal-50 dark:bg-teal-900/20 rounded-xl flex items-center justify-center text-[#37948b]">
                    <FaUserTie />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase">
                      Organizer
                    </p>
                    <p className="font-bold dark:text-white">
                      {event.organizer_name || 'Pet Care Team'}
                    </p>
                  </div>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-lg whitespace-pre-line">
                {event.description}
              </p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4">
            <div className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] shadow-2xl border border-gray-50 dark:border-gray-800 sticky top-32">
              <h3 className="text-lg font-black dark:text-white mb-8 flex justify-between items-center">
                Registration{' '}
                <span className="text-[10px] bg-teal-50 text-[#37948b] px-3 py-1 rounded-full">
                  LIVE
                </span>
              </h3>

              <div className="mb-10">
                <div className="flex justify-between text-xs font-bold mb-3 text-gray-400">
                  <span>BOOKED SEATS</span>
                  <span className="text-[#37948b]">
                    {registeredCount} / {totalSeats}
                  </span>
                </div>
                <div className="w-full h-3 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <motion.div
                    animate={{ width: `${progressWidth}%` }}
                    transition={{ duration: 1 }}
                    className="h-full bg-[#37948b] rounded-full"
                  />
                </div>
                <p className="text-[10px] text-gray-400 mt-3 font-bold uppercase">
                  {spotsLeft > 0
                    ? `Only ${spotsLeft} spots remaining!`
                    : 'Event is Full'}
                </p>
              </div>

              <button
                onClick={handleRegister}
                disabled={isRegistered || spotsLeft <= 0 || regLoading}
                className={`w-full py-5 rounded-2xl font-black transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-xs shadow-xl ${
                  isRegistered
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : spotsLeft <= 0
                      ? 'bg-red-50 text-red-400'
                      : 'bg-[#37948b] text-white hover:brightness-110 shadow-[#37948b44]'
                }`}
              >
                {regLoading ? (
                  'Processing...'
                ) : isRegistered ? (
                  <>
                    <FaCheckCircle /> Registered
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
