import React, { Children } from 'react';

import { Navigate } from 'react-router';
import useAuth from '../../hooks/useAuth';
import useUserRole from '../../hooks/useUserRole';
import Loading from '../../Loading/Loading';

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const { role, roleLoading } = useUserRole();

  if (loading || roleLoading) {
    return <Loading></Loading>;
  }

  if (!user || role !== 'admin') {
    return (
      <Navigate state={{ from: location.pathname }} to="/forbidden"></Navigate>
    );
  }

  return children;
};

export default AdminRoute;
