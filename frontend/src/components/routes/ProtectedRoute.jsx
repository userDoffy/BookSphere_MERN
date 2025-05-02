import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getCurrentUser } from "../../axios/authApi";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await getCurrentUser();
        if (res.status === 200) {
          const { role } = res.data.user;
          if (allowedRoles && !allowedRoles.includes(role)) {
            setIsAuthorized(false);
          } else {
            setIsAuthorized(true);
          }
        } else {
          setIsAuthorized(false);
        }
      } catch (err) {
        console.log(err);
        setIsAuthorized(false);
      } finally {
        setAuthChecked(true);
      }
    };

    checkAuth();
  }, [allowedRoles]);

  if (!authChecked) {
    // Optional: loading spinner or nothing
    return <div className="text-center py-5">Loading...</div>;
  }

  if (!isAuthorized) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
