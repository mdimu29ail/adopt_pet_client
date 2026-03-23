import React, { useEffect, useState } from 'react';
import { Link } from 'react-router';
import Swal from 'sweetalert2';
import useAuth from '../../hooks/useAuth';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const MyPets = () => {
  const { user } = useAuth();
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user?.email) return;

    setLoading(true);
    fetch('http://localhost:5000/pets')
      .then(res => res.json())
      .then(data => {
        const filtered = data.filter(pet => pet.owner_email === user.email);
        setPets(filtered);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching pets:', error);
        setLoading(false);
      });
  }, [user?.email]);

  const handleDelete = id => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You are about to delete this pet.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then(result => {
      if (!result.isConfirmed) return;

      fetch(`http://localhost:5000/pets/${id}`, {
        method: 'DELETE',
      })
        .then(res => res.json())
        .then(data => {
          if (data.deletedCount > 0) {
            Swal.fire('Deleted!', 'Pet has been deleted.', 'success');
            setPets(prev => prev.filter(p => p._id !== id));
          } else {
            Swal.fire('Error!', 'Failed to delete pet.', 'error');
          }
        })
        .catch(() => {
          Swal.fire('Error!', 'Something went wrong.', 'error');
        });
    });
  };

  return (
    <div className="min-h-screen py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-extrabold text-center mb-8">My Pets</h2>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="border rounded-lg shadow p-2 flex flex-col"
              >
                <Skeleton height={112} className="mb-2" />
                <Skeleton height={20} width={`60%`} className="mb-1" />
                <Skeleton height={15} width={`80%`} className="mb-0.5" />
                <Skeleton height={15} width={`50%`} className="mb-0.5" />
                <Skeleton height={15} width={`40%`} className="mb-2" />
                <div className="flex justify-between gap-1 pt-2">
                  <Skeleton height={30} width={60} />
                  <Skeleton height={30} width={60} />
                  <Skeleton height={30} width={60} />
                </div>
              </div>
            ))}
          </div>
        ) : pets.length === 0 ? (
          <p className="text-center italic">You have not added any pets yet.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pets.map(pet => (
              <div
                key={pet._id}
                className="border rounded-lg shadow p-2 flex flex-col"
              >
                <img
                  src={pet.image_url || 'https://via.placeholder.com/150'}
                  alt={pet.name}
                  className="w-full h-28 object-cover rounded mb-2"
                />
                <h3 className="text-base font-semibold mb-1">{pet.name}</h3>
                <p className="text-sm mb-0.5">
                  <strong>Type:</strong> {pet.type}
                </p>
                <p className="text-sm mb-0.5">
                  <strong>Age:</strong> {pet.age}
                </p>
                <p className="text-sm mb-1">
                  <strong>Status:</strong> {pet.status || 'Available'}
                </p>

                <div className="mt-auto flex justify-between gap-1 pt-2">
                  <Link to={`/dashboard/pets/${pet._id}`}>
                    <button className="px-2 py-1 text-xs border rounded hover:text-blue-500 cursor-pointer">
                      Details
                    </button>
                  </Link>
                  <Link to={`/updatePets/${pet._id}`}>
                    <button className="px-2 py-1 text-xs border rounded hover:text-yellow-500 cursor-pointer">
                      Update
                    </button>
                  </Link>
                  <button
                    onClick={() => handleDelete(pet._id)}
                    className="px-2 py-1 text-xs border rounded hover:text-red-500 cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyPets;
