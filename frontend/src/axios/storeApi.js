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

export const getBooksByKeyword = (keyword, page = 1, limit = 16) => {
  const queryParams = new URLSearchParams();
  if (keyword) queryParams.append("keyword", keyword);
  queryParams.append("page", page);
  queryParams.append("limit", limit);

  return axiosInstance.get(`/store/search?${queryParams.toString()}`);
};
