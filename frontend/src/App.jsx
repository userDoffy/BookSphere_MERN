import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./components/routes/AppRoutes.jsx";
import Header from "./components/layouts/Header.jsx";
import Footer from "./components/layouts/Footer.jsx";
import "./App.css";
import ErrorBoundary from "./components/ErrorBoundary";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { login, logout } from "./redux/auth/authSlice.js";
import axios from "axios";
import { getCurrentUser } from "./axios/authApi.js";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await getCurrentUser();
        if (res.status === 200) {
          const { name, role,profilepic } = res.data.user;
          dispatch(login({ token: true, name, role, profilepic }));
        }
      } catch (err) {
        dispatch(logout());
      }
    };

    checkAuth();
  }, [dispatch]);

  return (
      <BrowserRouter>
        <ErrorBoundary>
        <div className="d-flex flex-column min-vh-100">
          <Header />
          <Toaster position="top-right" toastOptions={{style: {marginTop: "30px",},}}/>
          <main className="flex-grow-1">
          <AppRoutes />
          </main>
          <Footer />
        </div>
        </ErrorBoundary>
      </BrowserRouter>
  );
}

export default App;
