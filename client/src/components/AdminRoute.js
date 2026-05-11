import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth(); // Both are booleans

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!isAuthenticated) {
    toast.error('Please login to access this page');
    return <Navigate to="/login" />;
  }

  if (!isAdmin) {
    toast.error('Access denied. Admin only.');
    return <Navigate to="/" />;
  }

  return children;
};

export default AdminRoute;