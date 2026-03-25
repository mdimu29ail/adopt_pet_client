import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useQuery, useQueryClient } from '@tanstack/react-query'; // React Query যুক্ত করা হয়েছে
import {
  FaMapMarkerAlt,
  FaPlus,
  FaTimes,
  FaEdit,
  FaTrash,
  FaSearch,
  FaCalendarAlt,
  FaTicketAlt,
  FaUsers,
  FaUserTie,
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import useAxios from '../../hooks/useAxios';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import useUserRole from '../../hooks/useUserRole';
import Swal from 'sweetalert2';

const Events = () => {
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const navigate = useNavigate();
  const axiosPublic = useAxios();
  const axiosSecure = useAxiosSecure();
  const [role] = useUserRole();
  const queryClient = useQueryClient(); // কুয়েরি ইনভ্যালিডেট করার জন্য

  // --- ডাটা ফেচিং (React Query দিয়ে) ---
  const {
    data: events = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const res = await axiosPublic.get('/events');
      return res.data;
    },
    // এই অপশনটি মিনিমাইজ করে ফিরে আসলে অটো রিলোড বন্ধ বা চালু করতে পারে
    refetchOnWindowFocus: false,
  });

  // ডিলিট লজিক
  const handleDelete = async id => {
    Swal.fire({
      title: 'Are you sure?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#37948b',
      confirmButtonText: 'Yes, delete it!',
    }).then(async result => {
      if (result.isConfirmed) {
        try {
          const res = await axiosSecure.delete(`/events/${id}`);
          if (res.data.success) {
            // ম্যানুয়াল রিলোড ছাড়াই ডাটা আপডেট হবে
            queryClient.invalidateQueries(['events']);
            Swal.fire('Deleted!', 'Event removed.', 'success');
          }
        } catch (err) {
          Swal.fire('Error', 'Failed to delete.', 'error');
        }
      }
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const form = e.target;
    const eventData = {
      title: form.title.value,
      location: form.location.value,
      date: form.date.value,
      image_url: form.image_url.value,
      description: form.description.value,
      ticket_price: parseFloat(form.ticket_price.value) || 0,
      total_seats: parseInt(form.total_seats.value) || 50,
      organizer_name: form.organizer_name.value || 'Pet Care Team',
    };

    try {
      let res;
      if (editingEvent) {
        res = await axiosSecure.patch(`/events/${editingEvent.id}`, eventData);
      } else {
        res = await axiosSecure.post('/events', eventData);
      }

      if (res.data.success) {
        setShowModal(false);
        setEditingEvent(null);
        // ডাটা অটোমেটিক আপডেট হবে, রিলোড লাগবে না
        queryClient.invalidateQueries(['events']);
        Swal.fire('Success!', editingEvent ? 'Updated' : 'Posted', 'success');
      }
    } catch (err) {
      Swal.fire('Error', 'Action failed.', 'error');
    }
  };

  const filteredEvents = events.filter(
    e =>
      e?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e?.location?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="w-full min-h-screen bg-[#FFFBF7] dark:bg-gray-950 pt-28 pb-20 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-6">
          <h1 className="text-5xl md:text-6xl font-black text-gray-900 dark:text-white tracking-tighter">
            Pet <span className="text-[#37948b]">Events</span>
          </h1>

          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative flex-grow">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-12 pr-6 py-4 rounded-2xl bg-white dark:bg-gray-900 shadow-sm border border-gray-100 outline-none focus:ring-2 ring-[#37948b] dark:text-white font-bold"
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            {role === 'admin' && (
              <button
                onClick={() => {
                  setEditingEvent(null);
                  setShowModal(true);
                }}
                className="bg-[#37948b] text-white p-5 rounded-2xl shadow-xl hover:scale-105 transition-all"
              >
                <FaPlus />
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {isLoading ? (
            [...Array(3)].map((_, i) => (
              <Skeleton
                key={i}
                height={350}
                borderRadius={30}
                className="mb-6"
              />
            ))
          ) : (
            <AnimatePresence>
              {filteredEvents.map(event => (
                <motion.div
                  layout
                  key={event.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-white dark:bg-gray-900 p-4 rounded-[2.5rem] shadow-xl group border border-transparent hover:border-[#37948b]/20 transition-all flex flex-col h-full"
                >
                  <div className="relative h-56 overflow-hidden rounded-[2rem] mb-6">
                    <img
                      src={event.image_url}
                      alt=""
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    {role === 'admin' && (
                      <div className="absolute top-4 right-4 flex gap-2">
                        <button
                          onClick={() => {
                            setEditingEvent(event);
                            setShowModal(true);
                          }}
                          className="p-3 bg-white/90 text-amber-500 rounded-xl shadow-md"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(event.id)}
                          className="p-3 bg-white/90 text-red-500 rounded-xl shadow-md"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="px-3 pb-4 flex-grow">
                    <div className="flex items-center gap-4 mb-3 text-gray-400 font-bold text-[10px] uppercase tracking-widest">
                      <span className="flex items-center gap-1.5">
                        <FaCalendarAlt className="text-[#37948b]" />{' '}
                        {event.date}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <FaMapMarkerAlt className="text-[#37948b]" />{' '}
                        {event.location}
                      </span>
                    </div>
                    <h3 className="text-2xl font-black dark:text-white mb-3 line-clamp-1">
                      {event.title}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 line-clamp-2">
                      {event.description}
                    </p>
                    <button
                      onClick={() => navigate(`/events/${event.id}`)}
                      className="w-full py-4 bg-[#37948b] text-white font-black rounded-2xl shadow-lg hover:bg-[#2d7a72] transition-all uppercase tracking-widest text-xs"
                    >
                      View Details
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>

      {/* --- Modal --- */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] w-full max-w-2xl shadow-2xl relative my-8"
          >
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-8 right-8 text-gray-400 hover:text-red-500 transition-colors"
            >
              <FaTimes size={24} />
            </button>
            <h2 className="text-3xl font-black mb-8 dark:text-white">
              {editingEvent ? 'Update' : 'Post New'}{' '}
              <span className="text-[#37948b]">Event</span>
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5 text-left">
              <input
                name="title"
                defaultValue={editingEvent?.title}
                placeholder="Event Title"
                className="w-full p-4 rounded-xl bg-gray-50 dark:bg-gray-800 dark:text-white outline-none"
                required
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <input
                  name="location"
                  defaultValue={editingEvent?.location}
                  placeholder="Location"
                  className="w-full p-4 rounded-xl bg-gray-50 dark:bg-gray-800 dark:text-white outline-none"
                  required
                />
                <input
                  name="date"
                  type="date"
                  defaultValue={editingEvent?.date}
                  className="w-full p-4 rounded-xl bg-gray-50 dark:bg-gray-800 dark:text-white outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <input
                  name="ticket_price"
                  type="number"
                  step="0.01"
                  defaultValue={editingEvent?.ticket_price || 0}
                  placeholder="Price"
                  className="w-full p-4 rounded-xl bg-gray-50 dark:bg-gray-800 dark:text-white outline-none"
                  required
                />
                <input
                  name="total_seats"
                  type="number"
                  defaultValue={editingEvent?.total_seats || 50}
                  placeholder="Seats"
                  className="w-full p-4 rounded-xl bg-gray-50 dark:bg-gray-800 dark:text-white outline-none"
                  required
                />
              </div>

              <input
                name="organizer_name"
                defaultValue={editingEvent?.organizer_name || 'Pet Care Team'}
                placeholder="Organizer Name"
                className="w-full p-4 rounded-xl bg-gray-50 dark:bg-gray-800 dark:text-white outline-none"
              />
              <input
                name="image_url"
                defaultValue={editingEvent?.image_url}
                placeholder="Image URL"
                className="w-full p-4 rounded-xl bg-gray-50 dark:bg-gray-800 dark:text-white outline-none"
                required
              />

              <textarea
                name="description"
                defaultValue={editingEvent?.description}
                placeholder="Description"
                className="w-full p-4 rounded-xl bg-gray-50 dark:bg-gray-800 dark:text-white h-32 outline-none resize-none"
                required
              />

              <button
                type="submit"
                className="w-full py-5 bg-[#37948b] text-white font-black rounded-2xl"
              >
                {editingEvent ? 'Save Changes' : 'Publish Event'}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Events;
