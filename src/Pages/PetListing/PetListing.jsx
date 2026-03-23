import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import useUserRole from '../../hooks/useUserRole';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const PetListing = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [pets, setPets] = useState([]);
  const [visibleCount, setVisibleCount] = useState(6);
  const [loading, setLoading] = useState(true);
  const { role, roleLoading } = useUserRole();

  useEffect(() => {
    const fetchPets = async () => {
      setLoading(true);
      try {
        const res = await fetch('http://localhost:5000/pets');
        const data = await res.json();

        const filtered = data
          .filter(pet => !pet.adopted)
          .filter(
            pet =>
              pet.name.toLowerCase().includes(search.toLowerCase()) &&
              (category === 'All' || pet.type === category),
          )
          .sort((a, b) => new Date(b.date) - new Date(a.date));

        setPets(filtered);
      } catch (error) {
        console.error('❌ Failed to fetch pets:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPets();
  }, [search, category]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop + 100 >=
        document.documentElement.offsetHeight
      ) {
        setVisibleCount(prev => prev + 3);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleViewDetails = id => {
    navigate(`/dashboard/pets/${id}`);
  };

  const handleDelete = async id => {
    const confirm = window.confirm('Are you sure you want to delete this pet?');
    if (!confirm) return;

    try {
      const res = await fetch(`http://localhost:5000/pets/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();

      if (data.deletedCount > 0) {
        setPets(prev => prev.filter(p => p._id !== id));
        alert('Pet deleted successfully!');
      } else {
        alert('Failed to delete pet.');
      }
    } catch (error) {
      console.error('❌ Delete error:', error);
      alert('Server error during deletion');
    }
  };

  if (roleLoading || loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 w-full mx-auto px-4 py-10">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="border rounded-lg p-4">
            <Skeleton height={180} className="mb-4" />
            <Skeleton height={20} width="80%" className="mb-2" />
            <Skeleton height={15} width="60%" className="mb-2" />
            <Skeleton height={15} width="40%" className="mb-2" />
            <div className="flex gap-2 mt-4">
              <Skeleton height={36} width="50%" />
              <Skeleton height={36} width="50%" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="w-full mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold text-center mb-8 text-orange-600">
        Adoptable Pets
      </h2>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border px-4 py-2 rounded-md w-full md:w-1/2"
        />
        <div className="flex gap-2 flex-wrap">
          {['All', 'Cat', 'Dog', 'Fish', 'Rabbit', 'Bird'].map(type => (
            <button
              key={type}
              className={`border px-4 py-2 rounded-md ${
                category === type
                  ? 'font-semibold underline text-orange-500'
                  : ''
              }`}
              onClick={() => setCategory(type)}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Pet Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {pets.slice(0, visibleCount).map(pet => (
          <div
            key={pet._id}
            className="border rounded-lg overflow-hidden flex flex-col"
          >
            <img
              src={pet.image_url}
              alt={pet.name}
              className="h-40 w-full object-cover"
            />
            <div className="p-4 flex flex-col justify-between flex-grow">
              <div>
                <h3 className="text-xl font-semibold mb-1">{pet.name}</h3>
                <div className="flex justify-between">
                  <p className="text-sm mb-1">Type: {pet.type}</p>
                  <p className="text-sm mb-1">Age: {pet.age}</p>
                </div>
                <p className="text-sm mb-2">Location: {pet.location}</p>
              </div>

              <div className="mt-4 flex justify-between">
                <button
                  className="border px-4 py-2 rounded text-sm cursor-pointer hover:text-blue-500"
                  onClick={() => handleViewDetails(pet._id)}
                >
                  Details
                </button>

                {role === 'admin' && (
                  <>
                    <button
                      className="border px-4 py-2 rounded text-sm cursor-pointer hover:text-yellow-500"
                      onClick={() => navigate(`/dashboard/edit-pet/${pet._id}`)}
                    >
                      Edit
                    </button>
                    <button
                      className="border px-4 py-2 rounded text-sm cursor-pointer hover:text-red-500"
                      onClick={() => handleDelete(pet._id)}
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {visibleCount < pets.length && (
        <p className="text-center mt-6">Scroll down to load more...</p>
      )}
    </div>
  );
};

export default PetListing;
