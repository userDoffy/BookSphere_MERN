import { createSlice } from '@reduxjs/toolkit'

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token:  false,
    name:  null,
    userid:  null,
    profilepic: null,
  },
  reducers: {
    login: (state, action) => {
      state.token = action.payload.token
      state.name = action.payload.name
      state.userid = action.payload._id
      state.profilepic = action.payload.profilepic

    },
    logout: state => {
      state.token = false
      state.name = null
      state.userid = null
      state.profilepic = null
    },
  }
})


export const { login, logout } = authSlice.actions

export default authSlice.reducer