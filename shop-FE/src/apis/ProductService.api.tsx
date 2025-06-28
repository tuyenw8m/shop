import type { Product, ProductList, ProductSearchParams } from 'src/types/product.type'
import type { SuccessResponse } from 'src/types/utils.type'
import http from 'src/utils/http'

const pathURL = '/products/v2'
const productApi = {
  getAllProducts(params: ProductSearchParams) {
    return http.get<SuccessResponse<ProductList>>(pathURL, {
      params
    })
  },
  getTopSold(params: ProductSearchParams) {
    return http.get<SuccessResponse<ProductList>>(`${pathURL}/top/week/v2`, {
      params
    })
  },
  getProductDetail(id: string) {
    return http.get<SuccessResponse<Product>>(`${pathURL}/${id}`)
  }
}

export default productApi
