import { configureStore } from '@reduxjs/toolkit'
import authReducer from './auth/authSlice'
import cartReducer from './cart/cartSlice'

export default configureStore({
  reducer: {
    auth:authReducer,
    cart:cartReducer
  }
})