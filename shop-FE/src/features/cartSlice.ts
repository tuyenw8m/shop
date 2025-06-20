import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { CartDataType, CartItem, CartState } from 'src/types/cart.type'

const initialState: CartState = {
  total_price: 0,
  total_items: 0,
  user_id: '',
  items: [],
  isOpen: false,
  lastAddedItem: null,
  loading: false
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCart: (state, action: PayloadAction<CartState | CartDataType>) => {
      state.items = action.payload.items
      state.total_price = action.payload.total_price
      state.total_items = action.payload.total_items
      state.user_id = action.payload.user_id as string
      state.loading = false
    },
    // Thêm hoặc cập nhật item trong store cục bộ (trước khi refetch từ server)
    addItem: (state, action: PayloadAction<CartItem>) => {
      const newItem = action.payload
      // Kiểm tra xem sản phẩm đã tồn tại trong giỏ chưa dựa trên product_id
      const existingItem = state.items.find((item) => item.product_id === newItem.product_id)

      if (existingItem) {
        existingItem.quantity += newItem.quantity
      } else {
        state.items.push(newItem)
      }
      state.lastAddedItem = newItem // Cập nhật sản phẩm cuối cùng được thêm

      // Tính toán lại tổng số lượng và tổng giá trị
      state.total_price = state.items.reduce((total, item) => total + item.price * item.quantity, 0)
      state.total_items = state.items.reduce((total, item) => total + item.quantity, 0)
    },
    // Cập nhật số lượng của một item
    updateQuantity: (state, action: PayloadAction<{ item_id: string; quantity: number }>) => {
      const { item_id, quantity } = action.payload
      const itemToUpdate = state.items.find((item) => item.item_id === item_id)

      if (itemToUpdate) {
        itemToUpdate.quantity = quantity
        // Tính toán lại tổng số lượng và tổng giá trị
        state.total_price = state.items.reduce((total, item) => total + item.price * item.quantity, 0)
        state.total_items = state.items.reduce((total, item) => total + item.quantity, 0)
      }
    },
    // Xóa một item khỏi giỏ
    removeItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.item_id !== action.payload)
      // Tính toán lại tổng số lượng và tổng giá trị
      state.total_price = state.items.reduce((total, item) => total + item.price * item.quantity, 0)
      state.total_items = state.items.reduce((total, item) => total + item.quantity, 0)
    },
    // Xóa toàn bộ giỏ hàng
    clearCart: (state) => {
      state.items = []
      state.total_items = 0
      state.total_price = 0
      state.lastAddedItem = null
    },
    // Cập nhật user_id
    setUserId: (state, action: PayloadAction<string>) => {
      state.user_id = action.payload
    },
    // Bật/tắt trạng thái hiển thị của giỏ hàng preview
    toggleCart: (state, action: PayloadAction<boolean | undefined>) => {
      state.isOpen = action.payload ?? !state.isOpen
    },
    // Set item cuối cùng được thêm
    setLastAddedItem: (state, action: PayloadAction<CartItem | null>) => {
      state.lastAddedItem = action.payload
    },
    // Set trạng thái loading
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    }
  }
})

export const {
  setUserId,
  toggleCart,
  setLastAddedItem,
  addItem,
  clearCart,
  removeItem,
  setCart,
  updateQuantity,
  setLoading
} = cartSlice.actions

const cartReducer = cartSlice.reducer
export default cartReducer
