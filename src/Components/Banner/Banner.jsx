import React from 'react';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Carousel } from 'react-responsive-carousel';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaPaw, FaHeart } from 'react-icons/fa';

const Banner = () => {
  const slides = [
    {
      image:
        'https://i.ibb.co/NgysD7HD/Whats-App-Image-2025-07-14-at-22-03-47-3ef8f810.jpg',
      title: 'Find Your New',
      highlight: 'Best Friend',
      description:
        'Thousands of lovable paws are waiting for a second chance. Start your journey of friendship today.',
    },
    {
      image:
        'https://i.ibb.co/hJsVSCFy/Whats-App-Image-2025-07-14-at-22-03-47-d83eb7ce.jpg',
      title: 'Give a Home to a',
      highlight: 'Soulmate',
      description:
        'Every pet deserves a family full of love and snacks. Adoption is an act of pure kindness.',
    },
    {
      image:
        'https://i.ibb.co/DHM90R2M/Whats-App-Image-2025-07-14-at-22-03-48-6a60bafb.jpg',
      title: 'Support Our',
      highlight: 'Furry Heroes',
      description:
        "Can't adopt? You can still make a huge difference by supporting our ongoing donation campaigns.",
    },
  ];

  return (
    <div className="relative group overflow-hidden bg-[#FFFBF7] dark:bg-gray-950">
      <Carousel
        autoPlay={true}
        infiniteLoop={true}
        showThumbs={false}
        showStatus={false}
        interval={5000}
        transitionTime={700}
        className="main-carousel"
        renderIndicator={(onClickHandler, isSelected, index, label) => (
          <li
            className={`inline-block w-3 h-3 mx-1 rounded-full cursor-pointer transition-all duration-300 ${
              isSelected ? 'bg-[#37948b] w-8' : 'bg-gray-300'
            }`}
            onClick={onClickHandler}
            title={label}
          />
        )}
      >
        {slides.map((slide, idx) => (
          <div key={idx} className="relative h-[500px] md:h-[650px] w-full">
            {/* --- Image with Overlay --- */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent z-10" />
            <img
              src={slide.image}
              alt="Pet Banner"
              className="h-full w-full object-cover"
            />

            {/* --- Animated Content Overlay --- */}
            <div className="absolute inset-0 z-20 flex items-center">
              <div className="container mx-auto px-6 md:px-12 text-left">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="max-w-2xl"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#37948b]/20 border border-[#37948b]/30 text-[#37948b] font-bold text-xs uppercase tracking-widest mb-6"
                  >
                    <FaPaw /> Adopt, Don't Shop
                  </motion.div>

                  <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-[1.1] mb-6">
                    {slide.title} <br />
                    <span className="text-[#37948b]">{slide.highlight}</span>
                  </h1>

                  <p className="text-gray-200 text-sm md:text-lg font-medium mb-10 max-w-lg leading-relaxed">
                    {slide.description}
                  </p>

                  <div className="flex flex-wrap gap-4">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Link
                        to="/petListing"
                        className="flex items-center gap-2 px-8 py-4 bg-[#37948b] text-white font-black rounded-2xl shadow-xl shadow-[#37948b33] hover:bg-[#2d7a72] transition-all"
                      >
                        Adopt Now <FaHeart />
                      </Link>
                    </motion.div>

                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Link
                        to="/donationCampaigns"
                        className="flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-md text-white border-2 border-white/20 font-black rounded-2xl hover:bg-white hover:text-[#37948b] transition-all"
                      >
                        Learn More
                      </Link>
                    </motion.div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        ))}
      </Carousel>

      {/* Custom Global CSS for the dots position */}
      <style>{`
        .main-carousel .control-dots {
          bottom: 40px !important;
          z-index: 30;
          text-align: left !important;
          padding-left: 3rem !important;
        }
        @media (max-width: 768px) {
          .main-carousel .control-dots {
            text-align: center !important;
            padding-left: 0 !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Banner;
