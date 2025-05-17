import React from 'react';
import { Route, Routes } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout'
import AdminProtectedRoute from './AdminProtectedRoute';
import AdminLogin from '../pages/AdminLogin';
import Dashboard from '../pages/Dashboard'
import ManageBooks from '../pages/ManageBooks';
import ManageUsers from '../pages/ManageUsers';
import ManageOrders from '../pages/ManageOrders';
import ManageBlogs from '../pages/ManageBlogs';
import CustomerSupport from '../pages/CustomerSupport';

const AdminRoutes = () => {
  return (
    <Routes>

      <Route path="/admin" element={<AdminLogin />} />
    
      <Route
        path="/admin/*"
        element={
          <AdminProtectedRoute allowedRoles={["Admin"]}>
            <AdminLayout />
          </AdminProtectedRoute>
        }
      >
        <Route path="dashboard" element={<Dashboard/>} />
        <Route path="manage-books" element={<ManageBooks />} />
        <Route path="manage-users" element={<ManageUsers />} />
        <Route path="manage-orders" element={<ManageOrders />} />
        <Route path="manage-blogs" element={<ManageBlogs />} />
        <Route path="customer-support" element={<CustomerSupport />} />
        
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
