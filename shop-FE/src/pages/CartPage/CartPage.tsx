import { useState } from 'react'
import { ShoppingCart, MapPin, CreditCard, Truck, Minus, Plus, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import type { RootState } from 'src/app/store'
import { useCartMutations } from 'src/hooks/useCartMutations'
import { useCartQuery } from 'src/hooks/useCartQuery'
import { formatPrices, getProfileLocalStorage } from 'src/utils/utils' // Corrected formatPrice to formatPrices
import { useMutation, useQuery } from '@tanstack/react-query'
import http from 'src/utils/http'
import OrderAPI from 'src/apis/Order.api'
import type { OrderList } from 'src/types/order.type'

export function CartPage() {
  const userProfile = getProfileLocalStorage()
  const user_id = userProfile?.id

  useCartQuery(user_id)

  const cartState = useSelector((state: RootState) => state.cart)

  const { items, total_items, total_price } = cartState

  const { updateCartItemQuantity, removeCartItem } = useCartMutations()

  const [note, setNote] = useState<string>('')
  const [paymentMethod, setPaymentMethod] = useState('cash')
  const [orderSuccess, setOrderSuccess] = useState(false)

  const subtotal = total_price
  const tax = Math.round(subtotal * 0.1)
  const total = subtotal + tax

  const { data: UserData } = useQuery({
    queryKey: ['userInfo'],
    queryFn: async () => {
      const res = await http.get('/users/me')
      return res.data.data
    }
  })

  const orderList: OrderList = items.map((item) => ({
    quantity: item.quantity,
    comment: note || '',
    status: 'PENDING',
    product_id: item.product_id
  }))

  const handleMutateBuyNow = useMutation({
    mutationFn: (body: OrderList) => OrderAPI.createOrder(body),
    onSuccess: () => {
      setOrderSuccess(true)

      setTimeout(() => {
        setOrderSuccess(false)
        items.forEach((item) => {
          removeCartItem.mutate(item.item_id)
        })
      }, 3000)
    }
  })

  const handleRemoveFromCart = (itemId: string) => {
    if (user_id) {
      removeCartItem.mutate(itemId)
    }
  }

  const handleUpdateQuantityChange = (itemId: string, productId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      handleRemoveFromCart(itemId)
      return
    }
    if (user_id) {
      updateCartItemQuantity.mutate({ item_id: itemId, product_id: productId, quantity: newQuantity })
    }
  }

  if (items.length === 0) {
    return (
      <div className='min-h-screen bg-gray-50 py-8 flex items-center justify-center'>
        <div className='max-w-xl mx-auto px-4 w-full'>
          <div className='bg-white rounded-lg shadow-lg p-8 md:p-16 text-center'>
            <ShoppingCart className='w-24 h-24 text-gray-300 mx-auto mb-6' />
            <h2 className='text-2xl md:text-3xl font-bold text-gray-800 mb-4'>Giỏ hàng trống</h2>
            <p className='text-gray-600 mb-8 text-base md:text-lg'>Bạn chưa có sản phẩm nào trong giỏ hàng</p>
            <Link to='/categories/all'>
              <button className='inline-flex items-center justify-center whitespace-nowrap rounded-md text-base font-semibold transition-colors bg-teal-600 text-white shadow-md hover:bg-teal-700 h-10 px-6 py-2'>
                Tiếp tục mua sắm
              </button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gray-50 py-8'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        {orderSuccess && (
          <div className='fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-100 text-green-700 px-6 py-2 rounded shadow z-50 transition-all duration-300'>
            Đặt hàng thành công, đơn hàng chờ xác nhận !
          </div>
        )}
        {/* Header */}
        <div className='mb-8'>
          <h1 className='flex items-center text-2xl md:text-3xl font-semibold text-teal-600 mb-2 uppercase'>
            <ShoppingCart size={32} strokeWidth={2} className='mr-3' />
            Giỏ hàng của bạn
          </h1>
          <p className='text-gray-600 text-sm'>Bạn có tổng cộng ({total_items}) sản phẩm trong giỏ hàng</p>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Left Column - Cart Items */}
          <div className='lg:col-span-2'>
            <div className='bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden'>
              {/* Table Header - Hidden on small screens, shown as grid header on larger screens */}
              <div className='hidden md:grid grid-cols-12 gap-4 p-4 bg-gray-50 border-b border-gray-200 text-sm font-medium text-gray-600'>
                <div className='col-span-5'>Mặt hàng</div>
                <div className='col-span-2 text-center'>Đơn giá</div>
                <div className='col-span-2 text-center'>Số lượng</div>
                <div className='col-span-2 text-center'>Thành tiền</div>
                <div className='col-span-1 text-red-600 text-center pr-4'>Xóa</div>
              </div>

              {/* Product Items */}
              <div className='divide-y divide-gray-200'>
                {items.map((item) => (
                  <div key={item.item_id} className='p-4 hover:bg-gray-50 transition-colors duration-200'>
                    <div className='hidden md:grid md:grid-cols-12 md:gap-4'>
                      <div className='col-span-5 flex items-center space-x-3'>
                        <div className='w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0'>
                          <img
                            src={item.image_url}
                            alt={item.name}
                            width={80}
                            height={80}
                            className='w-full h-full object-contain'
                          />
                        </div>
                        <div className='min-w-0 flex-1'>
                          <h3 className='font-medium text-gray-800 text-base line-clamp-2'>{item.name}</h3>
                        </div>
                      </div>

                      {/* Unit Price - 2 columns */}
                      <div className='col-span-2 flex items-center justify-center'>
                        <p className='font-semibold text-gray-800 text-base'>{formatPrices(item.price)}</p>
                      </div>

                      {/* Quantity - 2 columns */}
                      <div className='col-span-2 flex items-center justify-center'>
                        <div className='flex items-center space-x-2 border border-gray-300 rounded-lg'>
                          <button
                            onClick={() => handleUpdateQuantityChange(item.item_id, item.product_id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className='inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50 w-8 h-8 p-0 hover:bg-gray-100'
                          >
                            <Minus className='w-4 h-4' />
                          </button>
                          <span className='w-12 text-center font-medium text-base'>{item.quantity}</span>
                          <button
                            onClick={() => handleUpdateQuantityChange(item.item_id, item.product_id, item.quantity + 1)}
                            className='inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50 w-8 h-8 p-0 hover:bg-gray-100'
                          >
                            <Plus className='w-4 h-4' />
                          </button>
                        </div>
                      </div>

                      {/* Total Price - 2 columns */}
                      <div className='col-span-2 flex items-center justify-center'>
                        <p className='font-bold text-blue-600 text-base'>{formatPrices(item.price * item.quantity)}</p>
                      </div>

                      {/* Actions - 1 column */}
                      <div className='col-span-1 flex items-center justify-center'>
                        <button
                          onClick={() => handleRemoveFromCart(item.item_id)}
                          className='inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50 text-red-600 hover:text-red-700 hover:bg-red-50 h-9 px-4 py-2'
                        >
                          <Trash2 className='w-4 h-4' />
                        </button>
                      </div>
                    </div>

                    {/* Mobile Layout (flex-col) */}
                    <div className='md:hidden flex flex-col space-y-4'>
                      <div className='flex items-center space-x-3'>
                        <div className='w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0'>
                          <img
                            src={item.image_url}
                            alt={item.name}
                            width={80}
                            height={80}
                            className='w-full h-full object-contain'
                          />
                        </div>
                        <div className='flex-1 min-w-0'>
                          <h3 className='font-medium text-gray-800 text-base line-clamp-2 mb-1'>{item.name}</h3>
                          <p className='font-semibold text-gray-800 text-sm'>Đơn giá: {formatPrices(item.price)}</p>
                        </div>
                      </div>

                      <div className='flex justify-between items-center'>
                        <div className='flex items-center space-x-2 border border-gray-300 rounded-lg'>
                          <button
                            onClick={() => handleUpdateQuantityChange(item.item_id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className='inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50 w-8 h-8 p-0 hover:bg-gray-100'
                          >
                            <Minus className='w-4 h-4' />
                          </button>
                          <span className='w-12 text-center font-medium text-base'>{item.quantity}</span>
                          <button
                            onClick={() => handleUpdateQuantityChange(item.item_id, item.quantity + 1)}
                            className='inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50 w-8 h-8 p-0 hover:bg-gray-100'
                          >
                            <Plus className='w-4 h-4' />
                          </button>
                        </div>
                        <p className='font-bold text-blue-600 text-base'>
                          Thành tiền: {formatPrices(item.price * item.quantity)}
                        </p>
                        <button
                          onClick={() => handleRemoveFromCart(item.item_id)}
                          className='inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50 text-red-600 hover:text-red-700 hover:bg-red-50 p-2'
                        >
                          <Trash2 className='w-5 h-5' />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary and other details */}
          <div className='space-y-6'>
            {/* Update shipping information section */}
            <div className='bg-white rounded-lg shadow-md border border-gray-200 p-6'>
              <div className='flex items-center justify-between mb-4'>
                <div className='flex items-center space-x-2'>
                  <MapPin className='w-5 h-5 text-blue-600' />
                  <h3 className='font-semibold text-gray-800'>Địa chỉ giao hàng</h3>
                </div>
                <Link
                  to='/profile'
                  className='inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors border border-blue-600 text-blue-600 hover:bg-blue-50 px-3 py-1.5'
                >
                  Thay đổi
                </Link>
              </div>
              <div className='space-y-2 text-gray-700'>
                {UserData && (
                  <>
                    <p className='font-medium'>Tên người nhận: {UserData.name}</p>
                    <p>SĐT:(+84) {UserData.phone}</p>
                    <p>Địa chỉ: {UserData.address}</p>
                  </>
                )}
              </div>
            </div>

            {/* Shipping Method */}
            <div className='bg-white rounded-lg shadow-md border border-gray-200 p-6'>
              <div className='flex items-center space-x-2 mb-4'>
                <Truck className='w-5 h-5 text-teal-600' />
                <h3 className='font-semibold text-gray-800'>Ghi chú cho người bán</h3>
              </div>

              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={4}
                placeholder='Ghi chú (Ví dụ: Giao hàng ngoài giờ hành chính, gọi trước khi đến...)'
                className='w-full border border-gray-300 rounded-md p-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm transition'
              />
            </div>

            {/* Payment Method */}
            <div className='bg-white rounded-lg shadow-md border border-gray-200 p-6'>
              <div className='flex items-center space-x-2 mb-4'>
                <CreditCard className='w-5 h-5 text-teal-600' />
                <h3 className='font-semibold text-gray-800'>Phương thức thanh toán</h3>
              </div>
              <div
                role='radiogroup'
                className='grid gap-3' // Increased gap for better spacing
                aria-label='Payment method'
              >
                <div className='flex items-center space-x-3 cursor-pointer p-2 -m-2 rounded-md hover:bg-gray-50'>
                  <input
                    type='radio'
                    value='cash'
                    id='cash'
                    name='paymentMethod'
                    className='h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300'
                    checked={paymentMethod === 'cash'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <label htmlFor='cash' className='text-base font-medium text-gray-800 cursor-pointer'>
                    Thanh toán khi nhận hàng (COD)
                  </label>
                </div>
                <div className='flex items-center space-x-3 cursor-pointer p-2 -m-2 rounded-md hover:bg-gray-50'>
                  <input
                    type='radio'
                    value='paypal'
                    id='paypal'
                    name='paymentMethod'
                    className='h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300'
                    checked={paymentMethod === 'paypal'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <label htmlFor='paypal' className='text-base font-medium text-gray-800 cursor-pointer'>
                    PayPal
                  </label>
                </div>
                <div className='flex items-center space-x-3 cursor-pointer p-2 -m-2 rounded-md hover:bg-gray-50'>
                  <input
                    type='radio'
                    value='bank'
                    id='bank'
                    name='paymentMethod'
                    className='h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300'
                    checked={paymentMethod === 'bank'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <label htmlFor='bank' className='text-base font-medium text-gray-800 cursor-pointer'>
                    Chuyển khoản ngân hàng
                  </label>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className='bg-white rounded-lg shadow-lg border border-gray-200 p-6'>
              <h3 className='font-semibold text-gray-800 text-xl mb-4'>Tổng kết đơn hàng</h3>
              <div className='space-y-3'>
                <div className='flex justify-between text-gray-700'>
                  <span>Tạm tính ({total_items} sản phẩm)</span>
                  <span className='font-medium'>{formatPrices(subtotal)}</span>
                </div>
                <div className='flex justify-between text-gray-700'>
                  <span>Phí vận chuyển</span>
                  <span className='font-medium'>Miễn phí</span>
                </div>
                <div className='flex justify-between text-gray-700'>
                  <span>Thuế (10%)</span>
                  <span className='font-medium'>{formatPrices(tax)}</span>
                </div>
                <div className='border-t border-gray-200 my-4'></div>
                <div className='flex justify-between items-center text-lg md:text-xl'>
                  <span className='font-bold text-gray-800'>Tổng cộng</span>
                  <span className='font-bold text-teal-600'>{formatPrices(total)}</span>
                </div>
              </div>

              <button
                onClick={() => handleMutateBuyNow.mutate(orderList)}
                className='w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 text-lg shadow-lg hover:shadow-xl transition-all duration-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50'
              >
                🛒 Đặt mua ngay
              </button>

              <p className='text-xs text-gray-500 text-center mt-3'>
                Bằng cách đặt hàng, bạn đồng ý với{' '}
                <a href='#' className='text-teal-600 hover:underline'>
                  Điều khoản sử dụng
                </a>{' '}
                của chúng tôi
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
