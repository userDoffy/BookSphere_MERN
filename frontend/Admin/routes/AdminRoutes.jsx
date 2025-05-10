import React from 'react';
import { Route, Routes } from 'react-router-dom';
import AdminLayout from '../pages/AdminLayout';
import AdminProtectedRoute from './AdminProtectedRoute';
import AdminLogin from '../pages/AdminLogin';
import ManageBooks from '../pages/ManageBooks';

const AdminRoutes = () => {
  return (
    <Routes>
      
      <Route path="/admin/login" element={<AdminLogin />} />

      
      <Route
        path="/admin/*"
        element={
          <AdminProtectedRoute allowedRoles={["Admin"]}>
            <AdminLayout />
          </AdminProtectedRoute>
        }
      >
        <Route path="manage-books" element={<ManageBooks />} />
        
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
