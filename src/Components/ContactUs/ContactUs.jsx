import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import emailjs from '@emailjs/browser';
import Swal from 'sweetalert2';
import {
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaPaperPlane,
  FaPaw,
  FaClock,
} from 'react-icons/fa';

const ContactUs = () => {
  const form = useRef();

  const sendEmail = e => {
    e.preventDefault();

    // ✅ EmailJS Setup
    // এখানে আপনার নিজের Service ID, Template ID এবং Public Key বসাতে হবে (EmailJS ড্যাশবোর্ড থেকে পাবেন)
    emailjs
      .sendForm(
        'service_72ik6zg',
        'template_e3gvcn4',
        form.current,
        'Ia41bZh3xRfB4DdKz',
      )
      .then(
        result => {
          Swal.fire({
            icon: 'success',
            title: 'Message Sent!',
            text: 'Thank you! We will get back to you soon.',
            confirmButtonColor: '#37948b',
          });
          e.target.reset(); // ফর্ম ক্লিয়ার করে দিবে
        },
        error => {
          Swal.fire({
            icon: 'error',
            title: 'Failed to send',
            text: 'Something went wrong, please try again.',
            confirmButtonColor: '#37948b',
          });
        },
      );
  };

  return (
    <section className="w-full bg-[#FFFBF7] dark:bg-gray-950 py-20 px-6 overflow-hidden">
      <div className="max-w-[1440px] mx-auto">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#37948b]/10 text-[#37948b] font-black text-xs uppercase tracking-[0.2em] mb-4"
          >
            <FaPaw className="animate-bounce" /> Get In Touch
          </motion.div>
          <h2 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white leading-tight">
            Let’s Talk About{' '}
            <span className="text-[#37948b]">Your Furry Mate</span>
          </h2>
        </div>

        <div className="flex flex-col lg:flex-row bg-white dark:bg-gray-900 rounded-[3rem] shadow-2xl shadow-teal-900/5 overflow-hidden border border-gray-100 dark:border-gray-800">
          {/* --- Right: Contact Info --- */}
          <div className="w-full lg:w-1/2 p-8 md:p-16 lg:p-20 bg-[#37948b] text-white relative">
            <FaPaw className="absolute -bottom-10 -right-10 text-white/10 text-[300px] rotate-12 pointer-events-none" />

            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="relative z-10"
            >
              <h2 className="text-4xl font-black mb-8 leading-tight">
                Always Available
              </h2>
              <div className="space-y-8">
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                    <FaMapMarkerAlt size={24} />
                  </div>
                  <div>
                    <h3 className="text-sm font-black uppercase text-[#a7f3d0]">
                      Location
                    </h3>
                    <p className="text-lg font-bold">
                      Khulna, Dhaka, Bangladesh
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                    <FaPhoneAlt size={24} />
                  </div>
                  <div>
                    <h3 className="text-sm font-black uppercase text-[#a7f3d0]">
                      Call Us
                    </h3>
                    <p className="text-lg font-bold">+00 123 456 789</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                    <FaEnvelope size={24} />
                  </div>
                  <div>
                    <h3 className="text-sm font-black uppercase text-[#a7f3d0]">
                      Email Us
                    </h3>
                    <p className="text-lg font-bold">mdimuBahi@gmail.com</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* --- Left: Form --- */}
          <div className="w-full lg:w-1/2 p-8 md:p-16 lg:p-20 flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center gap-3 mb-8">
                <FaClock className="text-[#37948b]" />
                <span className="text-gray-400 font-bold uppercase text-xs tracking-widest">
                  Typical response time: 2 hours
                </span>
              </div>
              <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-10">
                Send a Message
              </h2>

              {/* Form starts here */}
              <form ref={form} onSubmit={sendEmail} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <input
                    type="text"
                    name="user_name"
                    placeholder="Full Name"
                    required
                    className="w-full bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-[#37948b] rounded-2xl px-6 py-4 outline-none font-bold"
                  />
                  <input
                    type="email"
                    name="user_email"
                    placeholder="Email Address"
                    required
                    className="w-full bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-[#37948b] rounded-2xl px-6 py-4 outline-none font-bold"
                  />
                </div>
                <input
                  type="text"
                  name="subject"
                  placeholder="Subject"
                  className="w-full bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-[#37948b] rounded-2xl px-6 py-4 outline-none font-bold"
                />
                <textarea
                  name="message"
                  placeholder="How can we help?"
                  rows="4"
                  required
                  className="w-full bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-[#37948b] rounded-2xl px-6 py-4 outline-none font-bold"
                ></textarea>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full bg-[#37948b] hover:bg-[#2d7a72] text-white font-black py-5 px-8 rounded-2xl shadow-xl shadow-[#37948b44] transition-all flex items-center justify-center gap-3 text-lg"
                >
                  SEND MESSAGE <FaPaperPlane className="text-sm" />
                </motion.button>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactUs;
