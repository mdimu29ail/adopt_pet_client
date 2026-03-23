import React from 'react';
import { useParams, Link } from 'react-router';
import { blogPosts } from '../Blog/blogData.js';

const BlogDetails = () => {
  const { id } = useParams(); // Get blog id from URL
  const post = blogPosts.find(p => p.id === parseInt(id));

  if (!post) {
    return (
      <div className="py-8 text-center">
        <p>Blog post not found.</p>
        <Link to="/blogs" className="underline mt-4 block">
          Back to Blogs
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      {/* Title */}
      <h2 className="text-3xl font-bold mb-4">{post.title}</h2>

      {/* Image */}
      <img
        src={post.image_url}
        alt={post.title}
        className="w-full h-64 object-cover rounded mb-4"
      />

      {/* Details */}
      <div className="mb-4">
        <p>
          By <strong>{post.author}</strong>
        </p>
        <p>Date: {post.date}</p>
        <p>Reading Time: {post.reading_time}</p>
        <p>Category: {post.category}</p>
        {post.tags && post.tags.length > 0 && (
          <p>
            Tags:{' '}
            {post.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-block rounded px-2 py-1 mr-2 bg-amber-600"
              >
                {tag}
              </span>
            ))}
          </p>
        )}
      </div>

      {/* Excerpt and Content */}
      <p className="mb-4">{post.excerpt}</p>
      <p className="mb-4">{post.content || 'Full blog content goes here...'}</p>

      <Link to="/blogs" className="underline mt-6 block">
        Back to Blogs
      </Link>
    </div>
  );
};

export default BlogDetails;
