import API from "./axios";

export const registerUser = async (payload) => {
  const res = await API.post("/auth/register", payload);
  return res.data;
};

export const loginUser = async (payload) => {
  const res = await API.post("/auth/login", payload);
  return res.data;
};

export const getCurrentUser = async () => {
  const res = await API.get("/users/me");
  return res.data;
};

export const getGoogleLoginUrl = () => {
  return "http://localhost:8080/oauth2/authorization/google";
};