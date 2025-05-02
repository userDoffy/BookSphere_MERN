import axiosInstance from "./axiosInstance";

export const loginUser = (formData) => {
  return axiosInstance.post("/auth/login", formData);
};

export const signupUser = (formData) => {
  return axiosInstance.post("/auth/signup", formData, { headers: { "Content-Type": "application/json" } });
}

export const verifyOtp = (formData) => {
  return axiosInstance.post("/auth/verifyotp", formData, { headers: { "Content-Type": "application/json" } });
}

export const getCurrentUser = () => {
  return axiosInstance.get("/auth/getcurrentuser");
};

export const logoutUser = () => {
  return axiosInstance.get("/auth/logout");
};