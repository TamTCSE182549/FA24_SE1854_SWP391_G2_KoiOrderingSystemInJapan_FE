import axios from "axios";

const API_BASE_URL = "http://localhost:8080/tour";

export const getTourById = async (id) => {
  const response = await axios.get(`${API_BASE_URL}/findById/${id}`);
  return response.data;
};
