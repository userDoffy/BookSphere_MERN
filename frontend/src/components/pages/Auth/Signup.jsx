import React, { useState } from "react";
import useForm from "../../../customhooks/useForm.jsx";
import { Link, useNavigate } from "react-router-dom";
import useRedirectIfAuthenticated from "../../../customhooks/useRedirectIfAuthenticated.jsx";
import { signupUser } from "../../../axios/authApi.js";
import { toast } from "react-hot-toast";

const Signup = () => {
  const navigate = useNavigate();
  const { formData, handleChange } = useForm({
    name: "",
    email: "",
    phone: "",
    address: "",
    password: "",
  });

  const [confirmPassword, setConfirmPassword] = useState("");

  useRedirectIfAuthenticated("/popular");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const response = await signupUser(formData);
      if (response.status === 201) {
        navigate("/verification", { state: { email: formData.email } });
      } else {
        navigate("/error", { state: { message: "Signup failed!" } });
      }
    } catch (error) {
      navigate("/error", { state: { message: "Signup failed!" } });
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center py-5">
      <div
        className="card p-4 shadow"
        style={{ width: "100%", maxWidth: "400px", borderRadius: "1rem" }}
      >
        <h3 className="text-center mb-4">Signup</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">Name</label>
            <input
              type="text"
              className="form-control"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="phone" className="form-label">Phone</label>
            <input
              type="text"
              className="form-control"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="address" className="form-label">Address</label>
            <input
              type="text"
              className="form-control"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
            <input
              type="password"
              className="form-control"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Signup
          </button>
        </form>
        <div className="text-center mt-3">
          <small>
            Already have an account?{" "}
            <Link to="/login" className="text-decoration-none">
              Login
            </Link>
          </small>
        </div>
      </div>
    </div>
  );
};

export default Signup;
