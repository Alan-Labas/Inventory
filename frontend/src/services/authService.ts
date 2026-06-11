import type { LoginRequest, LoginResponse, RegisterRequest } from '../dto/auth.ts'
import { api } from './api.ts'

export const register = async (data: RegisterRequest): Promise<string> => {
  const response = await api.post('/auth/register', data)
  return response.data
}

export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await api.post('/auth/login', data)
  return response.data
}
