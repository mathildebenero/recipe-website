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
    try {
      const response = await login(email, password);
      console.log("🔹 Login Response:", response);

      if (response.data?.token) {
        localStorage.setItem("token", response.data.token);

        // ✅ Decode JWT
        try {
          const decodedToken = JSON.parse(atob(response.data.token.split(".")[1]));
          localStorage.setItem("role", decodedToken.role);
          console.log("✅ User Role:", decodedToken.role);
        } catch (decodeError) {
          console.error("❌ Failed to decode JWT:", decodeError);
        }

        setMessage("✅ Login successful! Redirecting...");

        // ✅ Redirect to `/home`
        navigate("/home");
      } else {
        setMessage("❌ Invalid login response, please try again.");
      }
    } catch (error) {
      console.error("🔴 Login Error:", error.response?.data || error.message);
      setMessage(error.response?.data?.error || "❌ Login failed. Please try again.");
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
