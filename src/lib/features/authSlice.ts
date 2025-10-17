import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface AuthState {
  token: string | null
  email: string | null
  isAuthenticated: boolean
}

const getStoredAuthData = () => {
  if (typeof window === 'undefined') {
    return { token: null, email: null }
  }
  
  return {
    token: localStorage.getItem('token'),
    email: localStorage.getItem('email'),
  }
}

const { token, email } = getStoredAuthData()

const initialState: AuthState = {
  token,
  email,
  isAuthenticated: !!token,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ email: string; token: string }>) => {
      state.token = action.payload.token
      state.email = action.payload.email
      state.isAuthenticated = true
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', action.payload.token)
        localStorage.setItem('email', action.payload.email)
      }
    },
    logout: (state) => {
      state.token = null
      state.email = null
      state.isAuthenticated = false
      
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token')
        localStorage.removeItem('email')
      }
    },
  },
})

export const { setCredentials, logout } = authSlice.actions
export default authSlice.reducer