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
import { getCurrentUser } from "./axios/authApi.js";
import AdminRoutes from "../Admin/routes/AdminRoutes.jsx";
import { useLocation } from "react-router-dom";

function App() {
  const dispatch = useDispatch();
  const location = useLocation();
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

    if(!isAdminRoute){
      checkUserAuth();
    }
    
  }, [dispatch]);


  return (
    <ErrorBoundary>
      <div className="d-flex flex-column min-vh-100">
    
        {!isAdminRoute && <Header />}
        <Toaster position="top-right" toastOptions={{ style: { marginTop: "30px" } }} />
        <main className="flex-grow-1">
          {isAdminRoute ? <AdminRoutes /> : <AppRoutes />}
        </main>
        {!isAdminRoute && <Footer />}
      </div>
    </ErrorBoundary>
  );
}

export default App;
