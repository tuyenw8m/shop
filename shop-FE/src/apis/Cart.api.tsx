import http from 'src/utils/http'
import type { AddItemCart, UpdateQuantity, CartItem, CartDataType } from 'src/types/cart.type'
import type { ApiResponse } from 'src/types/utils.type'

const cartPath = '/cart'

const cartAPI = {
  getCart: () => http.get<ApiResponse<CartDataType>>(cartPath),
  addItemToCart: (body: AddItemCart) => http.post<ApiResponse<CartItem>>(cartPath, body),
  updateItemQuantity: (body: UpdateQuantity) => http.put<ApiResponse<CartItem>>(cartPath, body),
  removeItem: (item_id: string) => http.delete<ApiResponse<void>>(`${cartPath}/${item_id}`),
  clearCart: () => http.delete<ApiResponse<void>>(`${cartPath}/clear`)
}

export default cartAPI
