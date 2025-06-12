import type { CategoriesList } from 'src/types/categories.type'
import http from 'src/utils/http'

const pathURL = '/categories'
const categoriesAPI = {
  getCategories() {
    return http.get<CategoriesList>(pathURL)
  }
}

export default categoriesAPI
