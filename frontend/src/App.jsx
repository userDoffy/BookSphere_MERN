import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/layouts/Header";
import Footer from "./components/layouts/Footer";
import AppRoutes from "./components/routes/AppRoutes";
import AdminRoutes from "../Admin/routes/AdminRoutes";
import ErrorBoundary from "./components/ErrorBoundary";
import { Toaster } from "react-hot-toast";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./App.css";

import { useDispatch } from "react-redux";
import { login, logout } from "./redux/auth/authSlice";
import { getCurrentUser } from "./axios/authApi";

function App() {
  const location = useLocation();
  const dispatch = useDispatch();
  const isAdminRoute = location.pathname.startsWith("/admin");

  useEffect(() => {
    const checkUserAuth = async () => {
      try {
        const res = await getCurrentUser();
        if (res.status === 200) {
          const { name, _id, profilepic } = res.data.user;
          dispatch(login({ token: true, name, _id, profilepic }));
        }
      } catch (err) {
        dispatch(logout());
      }
    };

    if (!isAdminRoute) {
      checkUserAuth();
    }
  }, [dispatch, isAdminRoute]);

  return (
    <ErrorBoundary>
      <div className="d-flex flex-column min-vh-100">
        {!isAdminRoute && <Header />}
        <Toaster position="top-right" toastOptions={{ style: { marginTop: "30px" } }} />
        <main className="flex-grow-1">
          <Routes>
            <Route path="/admin/*" element={<AdminRoutes />} />
            <Route path="/*" element={<AppRoutes />} />
          </Routes>
        </main>
        {!isAdminRoute && <Footer />}
      </div>
    </ErrorBoundary>
  );
}

export default App;
