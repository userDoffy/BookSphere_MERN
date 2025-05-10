import React from "react";
import { Route } from "react-router-dom";

import UserProfile from "../pages/User/UserProfile.jsx";
import UserLayout from "../pages/User/UserLayout.jsx";
import Mybooks from "../pages/User/Mybooks.jsx";
import Myorders from "../pages/User/Myorders.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import Checkout from "../pages/User/Checkout.jsx";
import VerifyCheckout from "../pages/User/VerifyCheckout.jsx";
import ReadBook from "../pages/User/ReadBook.jsx";

const UserRoutes = [
  <Route
    path="/user/*"
    element={<ProtectedRoute allowedRoles={["User"]}><UserLayout /> </ProtectedRoute>}
  >
    <Route path="profile" element={<UserProfile />} />
    <Route path="mybooks" element={<Mybooks />} />
    <Route path="myorders" element={<Myorders />} />
    <Route path="checkout" element={<Checkout />} />
    <Route path="verify-checkout" element={<VerifyCheckout />} />
    
    <Route path="readbook" element={<ReadBook />} />
  </Route>,
];

export default UserRoutes;
