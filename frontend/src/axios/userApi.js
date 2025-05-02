import axiosInstance from "./axiosInstance";

export const getCurrentUser = () => {
  return axiosInstance.get("/auth/getcurrentuser");
};

export const updateUserProfile = (formData) => {
  return axiosInstance.put("/auth/updateprofile", formData, {headers: { "Content-Type": "multipart/form-data" },});
};

export const placeOrderStripe = (books, totalPrice) => {
  return axiosInstance.post("/order/placeOrderStripe", { books, totalPrice });
}

export const placeOrderKhalti = (books,totalPrice) => {
  return axiosInstance.post("/order/placeOrderKhalti", {books, totalPrice });
}
export const verifyKhaltiPayment = (pidx,orderId) => {
  return axiosInstance.post("/order/verifyKhaltiPayment",{pidx,orderId});
}
export const getOrders = () => {  
  return axiosInstance.get("/order/getOrders");
}
