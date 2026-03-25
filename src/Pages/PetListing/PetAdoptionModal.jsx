import React from 'react';
import Modal from 'react-modal';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaUser,
  FaEnvelope,
  FaPaw,
  FaTimes,
} from 'react-icons/fa';

// Modal styling for accessibility and positioning
Modal.setAppElement('#root');

const PetAdoptionModal = ({
  isOpen,
  onClose,
  selectedPet,
  user,
  formData,
  setFormData,
  onSubmit,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <Modal
          isOpen={isOpen}
          onRequestClose={onClose}
          className="outline-none w-full max-w-lg mx-auto self-center p-4"
          overlayClassName="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-2xl overflow-hidden relative border border-gray-100 dark:border-gray-800"
          >
            {/* --- Close Button --- */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 hover:text-red-500 transition-colors z-20"
            >
              <FaTimes size={18} />
            </button>

            {selectedPet && (
              <div className="p-8 md:p-10 flex flex-col">
                {/* --- Header Section --- */}
                <div className="text-center mb-8">
                  <div className="relative inline-block mb-4">
                    <img
                      src={selectedPet.image_url || selectedPet.img}
                      alt={selectedPet.name}
                      className="w-24 h-24 mx-auto rounded-[2rem] object-cover border-4 border-teal-50 shadow-lg"
                    />
                    <div className="absolute -bottom-2 -right-2 bg-[#37948b] p-2 rounded-xl text-white shadow-lg">
                      <FaPaw size={16} />
                    </div>
                  </div>
                  <h2 className="text-3xl font-black text-gray-900 dark:text-white">
                    Adopt{' '}
                    <span className="text-[#37948b]">{selectedPet.name}</span>
                  </h2>
                  <p className="text-gray-400 font-bold text-sm uppercase tracking-widest mt-1">
                    Application Form
                  </p>
                </div>

                {/* --- Form Section --- */}
                <form onSubmit={onSubmit} className="space-y-4">
                  {/* User Name (Read Only) */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">
                      Full Name
                    </label>
                    <div className="relative">
                      <FaUser className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" />
                      <input
                        value={
                          user?.name || user?.user_metadata?.full_name || ''
                        }
                        disabled
                        className="w-full pl-12 pr-6 py-3.5 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border-2 border-transparent text-gray-500 font-bold cursor-not-allowed"
                      />
                    </div>
                  </div>

                  {/* Email (Read Only) */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">
                      Email Address
                    </label>
                    <div className="relative">
                      <FaEnvelope className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" />
                      <input
                        value={user?.email || ''}
                        disabled
                        className="w-full pl-12 pr-6 py-3.5 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border-2 border-transparent text-gray-500 font-bold cursor-not-allowed"
                      />
                    </div>
                  </div>

                  {/* Phone Input */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">
                      Phone Number
                    </label>
                    <div className="relative group">
                      <FaPhoneAlt className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#37948b] transition-colors" />
                      <input
                        type="tel"
                        placeholder="e.g. +880 1234 567 890"
                        value={formData.phone}
                        onChange={e =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        required
                        className="w-full pl-12 pr-6 py-3.5 bg-gray-50 dark:bg-gray-800 rounded-2xl border-2 border-transparent focus:border-[#37948b] focus:bg-white dark:focus:bg-gray-800 outline-none transition-all font-bold dark:text-white"
                      />
                    </div>
                  </div>

                  {/* Address Input */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">
                      Home Address
                    </label>
                    <div className="relative group">
                      <FaMapMarkerAlt className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#37948b] transition-colors" />
                      <input
                        type="text"
                        placeholder="e.g. Dhaka, Bangladesh"
                        value={formData.address}
                        onChange={e =>
                          setFormData({ ...formData, address: e.target.value })
                        }
                        required
                        className="w-full pl-12 pr-6 py-3.5 bg-gray-50 dark:bg-gray-800 rounded-2xl border-2 border-transparent focus:border-[#37948b] focus:bg-white dark:focus:bg-gray-800 outline-none transition-all font-bold dark:text-white"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="w-full py-4 mt-4 bg-[#37948b] hover:bg-[#2d7a72] text-white font-black rounded-2xl shadow-xl shadow-[#37948b33] flex items-center justify-center gap-3 transition-all"
                  >
                    Submit Application <FaPaw />
                  </motion.button>
                </form>

                <p className="mt-6 text-center text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-relaxed">
                  By submitting, you agree to our{' '}
                  <span className="text-[#37948b]">Adoption Policy</span> and
                  24/7 care guidelines.
                </p>
              </div>
            )}
          </motion.div>
        </Modal>
      )}
    </AnimatePresence>
  );
};

export default PetAdoptionModal;
