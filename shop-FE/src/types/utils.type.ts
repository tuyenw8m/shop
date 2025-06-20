export interface SuccessResponse<Data> {
  status: number
  message: string | null
  data: Data
}

export interface ErrorResponse<Data> {
  status: number
  message: string | null
  data?: Data
}

export interface ApiResponse<T> {
  status: number
  message: string | null
  data: T
}

export interface AuthResponse {
  token: string
  refreshToken: null
  user: {
    id: string
    name: string
    avatar_url: string
    email: string
    phone: string
    address: string
    roles: string[]
  }
}
