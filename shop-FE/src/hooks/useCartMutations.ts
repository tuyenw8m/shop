import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useDispatch } from 'react-redux'
import cartAPI from 'src/apis/Cart.api'
import {
  addItem,
  toggleCart,
  updateQuantity,
  removeItem as removeItemFromStore,
  clearCart as clearCartFromStore
} from 'src/features/cartSlice'
import type { CartItem } from 'src/types/cart.type'
import type { Product } from 'src/types/product.type'

export const useCartMutations = (user_id: string | undefined) => {
  const queryClient = useQueryClient()
  const dispatch = useDispatch()

  const addItemToCart = useMutation({
    mutationFn: (product: Product) => {
      const response = cartAPI.addItemToCart({ product_id: product.id, quantity: 1 })
      return response?.data
    },
    onSuccess: (data: CartItem) => {
      dispatch(addItem(data))
      dispatch(toggleCart(true))
      setTimeout(() => {
        dispatch(toggleCart(false))
      }, 3000)
      queryClient.invalidateQueries({ queryKey: ['cart', user_id || 'guest'] })
    },
    onError: (error) => {
      console.error('Failed to add item to cart:', error)
    }
  })

  // Mutation để cập nhật số lượng sản phẩm
  const updateCartItemQuantity = useMutation({
    mutationFn: ({ item_id, quantity }: { item_id: string; quantity: number }) =>
      cartAPI.updateItemQuantity({ item_id, quantity }).then((res) => res.data), // Trả về data từ response
    onSuccess: (data, variables) => {
      // Cập nhật Redux store cục bộ
      dispatch(updateQuantity(variables))
      // Vô hiệu hóa query 'cart'
      queryClient.invalidateQueries({ queryKey: ['cart', user_id || 'guest'] })
    },
    onError: (error) => {
      console.error('Failed to update item quantity:', error)
    }
  })

  // Mutation để xóa sản phẩm
  const removeCartItem = useMutation({
    mutationFn: (item_id: string) => cartAPI.removeItem(item_id),
    onSuccess: (data, item_id) => {
      // Cập nhật Redux store cục bộ
      dispatch(removeItemFromStore(item_id))
      // Vô hiệu hóa query 'cart'
      queryClient.invalidateQueries({ queryKey: ['cart', user_id || 'guest'] })
    },
    onError: (error) => {
      console.error('Failed to remove item:', error)
    }
  })

  // Mutation để xóa toàn bộ giỏ hàng
  const clearCart = useMutation({
    mutationFn: () => cartAPI.clearCart(),
    onSuccess: () => {
      dispatch(clearCartFromStore())
      queryClient.invalidateQueries({ queryKey: ['cart', user_id || 'guest'] })
    },
    onError: (error) => {
      console.error('Failed to clear cart:', error)
    }
  })

  return {
    addItemToCart,
    updateCartItemQuantity,
    removeCartItem,
    clearCart
  }
}
