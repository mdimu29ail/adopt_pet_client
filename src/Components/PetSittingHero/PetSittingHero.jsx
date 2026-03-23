import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

// A placeholder image URL. Replace this with the actual URL of your image.
const VET_IMAGE_URL =
  'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=2069&auto=format&fit=crop';

/**
 * An animated hero component for a pet-sitting service with a loading skeleton.
 * It features a responsive two-column layout with text on the left and an image on the right.
 * The component fades in and slides up on load.
 */
function PetSittingHero() {
  // State to manage the loading status of the component
  const [isLoading, setIsLoading] = useState(true);

  // Simulate a network request or content loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500); // Simulate a 2.5-second load time
    return () => clearTimeout(timer); // Cleanup timer on unmount
  }, []);

  // Animation variants for the main container
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeInOut',
        when: 'beforeChildren',
        staggerChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  // Render the skeleton loader while isLoading is true
  if (isLoading) {
    return (
      <SkeletonTheme baseColor="#e0e0e0" highlightColor="#f5f5f5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12">
            {/* Left Skeleton Column */}
            <div className="w-full md:w-1/2 text-center md:text-left">
              <h1>
                <Skeleton
                  height={40}
                  width={`80%`}
                  style={{ marginBottom: '0.75rem' }}
                />
              </h1>
              <h2>
                <Skeleton
                  height={28}
                  width={`90%`}
                  style={{ marginBottom: '1.5rem' }}
                />
              </h2>
              <p>
                <Skeleton count={4} />
              </p>
            </div>
            {/* Right Skeleton Column */}
            <div className="w-full md:w-1/2 mt-8 md:mt-0">
              <Skeleton height={400} className="rounded-lg" />
            </div>
          </div>
        </div>
      </SkeletonTheme>
    );
  }

  // Render the actual component content with animations once loaded
  return (
    <motion.div
      className="container mx-auto px-4 sm:px-6 lg:px-8 py-16"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12">
        {/* Left Column: Text Content */}
        <motion.div
          className="w-full md:w-1/2 text-center md:text-left"
          variants={itemVariants}
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold  leading-tight mb-4">
            Pet Sitting
          </h1>
          <h2 className="text-xl sm:text-2xl font-semibold  mb-6">
            For Cats, Dogs & Exotic Pets*
          </h2>
          <p className=" leading-relaxed">
            We provide professional and loving care for your pets while you're
            away. Contact us to learn more about our services and schedule a
            meet and greet!
          </p>
        </motion.div>

        {/* Right Column: Image */}
        <motion.div
          className="w-full md:w-1/2 mt-8 md:mt-0 flex justify-center"
          variants={itemVariants}
        >
          <img
            src="https://i.ibb.co/hpPvVnQ/Whats-App-Image-2025-07-15-at-01-03-51-4c809265.jpg"
            alt="A happy dog playing with its owner"
            className="rounded-lg shadow-2xl object-cover w-full max-w-md"
            onError={e => {
              e.target.onerror = null;
              e.target.src =
                'https://i.ibb.co/hpPvVnQ/Whats-App-Image-2025-07-15-at-01-03-51-4c809265.jpg';
            }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
}

// Export the component for use in other parts of your application.
export default PetSittingHero;
