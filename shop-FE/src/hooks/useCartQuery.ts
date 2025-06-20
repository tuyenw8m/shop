import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import cartAPI from 'src/apis/Cart.api'
import { setCart } from 'src/features/cartSlice'
import type { CartDataType } from 'src/types/cart.type'

export const useCartQuery = (user_id: string | undefined) => {
  const dispatch = useDispatch()

  const queryResult = useQuery({
    queryKey: ['cart', user_id],
    queryFn: () => {
      return cartAPI.getCart()
    },
    enabled: !!user_id
  })

  // Update Redux store whenever query data changes
  useEffect(() => {
    if (queryResult.data?.data) {
      console.log(queryResult.data)
      const result = queryResult?.data?.data.data
      dispatch(setCart(result as CartDataType))
    }
  }, [queryResult.data, dispatch])

  return queryResult
}
