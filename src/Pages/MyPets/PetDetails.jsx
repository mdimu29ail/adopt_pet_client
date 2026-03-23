import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { motion } from 'framer-motion';
import useAuth from '../../hooks/useAuth';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const PetDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/pets/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch pet details');
        return res.json();
      })
      .then(data => {
        setPet(data);
        setError(null);
      })
      .catch(() => {
        setError('Could not load pet details. Please try again later.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const handleBack = () => {
    navigate(-1);
  };

  const isOwner = user?.email === pet?.owner_email;

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto py-16 px-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        <Skeleton height={300} />
        <div>
          <Skeleton count={6} />
          <div className="mt-4 flex gap-4">
            <Skeleton width={120} height={40} />
            <Skeleton width={160} height={40} />
          </div>
        </div>
      </div>
    );
  }

  if (error) return <p className="text-center text-red-500 py-10">{error}</p>;
  if (!pet) return <p className="text-center py-10">Pet not found.</p>;

  return (
    <motion.div
      className="max-w-6xl mx-auto py-10 px-4"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Image */}
        <motion.img
          src={pet.image_url || 'https://via.placeholder.com/600x400'}
          alt={pet.name}
          className="w-full h-96 object-cover"
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        />

        {/* Info */}
        <div className="p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-3xl font-bold text-orange-500 mb-4">
              Meet {pet.name}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-gray-700 text-[16px]">
              <p>
                <strong>Type:</strong> {pet.type}
              </p>
              <p>
                <strong>Breed:</strong> {pet.breed || 'Unknown'}
              </p>
              <p>
                <strong>Age:</strong> {pet.age}{' '}
                {pet.age === 1 ? 'year' : 'years'} old
              </p>
              <p>
                <strong>Location:</strong> {pet.location || 'Not specified'}
              </p>
              <p>
                <strong>Status:</strong>
                <span className="ml-2 inline-block px-2 py-0.5 text-sm bg-green-100 text-green-700 rounded-full">
                  {pet.status || 'Available'}
                </span>
              </p>
            </div>

            <div className="mt-6">
              <p className="text-gray-600">
                <strong className="text-orange-500">About {pet.name}:</strong>
                <br />
                {pet.description ||
                  `This lovely ${pet.type} is looking for a loving home.`}
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-6 flex flex-wrap gap-4">
            <button
              onClick={handleBack}
              className="px-5 py-2 bg-orange-100 text-orange-600 border border-orange-300 rounded-lg hover:bg-orange-200 transition duration-200"
              type="button"
            >
              ← Go Back
            </button>

            <Link to={`/dashboard/adopt/${pet._id}`}>
              <button
                className={`px-5 py-2 font-semibold rounded-lg transition duration-200 ${
                  isOwner
                    ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                    : 'bg-orange-500 text-white hover:bg-orange-600'
                }`}
                disabled={isOwner}
                title={
                  isOwner ? "You can't adopt your own pet" : `Adopt ${pet.name}`
                }
                type="button"
              >
                Adopt {pet.name} pet
              </button>
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PetDetails;
