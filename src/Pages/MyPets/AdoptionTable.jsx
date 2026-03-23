import React, { useEffect, useState } from 'react';
import axios from 'axios';
import useAuth from '../../hooks/useAuth';

const AdoptionTable = () => {
  const { user } = useAuth();
  const [adoptions, setAdoptions] = useState([]);
  const [pets, setPets] = useState([]);

  // Fetch user's adoptions
  const fetchUserAdoptions = async () => {
    if (!user?.email) return;
    try {
      const res = await axios.get(
        `http://localhost:5000/adoptions?email=${user.email}`,
      );
      setAdoptions(res.data || []);
    } catch (err) {
      console.error('Failed to load adoptions:', err);
    }
  };

  // Fetch all pets for mapping petId to petName
  const fetchPets = async () => {
    try {
      const res = await axios.get('http://localhost:5000/pets');
      setPets(res.data || []);
    } catch (err) {
      console.error('Failed to load pets:', err);
    }
  };

  useEffect(() => {
    fetchUserAdoptions();
    fetchPets();
  }, [user]);

  // Helper to get pet name by petId
  const getPetName = petId => {
    const pet = pets.find(p => p._id === petId);
    return pet ? pet.name : 'Unknown Pet';
  };

  return (
    <div className="w-full mx-auto px-4 py-10">
      <h2 className="text-2xl font-bold text-center mb-6">Adoption Request</h2>
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr className="">
              <th>Pet ID</th>
              <th>Pet Name</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {adoptions.map(ad => (
              <tr key={ad._id}>
                <td>{ad.petId}</td>
                <td>{getPetName(ad.petId)}</td>
                <td>{ad.phone}</td>
                <td>{ad.address}</td>
                <td>
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      ad.status === 'active'
                        ? 'bg-green-800 text-white'
                        : 'bg-orange-500 text-white'
                    }`}
                  >
                    {ad.status || 'pending'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdoptionTable;
