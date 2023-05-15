import axios from "axios";

const baseURL = process.env.REACT_APP_API_URL || "http://localhost:8000";
const API_URL = `${baseURL}/api/maps/`;

const getMap = async (id, token) => {
  // const config = {
  //   headers: {
  //     Authorization: `Bearer ${token}`,
  //   },
  // };

  // const response = await axios.get(`${API_URL}getOne/${id}`, config);
  const response = await axios.get(`${API_URL}getOne/${id}`);

  return response.data;
};

const getMaps = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(API_URL, config);

  return response.data;
};

const searchMapsBy = async (username) => {
  const response = await axios.get(`${API_URL}searchMapsBy/${username}`);

  return response.data;
};

const deleteMap = async (id, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.delete(`${API_URL}${id}`, config);

  return response.data;
};

const api = { getMap, getMaps, searchMapsBy, deleteMap };

export default api;
