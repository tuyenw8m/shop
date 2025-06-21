import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import cartAPI from 'src/apis/Cart.api'
import { getCart } from 'src/features/cartSlice'
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

  // Update Redux store khi có biến :))
  useEffect(() => {
    if (queryResult.data?.data) {
      console.log(queryResult.data)
      const result = queryResult?.data?.data.data
      dispatch(getCart(result as CartDataType))
    }
  }, [queryResult.data, dispatch])

  return queryResult
}
