// src/types/cart.type.ts
export interface CartItem {
  item_id: string // ID của item trong giỏ hàng (duy nhất cho mỗi sản phẩm cụ thể trong giỏ)
  product_id: string // ID của sản phẩm
  name: string
  price: number
  quantity: number
  image_url: string | null
  stock?: number // Số lượng tồn kho của sản phẩm
}

export interface CartState {
  total_price: number
  total_items: number
  user_id: string
  items: CartItem[]
  isOpen: boolean // Trạng thái đóng/mở của giỏ hàng preview
  lastAddedItem: CartItem | null // Item cuối cùng được thêm vào
  loading: boolean // Trạng thái tải dữ liệu
}

export interface CartDataType {
  items: CartItem[]
  total_items: number
  total_price: number
  user_id: null
}

export interface AddItemCart {
  product_id: string
  quantity: number
}

export interface UpdateQuantity {
  item_id: string
  quantity: number
}
