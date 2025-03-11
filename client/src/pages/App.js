import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import ExistingIdeas from "./ExistingIdeas.js";
import Home from "./Home.js";
import Login from "./Login.js";
import Register from "./Register.js";
import PrivateRoute from "./PrivateRoute.js"; // ✅ Import PrivateRoute

const App = () => {
  const token = localStorage.getItem("token"); // ✅ Check if user is logged in

  return (
    <Router>
      <Routes>
        {/* ✅ If logged in, go to Home. Otherwise, go to Register */}
        <Route path="/" element={token ? <Navigate to="/home" /> : <Navigate to="/register" />} />

        {/* ✅ Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ✅ Protected Routes */}
        <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
        <Route path="/ideas" element={<PrivateRoute><ExistingIdeas /></PrivateRoute>} />
      </Routes>
    </Router>
  );
};

export default App;
