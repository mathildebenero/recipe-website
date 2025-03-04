import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register, registerAdmin } from "../services/authService";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secretKey, setSecretKey] = useState(""); // ✅ Add state for secretKey
  const [isAdmin, setIsAdmin] = useState(false); // ✅ Toggle admin registration
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
        if (isAdmin && secretKey) {
          // ✅ If registering as an admin
          await registerAdmin(email, password, secretKey);
          setMessage("Admin registration successful! Redirecting...");
        } else {
          // ✅ If registering as a normal user
          await register(email, password);
          setMessage("User registration successful! Redirecting...");
        }
  
        setTimeout(() => navigate("/login"), 1500);
      } catch (error) {
        setMessage(error.response?.data?.error || "Registration failed");
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

        {/* ✅ Checkbox to show admin secret key */}
        <label>
          <input 
            type="checkbox" 
            checked={isAdmin} 
            onChange={() => setIsAdmin(!isAdmin)} 
          />
          Register as Admin
        </label>

        {/* ✅ Show secret key input only if isAdmin is checked */}
        {isAdmin && (
          <input
            type="text"
            placeholder="Admin Secret Key"
            value={secretKey}
            onChange={(e) => setSecretKey(e.target.value)}
          />
        )}

        <button type="submit">Register</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Register;
