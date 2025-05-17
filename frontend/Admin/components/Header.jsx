import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { logoutAdmin } from '../axios/adminApi';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutAdmin();
      navigate("/admin");
    } catch (error) {
      console.log(error);
      navigate("");
    }
  };

    return (
    <nav className="navbar navbar-dark bg-dark py-2">
      <div className="container-fluid d-flex justify-content-between align-items-center">

        {/* Left: Admin Title */}
        <div className="fw-bold text-white">Admin</div>

        {/* Middle: Navigation Links */}
        <div className="d-flex gap-3">
          <Link className="nav-link text-white" to="/admin/dashboard">Dashboard</Link>
          <Link className="nav-link text-white" to="/admin/manage-books">Manage Books</Link>
          <Link className="nav-link text-white" to="/admin/manage-orders">Manage Orders</Link>
          <Link className="nav-link text-white" to="/admin/manage-users">Manage Users</Link>
          <Link className="nav-link text-white" to="/admin/manage-blogs">Manage Blogs</Link>
          <Link className="nav-link text-white" to="/admin/customer-support">Customer Support</Link>
        </div>

        {/* Right: Logout Button */}
        <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>
          Logout
        </button>

      </div>
    </nav>
  );
};

export default Header;
