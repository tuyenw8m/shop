import axios, { type AxiosInstance } from 'axios'
import { getAccessToken, saveAccessTokenToLocalStorage, saveProfileToLocalStorage } from './utils'
import type { AuthResponse } from 'src/types/utils.type'

class Http {
  instance: AxiosInstance
  constructor() {
    this.instance = axios.create({
      baseURL: 'http://localhost:8888/shop/api/v1',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    })
    // Add a request interceptor
    this.instance.interceptors.request.use(
      (config) => {
        const token = getAccessToken(); // luôn lấy token mới nhất
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )
    // Add a response interceptor
    this.instance.interceptors.response.use((response) => {
      const { url } = response.config
      if (url === '/auth/login' || url === '/register') {
        const data = response.data.data as AuthResponse
        saveAccessTokenToLocalStorage(data.token)
        saveProfileToLocalStorage(data.user)
      }
      return response
    })
  }
}

const http = new Http().instance
export default http
