import React, { useState } from "react";
import { NavLink, useNavigate, Outlet } from "react-router-dom";
import "./SubNavLayout.css";

const SubNavLayout = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?keyword=${encodeURIComponent(searchTerm)}`);
    } else {
      navigate("/search"); // Navigate to the search page with no query to show all results
    }
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg bg-white border-bottom my-2 shadow-sm rounded-3">
        <div className="container d-flex justify-content-between align-items-center">
          {/* Search bar */}
          <form className="d-flex w-50" onSubmit={handleSearch}>
            <input
              type="text"
              className="form-control me-2"
              placeholder="Search books by title or author..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="btn btn-success" type="submit">
              <i className="bi bi-search"></i>
            </button>
          </form>

          {/* Sub Navigation */}
          <div>
            {["latest", "popular", "foryou"].map((route) => (
              <NavLink
                key={route}
                to={`/${route}`}
                className={({ isActive }) =>
                  `btn me-2 rounded-pill fw-semibold ${
                    isActive ? "btn-success text-white" : "btn-outline-success"
                  }`
                }
              >
                {route.charAt(0).toUpperCase() + route.slice(1)}
              </NavLink>
            ))}
          </div>
        </div>
      </nav>

      <div className="container mt-2">
        <Outlet />
      </div>
    </>
  );
};

export default SubNavLayout;
