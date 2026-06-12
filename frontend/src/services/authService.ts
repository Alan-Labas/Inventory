import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  changePasswordRequest,
} from '../dto/auth.ts'
import { api } from './api.ts'

export const register = async (data: RegisterRequest): Promise<string> => {
  const response = await api.post('/auth/register', data)
  return response.data
}

export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await api.post('/auth/login', data)
  return response.data
}

export const changePassword = async (data: changePasswordRequest): Promise<string> =>{
  const response = await api.put('/user/changePassword', data)
  return response.data
}

export const confirmEmail = async (data: string): Promise<string> => {
  const response = await api.get('/auth/confirm-acc', {params: {token: data}})
  return response.data
}