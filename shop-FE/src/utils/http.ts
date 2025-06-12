import axios, { type AxiosInstance } from 'axios'

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
    // this.instance.interceptors.request.use()
    // // Add a response interceptor
    // this.instance.interceptors.response.use()
  }
}

const http = new Http().instance
export default http
