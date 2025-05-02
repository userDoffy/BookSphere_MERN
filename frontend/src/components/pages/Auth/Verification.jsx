import React from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import useForm from "../../../customhooks/useForm.jsx";
import useRedirectIfAuthenticated from "../../../customhooks/useRedirectIfAuthenticated.jsx";
import toast from 'react-hot-toast';
import { verifyOtp } from '../../../axios/authApi.js';

const Verification = () => {
  useRedirectIfAuthenticated('/popular');
  const location = useLocation();
  const navigate = useNavigate();

  const { formData, handleChange } = useForm({
    email: location.state?.email || null,
    Otp: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await verifyOtp(formData);
      if (response.status === 200) {
        console.log("OTP verified successfully!");
        navigate("/login");
        toast.success("Account verified successfully! Please login.");
      } else {
        navigate("/error", { state: { message: "Error verifying OTP" } });
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      navigate("/error", { state: { message: "Error verifying OTP" } });
    }
  };

  return (
    <div className="container d-flex flex-column align-items-center justify-content-center py-5">
      <div className="card p-4 shadow" style={{ maxWidth: "400px", width: "100%" }}>
        <h4 className="text-center mb-3">Email Verification</h4>
        <p className="text-center text-muted">Enter the 6-digit code sent to your email: <br/>{formData.email}</p>
        <p className="text-center"><strong>{formData.email}</strong></p>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="text"
              name="Otp"
              value={formData.Otp}
              onChange={handleChange}
              className="form-control text-center"
              placeholder="Enter code"
              maxLength="6"
              style={{ fontSize: "1.5rem", letterSpacing: "8px" }}
              required
            />
          </div>
          <div className="d-grid">
            <button type="submit" className="btn btn-primary">Verify</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Verification;
