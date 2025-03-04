import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/authService";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("🔹 Login form submitted!"); // Debugging
    
    try {
      console.log("🔹 Calling login API with:", { email, password });
      const response = await login(email, password);
      
      console.log("🔹 Login Response:", response); // Debugging
  
      if (response.data?.token) {
        localStorage.setItem("token", response.data.token); // ✅ Store JWT token
        setMessage("Login successful! Redirecting...");
        setTimeout(() => navigate("/"), 1500);
      } else {
        setMessage("Invalid login response, please try again.");
      }
    } catch (error) {
      console.error("🔴 Login Error:", error.response?.data || error.message);
      setMessage(error.response?.data?.error || "Login failed");
    }
  };
  
  

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
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
        <button type="submit">Login</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Login;
