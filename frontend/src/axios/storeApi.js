import axiosInstance from "./axiosInstance";

export const getLatestBooks = ({ page, limit }) => {
  return axiosInstance.get(`/store/latest`, {
    params: { page, limit },
  });
};

export const getPopularBooks = ({ page, limit }) => {       
  return axiosInstance.get(`/store/popular`, {
    params: { page, limit },
  });
}

export const getBookDetails = (bookId) => {         
  return axiosInstance.get(`/store/book/${bookId}`);
}

