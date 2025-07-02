import type { OrderList, OrderResponse } from 'src/types/order.type'
import type { SuccessResponse } from 'src/types/utils.type'
import http from 'src/utils/http'

const orderPath = '/orders/list'
const OrderAPI = {
  createOrder: (body: OrderList) => http.post<SuccessResponse<OrderResponse>>(orderPath, body)
}

export default OrderAPI
