import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api";

export const getDeliveryList = async (bookingId, token) => {
  const response = await axios.get(`${API_BASE_URL}/delivery-history/${bookingId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const getCheckoutInfo = async (bookingId, token) => {
  const response = await axios.get(`${API_BASE_URL}/delivery/${bookingId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const updateDelivery = async (deliveryId, data, token) => {
  const response = await axios.put(`${API_BASE_URL}/delivery-history/${deliveryId}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const deleteDelivery = async (deliveryId, token) => {
  const response = await axios.delete(`${API_BASE_URL}/delivery-history/${deliveryId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const addDelivery = async (bookingId, data, token) => {
  const response = await axios.post(`${API_BASE_URL}/delivery-history/${bookingId}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const checkoutDelivery = async (bookingId, data, token) => {
  const response = await axios.post(`${API_BASE_URL}/delivery/${bookingId}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
