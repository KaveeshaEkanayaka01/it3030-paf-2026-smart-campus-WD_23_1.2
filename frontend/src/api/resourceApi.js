import API from "./axios";

export const getAllResources = async () => {
  const res = await API.get("/resources");
  return res.data;
};

export const getAvailableResources = async () => {
  const res = await API.get("/resources/available");
  return res.data;
};

export const getResourceById = async (id) => {
  const res = await API.get(`/resources/${id}`);
  return res.data;
};

export const getResourcesByType = async (type) => {
  const res = await API.get(`/resources/type/${type}`);
  return res.data;
};

export const searchResources = async (keyword) => {
  const res = await API.get(`/resources/search?keyword=${encodeURIComponent(keyword)}`);
  return res.data;
};

export const createResource = async (payload) => {
  const res = await API.post("/resources", payload);
  return res.data;
};

export const updateResource = async (id, payload) => {
  const res = await API.put(`/resources/${id}`, payload);
  return res.data;
};

export const deleteResource = async (id) => {
  const res = await API.delete(`/resources/${id}`);
  return res.data;
};