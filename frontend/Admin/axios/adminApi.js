import axiosInstance from './axiosInstance'
export const loginAdmin = (formData) => {
    return axiosInstance.post("/login", formData);
}

export const getAdmin = () => {
    return axiosInstance.get("/getAdmin");
}

export const logoutAdmin = () => {
    return axiosInstance.get("/logout");
}

//managing books
export const getBooks = ()=>{
    return axiosInstance.get("/getbooks")
}

export const deleteBook = (id)=>{
    return axiosInstance.delete(`/deletebook/${id}`)
}

export const addBook = (formData)=>{
    return axiosInstance.post("/addbook",formData)
}

export const updateBook = (id,formData)=>{
    return axiosInstance.put(`/updatebook/${id}`,formData)
}

//managing users
export const getUsers = ()=>{
    return axiosInstance.get("/getusers")
}

export const deleteUser = (id)=>{
    return axiosInstance.delete(`/deleteuser/${id}`)
}

export const updateUser = (id,formData)=>{
    return axiosInstance.put(`/updateuser/${id}`,formData)
}

export const getAllOrders = ()=>{
    return axiosInstance.get("/getallorders")
}

export const updateOrderStatus = (id,formData)=>{
    return axiosInstance.put(`/updateorderstatus/${id}`,formData)
}

export const deleteOrder = (id)=>{
    return axiosInstance.delete(`/deleteorder/${id}`)
}