import React from 'react';
import { motion } from 'framer-motion';

// --- Data for Testimonials ---
// In a real application, this data would likely come from an API.
const testimonials = [
  {
    name: 'Steve - Client',
    quote:
      'Leaving our cat for a week was stressful, but the daily updates and photos put our minds at ease. We came home to a happy and relaxed pet. Highly recommend!',
    rating: 'Good',
    stars: 4,
    avatar: 'https://placehold.co/100x100/EFEFEF/333?text=Steve',
  },
  {
    name: 'Mary - Client',
    quote:
      'Absolutely fantastic service! They took care of our energetic Golden Retriever, including daily walks and playtime. It is clear they genuinely love animals.',
    rating: 'Excellent',
    stars: 5,
    avatar: 'https://placehold.co/100x100/EFEFEF/333?text=Mary',
  },
  {
    name: 'Scotty - Client',
    quote:
      'I was worried about finding someone to look after my bearded dragon, but they were knowledgeable and professional. I could not have asked for better care.',
    rating: 'Fantastic',
    stars: 5,
    avatar: 'https://placehold.co/100x100/EFEFEF/333?text=Scotty',
  },
];

// --- Star Rating Component ---
const StarRating = ({ count }) => {
  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className={`w-5 h-5 ${
            i < count ? 'text-green-800' : 'text-gray-300'
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
};

// --- Testimonial Card Component ---
const TestimonialCard = ({ name, quote, rating, stars, avatar }) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <motion.div
      className="bg-orange-500 text-white p-8 rounded-3xl shadow-lg flex flex-col items-center text-center"
      variants={cardVariants}
    >
      <img
        src={avatar}
        alt={name}
        className="w-24 h-24 rounded-full border-4 border-white object-cover mb-4 shadow-md"
        onError={e => {
          e.target.onerror = null;
          e.target.src = 'https://placehold.co/100x100/EFEFEF/333?text=User';
        }}
      />
      <h3 className="font-bold text-lg mb-1">{name}</h3>
      <p className="text-indigo-200 text-sm mb-4">{quote}</p>
      <div className="flex items-center gap-2 mt-auto">
        <span className="font-semibold">{rating}</span>
        <StarRating count={stars} />
      </div>
    </motion.div>
  );
};

// --- Main Testimonials Section Component ---
function Testimonials() {
  const sectionVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  return (
    <section className="bg-yellow-100 shadow-2xl rounded-2xl py-20 px-4">
      <div className="container mx-auto text-center">
        <div className="mb-4">
          {/* Paw Icon */}
          <svg
            className="w-8 h-8 mx-auto text-gray-800"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 3.5c-1.25 0-2.77.2-4.25.9-2.22 1.05-3.88 3.3-3.75 5.6.09 1.6.9 3.1 2.25 4.2 1.35 1.1 3.1 1.8 5 1.8s3.65-.7 5-1.8c1.35-1.1 2.16-2.6 2.25-4.2.13-2.3-1.53-4.55-3.75-5.6C12.77 3.7 11.25 3.5 10 3.5zm1.5 10c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm-3 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm-3-3c-.83 0-1.5-.67-1.5-1.5S4.67 7.5 5.5 7.5 7 8.17 7 9s-.67 1.5-1.5 1.5zm9 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
          </svg>
        </div>
        <h2 className="text-4xl font-bold text-gray-800 mb-2">
          Review from our users
        </h2>
        <p className="text-gray-700 max-w-2xl mx-auto mb-12">
          Hear from our happy clients who trust us to care for their beloved
          pets.
        </p>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} {...testimonial} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default Testimonials;
