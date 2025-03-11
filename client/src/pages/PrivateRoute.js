import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token"); // ✅ Check if user is logged in
  return token ? children : <Navigate to="/register" />; // ✅ Redirect to Register if not logged in
};

export default PrivateRoute;
