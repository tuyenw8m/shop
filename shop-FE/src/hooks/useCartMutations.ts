import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useDispatch } from 'react-redux'
import cartAPI from 'src/apis/Cart.api'
import { addItem, toggleCart, updateQuantity, removeItem as removeItemFromStore } from 'src/features/cartSlice'
import type { CartItem, UpdateQuantity } from 'src/types/cart.type'
import type { Product } from 'src/types/product.type'

export const useCartMutations = (user_id: string | undefined) => {
  const queryClient = useQueryClient()
  const dispatch = useDispatch()

  const addItemToCart = useMutation({
    mutationFn: async ({ product, quantity = 1 }: { product: Product; quantity?: number }) => {
      const response = await cartAPI.addItemToCart({
        product_id: product.id,
        quantity
      })
      return response?.data.data
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
      console.error('Thất bại khi thêm sản phẩm vào giỏ hàng:', error)
    }
  })

  const updateCartItemQuantity = useMutation({
    mutationFn: ({ item_id, product_id, quantity }: UpdateQuantity) =>
      cartAPI.updateItemQuantity({ product_id, item_id, quantity }).then((res) => res.data),
    onSuccess: (data, variables) => {
      dispatch(
        updateQuantity({ item_id: variables.item_id, product_id: variables.product_id, quantity: variables.quantity })
      )
      queryClient.invalidateQueries({ queryKey: ['cart', user_id || 'guest'] })
    },
    onError: (error) => {
      console.error('Thất bại khi cập nhật số lượng sản phẩm:', error)
    }
  })

  const removeCartItem = useMutation({
    mutationFn: (item_id: string) => {
      return cartAPI.removeItem(item_id)
    },
    onSuccess: (data, item_id) => {
      dispatch(removeItemFromStore(item_id))
      queryClient.invalidateQueries({ queryKey: ['cart', user_id || 'guest'] })
    },
    onError: (error) => {
      console.error('Lỗi khi xóa sản phẩm khỏi giỏ hàng:', error)
    }
  })

  return {
    addItemToCart,
    updateCartItemQuantity,
    removeCartItem
  }
}
