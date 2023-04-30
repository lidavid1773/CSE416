import axios from "axios";

const baseURL = process.env.REACT_APP_API_URL || "http://localhost:8000";
const API_URL = `${baseURL}/api/maps/`;

const getComments = async (id) => {
  const response = await axios.get(`${API_URL}${id}/comments`);

  return response.data;
};

const addComment = async (commentData, id, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.post(
    `${API_URL}${id}/comments`,
    commentData,
    config
  );

  return response.data;
};

const api = { getComments, addComment };

export default api;
