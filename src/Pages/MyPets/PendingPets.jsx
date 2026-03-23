import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const PendingPets = () => {
  const [adoptions, setAdoptions] = useState([]);

  const fetchAdoptions = async () => {
    try {
      const res = await axios.get('http://localhost:5000/adoptions');
      setAdoptions(res.data || []);
    } catch (err) {
      console.error('Failed to load adoptions:', err);
    }
  };

  useEffect(() => {
    fetchAdoptions();
  }, []);

  const handleActivate = async id => {
    try {
      const res = await axios.patch(`http://localhost:5000/adoptions/${id}`, {
        status: 'Accepted',
      });

      if (res.data.success) {
        Swal.fire('Activated!', 'Adoption marked as Accepted.', 'success');
        fetchAdoptions();
      }
    } catch (err) {
      Swal.fire('Error', 'Could not activate adoption', 'error');
    }
  };

  const handleDelete = async id => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this deletion!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    });

    if (result.isConfirmed) {
      try {
        const res = await axios.delete(`http://localhost:5000/adoptions/${id}`);
        if (res.data.success) {
          Swal.fire(
            'Deleted!',
            'Adoption request has been deleted.',
            'success',
          );
          fetchAdoptions();
        } else {
          Swal.fire('Error', 'Failed to delete adoption request.', 'error');
        }
      } catch (err) {
        Swal.fire('Error', 'Failed to delete adoption request.', 'error');
      }
    }
  };

  return (
    <div className="w-full mx-auto px-4 py-10">
      <h2 className="text-2xl font-bold text-center mb-6">Pending Adoptions</h2>
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr className="">
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {adoptions.map(ad => (
              <tr key={ad._id}>
                <td>{ad.name}</td>
                <td>{ad.email}</td>
                <td>{ad.phone}</td>
                <td>
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      ad.status === 'Accepted'
                        ? 'bg-green-700 text-white'
                        : 'bg-orange-500 text-white'
                    }`}
                  >
                    {ad.status || 'pending'}
                  </span>
                </td>
                <td className="flex gap-2">
                  <button
                    onClick={() => handleActivate(ad._id)}
                    disabled={ad.status === 'Accepted'}
                    className="btn btn-sm bg-green-500 text-white disabled:opacity-50 cursor-pointer"
                  >
                    {ad.status === 'Accepted' ? 'Activated' : 'Activate'}
                  </button>

                  <button
                    onClick={() => handleDelete(ad._id)}
                    className="btn btn-sm bg-red-600 text-white cursor-pointer"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PendingPets;
