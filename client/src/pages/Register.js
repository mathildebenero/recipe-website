import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register, registerAdmin } from "../services/authService";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secretKey, setSecretKey] = useState(""); // ✅ Field for Secret Key
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage(""); // Clear message before starting

    try {
      if (secretKey) {
        // ✅ If a secret key is provided, attempt admin registration
        await registerAdmin(email, password, secretKey);
        setMessage("✅ Admin registration successful! Redirecting...");
      } else {
        // ✅ Otherwise, register as a normal user
        await register(email, password);
        setMessage("✅ User registration successful! Redirecting...");
      }

      // Redirect after success
      setTimeout(() => navigate("/login"), 1500);
    } catch (error) {
      console.error("🔴 Registration Error:", error.response?.data || error.message);
      setMessage(error.response?.data?.error || "❌ Registration failed. Please try again.");
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {/* ✅ Optional Secret Key input for Admin registration */}
        <input
          type="text"
          placeholder="Admin Secret Key (optional)"
          value={secretKey}
          onChange={(e) => setSecretKey(e.target.value)}
        />
        <button type="submit">Register</button>
      </form>
      {message && <p>{message}</p>}

      {/* ✅ Button to navigate to login page */}
      <button 
        onClick={() => navigate("/login")} 
        style={{ background: "none", border: "none", color: "blue", cursor: "pointer", marginTop: "10px" }}
      >
        Already have an account? Log-in.
      </button>
    </div>
  );
};

export default Register;
