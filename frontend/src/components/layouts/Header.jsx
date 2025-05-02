import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/auth/authSlice.js";
import {toast} from "react-hot-toast";
import { logoutUser } from "../../axios/authApi.js";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { token, name,profilepic } = useSelector((state) => state.auth);

  const handleLogout = async () => {
    try {
      const res = await logoutUser();
      if (res.status === 200) {
        localStorage.removeItem("cart");
        dispatch(logout());
        navigate("/");
        toast.success("Logout successful");
      } else {
        navigate("/error", { state: { message: "Logout failed" } });
      }
    } catch (error) {
      navigate("/error", { state: { message: "Logout failed" } });
    }
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
        <div className="container-fluid">
          {/* Brand */}
          <NavLink
            className="navbar-brand d-flex align-items-center"
            to="/latest"
          >
            <i
              className="bi bi-book"
              style={{ fontSize: "1.5rem", marginRight: "0.5rem" }}
            ></i>
            <span className="fw-bold">BookSphere</span>
          </NavLink>

          {/* Toggler */}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Links */}
          <div className="collapse navbar-collapse" id="navbarNav">
            {/* Left nav items */}
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              {[
                { to: "/latest", label: "Store" },
                { to: "/communityblogs", label: "Community Blogs" },
                { to: "/about", label: "About" },
              ].map((item, index) => (
                <li className="nav-item" key={index}>
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      `nav-link fw-semibold ${isActive ? "text-success" : ""}`
                    }
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>

            {/* Right-side icons */}
            {/* Right-side icons and dropdown */}
            <div className="d-flex flex-column flex-lg-row align-items-lg-center gap-2 gap-lg-4 mt-3 mt-lg-0">
              <NavLink to="user/mybooks" className="nav-link text-center">
                <i
                  className="bi bi-journal-bookmark"
                  style={{ fontSize: "1.25rem" }}
                ></i>
                <div className="d-lg-none small">My Books</div>
              </NavLink>
              <NavLink to="user/myorders" className="nav-link text-center">
                <i
                  className="bi bi-clock-history"
                  style={{ fontSize: "1.25rem" }}
                ></i>
                <div className="d-lg-none small">My Orders</div>
              </NavLink>
              <NavLink to="/cart" className="nav-link text-center">
                <i className="bi bi-cart3" style={{ fontSize: "1.25rem" }}></i>
                <div className="d-lg-none small">Cart</div>
              </NavLink>

              {token ? (
                <div className="dropdown text-center">
                  <button
                    className="btn dropdown-toggle d-flex align-items-center justify-content-center mx-auto"
                    type="button"
                    id="profileDropdown"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    {profilepic ? (
                      <img
                        src={profilepic}
                        alt="Profile"
                        className="rounded-circle"
                        style={{ width: "25px", height: "25px" }}
                      />
                    ) : (
                      <i
                        className="bi bi-person-circle"
                        style={{ fontSize: "1.5rem" }}
                      ></i>
                    )}
                    <span className="ms-1 d-none d-lg-inline">
                      {name || "User"}
                    </span>
                  </button>

                  <ul
                    className="dropdown-menu dropdown-menu-center start-50 translate-middle-x mt-2"
                    aria-labelledby="profileDropdown"
                    style={{ minWidth: "160px", textAlign: "center" }}
                  >
                    <li>
                      <NavLink className="dropdown-item" to="user/profile">
                        Profile
                      </NavLink>
                    </li>
                    <li>
                      <button
                        className="dropdown-item text-danger"
                        onClick={handleLogout}
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
                </div>
              ) : (
                <NavLink to="/login" className="nav-link text-center">
                  <i
                    className="bi bi-person-circle"
                    style={{ fontSize: "1.5rem" }}
                  ></i>
                  <div className="d-lg-none small">Login</div>
                </NavLink>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Header;
