// import React, { useEffect, useState } from 'react';
// import Swal from 'sweetalert2';
// import useAxiosSecure from '../../hooks/useAxiosSecure';
// import useUserRole from '../../hooks/useUserRole';

// const AdminDataEditor = () => {
//   const axiosSecure = useAxiosSecure();
//   const { role, roleLoading } = useUserRole();

//   const [data, setData] = useState({
//     users: [],
//     pets: [],
//     adoptions: [],
//     campaigns: [],
//     payments: [],
//   });
//   const [loading, setLoading] = useState(false);

//   const fetchData = async () => {
//     setLoading(true);
//     try {
//       const [users, pets, adoptions, campaigns, payments] = await Promise.all([
//         axiosSecure.get('/admin/users'),
//         axiosSecure.get('/admin/pets'),
//         axiosSecure.get('/admin/adoptions'),
//         axiosSecure.get('/admin/campaigns'),
//         axiosSecure.get('/admin/payments'),
//       ]);
//       setData({
//         users: users.data,
//         pets: pets.data,
//         adoptions: adoptions.data,
//         campaigns: campaigns.data,
//         payments: payments.data,
//       });
//     } catch (err) {
//       Swal.fire('Error', 'Could not load admin data', 'error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (role === 'admin') {
//       fetchData();
//     }
//   }, [role]);

//   if (roleLoading) return <p>Loading role...</p>;
//   if (role !== 'admin') return <p>Access denied. Admins only.</p>;
//   if (loading) return <p>Loading admin data...</p>;

//   return (
//     <div>
//       <h2>Admin Data Manager</h2>
//       <h3>Users</h3>
//       <pre>{JSON.stringify(data.users, null, 2)}</pre>
//       <h3>Pets</h3>
//       <pre>{JSON.stringify(data.pets, null, 2)}</pre>
//       <h3>Adoptions</h3>
//       <pre>{JSON.stringify(data.adoptions, null, 2)}</pre>
//       <h3>Campaigns</h3>
//       <pre>{JSON.stringify(data.campaigns, null, 2)}</pre>
//       <h3>Payments</h3>
//       <pre>{JSON.stringify(data.payments, null, 2)}</pre>
//     </div>
//   );
// };

// export default AdminDataEditor;
