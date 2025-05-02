import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import './SubNavLayout.css'; // Import the CSS file

const SubNavLayout = () => {
  return (
    <>
      <nav className="navbar navbar-expand-lg bg-white border-bottom my-2 shadow-sm rounded-3">
        <div className="container d-flex justify-content-between align-items-center">
          <span className="navbar-brand text-success fw-bold animated-title">
            Discover Your Next Favorite Read
          </span>

          <div>
            {['latest', 'popular', 'foryou'].map((route) => (
              <NavLink
                key={route}
                to={`/${route}`}
                className={({ isActive }) =>
                  `btn me-2 rounded-pill fw-semibold ${
                    isActive ? 'btn-success text-white' : 'btn-outline-success'
                  }`
                }
              >
                {route.charAt(0).toUpperCase() + route.slice(1)}
              </NavLink>
            ))}
          </div>
        </div>
      </nav>

      <div className="container mt-4">
        <Outlet />
      </div>
    </>
  );
};

export default SubNavLayout;
