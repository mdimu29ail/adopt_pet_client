import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import { FaUserShield } from 'react-icons/fa';
import moment from 'moment';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

import useAxiosSecure from '../../hooks/useAxiosSecure';

const MakeAdmin = () => {
  const [search, setSearch] = useState('');
  const axiosSecure = useAxiosSecure();

  const {
    data: users = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const res = await axiosSecure.get('/users');
      return res.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const filteredUsers = useMemo(() => {
    const s = search.toLowerCase().trim();
    return users.filter(user => {
      const name = (user.name || '').toLowerCase();
      const email = (user.email || '').toLowerCase();
      return name.includes(s) || email.includes(s);
    });
  }, [search, users]);

  const toggleRole = async (email, currentRole) => {
    const isPromote = currentRole !== 'admin';

    const confirm = await Swal.fire({
      title: isPromote ? 'Make Admin?' : 'Remove Admin?',
      text: `Do you want to ${isPromote ? 'promote' : 'demote'} ${email}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: isPromote ? 'Yes, Promote' : 'Yes, Demote',
    });

    if (!confirm.isConfirmed) return;

    try {
      const res = await axiosSecure.patch('/users/role', {
        email,
        role: isPromote ? 'admin' : 'user',
      });

      if (res.data.success) {
        Swal.fire(
          'Success',
          `${email} is now ${isPromote ? 'an Admin' : 'a User'}`,
          'success'
        );
        refetch();
      } else {
        Swal.fire('Error', res.data.message || 'Update failed', 'error');
      }
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'Server error occurred', 'error');
    }
  };

  if (isLoading) {
    return (
      <div className="px-4 py-8">
        <Skeleton height={40} width={300} className="mb-4" />
        <Skeleton height={50} className="mb-4" />
        {[...Array(5)].map((_, i) => (
          <div className="grid grid-cols-5 gap-4 mb-2" key={i}>
            {[...Array(5)].map((__, j) => (
              <Skeleton key={j} height={30} />
            ))}
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-10 font-semibold text-red-600">
        Failed to load users.
      </div>
    );
  }

  return (
    <div className="w-full mx-auto px-4 py-8 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">
        <FaUserShield className="inline-block mr-2" />
        Manage User Roles
      </h2>

      <input
        type="text"
        placeholder="Search by email or name..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="input input-bordered w-full mb-6"
      />

      <div className="overflow-x-auto">
        <table className="table w-full table-zebra">
          <thead>
            <tr>
              <th>#</th>
              <th>User Info</th>
              <th>Role</th>
              <th>Updated At</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length ? (
              filteredUsers.map((user, index) => (
                <tr key={user._id || user.email}>
                  <td>{index + 1}</td>
                  <td>
                    <div>
                      <p className="font-semibold">
                        {user.name || 'Unnamed User'}
                      </p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </td>
                  <td className="capitalize">{user.role || 'user'}</td>
                  <td>
                    {user.updatedAt
                      ? moment(user.updatedAt).format('LLL')
                      : 'N/A'}
                  </td>
                  <td>
                    <button
                      className={`btn btn-sm ${
                        user.role === 'admin' ? 'btn-warning' : 'btn-success'
                      }`}
                      onClick={() => toggleRole(user.email, user.role)}
                    >
                      {user.role === 'admin' ? 'Remove Admin' : 'Make Admin'}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center text-gray-500 py-8">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MakeAdmin;
