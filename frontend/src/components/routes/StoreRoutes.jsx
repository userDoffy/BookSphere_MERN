import React from "react";
import { Route } from "react-router-dom";
import SubNavLayout from "../layouts/SubNavLayout.jsx";
import Latest from "../pages/Store/Latest.jsx";
import Popular from "../pages/Store/Popular.jsx";
import ForYou from "../pages/Store/Foryou.jsx";
import BookDetails from "../pages/Store/BookDetails.jsx";
import Cart from "../pages/Store/Cart.jsx";

const StoreRoutes = [
  <Route element={<SubNavLayout />}>
    <Route path="/" element={<Latest />} />
    <Route path="/latest" element={<Latest />} />
    <Route path="/popular" element={<Popular />} />
    <Route path="/foryou" element={<ForYou />} />
    <Route path="/book/:id" element={<BookDetails />} />
    <Route path="/cart" element={<Cart />} />
  </Route>,
];

export default StoreRoutes;