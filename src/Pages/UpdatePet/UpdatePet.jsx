import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { motion } from 'framer-motion';
import {
  FaPaw,
  FaArrowLeft,
  FaCloudUploadAlt,
  FaSpinner,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaDog,
  FaEdit,
  FaInfoCircle,
} from 'react-icons/fa';
import useAuth from '../../hooks/useAuth';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { supabase } from '../../Supabase/supabase.config';

const UpdatePet = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);

  // ১. সুপাবেস থেকে পেটের তথ্য আনা
  useEffect(() => {
    const fetchPetData = async () => {
      try {
        const res = await axiosSecure.get(`/pets/${id}`);
        setPet(res.data);
        setPreviewUrl(res.data.image_url);
        setLoading(false);
      } catch (err) {
        console.error(err);
        Swal.fire('Error', 'Failed to load pet data.', 'error');
        setLoading(false);
      }
    };
    fetchPetData();
  }, [id, axiosSecure]);

  // ২. সরাসরি সুপাবেস স্টোরেজে ইমেজ আপলোড
  const handleImageChange = async e => {
    const file = e.target.files[0];
    if (!file) return;

    setPreviewUrl(URL.createObjectURL(file));
    setUploadingImage(true);

    try {
      const fileName = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
      const { data, error } = await supabase.storage
        .from('pet-images') // নিশ্চিত করুন এই বাল্কেটটি আপনার সুপাবেসে আছে
        .upload(`pets/${fileName}`, file);

      if (error) throw error;

      const { data: urlData } = supabase.storage
        .from('pet-images')
        .getPublicUrl(`pets/${fileName}`);

      setPet({ ...pet, image_url: urlData.publicUrl });
      Swal.fire({
        icon: 'success',
        title: 'Image Uploaded',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'Image upload failed. Try again.', 'error');
    } finally {
      setUploadingImage(false);
    }
  };

  // ৩. তথ্য আপডেট সাবমিট করা
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
      image_url: pet.image_url,
      description: form.description.value,
    };

    try {
      const res = await axiosSecure.put(`/pets/${id}`, updatedPet);
      if (res.data.success) {
        Swal.fire({
          icon: 'success',
          title: 'Successfully Updated!',
          text: `${updatedPet.name}'s profile is now updated.`,
          confirmButtonColor: '#37948b',
        });
        navigate('/dashboard/myPets');
      }
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'Failed to update pet profile.', 'error');
    } finally {
      setUpdateLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-[#FFFBF7] dark:bg-gray-950">
        <FaPaw className="text-6xl text-[#37948b] animate-bounce mb-4" />
        <p className="text-[#37948b] font-black uppercase tracking-widest">
          Loading Profile...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#FFFBF7] dark:bg-gray-950 pt-28 pb-20 px-4 md:px-10 lg:px-20 font-sans">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        {/* --- Header --- */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
          <div className="text-center md:text-left">
            <Link
              to="/dashboard/myPets"
              className="inline-flex items-center gap-2 text-[#37948b] font-black text-xs uppercase tracking-widest mb-4 hover:gap-3 transition-all"
            >
              <FaArrowLeft /> My Paws Pack
            </Link>
            <h2 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white leading-tight tracking-tighter">
              Update <span className="text-[#37948b]">Pet Profile</span>
            </h2>
          </div>
          <div className="hidden lg:flex items-center gap-3 bg-white dark:bg-gray-900 p-4 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-gray-800 flex items-center justify-center text-[#37948b]">
              <FaEdit size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">
                Status
              </p>
              <p className="text-sm font-bold text-amber-500">
                Currently Editing
              </p>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 lg:grid-cols-12 gap-10"
        >
          {/* --- Left Column: Profile Media --- */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-gray-800 text-center">
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-6">
                Profile Photo
              </label>

              <div className="relative group w-full aspect-square rounded-[2rem] border-2 border-[#37948b] overflow-hidden shadow-2xl bg-gray-50">
                <img
                  src={previewUrl}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  alt="Pet Preview"
                />

                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center backdrop-blur-sm cursor-pointer">
                  <FaCloudUploadAlt size={40} className="text-white mb-2" />
                  <p className="text-white font-black text-[10px] uppercase tracking-widest">
                    Change Image
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                  />
                </div>

                {uploadingImage && (
                  <div className="absolute inset-0 bg-white/80 dark:bg-black/80 flex items-center justify-center z-20">
                    <FaSpinner className="animate-spin text-[#37948b] text-4xl" />
                  </div>
                )}
              </div>
              <p className="mt-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Click to update image
              </p>
            </div>

            <div className="bg-teal-50 dark:bg-teal-900/20 p-8 rounded-[2.5rem] border border-teal-100 dark:border-teal-800/30">
              <div className="flex items-center gap-3 mb-4">
                <FaInfoCircle className="text-[#37948b]" />
                <h4 className="font-black text-sm uppercase tracking-widest text-gray-700 dark:text-gray-200">
                  Owner Info
                </h4>
              </div>
              <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest leading-relaxed">
                Name: {user?.user_metadata?.full_name || user?.displayName}
                <br />
                Email: {user?.email}
              </p>
            </div>
          </div>

          {/* --- Right Column: Form Details --- */}
          <div className="lg:col-span-8">
            <div className="bg-white dark:bg-gray-900 p-8 md:p-12 rounded-[3rem] shadow-xl border border-gray-100 dark:border-gray-800">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Pet Name */}
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

                {/* Species */}
                <div className="space-y-2">
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

                {/* Breed */}
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                    Breed
                  </label>
                  <input
                    name="breed"
                    defaultValue={pet.breed}
                    className="w-full px-6 py-4 rounded-2xl border-2 border-gray-50 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 outline-none focus:border-[#37948b] font-bold dark:text-white transition-all"
                  />
                </div>

                {/* Age */}
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                    Age (Years)
                  </label>
                  <div className="relative">
                    <FaCalendarAlt className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" />
                    <input
                      name="age"
                      defaultValue={pet.age}
                      className="w-full pl-14 pr-6 py-4 rounded-2xl border-2 border-gray-50 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 outline-none focus:border-[#37948b] font-bold dark:text-white transition-all"
                    />
                  </div>
                </div>

                {/* Location */}
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

                {/* Status Selection */}
                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                    Current Status
                  </label>
                  <select
                    name="status"
                    defaultValue={pet.status}
                    className="w-full px-6 py-4 rounded-2xl border-2 border-gray-50 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 outline-none focus:border-[#37948b] font-bold dark:text-white transition-all cursor-pointer"
                  >
                    <option value="Available">Available</option>
                    <option value="Adopted">Adopted</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>

                {/* Description */}
                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <FaInfoCircle className="text-[#37948b]" /> Full Description
                  </label>
                  <textarea
                    name="description"
                    rows="5"
                    defaultValue={pet.description}
                    className="w-full px-6 py-5 rounded-[2rem] border-2 border-gray-50 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 outline-none focus:border-[#37948b] font-bold dark:text-white transition-all resize-none"
                  ></textarea>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02, backgroundColor: '#2d7a72' }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={updateLoading || uploadingImage}
                className="w-full mt-10 py-5 bg-[#37948b] text-white font-black rounded-2xl shadow-xl shadow-[#37948b44] flex items-center justify-center gap-3 disabled:opacity-50 text-xs uppercase tracking-[0.2em] transition-all"
              >
                {updateLoading ? (
                  <FaSpinner className="animate-spin text-xl" />
                ) : (
                  <FaPaw className="text-xl" />
                )}
                {updateLoading ? 'Applying Changes...' : 'Update Profile'}
              </motion.button>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default UpdatePet;
