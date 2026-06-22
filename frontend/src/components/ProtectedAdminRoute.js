import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedAdminRoute = ({ user, children }) => {
  if (!user || user.role !== 'admin') {
    sessionStorage.setItem('homeMessage', 'Admin access required. You have been redirected to the home page.');
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedAdminRoute;
