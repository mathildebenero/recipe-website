import axios from "axios";

// Ensure API URL is correct (use HTTPS for production)
const API_URL = process.env.REACT_APP_BACKEND_URL?.replace(/\/$/, "") || "https://recipe-website-66gy.onrender.com";

console.log("🔹 API URL being used:", API_URL); // Debugging

// ✅ Function for normal user registration
export const register = async (email, password) => {
  return axios.post(`${API_URL}/register`, { email, password });
};

// ✅ Function for admin registration (requires secret key)
export const registerAdmin = async (email, password, secretKey) => {
  return axios.post(`${API_URL}/create-admin`, { email, password, secretKey });
};

// ✅ Function for user login
export const login = async (email, password) => {
    console.log("🔹 Sending Login Request to:", `${API_URL}/login`); // Debugging
    return axios.post(`${API_URL}/login`, { email, password });
  };
