import axios from 'axios'
import { env } from '../config/env.ts'

export const api = axios.create({
  baseURL: `${env.apiBaseUrl}/api`,
})

// Attach the JWT to every request once the user is logged in.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Token expired or invalid -> drop the session and go back to login.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !window.location.pathname.startsWith('/login')) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.assign('/login')
    }
    return Promise.reject(error)
  },
)
