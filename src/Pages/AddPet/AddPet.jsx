import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router';
import useAuth from '../../hooks/useAuth';
import axios from 'axios';

const AddPet = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

  const handleImageChange = e => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const form = e.target;

    // Upload image to ImgBB first
    let image_url = '';
    if (imageFile) {
      const imageData = new FormData();
      imageData.append('image', imageFile);

      try {
        const imgbbApiKey =
          import.meta.env.VITE_image_upload_key ||
          '57826cf4e0dd6a90cc9310035762ca80';
        const imgbbRes = await axios.post(
          `https://api.imgbb.com/1/upload?key=${imgbbApiKey}`,
          imageData,
        );

        if (imgbbRes.data.success) {
          image_url = imgbbRes.data.data.url;
        } else {
          throw new Error('Image upload failed');
        }
      } catch (error) {
        console.error('❌ ImgBB Upload Error:', error);
        Swal.fire(
          'Image Upload Failed',
          'Could not upload the image.',
          'error',
        );
        return;
      }
    }

    // Construct new pet object
    const newPet = {
      name: form.name.value,
      type: form.type.value,
      breed: form.breed.value,
      age: parseInt(form.age.value || '0'),
      location: form.location.value,
      status: form.status.value,
      image_url,
      description: form.description.value,
      owner_email: user.email,
      owner_name: user.displayName,
    };

    try {
      const res = await axios.post('http://localhost:5000/pets', newPet);
      if (res.data.insertedId) {
        Swal.fire('Success!', 'Pet added successfully.', 'success');
        navigate('/dashboard/mypets');
      }
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'Failed to add pet.', 'error');
    }
  };

  return (
    <div className="w-full mx-auto px-6 py-10 shadow-xl rounded-xl mt-8">
      <h2 className="text-4xl font-bold text-center mb-10 text-orange-600">
        Add New Pet
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pet Name */}
          <div>
            <label className="block mb-2 font-medium">Pet Name</label>
            <input
              type="text"
              name="name"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* Type */}
          <div>
            <label className="block mb-2 font-medium">Type</label>
            <input
              type="text"
              name="type"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* Breed */}
          <div>
            <label className="block mb-2 font-medium">Breed</label>
            <input
              type="text"
              name="breed"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* Age */}
          <div>
            <label className="block mb-2 font-medium">Age</label>
            <input
              type="number"
              name="age"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block mb-2 font-medium">Location</label>
            <input
              type="text"
              name="location"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block mb-2 font-medium">Status</label>
            <input
              type="text"
              name="status"
              defaultValue="available"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* Image Upload */}
          <div className="md:col-span-2">
            <label className="block mb-2 font-medium">Pet Photo</label>
            <div className="flex flex-col items-center justify-center w-full border-2 border-dashed border-gray-300 rounded-xl p-6">
              <label
                htmlFor="imageUpload"
                className="cursor-pointer text-orange-600 hover:text-orange-700 font-medium"
              >
                Click to upload image
              </label>
              <input
                type="file"
                id="imageUpload"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              {previewUrl && (
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="mt-4 w-40 h-40 object-cover rounded-md shadow-md"
                />
              )}
            </div>
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label className="block mb-2 font-medium">Description</label>
            <textarea
              name="description"
              rows="3"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-orange-500"
            ></textarea>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-6">
          <button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl text-lg font-semibold transition duration-200 cursor-pointer"
          >
            🐶 Add Pet
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddPet;
