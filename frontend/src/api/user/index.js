import axios from "axios";

// Make sure to set REACT_APP_API_URL as a config var in heroku.
const baseURL = process.env.REACT_APP_API_URL || "http://localhost:8000";
const API_URL = `${baseURL}/api/users/`;

const register = async (user) => {
  const response = await axios.post(API_URL, user);

  // store user data into local storage
  if (response.data) {
    localStorage.setItem("user", JSON.stringify(response.data));
  }

  return response.data;
};

const login = async (user) => {
  const response = await axios.post(`${API_URL}login`, user);

  // store user data into local storage
  if (response.data) {
    localStorage.setItem("user", JSON.stringify(response.data));
  }

  return response.data;
};

const logout = () => {
  // Remove token from local storage to logout
  localStorage.removeItem("user");
};

// one time reset password link
const sendLink = async (email) => {
  const response = await axios.post(`${API_URL}forgot-password`, { email });

  return response.data;
};

const resetPassword = async (id, token, password) => {
  const response = await axios.post(`${API_URL}reset-password/${id}/${token}`, {
    password,
  });

  return response.data;
};

const api = {
  register,
  login,
  logout,
  sendLink,
  resetPassword,
};

export default api;
