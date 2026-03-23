import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import Swal from 'sweetalert2';
import axios from 'axios';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const imgbbAPI = 'https://api.imgbb.com/1/upload';
const imgbbKey = import.meta.env.VITE_image_upload_key;

const EditDonationCampaign = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [campaign, setCampaign] = useState({
    short_description: '',
    long_description: '',
    max_donation: '',
    donated_amount: '',
    pet_image: '',
    end_date: '',
    owner_name: '',
    owner_email: '',
  });

  const [loading, setLoading] = useState(true);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/campaigns/${id}`)
      .then(res => {
        const data = res.data;
        setCampaign({
          short_description: data.short_description || '',
          long_description: data.long_description || '',
          max_donation: data.max_donation || '',
          donated_amount: data.donated_amount || '',
          pet_image: data.pet_image || '',
          end_date: data.end_date?.slice(0, 10) || '',
          owner_name: data.owner_name || '',
          owner_email: data.owner_email || '',
        });
      })
      .catch(() => {
        Swal.fire('Error', 'Failed to load campaign data', 'error');
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = e => {
    const { name, value } = e.target;
    setCampaign(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = async e => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await axios.post(`${imgbbAPI}?key=${imgbbKey}`, formData);
      const imageUrl = res.data.data.url;
      setCampaign(prev => ({ ...prev, pet_image: imageUrl }));
      Swal.fire('Success', 'Image uploaded', 'success');
    } catch (err) {
      Swal.fire('Error', 'Image upload failed', 'error');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();

    const updatedData = {
      ...campaign,
      max_donation: Number(campaign.max_donation),
      donated_amount: Number(campaign.donated_amount),
    };

    try {
      const res = await axios.patch(
        `http://localhost:5000/campaigns/${id}`,
        updatedData,
      );

      if (res.data.modifiedCount > 0 || res.data.success) {
        Swal.fire('Success', 'Campaign updated successfully!', 'success');
        navigate('/donationCampaigns');
      } else {
        Swal.fire('Info', 'No changes were made', 'info');
      }
    } catch (err) {
      Swal.fire('Error', 'Failed to update campaign', 'error');
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Skeleton height={40} width="60%" />
        <Skeleton count={6} height={30} />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-orange-600">
        Edit Donation Campaign
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="short_description"
          value={campaign.short_description}
          onChange={handleChange}
          placeholder="Short Description"
          className="input input-bordered w-full"
          required
        />

        <textarea
          name="long_description"
          value={campaign.long_description}
          onChange={handleChange}
          placeholder="Long Description"
          rows={4}
          className="textarea textarea-bordered w-full"
          required
        />

        <input
          type="number"
          name="max_donation"
          value={campaign.max_donation}
          onChange={handleChange}
          placeholder="Max Donation Amount"
          className="input input-bordered w-full"
          required
        />

        <input
          type="number"
          name="donated_amount"
          value={campaign.donated_amount}
          onChange={handleChange}
          placeholder="Donated Amount"
          className="input input-bordered w-full"
          required
        />

        <input
          type="date"
          name="end_date"
          value={campaign.end_date}
          onChange={handleChange}
          className="input input-bordered w-full"
          required
        />

        {campaign.pet_image && (
          <img
            src={campaign.pet_image}
            alt="Campaign"
            className="w-full h-40 object-cover rounded"
          />
        )}

        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="file-input file-input-bordered w-full"
          disabled={uploadingImage}
        />
        {uploadingImage && (
          <p className="text-sm text-gray-500">Uploading image...</p>
        )}

        <input
          type="text"
          name="owner_name"
          value={campaign.owner_name}
          readOnly
          className="input input-bordered w-full bg-gray-100 text-gray-400 cursor-not-allowed"
        />

        <input
          type="email"
          name="owner_email"
          value={campaign.owner_email}
          readOnly
          className="input input-bordered w-full bg-gray-100 text-gray-400 cursor-not-allowed"
        />

        <button
          type="submit"
          className="btn bg-orange-500 text-white w-full"
          disabled={uploadingImage}
        >
          Update Campaign
        </button>
      </form>
    </div>
  );
};

export default EditDonationCampaign;
