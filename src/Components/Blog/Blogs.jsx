import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import {
  FaPlus,
  FaTimes,
  FaEdit,
  FaTrash,
  FaSearch,
  FaUser,
  FaClock,
  FaCloudUploadAlt,
  FaSpinner,
  FaBookOpen,
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import useUserRole from '../../hooks/useUserRole';
import Swal from 'sweetalert2';
import { supabase } from '../../Supabase/supabase.config'; // Supabase Client ইম্পোর্ট

const Blogs = () => {
  const [showModal, setShowModal] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  // 📷 ইমেজ আপলোড ও প্রিভিউ স্টেট
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [imageUploading, setImageUploading] = useState(false);

  const navigate = useNavigate();
  const [role] = useUserRole();
  const queryClient = useQueryClient();

  // --- ১. সুপাবেস থেকে ব্লগ ডাটা ফেচিং ---
  const { data: blogs = [], isLoading } = useQuery({
    queryKey: ['blogs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blogs') // আপনার Supabase blogs টেবিলের নাম
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

  // 🌐 Supabase Storage-এ ইমেজ আপলোড ফাংশন
  const uploadToSupabaseStorage = async file => {
    const fileExt = file.name.split('.').pop();
    const safeFileName = `${Date.now()}_${Math.random().toString(36).substring(2, 10)}.${fileExt}`;

    // 'Event' বাকেট বা আপনার ব্যবহৃত বাকেটে আপলোড করা হচ্ছে
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('Event') // আপনার বাকেটের নাম
      .upload(`blogs/${safeFileName}`, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      throw new Error(`Storage Error: ${uploadError.message}`);
    }

    const { data: urlData } = supabase.storage
      .from('Event')
      .getPublicUrl(`blogs/${safeFileName}`);

    return urlData.publicUrl;
  };

  // --- ২. সুপাবেস ডিলিট লজিক ---
  const handleDelete = async id => {
    Swal.fire({
      title: 'Delete this blog?',
      text: 'This action cannot be undone!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#37948b',
      cancelButtonColor: '#ef4444',
      confirmButtonText: 'Yes, delete it!',
      background: '#FFFBF7',
    }).then(async result => {
      if (result.isConfirmed) {
        try {
          const { error } = await supabase.from('blogs').delete().eq('id', id);

          if (error) throw error;

          queryClient.invalidateQueries({ queryKey: ['blogs'] });
          Swal.fire('Deleted!', 'Blog has been removed.', 'success');
        } catch (err) {
          console.error('Delete Error:', err);
          Swal.fire('Error', err.message || 'Failed to delete blog.', 'error');
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
      let finalImageUrl = editingBlog?.image_url || '';

      // নতুন ইমেজ সিলেক্ট করা থাকলে Supabase-এ আপলোড হবে
      if (imageFile) {
        setImageUploading(true);
        finalImageUrl = await uploadToSupabaseStorage(imageFile);
      } else if (!finalImageUrl) {
        Swal.fire('Warning', 'Please select a blog cover image!', 'warning');
        setActionLoading(false);
        return;
      }

      const blogData = {
        title: form.title.value,
        author: form.author.value,
        category: form.category.value,
        reading_time: form.reading_time.value,
        image_url: finalImageUrl,
        excerpt: form.excerpt.value,
        content: form.content.value,
        tags: form.tags.value
          ? form.tags.value.split(',').map(tag => tag.trim())
          : [],
      };

      if (editingBlog) {
        const { error } = await supabase
          .from('blogs')
          .update(blogData)
          .eq('id', editingBlog.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('blogs')
          .insert([{ ...blogData, created_at: new Date().toISOString() }]);

        if (error) throw error;
      }

      setShowModal(false);
      setEditingBlog(null);
      setImageFile(null);
      setImagePreview('');

      queryClient.invalidateQueries({ queryKey: ['blogs'] });

      Swal.fire({
        icon: 'success',
        title: editingBlog ? 'Blog Updated!' : 'Blog Published!',
        timer: 1500,
        showConfirmButton: false,
        background: '#FFFBF7',
      });
    } catch (err) {
      console.error('Action Error:', err);
      Swal.fire(
        'Error',
        err.message || 'Action failed. Check database permissions.',
        'error'
      );
    } finally {
      setActionLoading(false);
      setImageUploading(false);
    }
  };

  const filteredBlogs = blogs.filter(
    b =>
      b?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b?.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full min-h-screen bg-[#FFFBF7] dark:bg-gray-950 pt-28 pb-20 px-6 md:px-12 font-sans">
      <div className="  mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-6">
          <h1 className="text-5xl md:text-6xl font-black text-gray-900 dark:text-white tracking-tighter">
            Pet <span className="text-[#37948b]">Blogs</span>
          </h1>

          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative flex-grow">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search blogs..."
                className="w-full pl-12 pr-6 py-4 rounded-2xl bg-white dark:bg-gray-900 shadow-sm border border-gray-100 dark:border-gray-800 outline-none focus:ring-2 ring-[#37948b] dark:text-white font-bold"
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            {role === 'admin' && (
              <button
                onClick={() => {
                  setEditingBlog(null);
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
            /* ✅ mode="popLayout" এর কারণে ডিলিট হলে গ্রিডে কোনো ফাঁকা জায়গা থাকবে না */
            <AnimatePresence mode="popLayout">
              {filteredBlogs.map(blog => (
                <motion.div
                  layout
                  key={blog.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ layout: { duration: 0.35, ease: 'easeInOut' } }}
                  className="bg-white dark:bg-gray-900 p-4 rounded-[2.5rem] shadow-xl group border border-transparent hover:border-[#37948b]/20 transition-all flex flex-col h-full"
                >
                  <div className="relative h-56 overflow-hidden rounded-[2rem] mb-6">
                    <img
                      src={
                        blog.image_url || 'https://via.placeholder.com/600x400'
                      }
                      alt={blog.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    {role === 'admin' && (
                      <div className="absolute top-4 right-4 flex gap-2">
                        <button
                          onClick={() => {
                            setEditingBlog(blog);
                            setImagePreview(blog.image_url || '');
                            setImageFile(null);
                            setShowModal(true);
                          }}
                          className="p-3 bg-white/90 dark:bg-gray-900/90 text-amber-500 rounded-xl shadow-md hover:scale-110 transition-all cursor-pointer"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(blog.id)}
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
                          <FaUser className="text-[#37948b]" />{' '}
                          {blog.author || 'Admin'}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <FaClock className="text-[#37948b]" />{' '}
                          {blog.reading_time || '3 min'}
                        </span>
                      </div>
                      <h3 className="text-2xl font-black dark:text-white mb-3 line-clamp-1">
                        {blog.title}
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 line-clamp-2">
                        {blog.excerpt}
                      </p>
                    </div>
                    <button
                      onClick={() => navigate(`/blogs/${blog.id}`)}
                      className="w-full py-4 bg-[#37948b] text-white font-black rounded-2xl shadow-lg hover:bg-[#2d7a72] transition-all uppercase tracking-widest text-xs cursor-pointer flex items-center justify-center gap-2"
                    >
                      <FaBookOpen /> Read Story
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>

      {/* --- Create/Edit Blog Modal --- */}
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
              {editingBlog ? 'Edit' : 'Post New'}{' '}
              <span className="text-[#37948b]">Blog</span>
            </h2>

            <form
              onSubmit={handleSubmit}
              className="space-y-5 text-left font-sans"
            >
              {/* 📷 ইমেজ আপলোড ও প্রিভিউ বক্স */}
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1 mb-2 block">
                  Blog Banner Photo (Click to Upload)
                </label>
                <div className="relative group w-full aspect-video rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 hover:border-[#37948b] overflow-hidden bg-gray-50 dark:bg-gray-800 transition-all flex items-center justify-center cursor-pointer">
                  {imagePreview ? (
                    <>
                      <img
                        src={imagePreview}
                        alt="Blog Banner Preview"
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
                  Blog Title
                </label>
                <input
                  name="title"
                  defaultValue={editingBlog?.title || ''}
                  placeholder="e.g. 10 Essential Tips for First-Time Puppy Owners"
                  className="w-full p-4 rounded-xl bg-gray-50 dark:bg-gray-800 dark:text-white outline-none border border-transparent focus:border-[#37948b] font-bold"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1 mb-1 block">
                    Author
                  </label>
                  <input
                    name="author"
                    defaultValue={editingBlog?.author || 'Admin'}
                    placeholder="Author Name"
                    className="w-full p-4 rounded-xl bg-gray-50 dark:bg-gray-800 dark:text-white outline-none border border-transparent focus:border-[#37948b] font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1 mb-1 block">
                    Category
                  </label>
                  <input
                    name="category"
                    defaultValue={editingBlog?.category || ''}
                    placeholder="e.g. Pet Care, Nutrition"
                    className="w-full p-4 rounded-xl bg-gray-50 dark:bg-gray-800 dark:text-white outline-none border border-transparent focus:border-[#37948b] font-bold"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1 mb-1 block">
                    Reading Time
                  </label>
                  <input
                    name="reading_time"
                    defaultValue={editingBlog?.reading_time || '5 min read'}
                    placeholder="e.g. 5 min read"
                    className="w-full p-4 rounded-xl bg-gray-50 dark:bg-gray-800 dark:text-white outline-none border border-transparent focus:border-[#37948b] font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1 mb-1 block">
                    Tags (Comma Separated)
                  </label>
                  <input
                    name="tags"
                    defaultValue={editingBlog?.tags?.join(', ') || ''}
                    placeholder="dogs, health, adoption"
                    className="w-full p-4 rounded-xl bg-gray-50 dark:bg-gray-800 dark:text-white outline-none border border-transparent focus:border-[#37948b] font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1 mb-1 block">
                  Short Summary (Excerpt)
                </label>
                <textarea
                  name="excerpt"
                  defaultValue={editingBlog?.excerpt || ''}
                  placeholder="A brief summary for preview..."
                  className="w-full p-4 rounded-xl bg-gray-50 dark:bg-gray-800 dark:text-white h-24 outline-none border border-transparent focus:border-[#37948b] font-medium resize-none"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1 mb-1 block">
                  Full Blog Content
                </label>
                <textarea
                  name="content"
                  defaultValue={editingBlog?.content || ''}
                  placeholder="Write your complete story or article here..."
                  className="w-full p-4 rounded-xl bg-gray-50 dark:bg-gray-800 dark:text-white h-44 outline-none border border-transparent focus:border-[#37948b] font-medium resize-none"
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
                ) : editingBlog ? (
                  'Save Changes'
                ) : (
                  'Publish Blog'
                )}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Blogs;
