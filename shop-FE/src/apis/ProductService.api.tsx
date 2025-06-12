import type { Product, ProductList, ProductQueryParams } from 'src/types/product.type'
import type { SuccessResponse } from 'src/types/utils.type'
import http from 'src/utils/http'

const pathURL = '/products'
const productApi = {
  getAllProducts(params: ProductQueryParams) {
    return http.get<SuccessResponse<ProductList>>(pathURL, {
      params
    })
  },
  getProductDetail(id: string) {
    return http.get<SuccessResponse<Product>>(`${pathURL}/${id}`)
  }
}

export default productApi
