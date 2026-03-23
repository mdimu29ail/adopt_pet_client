import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import Swal from 'sweetalert2';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const EditPetForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageUploading, setImageUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    fetch(`http://localhost:5000/pets/${id}`)
      .then(res => res.json())
      .then(data => {
        setPet(data);
        setImageUrl(data.image_url || '');
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch pet:', err);
        Swal.fire('Error', 'Failed to load pet data', 'error');
        setLoading(false);
      });
  }, [id]);

  const imgbbAPIKey = import.meta.env.VITE_image_upload_key;

  const handleImageUpload = async e => {
    const file = e.target.files[0];
    if (!file) return;

    setImageUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await fetch(
        `https://api.imgbb.com/1/upload?key=${imgbbAPIKey}`,
        {
          method: 'POST',
          body: formData,
        },
      );
      const data = await res.json();

      if (data.success) {
        setImageUrl(data.data.url);
        Swal.fire('Success', 'Image uploaded successfully', 'success');
      } else {
        Swal.fire('Error', 'Image upload failed', 'error');
      }
    } catch (err) {
      console.error('Image upload error:', err);
      Swal.fire('Error', 'Image upload failed', 'error');
    }

    setImageUploading(false);
  };

  const handleSubmit = e => {
    e.preventDefault();
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

    fetch(`http://localhost:5000/pets/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedPet),
    })
      .then(res => res.json())
      .then(result => {
        if (result.modifiedCount > 0) {
          Swal.fire('Success', 'Pet updated successfully!', 'success');
          navigate('/petListing');
        } else {
          Swal.fire('Info', 'No changes were made', 'info');
        }
      })
      .catch(() =>
        Swal.fire('Error', 'Something went wrong while updating', 'error'),
      );
  };

  if (loading) {
    return (
      <div className="max-w-xl mx-auto py-10 px-4">
        <Skeleton height={40} width="50%" className="mb-4" />
        <Skeleton count={7} height={35} className="mb-3" />
        <Skeleton height={200} />
      </div>
    );
  }

  if (!pet) {
    return <p className="text-center text-red-500">Pet not found</p>;
  }

  return (
    <div className="max-w-xl mx-auto py-10 px-4">
      <h2 className="text-3xl font-bold mb-6 text-center">Edit Pet</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          defaultValue={pet.name}
          placeholder="Name"
          className="input input-bordered w-full"
          required
        />

        <input
          name="type"
          defaultValue={pet.type}
          placeholder="Type (Dog/Cat)"
          className="input input-bordered w-full"
          required
        />

        <input
          name="breed"
          defaultValue={pet.breed}
          placeholder="Breed"
          className="input input-bordered w-full"
          required
        />

        <input
          name="age"
          type="number"
          defaultValue={pet.age}
          placeholder="Age"
          className="input input-bordered w-full"
          required
        />

        <input
          name="location"
          defaultValue={pet.location}
          placeholder="Location"
          className="input input-bordered w-full"
          required
        />

        <select
          name="status"
          defaultValue={pet.status}
          className="select select-bordered w-full"
          required
        >
          <option value="Available">Available</option>
          <option value="Adopted">Adopted</option>
          <option value="Pending">Pending</option>
        </select>

        <textarea
          name="description"
          defaultValue={pet.description}
          placeholder="Description"
          className="textarea textarea-bordered w-full"
          rows={4}
          required
        ></textarea>

        {/* Image upload section */}
        <div>
          <label className="block mb-1 font-semibold">Upload Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            disabled={imageUploading}
            className="w-full"
          />
          {imageUploading && (
            <p className="text-sm text-gray-500 mt-1">Uploading image...</p>
          )}
          {imageUrl && (
            <img
              src={imageUrl}
              alt="Uploaded"
              className="mt-2 h-40 w-full object-cover rounded"
            />
          )}
        </div>

        <button
          type="submit"
          className="w-full border border-orange-500 font-semibold py-2 rounded hover:bg-orange-500 hover:text-white transition"
          disabled={imageUploading}
        >
          Update Pet
        </button>
      </form>
    </div>
  );
};

export default EditPetForm;
