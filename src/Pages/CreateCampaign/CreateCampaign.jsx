import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import Swal from 'sweetalert2';
import axios from 'axios';
import useAuth from '../../hooks/useAuth';

const CreateCampaign = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [imageUrl, setImageUrl] = useState('');
  const [preview, setPreview] = useState('');
  const [uploading, setUploading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const handleImageUpload = async e => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setPreview(URL.createObjectURL(file));

    const formData = new FormData();
    formData.append('image', file);

    try {
      const apiKey =
        import.meta.env.VITE_image_upload_key ||
        '57826cf4e0dd6a90cc9310035762ca80';
      const res = await axios.post(
        `https://api.imgbb.com/1/upload?key=${apiKey}`,
        formData,
      );
      const uploadedUrl = res.data?.data?.url;
      if (uploadedUrl) {
        setImageUrl(uploadedUrl);
      } else {
        throw new Error('No image URL returned');
      }
    } catch (error) {
      console.error('Image upload failed:', error);
      Swal.fire('Error', 'Image upload failed. Please try again.', 'error');
      setImageUrl('');
      setPreview('');
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async data => {
    if (!imageUrl) {
      return Swal.fire(
        'Image Required',
        'Please upload an image first.',
        'warning',
      );
    }

    const campaign = {
      pet_image: imageUrl,
      max_donation: parseFloat(data.max_donation),
      end_date: data.end_date,
      short_description: data.short_description,
      long_description: data.long_description,
      donated_amount: 0,
      createdAt: new Date().toISOString(),
      owner_email: user?.email || 'unknown',
      owner_name: user?.displayName || 'unknown',
    };

    try {
      const res = await axios.post('http://localhost:5000/campaigns', campaign);
      if (res.data.insertedId) {
        Swal.fire('Success!', 'Campaign created successfully.', 'success');
        reset();
        setImageUrl('');
        setPreview('');
        navigate('/dashboard/campaigns');
      } else {
        throw new Error('Insert failed');
      }
    } catch (error) {
      console.error('Failed to submit campaign:', error);
      Swal.fire('Error', 'Failed to create campaign.', 'error');
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-6 py-10 shadow-xl rounded-2xl mt-10 ">
      <h2 className="text-4xl font-bold text-center mb-10 text-orange-600">
        Create Donation Campaign
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Pet Title */}
        <div>
          <label className="block mb-2 font-semibold ">Pet Title</label>
          <input
            type="text"
            {...register('short_description', { required: true })}
            className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          {errors.short_description && (
            <p className="text-red-500 text-sm">This field is required</p>
          )}
        </div>

        {/* Max Donation */}
        <div>
          <label className="block mb-2 font-semibold ">
            Max Donation Amount
          </label>
          <input
            type="number"
            step="0.01"
            {...register('max_donation', { required: true })}
            className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          {errors.max_donation && (
            <p className="text-red-500 text-sm">This field is required</p>
          )}
        </div>

        {/* End Date */}
        <div>
          <label className="block mb-2 font-semibold ">Donation End Date</label>
          <input
            type="date"
            {...register('end_date', { required: true })}
            className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          {errors.end_date && (
            <p className="text-red-500 text-sm">This field is required</p>
          )}
        </div>

        {/* Long Description */}
        <div>
          <label className="block mb-2 font-semibold ">Long Description</label>
          <textarea
            rows="4"
            {...register('long_description', { required: true })}
            className="w-full border rounded-xl px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-orange-500"
          ></textarea>
          {errors.long_description && (
            <p className="text-red-500 text-sm">This field is required</p>
          )}
        </div>

        {/* Read Only Email */}
        <div>
          <label className="block mb-2 font-semibold ">Created By</label>
          <input
            type="text"
            readOnly
            value={user?.email || 'unknown'}
            className="w-full border rounded-xl px-4 py-3 cursor-not-allowed bg-gray-100 text-gray-600"
          />
        </div>

        {/* Image Upload */}
        <div>
          <label className="block mb-2 font-semibold ">
            Upload Campaign Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="w-full border border-dashed rounded-xl px-4 py-3 cursor-pointer text-orange-600 bg-orange-50 hover:bg-orange-100"
          />
          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="mt-4 w-40 h-40 object-cover rounded-lg shadow-md"
            />
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={uploading}
          className={`w-full py-3 cursor-pointer rounded-xl text-lg font-semibold text-white transition duration-200 ${
            uploading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-orange-500 hover:bg-orange-600'
          }`}
        >
          {uploading ? 'Uploading Image...' : 'Create Campaign'}
        </button>
      </form>
    </div>
  );
};

export default CreateCampaign;
