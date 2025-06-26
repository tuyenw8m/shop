import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { CartDataType, CartItem, CartState, UpdateQuantity } from 'src/types/cart.type'

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
    getCart: (state, action: PayloadAction<CartState | CartDataType>) => {
      state.items = action.payload.items
      state.total_price = action.payload.total_price
      state.total_items = action.payload.total_items
      state.user_id = action.payload.user_id as string
      state.loading = false
    },
    addItem: (state, action: PayloadAction<CartItem>) => {
      const newItem = action.payload
      const existingItemIndex = state.items.findIndex((item) => item.product_id === newItem.product_id)
      console.log(existingItemIndex)
      console.log(action.payload)

      if (existingItemIndex !== -1) {
        state.items[existingItemIndex].quantity += newItem.quantity
      } else {
        state.items.push(newItem)
      }
      state.lastAddedItem = newItem

      // Tính tiền và số lượng sau khi add
      state.total_price = state.items.reduce((total, item) => total + item.price * item.quantity, 0)
      state.total_items = state.items.reduce((total, item) => total + item.quantity, 0)
    },
    updateQuantity: (state, action: PayloadAction<UpdateQuantity>) => {
      const { item_id, quantity } = action.payload
      const itemToUpdate = state.items.find((item) => item.item_id === item_id)

      if (itemToUpdate) {
        itemToUpdate.quantity = quantity
        // Tính toán lại tổng số lượng và tổng giá trị
        state.total_price = state.items.reduce((total, item) => total + item.price * item.quantity, 0)
        state.total_items = state.items.reduce((total, item) => total + item.quantity, 0)
      }
    },
    removeItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.item_id !== action.payload)
      state.total_price = state.items.reduce((total, item) => total + item.price * item.quantity, 0)
      state.total_items = state.items.reduce((total, item) => total + item.quantity, 0)
    },
    clearCart: (state) => {
      state.items = []
      state.total_items = 0
      state.total_price = 0
      state.lastAddedItem = null
    },
    setUserId: (state, action: PayloadAction<string>) => {
      state.user_id = action.payload
    },
    toggleCart: (state, action: PayloadAction<boolean | undefined>) => {
      state.isOpen = action.payload ?? !state.isOpen
    },
    setLastAddedItem: (state, action: PayloadAction<CartItem | null>) => {
      state.lastAddedItem = action.payload
    },
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
  getCart,
  updateQuantity,
  setLoading
} = cartSlice.actions

const cartReducer = cartSlice.reducer
export default cartReducer
