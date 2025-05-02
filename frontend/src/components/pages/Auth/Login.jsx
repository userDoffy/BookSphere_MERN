import React from "react";
import useForm from "../../../customhooks/useForm.jsx";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../../../redux/auth/authSlice.js";
import useRedirectIfAuthenticated from "../../../customhooks/useRedirectIfAuthenticated.jsx";
import { toast } from "react-hot-toast";
import { getCurrentUser, loginUser } from "../../../axios/authApi.js";

const Login = () => {
  useRedirectIfAuthenticated("/popular");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { formData, handleChange } = useForm({
    email: "",
    password: "",
    role: "User",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser(formData);

      if (response.status == 200) {
        const res = await getCurrentUser();

        if (res.status !== 200) {
          throw new Error("Not authenticated");
        }
        const { name, role,profilepic } = res.data.user;
        dispatch(login({ token: true, name: name, role: role,profilepic:profilepic }));
        navigate("/popular");
        toast.success("Login successful");
      } else {
        navigate("/error", { state: { message: "Login failed" } });
        toast.error("Login failed");
      }
    } catch (error) {
      navigate("/error", { state: { message: "Error logging in" } });
      toast.error("Error logging in");
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center py-5">
      <div
        className="card p-4 shadow"
        style={{ width: "100%", maxWidth: "400px", borderRadius: "1rem" }}
      >
        <h3 className="text-center mb-4">Login</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email
            </label>
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
            <label htmlFor="password" className="form-label">
              Password
            </label>
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
          <button type="submit" className="btn btn-primary w-100">
            Login
          </button>
        </form>
        <div className="text-center mt-3">
          <small>
            Don’t have an account?{" "}
            <Link to="/signup" className="text-decoration-none">
              Signup
            </Link>
          </small>
        </div>
      </div>
    </div>
  );
};

export default Login;
