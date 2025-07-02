export interface OrderRequest {
  quantity: number
  comment: string
  status: string
  product_id: string
}

export type OrderList = OrderRequest[]

export interface OrderResponse {
  id: string
  user_id: string
  product_id: string
  total_price: number
  status: string
  items_count: number
  created_at: string
  price: number
}
