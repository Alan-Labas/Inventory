export type LoginRequest = {
  email: string
  password: string
}

export type RegisterRequest = {
  name: string
  surname: string
  username: string
  email: string
  password: string
}

// Shape returned by POST /api/auth/login
export type LoginResponse = {
  token: string
  email: string
  name: string
}
