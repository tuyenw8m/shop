import axios from 'axios'
import { getAccessToken } from 'src/utils/utils'

const BASE_URL = 'http://localhost:8888/shop/api/v1'

const user_token = getAccessToken()

export const reviewAPI = {
  submitReview(productId: string, formData: FormData) {
    return axios.post(`${BASE_URL}/products/${productId}/reviews`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${user_token}`
      }
    })
  },

  getReviews(productId: string) {
    return axios.get(`${BASE_URL}/products/${productId}/reviews`)
  }
}
