import axios from "axios";

const API_URL = process.env.REACT_APP_BACKEND_URL?.replace(/\/$/, "") || "http://localhost:5000";

// ✅ Function for normal user registration
export const register = async (email, password) => {
  return axios.post(`${API_URL}/register`, { email, password });
};

// ✅ Function for admin registration (requires secret key)
export const registerAdmin = async (email, password, secretKey) => {
  return axios.post(`${API_URL}/create-admin`, { email, password, secretKey });
};

// ✅ Function for login
export const login = async (email, password) => {
  return axios.post(`${API_URL}/login`, { email, password });
};
