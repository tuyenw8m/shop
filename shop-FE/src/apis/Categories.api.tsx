import type { Category } from 'src/types/categories.type'
import type { ApiResponse } from 'src/types/utils.type'
import http from 'src/utils/http'

const pathURL = '/categories/v2'
const categoriesAPI = {
  getCategories() {
    return http.get<ApiResponse<Category>>(pathURL)
  }
}

export default categoriesAPI
