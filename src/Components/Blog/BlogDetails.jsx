import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  FaUser,
  FaClock,
  FaArrowLeft,
  FaTag,
  FaCalendarAlt,
  FaShareAlt,
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaPaw,
  FaQuoteLeft,
  FaHeart,
  FaRegComment,
  FaChevronRight,
  FaInstagram,
  FaBookmark,
} from 'react-icons/fa';
import useAxios from '../../hooks/useAxios';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { motion, useScroll, useSpring } from 'framer-motion';

const BlogDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const axiosPublic = useAxios();

  // ১. স্ক্রল প্রগ্রেস বার লজিক
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // ২. বর্তমান ব্লগের ডাটা ফেচ করা
  const { data: post, isLoading } = useQuery({
    queryKey: ['blog', id],
    queryFn: async () => {
      const res = await axiosPublic.get(`/blogs/${id}`);
      return res.data;
    },
  });

  // ৩. রিলেটেড ব্লগের ডাটা ফেচ করা (ক্যাটাগরি অনুযায়ী)
  const { data: relatedPosts = [] } = useQuery({
    queryKey: ['related-blogs', post?.category],
    enabled: !!post?.category,
    queryFn: async () => {
      const res = await axiosPublic.get('/blogs');
      return res.data
        .filter(p => p.category === post.category && p.id !== id)
        .slice(0, 2);
    },
  });

  if (isLoading) return <LoadingSkeleton />;
  if (!post)
    return (
      <div className="py-40 text-center font-black text-2xl">
        Article not found!
      </div>
    );

  return (
    <div className="min-h-screen bg-[#fcfcfc] dark:bg-gray-950 text-gray-900 dark:text-gray-100 selection:bg-[#37948b] selection:text-white pb-20">
      {/* --- Reading Progress Bar --- */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1.5 bg-[#37948b] z-[1000] origin-left"
        style={{ scaleX }}
      />

      {/* --- Asymmetric Hero Section --- */}
      <header className="relative pt-32 pb-20 px-6 max-w-7xl mx-auto overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Content Info */}
          <div className="lg:col-span-7 z-10">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3 text-[#37948b] font-black text-[10px] uppercase tracking-[0.3em] mb-6"
            >
              <FaPaw className="animate-pulse text-lg" />
              <span>{post.category || 'Journal'}</span>
              <span className="w-12 h-[1px] bg-gray-200"></span>
            </motion.div>

            {/* Fixed Tag: motion.h1 */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-8xl font-black leading-[0.95] tracking-tighter mb-10"
            >
              {post.title}
            </motion.h1>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <img
                  src={`https://ui-avatars.com/api/?name=${post.author}&background=37948b&color=fff`}
                  className="w-12 h-12 rounded-full ring-4 ring-white dark:ring-gray-800"
                  alt="author"
                />
                <div>
                  <p className="text-[10px] font-black uppercase text-gray-400">
                    Written by
                  </p>
                  <p className="font-bold text-sm">{post.author}</p>
                </div>
              </div>
              <div className="h-10 w-[1px] bg-gray-200 dark:bg-gray-800"></div>
              <div className="flex flex-col">
                <p className="text-[10px] font-black uppercase text-gray-400">
                  Reading Time
                </p>
                <p className="text-gray-600 dark:text-gray-300 text-xs font-bold uppercase tracking-widest">
                  {post.reading_time || '5 MIN READ'}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Image */}
          <div className="lg:col-span-5 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="relative aspect-[4/5] rounded-[4rem] overflow-hidden shadow-2xl z-10"
            >
              <img
                src={post.image_url}
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-1000"
                alt="blog cover"
              />
            </motion.div>
            <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-[#37948b]/10 rounded-full blur-3xl -z-0"></div>
          </div>
        </div>
      </header>

      {/* --- Main Article Section --- */}
      <main className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* Left Aside: Interaction Bar (Sticky) */}
        <aside className="hidden lg:block lg:col-span-1">
          <div className="sticky top-40 space-y-8 flex flex-col items-center">
            <button className="w-14 h-14 rounded-full bg-white dark:bg-gray-900 shadow-xl flex items-center justify-center text-gray-400 hover:text-red-500 transition-all border border-gray-100 dark:border-gray-800 group">
              <FaHeart className="text-xl" />
            </button>
            <button className="w-14 h-14 rounded-full bg-white dark:bg-gray-900 shadow-xl flex items-center justify-center text-gray-400 hover:text-[#37948b] transition-all border border-gray-100 dark:border-gray-800">
              <FaBookmark className="text-xl" />
            </button>
            <div className="h-20 w-[1px] bg-gray-200 dark:bg-gray-800"></div>
            <div className="flex flex-col gap-6 text-gray-300">
              <FaFacebookF className="hover:text-[#37948b] transition-colors cursor-pointer text-xl" />
              <FaTwitter className="hover:text-[#37948b] transition-colors cursor-pointer text-xl" />
              <FaShareAlt className="hover:text-[#37948b] transition-colors cursor-pointer text-xl" />
            </div>
          </div>
        </aside>

        {/* Middle: Article Body */}
        <article className="lg:col-span-7">
          <div className="bg-white dark:bg-gray-900 p-8 md:p-14 rounded-[4rem] shadow-sm border border-gray-50 dark:border-gray-800 relative">
            <FaQuoteLeft className="absolute top-10 left-10 text-gray-100 dark:text-gray-800 text-8xl -z-0" />

            <div className="relative z-10">
              <p className="text-2xl font-bold text-gray-800 dark:text-gray-200 italic mb-12 leading-relaxed pl-8 border-l-4 border-[#37948b]">
                {post.excerpt}
              </p>

              <div
                className="prose prose-xl dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 leading-[1.9] whitespace-pre-line 
                    first-letter:text-8xl first-letter:font-black first-letter:text-[#37948b] 
                    first-letter:mr-4 first-letter:float-left first-letter:mt-3 font-medium"
              >
                {post.content}
              </div>
            </div>

            {/* Tags Section */}
            <div className="mt-16 flex flex-wrap gap-3">
              {post.tags?.map((tag, i) => (
                <span
                  key={i}
                  className="px-5 py-2.5 bg-gray-50 dark:bg-gray-800 rounded-2xl text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-[#37948b] transition-colors"
                >
                  <FaTag className="inline mr-1" /> {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Author Bio Card */}
          <motion.div
            whileHover={{ y: -5 }}
            className="mt-12 p-8 bg-white dark:bg-gray-900 rounded-[3rem] border border-gray-100 dark:border-gray-800 flex flex-col md:flex-row items-center gap-8 shadow-sm"
          >
            <img
              src="https://i.pravatar.cc/150?u=admin"
              className="w-24 h-24 rounded-[2rem] object-cover"
              alt="author bio"
            />
            <div className="text-center md:text-left">
              <h4 className="font-black text-2xl mb-2">About {post.author}</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
                Pet care enthusiast and regular contributor at Pet Adoption.
                Dedicated to providing the best tips for your furry friends.
              </p>
            </div>
          </motion.div>
        </article>

        {/* Right Aside: Sidebar */}
        <aside className="lg:col-span-4 space-y-12">
          {/* Up Next / Related Articles */}
          <div className="bg-white dark:bg-gray-900 p-8 rounded-[3.5rem] border border-gray-50 dark:border-gray-800 shadow-sm">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-8 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#37948b]"></span> Up
              Next
            </h3>
            <div className="space-y-10">
              {relatedPosts.map(rel => (
                <Link
                  to={`/blogs/${rel.id}`}
                  key={rel.id}
                  className="group block"
                >
                  <div className="relative rounded-[2rem] overflow-hidden mb-4 aspect-video shadow-md">
                    <img
                      src={rel.image_url}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      alt="related"
                    />
                  </div>
                  <p className="text-[10px] font-black text-[#37948b] uppercase mb-2">
                    {rel.category}
                  </p>
                  <h4 className="font-black text-xl leading-tight group-hover:text-[#37948b] transition-all line-clamp-2">
                    {rel.title}
                  </h4>
                </Link>
              ))}
            </div>
          </div>

          {/* Newsletter SaaS Card */}
          <div className="p-10 bg-[#121212] rounded-[3.5rem] text-white overflow-hidden relative group">
            <FaPaw className="absolute -bottom-10 -right-10 text-white/5 text-[15rem] rotate-12" />
            <h3 className="text-3xl font-black mb-4 relative z-10 leading-tight">
              Stay in the <span className="text-[#37948b]">loop.</span>
            </h3>
            <p className="text-gray-400 text-sm mb-8 relative z-10 font-medium">
              Weekly adoption success stories and care guides.
            </p>
            <div className="flex flex-col gap-3 relative z-10">
              <input
                type="email"
                placeholder="Enter email..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 placeholder:text-gray-600 outline-none focus:bg-white/10 transition-all text-sm"
              />
              <button className="w-full bg-[#37948b] text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:brightness-110 transition-all shadow-lg shadow-teal-900/40">
                Join Journal
              </button>
            </div>
          </div>
        </aside>
      </main>

      {/* --- Navigation Footer --- */}
      <footer className="max-w-7xl mx-auto px-6 py-20 border-t border-gray-100 dark:border-gray-800 mt-20 flex flex-col md:flex-row justify-between items-center gap-8">
        <button
          onClick={() => navigate('/blogs')}
          className="group flex items-center gap-4 font-black uppercase text-[10px] tracking-[0.3em] text-gray-400 hover:text-[#37948b] transition-all"
        >
          <FaArrowLeft className="group-hover:-translate-x-2 transition-transform" />{' '}
          Back To All Stories
        </button>
        <div className="flex gap-8">
          <FaFacebookF className="text-gray-300 hover:text-[#37948b] cursor-pointer transition-colors text-xl" />
          <FaInstagram className="text-gray-300 hover:text-[#37948b] cursor-pointer transition-colors text-xl" />
          <FaTwitter className="text-gray-300 hover:text-[#37948b] cursor-pointer transition-colors text-xl" />
        </div>
      </footer>
    </div>
  );
};

// --- Modern Skeleton Loader ---
const LoadingSkeleton = () => (
  <div className="max-w-7xl mx-auto pt-40 px-6">
    <div className="grid lg:grid-cols-12 gap-16">
      <div className="lg:col-span-7">
        <Skeleton height={20} width="30%" className="mb-4" />
        <Skeleton height={100} width="90%" className="mb-10" />
        <Skeleton height={500} borderRadius={60} className="mt-10" />
      </div>
      <div className="lg:col-span-5">
        <Skeleton height={600} borderRadius={60} />
      </div>
    </div>
  </div>
);

export default BlogDetails;
