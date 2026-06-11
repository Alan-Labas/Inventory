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
