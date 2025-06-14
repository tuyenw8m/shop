import type { CategoriesList } from 'src/types/categories.type'
import http from 'src/utils/http'

const pathURL = '/categories/v2'
const categoriesAPI = {
  getCategories() {
    return http.get<CategoriesList>(pathURL)
  }
}

export default categoriesAPI
