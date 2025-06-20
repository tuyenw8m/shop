import axios, { type AxiosInstance } from 'axios'
import { getAccessToken, saveAccessTokenToLocalStorage, saveProfileToLocalStorage } from './utils'
import type { AuthResponse } from 'src/types/utils.type'

class Http {
  instance: AxiosInstance
  private accessToken: string | undefined
  constructor() {
    this.accessToken = getAccessToken()
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
        if (this.accessToken && config.headers) {
          config.headers.Authorization = `Bearer ${this.accessToken}`
          return config
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
        this.accessToken = data.token
        saveAccessTokenToLocalStorage(this.accessToken)
        saveProfileToLocalStorage(data.user)
      }
      return response
    })
  }
}

const http = new Http().instance
export default http
