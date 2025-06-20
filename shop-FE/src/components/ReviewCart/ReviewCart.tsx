import { useDispatch, useSelector } from 'react-redux'
import type { RootState } from 'src/app/store'
import { ShoppingCart, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import { toggleCart } from 'src/features/cartSlice'
import { formatPrices, getProfileLocalStorage } from 'src/utils/utils'
import { useCartQuery } from 'src/hooks/useCartQuery'

export default function ReviewCart() {
  const userProfile = getProfileLocalStorage()
  const user_id = userProfile?.id

  useCartQuery(user_id)

  const dispatch = useDispatch()
  const { isOpen, total_items, total_price, items, loading } = useSelector((state: RootState) => state.cart)

  const closeCart = () => dispatch(toggleCart(false))

  if (!isOpen) return null

  return (
    <>
      <div className='fixed inset-0  bg-opacity-25 z-40' onClick={closeCart} />

      <div className='fixed top-14 right-27 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50 animate-in slide-in-from-top-2 duration-300'>
        <div className='flex items-center justify-between p-4 border-b border-gray-200'>
          <div className='flex items-center space-x-2'>
            <ShoppingCart className='w-5 h-5 text-teal-600' />
            <h3 className='font-semibold text-gray-800'>Giỏ hàng ({total_items})</h3>
          </div>
          <button onClick={closeCart} className='p-1 hover:bg-gray-100 rounded-full'>
            <X className='w-4 h-4 text-gray-500' />
          </button>
        </div>

        {items && (
          <>
            <div className='max-h-96 overflow-y-auto'>
              {loading ? (
                <div className='p-6 text-center text-gray-500'>Đang tải giỏ hàng...</div>
              ) : items.length === 0 ? (
                <div className='p-6 text-center'>
                  <ShoppingCart className='w-12 h-12 text-gray-300 mx-auto mb-3' />
                  <p className='text-gray-500'>Giỏ hàng trống</p>
                </div>
              ) : (
                <div className='p-4 space-y-3'>
                  {items.slice(-3).map((item) => (
                    <div key={item.item_id} className='flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg'>
                      <div className='w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0'>
                        <img
                          src='https://i.pinimg.com/736x/b6/14/28/b614286ef52de836895c9855796e3e84.jpg'
                          alt={item.name}
                          width={48}
                          height={48}
                          className='w-full h-full object-contain'
                        />
                      </div>
                      <div className='flex-1 min-w-0'>
                        <p className='text-sm font-medium text-gray-800 truncate'>{item.name}</p>
                        <p className='text-xs text-gray-500'>Số lượng: {item.quantity}</p>
                        <p className='text-sm font-semibold text-teal-600'>
                          {formatPrices(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                  {items.length > 3 && (
                    <p className='text-xs text-gray-500 text-center'>và {items.length - 3} sản phẩm khác...</p>
                  )}
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className='p-4 border-t border-gray-200 bg-gray-50'>
                <div className='flex items-center justify-between mb-3'>
                  <span className='font-medium text-gray-800'>Tổng cộng:</span>
                  <span className='font-bold text-lg text-teal-600'>{formatPrices(total_price)}đ</span>
                </div>
                <div className='grid grid-cols-2 gap-2'>
                  <Link to='/cart' onClick={closeCart}>
                    <button className='w-full bg-teal-600 text-white py-2 px-4 rounded-md hover:bg-teal-700 transition-colors'>
                      Xem giỏ hàng
                    </button>
                  </Link>
                  <Link to='/checkout' onClick={closeCart}>
                    <button className='w-full bg-teal-600 text-white py-2 px-4 rounded-md hover:bg-teal-700 transition-colors'>
                      Thanh toán
                    </button>
                  </Link>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  )
}
