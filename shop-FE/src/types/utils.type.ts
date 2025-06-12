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
