import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useQuery, useQueryClient } from '@tanstack/react-query';
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
  FaCloudUploadAlt,
  FaSpinner,
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import useUserRole from '../../hooks/useUserRole';
import Swal from 'sweetalert2';
import { supabase } from '../../Supabase/supabase.config';

const Events = () => {
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  // 📷 ইমেজ আপলোড ও প্রিভিউ স্টেট
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [imageUploading, setImageUploading] = useState(false);

  const navigate = useNavigate();
  const [role] = useUserRole();
  const queryClient = useQueryClient();

  // --- ১. সুপাবেস থেকে ডাটা ফেচিং ---
  const {
    data: events = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw new Error(error.message);
      return data || [];
    },
    refetchOnWindowFocus: false,
  });

  // 📷 লোকাল প্রিভিউ হ্যান্ডলার
  const handleImageChange = e => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // 🌐 Supabase Storage ('Event' বাকেটে) ইমেজ আপলোড ফাংশন
  const uploadToSupabaseStorage = async file => {
    const fileExt = file.name.split('.').pop();
    const safeFileName = `${Date.now()}_${Math.random().toString(36).substring(2, 10)}.${fileExt}`;

    // 'Event' বাকেটে আপলোড করা হচ্ছে
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('Event') // আপনার বাকেটের নাম Event
      .upload(`banners/${safeFileName}`, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      throw new Error(`Storage Error: ${uploadError.message}`);
    }

    // আপলোড হওয়া ছবির পাবলিক ইউআরএল সংগ্রহ
    const { data: urlData } = supabase.storage
      .from('Event')
      .getPublicUrl(`banners/${safeFileName}`);

    return urlData.publicUrl;
  };

  // --- ২. সুপাবেস ডিলিট লজিক ---
  const handleDelete = async id => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This event will be permanently removed!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#37948b',
      cancelButtonColor: '#ef4444',
      confirmButtonText: 'Yes, delete it!',
      background: '#FFFBF7',
    }).then(async result => {
      if (result.isConfirmed) {
        try {
          const { error } = await supabase.from('events').delete().eq('id', id);

          if (error) throw error;

          queryClient.invalidateQueries({ queryKey: ['events'] });
          Swal.fire('Deleted!', 'Event removed successfully.', 'success');
        } catch (err) {
          console.error('Delete Error:', err);
          Swal.fire('Error', err.message || 'Failed to delete event.', 'error');
        }
      }
    });
  };

  // --- ৩. ফর্ম সাবমিট (Supabase Storage + Supabase Database) ---
  const handleSubmit = async e => {
    e.preventDefault();
    setActionLoading(true);
    const form = e.target;

    try {
      let finalImageUrl = editingEvent?.image_url || '';

      // নতুন ছবি সিলেক্ট করা থাকলে Supabase 'Event' বাকেটে আপলোড হবে
      if (imageFile) {
        setImageUploading(true);
        finalImageUrl = await uploadToSupabaseStorage(imageFile);
      } else if (!finalImageUrl) {
        Swal.fire('Warning', 'Please select an event banner image!', 'warning');
        setActionLoading(false);
        return;
      }

      const eventData = {
        title: form.title.value,
        location: form.location.value,
        date: form.date.value,
        image_url: finalImageUrl,
        description: form.description.value,
        ticket_price: parseFloat(form.ticket_price.value) || 0,
        total_seats: parseInt(form.total_seats.value) || 50,
        organizer_name: form.organizer_name.value || 'Pet Care Team',
      };

      if (editingEvent) {
        const { error } = await supabase
          .from('events')
          .update(eventData)
          .eq('id', editingEvent.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('events')
          .insert([{ ...eventData, created_at: new Date().toISOString() }]);

        if (error) throw error;
      }

      setShowModal(false);
      setEditingEvent(null);
      setImageFile(null);
      setImagePreview('');

      queryClient.invalidateQueries({ queryKey: ['events'] });

      Swal.fire({
        icon: 'success',
        title: editingEvent ? 'Event Updated!' : 'Event Published!',
        timer: 1500,
        showConfirmButton: false,
        background: '#FFFBF7',
      });
    } catch (err) {
      console.error('Action Error:', err);
      Swal.fire(
        'Error',
        err.message || 'Action failed. Check permissions.',
        'error'
      );
    } finally {
      setActionLoading(false);
      setImageUploading(false);
    }
  };

  const filteredEvents = events.filter(
    e =>
      e?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e?.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full min-h-screen bg-[#FFFBF7] dark:bg-gray-950 pt-28 pb-20 px-6 md:px-12">
      <div className="  mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-6">
          <h1 className="text-5xl md:text-6xl font-black text-gray-900 dark:text-white tracking-tighter">
            Pet <span className="text-[#37948b]">Events</span>
          </h1>

          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative flex-grow">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search events..."
                className="w-full pl-12 pr-6 py-4 rounded-2xl bg-white dark:bg-gray-900 shadow-sm border border-gray-100 dark:border-gray-800 outline-none focus:ring-2 ring-[#37948b] dark:text-white font-bold"
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            {role === 'admin' && (
              <button
                onClick={() => {
                  setEditingEvent(null);
                  setImagePreview('');
                  setImageFile(null);
                  setShowModal(true);
                }}
                className="bg-[#37948b] text-white p-5 rounded-2xl shadow-xl hover:scale-105 transition-all cursor-pointer"
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
            <AnimatePresence mode="popLayout">
              {filteredEvents.map(event => (
                <motion.div
                  layout
                  key={event.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ layout: { duration: 0.35, ease: 'easeInOut' } }}
                  className="bg-white dark:bg-gray-900 p-4 rounded-[2.5rem] shadow-xl group border border-transparent hover:border-[#37948b]/20 transition-all flex flex-col h-full"
                >
                  <div className="relative h-56 overflow-hidden rounded-[2rem] mb-6">
                    <img
                      src={
                        event.image_url || 'https://via.placeholder.com/600x400'
                      }
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    {role === 'admin' && (
                      <div className="absolute top-4 right-4 flex gap-2">
                        <button
                          onClick={() => {
                            setEditingEvent(event);
                            setImagePreview(event.image_url || '');
                            setImageFile(null);
                            setShowModal(true);
                          }}
                          className="p-3 bg-white/90 dark:bg-gray-900/90 text-amber-500 rounded-xl shadow-md hover:scale-110 transition-all cursor-pointer"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(event.id)}
                          className="p-3 bg-white/90 dark:bg-gray-900/90 text-red-500 rounded-xl shadow-md hover:scale-110 transition-all cursor-pointer"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="px-3 pb-4 flex-grow flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-4 mb-3 text-gray-400 font-bold text-[10px] uppercase tracking-widest">
                        <span className="flex items-center gap-1.5">
                          <FaCalendarAlt className="text-[#37948b]" />{' '}
                          {event.date}
                        </span>
                        <span className="flex items-center gap-1.5 truncate max-w-[140px]">
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
                    </div>
                    <button
                      onClick={() => navigate(`/events/${event.id}`)}
                      className="w-full py-4 bg-[#37948b] text-white font-black rounded-2xl shadow-lg hover:bg-[#2d7a72] transition-all uppercase tracking-widest text-xs cursor-pointer"
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

      {/* --- Create/Edit Event Modal --- */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-gray-900 p-8 md:p-10 rounded-[2.5rem] w-full max-w-2xl shadow-2xl relative my-8 border border-gray-100 dark:border-gray-800 max-h-[90vh] overflow-y-auto"
          >
            <button
              onClick={() => {
                setShowModal(false);
                setImagePreview('');
                setImageFile(null);
              }}
              className="absolute top-8 right-8 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
            >
              <FaTimes size={24} />
            </button>
            <h2 className="text-3xl font-black mb-8 dark:text-white tracking-tight">
              {editingEvent ? 'Update' : 'Post New'}{' '}
              <span className="text-[#37948b]">Event</span>
            </h2>

            <form
              onSubmit={handleSubmit}
              className="space-y-5 text-left font-sans"
            >
              {/* 📷 ইমেজ আপলোড ও প্রিভিউ বক্স (Supabase 'Event' Bucket) */}
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1 mb-2 block">
                  Event Banner (Click to Upload to Supabase Storage)
                </label>
                <div className="relative group w-full aspect-video rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 hover:border-[#37948b] overflow-hidden bg-gray-50 dark:bg-gray-800 transition-all flex items-center justify-center cursor-pointer">
                  {imagePreview ? (
                    <>
                      <img
                        src={imagePreview}
                        alt="Event Banner Preview"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center backdrop-blur-sm">
                        <FaCloudUploadAlt
                          size={36}
                          className="text-white mb-1"
                        />
                        <p className="text-white font-black text-xs uppercase tracking-wider">
                          Click to Change Image
                        </p>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center p-6 text-center">
                      <FaCloudUploadAlt
                        size={40}
                        className="text-[#37948b] mb-2"
                      />
                      <p className="text-xs font-bold text-gray-600 dark:text-gray-300">
                        Click to select banner image
                      </p>
                      <p className="text-[10px] text-gray-400 mt-1">
                        PNG, JPG, JPEG supported
                      </p>
                    </div>
                  )}

                  {/* হিডেন ফাইল ইনপুট */}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                  />

                  {imageUploading && (
                    <div className="absolute inset-0 bg-white/80 dark:bg-black/80 flex items-center justify-center z-20">
                      <FaSpinner className="animate-spin text-[#37948b] text-4xl" />
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1 mb-1 block">
                  Event Title
                </label>
                <input
                  name="title"
                  defaultValue={editingEvent?.title || ''}
                  placeholder="e.g. Annual Pet Adoption Fair"
                  className="w-full p-4 rounded-xl bg-gray-50 dark:bg-gray-800 dark:text-white outline-none border border-transparent focus:border-[#37948b] font-bold"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1 mb-1 block">
                    Location
                  </label>
                  <input
                    name="location"
                    defaultValue={editingEvent?.location || ''}
                    placeholder="City, Venue"
                    className="w-full p-4 rounded-xl bg-gray-50 dark:bg-gray-800 dark:text-white outline-none border border-transparent focus:border-[#37948b] font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1 mb-1 block">
                    Event Date
                  </label>
                  <input
                    name="date"
                    type="date"
                    defaultValue={editingEvent?.date || ''}
                    className="w-full p-4 rounded-xl bg-gray-50 dark:bg-gray-800 dark:text-white outline-none border border-transparent focus:border-[#37948b] font-bold"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1 mb-1 block">
                    Ticket Price ($)
                  </label>
                  <input
                    name="ticket_price"
                    type="number"
                    step="0.01"
                    defaultValue={editingEvent?.ticket_price || 0}
                    placeholder="0 for Free"
                    className="w-full p-4 rounded-xl bg-gray-50 dark:bg-gray-800 dark:text-white outline-none border border-transparent focus:border-[#37948b] font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1 mb-1 block">
                    Total Seats
                  </label>
                  <input
                    name="total_seats"
                    type="number"
                    defaultValue={editingEvent?.total_seats || 50}
                    placeholder="Seats"
                    className="w-full p-4 rounded-xl bg-gray-50 dark:bg-gray-800 dark:text-white outline-none border border-transparent focus:border-[#37948b] font-bold"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1 mb-1 block">
                  Organizer Name
                </label>
                <input
                  name="organizer_name"
                  defaultValue={editingEvent?.organizer_name || 'Pet Care Team'}
                  placeholder="Organizer Name"
                  className="w-full p-4 rounded-xl bg-gray-50 dark:bg-gray-800 dark:text-white outline-none border border-transparent focus:border-[#37948b] font-bold"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1 mb-1 block">
                  Event Description
                </label>
                <textarea
                  name="description"
                  defaultValue={editingEvent?.description || ''}
                  placeholder="Tell us about the event schedule, activities..."
                  className="w-full p-4 rounded-xl bg-gray-50 dark:bg-gray-800 dark:text-white h-32 outline-none border border-transparent focus:border-[#37948b] font-bold resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={actionLoading || imageUploading}
                className="w-full py-5 bg-[#37948b] text-white font-black rounded-2xl shadow-xl hover:bg-[#2d7a72] transition-all uppercase tracking-widest text-xs cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {actionLoading || imageUploading ? (
                  <>
                    <FaSpinner className="animate-spin text-base" /> Uploading &
                    Processing...
                  </>
                ) : editingEvent ? (
                  'Save Changes'
                ) : (
                  'Publish Event'
                )}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Events;
