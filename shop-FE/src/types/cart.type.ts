export interface CartItem {
  item_id: string
  product_id: string
  name: string
  price: number
  quantity: number
  image_url: string
  stock?: number
}

export interface CartState {
  total_price: number
  total_items: number
  user_id: string
  items: CartItem[]
  isOpen: boolean
  lastAddedItem: CartItem | null
  loading: boolean
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
  product_id: string
  quantity: number
}
