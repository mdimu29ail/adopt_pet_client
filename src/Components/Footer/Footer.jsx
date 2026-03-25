import React from 'react';
import { motion } from 'framer-motion';
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaYoutube,
  FaHeart,
  FaPaw,
} from 'react-icons/fa';
import Logo from '../Logo/Logo';
import Container from '../../Container/Container';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: 'Quick Links',
      links: [
        { name: 'Home', path: '/' },
        { name: 'Pet Listing', path: '/petListing' },
        { name: 'Campaigns', path: '/donationCampaigns' },
        { name: 'About Us', path: '/about' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { name: 'Adopt a Pet', path: '/petListing' },
        { name: 'Success Stories', path: '/blogs' },
        { name: 'Safety Tips', path: '/blogs' },
        { name: 'Volunteer', path: '/events' },
      ],
    },
  ];

  const socialLinks = [
    { icon: <FaFacebookF />, color: '#1877F2', path: '#' },
    { icon: <FaTwitter />, color: '#1DA1F2', path: '#' },
    { icon: <FaInstagram />, color: '#E4405F', path: '#' },
    { icon: <FaYoutube />, color: '#CD201F', path: '#' },
  ];

  return (
    <footer className="bg-[#FFFBF7] dark:bg-gray-950 pt-20 pb-10 border-t border-gray-100 dark:border-gray-800">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* --- Brand Section --- */}
          <div className="col-span-1 lg:col-span-1">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="mb-6 inline-block"
            >
              <Logo />
            </motion.div>
            <p className="text-gray-600 dark:text-gray-400 font-medium leading-relaxed mb-6">
              Connecting lovable paws with caring hearts since 2024. We believe
              every pet deserves a family full of love and snacks.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social, idx) => (
                <motion.a
                  key={idx}
                  href={social.path}
                  whileHover={{ y: -5, scale: 1.1 }}
                  className="w-10 h-10 rounded-full flex items-center justify-center bg-white dark:bg-gray-800 shadow-md text-[#37948b] hover:bg-[#37948b] hover:text-white transition-all duration-300"
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </div>

          {/* --- Link Sections --- */}
          {footerLinks.map((section, idx) => (
            <div key={idx} className="col-span-1">
              <h3 className="text-[#2D3436] dark:text-white font-black text-lg mb-6 uppercase tracking-wider flex items-center gap-2">
                <FaPaw className="text-[#37948b] text-sm" /> {section.title}
              </h3>
              <ul className="space-y-4">
                {section.links.map((link, lIdx) => (
                  <li key={lIdx}>
                    <Link
                      to={link.path}
                      className="text-gray-500 dark:text-gray-400 font-bold hover:text-[#37948b] dark:hover:text-[#37948b] transition-colors flex items-center gap-2 group"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-transparent group-hover:bg-[#37948b] transition-all" />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* --- Contact / Newsletter --- */}
          <div className="col-span-1">
            <h3 className="text-[#2D3436] dark:text-white font-black text-lg mb-6 uppercase tracking-wider">
              Join Our Pack
            </h3>
            <p className="text-gray-500 dark:text-gray-400 font-bold mb-4">
              Get updates on new pets and events!
            </p>
            <div className="relative group">
              <input
                type="email"
                placeholder="Enter email"
                className="w-full px-5 py-3 rounded-2xl bg-gray-100 dark:bg-gray-800 border-2 border-transparent focus:border-[#37948b] outline-none transition-all dark:text-white"
              />
              <motion.button
                whileTap={{ scale: 0.9 }}
                className="absolute right-2 top-1.5 bg-[#37948b] text-white p-2 rounded-xl"
              >
                <FaHeart />
              </motion.button>
            </div>
          </div>
        </div>

        {/* --- Bottom Footer --- */}
        <div className="border-t border-gray-100 dark:border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 dark:text-gray-500 font-bold text-sm">
            © {currentYear} <span className="text-[#37948b]">PetAdopt</span>.
            All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-500 font-bold text-sm">
            Made with <FaHeart className="text-[#37948b] animate-pulse" /> for
            all furry friends.
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
