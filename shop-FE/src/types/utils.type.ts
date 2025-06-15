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
