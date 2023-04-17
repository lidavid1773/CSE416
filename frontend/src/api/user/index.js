import axios from "axios";

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

const api = {
  register,
  login,
  logout,
};

export default api;
