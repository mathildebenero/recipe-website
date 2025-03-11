import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import ExistingIdeas from "./ExistingIdeas.js";
import Home from "./Home.js";
import Login from "./Login.js";
import Register from "./Register.js";
import PrivateRoute from "./PrivateRoute.js"; // ✅ Import PrivateRoute

const App = () => {
  return (
    <Router>
      <Routes>
        {/* ✅ Default route redirects to Register */}
        <Route path="/" element={<Navigate to="/register" />} />
        
        {/* ✅ Public Routes (accessible to everyone) */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ✅ Protected Routes (accessible only if logged in) */}
        <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
        <Route path="/ideas" element={<PrivateRoute><ExistingIdeas /></PrivateRoute>} />
      </Routes>
    </Router>
  );
};

export default App;
