import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import type { LoginRequest, RegisterRequest } from '../dto/auth.ts'
import * as authService from '../services/authService.ts'

type AuthUser = {
  email: string
  name: string
}

type AuthContextValue = {
  user: AuthUser | null
  isAuthenticated: boolean
  login: (data: LoginRequest) => Promise<void>
  register: (data: RegisterRequest) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

const readStoredUser = (): AuthUser | null => {
  const token = localStorage.getItem('token')
  const stored = localStorage.getItem('user')
  if (!token || !stored) return null
  try {
    return JSON.parse(stored) as AuthUser
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(readStoredUser)

  const login = useCallback(async (data: LoginRequest) => {
    const response = await authService.login(data)
    const authUser = { email: response.email, name: response.name }
    localStorage.setItem('token', response.token)
    localStorage.setItem('user', JSON.stringify(authUser))
    setUser(authUser)
  }, [])

  const register = useCallback(async (data: RegisterRequest) => {
    await authService.register(data)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({ user, isAuthenticated: user !== null, login, register, logout }),
    [user, login, register, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
