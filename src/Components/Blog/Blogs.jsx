import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { blogPosts } from '../Blog/blogData.js';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const categories = ['All', 'Dog', 'Cat', 'Rabbit', 'Fish', 'Bird', 'Others'];

const Blogs = () => {
  const [filter, setFilter] = useState('All');
  const [showAll, setShowAll] = useState(false);
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setPosts(blogPosts);
      setLoading(false);
    }, 1000); // 1s delay
    return () => clearTimeout(timer);
  }, []);

  // Filter posts by category
  const filteredPosts =
    filter === 'All' ? posts : posts.filter(post => post.category === filter);

  // Show first 6 posts or all
  const postsToShow = showAll ? filteredPosts : filteredPosts.slice(0, 6);

  return (
    <section className="py-12 px-4">
      <h2 className="text-3xl font-bold text-center mb-8">
        Pet Care & Adoption Tips
      </h2>

      {/* Category Buttons */}
      <div className="flex flex-wrap justify-center gap-3 mb-8">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => {
              setFilter(cat);
              setShowAll(false);
            }}
            className={`px-4 py-2 rounded-full font-semibold border transition ${
              filter === cat
                ? 'bg-orange-500  border-orange-500'
                : ' border-gray-300 hover:bg-orange-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Blog Posts Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {loading
          ? Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                className="rounded-lg shadow p-4 animate-pulse overflow-hidden"
              >
                <Skeleton height={192} className="rounded-lg" />
                <Skeleton height={24} width={`80%`} className="mt-3" />
                <Skeleton height={16} width={`60%`} className="mt-1" />
                <Skeleton height={40} className="mt-3" />
              </div>
            ))
          : postsToShow.map(post => (
              <div
                key={post.id}
                className="rounded-lg shadow hover:shadow-lg transition overflow-hidden"
              >
                <img
                  src={post.image_url}
                  alt={post.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
                  <p className="text-sm mb-2">{post.date}</p>
                  <p className="mb-4">{post.excerpt}</p>
                  <Link
                    to={`/blog/${post.id}`}
                    className="text-orange-500 font-semibold hover:text-orange-600 hover:underline transition"
                  >
                    Read More
                  </Link>
                </div>
              </div>
            ))}

        {!loading && postsToShow.length === 0 && (
          <p className="text-center col-span-full">
            No blog posts found in this category.
          </p>
        )}
      </div>

      {/* Show All / Show Less Button */}
      {!loading && filteredPosts.length > 6 && (
        <div className="text-center mt-6">
          <button
            onClick={() => setShowAll(!showAll)}
            className="bg-orange-500 hover:bg-orange-600 px-6 py-2 rounded-md transition"
          >
            {showAll ? 'Show Less' : 'See All'}
          </button>
        </div>
      )}
    </section>
  );
};

export default Blogs;
