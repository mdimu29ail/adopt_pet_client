import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import useAuth from '../../hooks/useAuth';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { supabase } from '../../Supabase/supabase.config'; // সুপাবেস ক্লায়েন্ট ইম্পোর্ট
import {
  FaPaw,
  FaDog,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaCloudUploadAlt,
  FaInfoCircle,
  FaSpinner,
  FaChevronDown,
} from 'react-icons/fa';

const AddPet = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleImageChange = e => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    const form = e.target;

    try {
      let image_url = '';

      // --- ১. সরাসরি সুপাবেস স্টোরেজে আপলোড ---
      if (imageFile) {
        const fileName = `${Date.now()}_${imageFile.name.replace(/\s+/g, '_')}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('pet-images') // আপনার বাল্কেট নাম
          .upload(`pets/${fileName}`, imageFile);

        if (uploadError) throw uploadError;

        // পাবলিক ইউআরএল গেট করা
        const { data: urlData } = supabase.storage
          .from('pet-images')
          .getPublicUrl(`pets/${fileName}`);

        image_url = urlData.publicUrl;
      }

      // --- ২. পেটের তথ্য গোছানো ---
      const newPet = {
        name: form.name.value,
        type: form.type.value,
        breed: form.breed.value || 'Mixed',
        age: form.age.value,
        location: form.location.value,
        status: 'Available',
        image_url: image_url,
        description: form.description.value,
        owner_email: user.email,
        owner_name:
          user?.user_metadata?.full_name || user?.displayName || 'User',
        created_at: new Date().toISOString(),
      };

      // --- ৩. ব্যাকএন্ড এপিআই কল ---
      const res = await axiosSecure.post('/pets', newPet);

      if (res.data.insertedId) {
        Swal.fire({
          icon: 'success',
          title: 'Successfully Added!',
          text: `${newPet.name} is ready for adoption.`,
          timer: 2000,
          showConfirmButton: false,
          background: '#FFFBF7',
        });
        navigate('/dashboard/myPets');
      }
    } catch (error) {
      console.error('❌ Submission Error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text:
          error.message || 'Failed to add pet. Please check your connection.',
        confirmButtonColor: '#37948b',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#FFFBF7] dark:bg-gray-950 p-4 md:p-10 font-sans pt-24 md:pt-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        <div className="mb-12 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#37948b]/10 text-[#37948b] font-black text-xs uppercase tracking-[0.2em] mb-4">
            <FaPaw className="animate-bounce" /> New Member Alert
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white leading-tight tracking-tighter">
            Add to <br />
            <span className="text-[#37948b]">Pet List</span>
          </h2>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 lg:grid-cols-12 gap-10"
        >
          {/* Media Section */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-gray-800">
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-6">
                Pet Image
              </label>
              <div
                className={`relative group aspect-square rounded-[2rem] border-2 border-dashed transition-all flex items-center justify-center overflow-hidden ${previewUrl ? 'border-[#37948b]' : 'border-gray-200 dark:border-gray-700'}`}
              >
                {previewUrl ? (
                  <>
                    <img
                      src={previewUrl}
                      className="w-full h-full object-cover"
                      alt="preview"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                      <p className="text-white font-black text-xs uppercase">
                        Change Image
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="text-center p-6">
                    <FaCloudUploadAlt
                      size={40}
                      className="mx-auto mb-3 text-[#37948b]"
                    />
                    <p className="text-gray-400 text-xs font-bold uppercase">
                      Click to Upload
                    </p>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 opacity-0 cursor-pointer z-10"
                  required
                />
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="lg:col-span-8">
            <div className="bg-white dark:bg-gray-900 p-8 md:p-12 rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-gray-800">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                    Pet Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="Name"
                    className="w-full px-6 py-4 rounded-2xl border-2 border-gray-50 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 outline-none focus:border-[#37948b] transition-all font-bold dark:text-white"
                  />
                </div>

                <div className="space-y-2 relative">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                    Species
                  </label>
                  <select
                    name="type"
                    required
                    className="w-full px-6 py-4 rounded-2xl border-2 border-gray-50 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 outline-none focus:border-[#37948b] font-bold dark:text-white appearance-none cursor-pointer"
                  >
                    <option value="Dog">Dog</option>
                    <option value="Cat">Cat</option>
                    <option value="Rabbit">Rabbit</option>
                    <option value="Fish">Fish</option>
                    <option value="Bird">Bird</option>
                  </select>
                  <FaChevronDown className="absolute right-5 bottom-5 text-gray-400" />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                    Breed
                  </label>
                  <input
                    type="text"
                    name="breed"
                    placeholder="Breed"
                    className="w-full px-6 py-4 rounded-2xl border-2 border-gray-50 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 outline-none focus:border-[#37948b] font-bold dark:text-white"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                    Age
                  </label>
                  <input
                    type="text"
                    name="age"
                    placeholder="e.g. 2 Years"
                    className="w-full px-6 py-4 rounded-2xl border-2 border-gray-50 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 outline-none focus:border-[#37948b] font-bold dark:text-white"
                  />
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    required
                    placeholder="City, Country"
                    className="w-full px-6 py-4 rounded-2xl border-2 border-gray-50 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 outline-none focus:border-[#37948b] font-bold dark:text-white"
                  />
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    rows="4"
                    placeholder="Tell us more..."
                    className="w-full px-6 py-4 rounded-[2rem] border-2 border-gray-50 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 outline-none focus:border-[#37948b] font-bold dark:text-white resize-none"
                  ></textarea>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full mt-10 py-5 bg-[#37948b] text-white font-black rounded-2xl shadow-xl hover:bg-[#2d7a72] transition-all flex items-center justify-center gap-3 disabled:opacity-70 text-lg uppercase"
              >
                {loading ? <FaSpinner className="animate-spin" /> : <FaPaw />}
                {loading ? 'Processing...' : 'Register Pet'}
              </motion.button>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default AddPet;
