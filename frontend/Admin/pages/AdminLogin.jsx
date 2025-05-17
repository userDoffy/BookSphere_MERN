import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import useForm from '../../src/customhooks/useForm';
import { loginAdmin } from '../axios/adminApi';
import { useNavigate } from 'react-router-dom';
const AdminLogin = () => {
  const navigate = useNavigate();
  const { formData, handleChange } = useForm({
    email: "",
    password: "",
    role: "Admin",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async(e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try{
      const response = await loginAdmin(formData);
      if (response.status === 200) {
        
        console.log("Login successful");
        setLoading(false);
        navigate("dashboard");
      } else {
       
        setError("Login failed");
        setLoading(false);
      }
    }
    catch (error) {
      setError("Error logging in");
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-dark">
      <div className="card bg-secondary text-white p-4 shadow rounded" style={{ width: '100%', maxWidth: '350px' }}>
        <h3 className="text-center mb-3">Admin Login</h3>

        {error && <div className="alert alert-danger py-2">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              className="form-control bg-dark text-white border-secondary"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email"
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              className="form-control bg-dark text-white border-secondary"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              required
            />
          </div>

          <button type="submit" className="btn btn-light w-100" disabled={loading}>
            {loading ? (
              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            ) : (
              'Login'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
