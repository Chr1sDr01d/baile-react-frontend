// src/api/api.js
const API_BASE_URL = 'http://localhost:5001';

export const fetchData = async (endpoint) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`);
  const data = await response.json();
  return data;
};
