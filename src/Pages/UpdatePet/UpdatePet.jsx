import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import Swal from 'sweetalert2';
import { getAuth } from 'firebase/auth';
import useAuth from '../../hooks/useAuth';
import axios from 'axios';

const UpdatePet = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [previewUrl, setPreviewUrl] = useState('');
  const [uploadedImageUrl, setUploadedImageUrl] = useState('');

  useEffect(() => {
    fetch(`http://localhost:5000/pets/${id}`)
      .then(res => res.json())
      .then(data => {
        setPet(data);
        setPreviewUrl(data.image_url);
        setUploadedImageUrl(data.image_url);
        setLoading(false);
      })
      .catch(() => {
        Swal.fire('Error', 'Failed to load pet data.', 'error');
        setLoading(false);
      });
  }, [id]);

  const handleImageChange = async e => {
    const file = e.target.files[0];
    if (!file) return;

    setPreviewUrl(URL.createObjectURL(file));

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
      const url = res.data?.data?.url;
      setUploadedImageUrl(url);
    } catch (error) {
      console.log(error);
      Swal.fire('Image Upload Failed', 'Please try again', 'error');
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const form = e.target;

    const updatedPet = {
      name: form.name.value,
      type: form.type.value,
      breed: form.breed.value,
      age: form.age.value,
      location: form.location.value,
      status: form.status.value,
      image_url: uploadedImageUrl || pet.image_url,
      description: form.description.value,
    };

    const auth = getAuth();
    const currentUser = auth.currentUser;
    if (!currentUser) {
      return Swal.fire('Unauthorized', 'Please login to update pets.', 'error');
    }

    try {
      const token = await currentUser.getIdToken(true);
      const res = await fetch(`http://localhost:5000/pets/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedPet),
      });

      const result = await res.json();

      if (result.modifiedCount > 0) {
        Swal.fire('Success!', 'Pet updated successfully.', 'success');
        navigate('/dashboard/mypets');
      } else {
        Swal.fire('Notice', 'No changes were made.', 'info');
      }
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'Failed to update pet.', 'error');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin h-16 w-16 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!pet) {
    return <p className="text-center py-10 text-red-500">Pet not found.</p>;
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 bg-white shadow-xl rounded-xl mt-8">
      <h2 className="text-4xl font-bold text-center mb-10 text-blue-700">
        Update Pet
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { name: 'name', label: 'Pet Name' },
            { name: 'type', label: 'Type' },
            { name: 'breed', label: 'Breed' },
            { name: 'age', label: 'Age' },
            { name: 'location', label: 'Location' },
            { name: 'status', label: 'Status' },
          ].map(field => (
            <div key={field.name}>
              <label className="block mb-2 font-medium text-gray-700">
                {field.label}
              </label>
              <input
                type="text"
                name={field.name}
                defaultValue={pet[field.name]}
                required={field.name === 'name' || field.name === 'type'}
                className="input input-bordered w-full"
              />
            </div>
          ))}

          <div className="md:col-span-2">
            <label className="block mb-2 font-medium text-gray-700">
              Pet Photo
            </label>
            <div className="flex flex-col items-center justify-center w-full border-2 border-dashed border-gray-300 rounded-xl p-6 bg-gray-50">
              <label
                htmlFor="imageUpload"
                className="cursor-pointer text-blue-600 hover:text-blue-800 font-medium"
              >
                Click to upload a new image
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

          <div className="md:col-span-2">
            <label className="block mb-2 font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              rows="3"
              defaultValue={pet.description}
              className="textarea textarea-bordered w-full resize-none"
            ></textarea>
          </div>
        </div>

        <div className="pt-6">
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl text-lg font-semibold transition duration-200"
          >
            Update Pet
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdatePet;
