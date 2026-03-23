import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import axios from 'axios';
import useAuth from '../../hooks/useAuth';
import Swal from 'sweetalert2';

const AdoptForm = () => {
  const { id } = useParams(); // Pet ID
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    phone: '',
    address: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!user?.email) {
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Your work has been saved',
        showConfirmButton: false,
        timer: 1500,
      });
      return;
    }

    const adoptionData = {
      petId: id,
      name: user.displayName || '',
      email: user.email || '',
      phone: formData.phone,
      address: formData.address,
      message: formData.message,
      createdAt: new Date().toISOString(),
    };

    try {
      setLoading(true);
      const res = await axios.post(
        'http://localhost:5000/adoptions',
        adoptionData,
      );
      setLoading(false);

      if (res.data?.insertedId || res.data?.acknowledged) {
        alert('✅ Adoption request submitted successfully!');
        navigate('/dashboard/adoptions');
      } else {
        alert('❌ Failed to submit request.');
      }
    } catch (error) {
      setLoading(false);
      console.error('Submission error:', error);
      alert('❌ Something went wrong. Please try again.');
    }
  };

  if (!user) {
    return <p className="text-center py-10">Please log in to adopt a pet.</p>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-10 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg bg-white p-6 rounded-lg shadow-md"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Adopt This Pet</h2>

        <input
          type="text"
          value={user.displayName || ''}
          readOnly
          className="w-full mb-3 px-3 py-2 border rounded bg-gray-100"
          placeholder="Name"
        />

        <input
          type="email"
          value={user.email || ''}
          readOnly
          className="w-full mb-3 px-3 py-2 border rounded bg-gray-100"
          placeholder="Email"
        />

        <input
          type="text"
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          className="w-full mb-3 px-3 py-2 border rounded"
          required
        />

        <input
          type="text"
          name="address"
          placeholder="Your Address"
          value={formData.address}
          onChange={handleChange}
          className="w-full mb-3 px-3 py-2 border rounded"
          required
        />

        <textarea
          name="message"
          placeholder="Why do you want to adopt?"
          value={formData.message}
          onChange={handleChange}
          className="w-full mb-4 px-3 py-2 border rounded"
          rows={4}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Submitting...' : 'Submit Request'}
        </button>
      </form>
    </div>
  );
};

export default AdoptForm;
