import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { motion } from 'framer-motion';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import {
  FaPaw,
  FaDog,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaCloudUploadAlt,
  FaSpinner,
  FaChevronDown,
  FaArrowLeft,
  FaInfoCircle,
} from 'react-icons/fa';
import { supabase } from '../../Supabase/supabase.config';
import useAxiosSecure from '../../hooks/useAxiosSecure';

const EditPetForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();

  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageUploading, setImageUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [updateLoading, setUpdateLoading] = useState(false);

  // ১. পেটের বর্তমান তথ্য লোড করা
  useEffect(() => {
    const fetchPet = async () => {
      try {
        const res = await axiosSecure.get(`/pets/${id}`);
        setPet(res.data);
        setImageUrl(res.data.image_url || '');
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch pet:', err);
        Swal.fire('Error', 'Failed to load pet data', 'error');
        setLoading(false);
      }
    };
    fetchPet();
  }, [id, axiosSecure]);

  // ২. সরাসরি সুপাবেস স্টোরেজে ইমেজ আপলোড
  const handleImageUpload = async e => {
    const file = e.target.files[0];
    if (!file) return;

    setImageUploading(true);
    try {
      const fileName = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('pet-images') // আপনার বাল্কেট নাম
        .upload(`pets/${fileName}`, file);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('pet-images')
        .getPublicUrl(`pets/${fileName}`);

      setImageUrl(urlData.publicUrl);
      Swal.fire({
        icon: 'success',
        title: 'Image Uploaded!',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (err) {
      console.error('Upload error:', err);
      Swal.fire('Error', 'Image upload failed', 'error');
    } finally {
      setImageUploading(false);
    }
  };

  // ৩. তথ্য আপডেট করা
  const handleSubmit = async e => {
    e.preventDefault();
    setUpdateLoading(true);
    const form = e.target;

    const updatedPet = {
      name: form.name.value,
      type: form.type.value,
      breed: form.breed.value,
      age: form.age.value,
      location: form.location.value,
      status: form.status.value,
      description: form.description.value,
      image_url: imageUrl,
    };

    try {
      const res = await axiosSecure.put(`/pets/${id}`, updatedPet);
      if (res.data.success) {
        Swal.fire({
          icon: 'success',
          title: 'Updates Saved!',
          text: 'Pet information has been updated.',
          confirmButtonColor: '#37948b',
        });
        navigate('/petListing');
      } else {
        Swal.fire('Info', 'No changes were detected', 'info');
      }
    } catch (err) {
      Swal.fire('Error', 'Failed to update pet data', 'error');
    } finally {
      setUpdateLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-20 px-6">
        <Skeleton height={50} width="40%" className="mb-10" borderRadius={20} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Skeleton height={400} borderRadius={30} />
          <div className="space-y-4">
            <Skeleton height={50} borderRadius={15} />
            <Skeleton height={50} borderRadius={15} />
            <Skeleton height={50} borderRadius={15} />
            <Skeleton height={150} borderRadius={15} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#FFFBF7] dark:bg-gray-950 pt-28 pb-20 px-6 md:px-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl mx-auto"
      >
        {/* --- Header --- */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
          <div className="text-center md:text-left">
            <Link
              to="/petListing"
              className="inline-flex items-center gap-2 text-[#37948b] font-black text-xs uppercase tracking-widest mb-4 hover:gap-3 transition-all"
            >
              <FaArrowLeft /> Back to List
            </Link>
            <h2 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white tracking-tighter">
              Edit <span className="text-[#37948b]">{pet.name}</span>
            </h2>
          </div>
          <div className="bg-white dark:bg-gray-900 px-6 py-3 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-xs font-black uppercase text-gray-500 tracking-widest">
              Editing Mode
            </span>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 lg:grid-cols-12 gap-10"
        >
          {/* --- Image Section --- */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-gray-800">
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-6">
                Profile Media
              </label>

              <div className="relative group aspect-square rounded-[2rem] border-2 border-[#37948b] overflow-hidden shadow-2xl">
                <img
                  src={imageUrl || 'https://via.placeholder.com/400'}
                  className="w-full h-full object-cover"
                  alt="pet"
                />
                <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm cursor-pointer">
                  <FaCloudUploadAlt size={40} className="text-white mb-2" />
                  <p className="text-white font-black text-[10px] uppercase tracking-widest">
                    Update Photo
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
                {imageUploading && (
                  <div className="absolute inset-0 bg-white/80 dark:bg-black/80 flex items-center justify-center">
                    <FaSpinner className="animate-spin text-[#37948b] text-3xl" />
                  </div>
                )}
              </div>
              <p className="mt-4 text-[10px] font-bold text-center text-gray-400 uppercase tracking-widest">
                Click photo to change
              </p>
            </div>
          </div>

          {/* --- Details Form Section --- */}
          <div className="lg:col-span-8">
            <div className="bg-white dark:bg-gray-900 p-8 md:p-12 rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-gray-800">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Name */}
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                    Pet Name
                  </label>
                  <div className="relative">
                    <FaPaw className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" />
                    <input
                      name="name"
                      defaultValue={pet.name}
                      required
                      className="w-full pl-14 pr-6 py-4 rounded-2xl border-2 border-gray-50 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 outline-none focus:border-[#37948b] font-bold dark:text-white transition-all"
                    />
                  </div>
                </div>

                {/* Type & Status */}
                <div className="space-y-2 relative">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                    Species
                  </label>
                  <div className="relative">
                    <FaDog className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" />
                    <input
                      name="type"
                      defaultValue={pet.type}
                      required
                      className="w-full pl-14 pr-6 py-4 rounded-2xl border-2 border-gray-50 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 outline-none focus:border-[#37948b] font-bold dark:text-white transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                    Breed
                  </label>
                  <input
                    name="breed"
                    defaultValue={pet.breed}
                    required
                    className="w-full px-6 py-4 rounded-2xl border-2 border-gray-50 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 outline-none focus:border-[#37948b] font-bold dark:text-white transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                    Age (e.g. 2 Years)
                  </label>
                  <div className="relative">
                    <FaCalendarAlt className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" />
                    <input
                      name="age"
                      defaultValue={pet.age}
                      required
                      className="w-full pl-14 pr-6 py-4 rounded-2xl border-2 border-gray-50 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 outline-none focus:border-[#37948b] font-bold dark:text-white transition-all"
                    />
                  </div>
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                    Location
                  </label>
                  <div className="relative">
                    <FaMapMarkerAlt className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" />
                    <input
                      name="location"
                      defaultValue={pet.location}
                      required
                      className="w-full pl-14 pr-6 py-4 rounded-2xl border-2 border-gray-50 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 outline-none focus:border-[#37948b] font-bold dark:text-white transition-all"
                    />
                  </div>
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                    Adoption Status
                  </label>
                  <div className="relative">
                    <select
                      name="status"
                      defaultValue={pet.status}
                      className="w-full px-6 py-4 rounded-2xl border-2 border-gray-50 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 outline-none focus:border-[#37948b] font-bold dark:text-white appearance-none cursor-pointer"
                    >
                      <option value="Available">Available</option>
                      <option value="Adopted">Adopted</option>
                      <option value="Pending">Pending</option>
                    </select>
                    <FaChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" />
                  </div>
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <FaInfoCircle className="text-[#37948b]" /> Biography &
                    Details
                  </label>
                  <textarea
                    name="description"
                    defaultValue={pet.description}
                    rows="5"
                    required
                    className="w-full px-6 py-5 rounded-[2rem] border-2 border-gray-50 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 outline-none focus:border-[#37948b] font-bold dark:text-white transition-all resize-none"
                  ></textarea>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={imageUploading || updateLoading}
                className="w-full mt-10 py-5 bg-[#37948b] text-white font-black rounded-2xl shadow-xl hover:bg-[#2d7a72] transition-all flex items-center justify-center gap-3 disabled:opacity-50 text-xs uppercase tracking-[0.2em]"
              >
                {updateLoading ? (
                  <FaSpinner className="animate-spin text-xl" />
                ) : (
                  <FaPaw className="text-xl" />
                )}
                {updateLoading ? 'Saving Changes...' : 'Update Pet Profile'}
              </motion.button>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default EditPetForm;
