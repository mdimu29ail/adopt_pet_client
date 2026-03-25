import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Skeleton from 'react-loading-skeleton';
import {
  FaPlus,
  FaTimes,
  FaEdit,
  FaTrash,
  FaSearch,
  FaUser,
  FaClock,
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import useAxios from '../../hooks/useAxios';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import useUserRole from '../../hooks/useUserRole';
import Swal from 'sweetalert2';

const Blogs = () => {
  const [showModal, setShowModal] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const axiosPublic = useAxios();
  const axiosSecure = useAxiosSecure();
  const [role] = useUserRole();
  const queryClient = useQueryClient();

  const { data: blogs = [], isLoading } = useQuery({
    queryKey: ['blogs'],
    queryFn: async () => {
      const res = await axiosPublic.get('/blogs');
      return res.data;
    },
    refetchOnWindowFocus: false,
  });

  const handleDelete = async id => {
    Swal.fire({
      title: 'Delete this blog?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#37948b',
      confirmButtonText: 'Yes, delete it!',
    }).then(async result => {
      if (result.isConfirmed) {
        try {
          const res = await axiosSecure.delete(`/blogs/${id}`);
          if (res.data.success) {
            queryClient.invalidateQueries(['blogs']);
            Swal.fire('Deleted!', 'Blog has been removed.', 'success');
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
    const blogData = {
      title: form.title.value,
      author: form.author.value,
      category: form.category.value,
      reading_time: form.reading_time.value,
      image_url: form.image_url.value,
      excerpt: form.excerpt.value,
      content: form.content.value,
      tags: form.tags.value.split(',').map(tag => tag.trim()),
    };

    try {
      let res;
      if (editingBlog) {
        res = await axiosSecure.patch(`/blogs/${editingBlog.id}`, blogData);
      } else {
        res = await axiosSecure.post('/blogs', blogData);
      }

      if (res.data.success) {
        setShowModal(false);
        setEditingBlog(null);
        queryClient.invalidateQueries(['blogs']);
        Swal.fire('Success!', editingBlog ? 'Updated' : 'Published', 'success');
      }
    } catch (err) {
      Swal.fire('Error', 'Action failed.', 'error');
    }
  };

  const filteredBlogs = blogs.filter(b =>
    b.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="w-full min-h-screen bg-[#FFFBF7] dark:bg-gray-950 pt-28 pb-20 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
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
                className="w-full pl-12 pr-6 py-4 rounded-2xl bg-white dark:bg-gray-900 shadow-sm border border-gray-100 outline-none focus:ring-2 ring-[#37948b] dark:text-white font-bold"
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            {role === 'admin' && (
              <button
                onClick={() => {
                  setEditingBlog(null);
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
              {filteredBlogs.map(blog => (
                <motion.div
                  layout
                  key={blog.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-white dark:bg-gray-900 p-4 rounded-[2.5rem] shadow-xl group border border-transparent hover:border-[#37948b]/20 transition-all flex flex-col h-full"
                >
                  <div className="relative h-56 overflow-hidden rounded-[2rem] mb-6">
                    <img
                      src={blog.image_url}
                      alt=""
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    {role === 'admin' && (
                      <div className="absolute top-4 right-4 flex gap-2">
                        <button
                          onClick={() => {
                            setEditingBlog(blog);
                            setShowModal(true);
                          }}
                          className="p-3 bg-white/90 text-amber-500 rounded-xl shadow-md"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(blog.id)}
                          className="p-3 bg-white/90 text-red-500 rounded-xl shadow-md"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="px-3 pb-4 flex-grow flex flex-col">
                    <div className="flex items-center gap-4 mb-3 text-gray-400 font-bold text-[10px] uppercase tracking-widest">
                      <span className="flex items-center gap-1.5">
                        <FaUser className="text-[#37948b]" /> {blog.author}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <FaClock className="text-[#37948b]" />{' '}
                        {blog.reading_time}
                      </span>
                    </div>
                    <h3 className="text-2xl font-black dark:text-white mb-3 line-clamp-1">
                      {blog.title}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 line-clamp-2">
                      {blog.excerpt}
                    </p>
                    <button
                      onClick={() => navigate(`/blogs/${blog.id}`)}
                      className="mt-auto w-full py-4 bg-[#37948b] text-white font-black rounded-2xl shadow-lg hover:bg-[#2d7a72] transition-all uppercase tracking-widest text-xs"
                    >
                      Read Story
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>

      {/* Admin Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] w-full max-w-2xl shadow-2xl relative my-8"
          >
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-8 right-8 text-gray-400 hover:text-red-500"
            >
              <FaTimes size={24} />
            </button>
            <h2 className="text-3xl font-black mb-8 dark:text-white">
              {editingBlog ? 'Edit' : 'Post New'}{' '}
              <span className="text-[#37948b]">Blog</span>
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              <input
                name="title"
                defaultValue={editingBlog?.title}
                placeholder="Blog Title"
                className="w-full p-4 rounded-xl bg-gray-50 dark:bg-gray-800 dark:text-white outline-none"
                required
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  name="author"
                  defaultValue={editingBlog?.author || 'Admin'}
                  placeholder="Author Name"
                  className="w-full p-4 rounded-xl bg-gray-50 dark:bg-gray-800 dark:text-white outline-none"
                  required
                />
                <input
                  name="category"
                  defaultValue={editingBlog?.category}
                  placeholder="Category"
                  className="w-full p-4 rounded-xl bg-gray-50 dark:bg-gray-800 dark:text-white outline-none"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  name="reading_time"
                  defaultValue={editingBlog?.reading_time}
                  placeholder="Reading Time (e.g. 5 min)"
                  className="w-full p-4 rounded-xl bg-gray-50 dark:bg-gray-800 dark:text-white outline-none"
                  required
                />
                <input
                  name="tags"
                  defaultValue={editingBlog?.tags?.join(', ')}
                  placeholder="Tags (comma separated)"
                  className="w-full p-4 rounded-xl bg-gray-50 dark:bg-gray-800 dark:text-white outline-none"
                />
              </div>
              <input
                name="image_url"
                defaultValue={editingBlog?.image_url}
                placeholder="Image URL"
                className="w-full p-4 rounded-xl bg-gray-50 dark:bg-gray-800 dark:text-white outline-none"
                required
              />
              <textarea
                name="excerpt"
                defaultValue={editingBlog?.excerpt}
                placeholder="Short Excerpt"
                className="w-full p-4 rounded-xl bg-gray-50 dark:bg-gray-800 dark:text-white h-20 outline-none resize-none"
                required
              />
              <textarea
                name="content"
                defaultValue={editingBlog?.content}
                placeholder="Full Content"
                className="w-full p-4 rounded-xl bg-gray-50 dark:bg-gray-800 dark:text-white h-40 outline-none resize-none"
                required
              />
              <button
                type="submit"
                className="w-full py-5 bg-[#37948b] text-white font-black rounded-2xl shadow-xl uppercase tracking-widest text-xs"
              >
                {editingBlog ? 'Save Changes' : 'Publish Blog'}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Blogs;
