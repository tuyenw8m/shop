import { useState } from 'react'
import { ShoppingCart, MapPin, CreditCard, Truck, Minus, Plus, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import type { RootState } from 'src/app/store'
import { useCartMutations } from 'src/hooks/useCartMutations'
import { useCartQuery } from 'src/hooks/useCartQuery'
import { formatPrices, getProfileLocalStorage } from 'src/utils/utils'

export function CartPage() {
  const userProfile = getProfileLocalStorage()
  const user_id = userProfile?.id

  useCartQuery(user_id)

  const cartState = useSelector((state: RootState) => state.cart)
  const { items, total_items, total_price } = cartState

  const { updateCartItemQuantity, removeCartItem, clearCart } = useCartMutations()

  const [shippingMethod, setShippingMethod] = useState('standard')
  const [paymentMethod, setPaymentMethod] = useState('cash')

  const subtotal = total_price
  const tax = Math.round(subtotal * 0.1)
  const shippingFee = shippingMethod === 'express' ? 50000 : 0
  const total = subtotal + tax + shippingFee

  const handleRemoveFromCart = (itemId: string) => {
    if (user_id) {
      removeCartItem.mutate({ user_id: user_id, item_id: itemId })
    }
  }

  const handleUpdateQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      handleRemoveFromCart(itemId)
      return
    }
    if (user_id) {
      updateCartItemQuantity.mutate({
        user_id: user_id,
        item_id: itemId,
        quantity: newQuantity
      })
    }
  }

  const handleClearCart = () => {
    if (user_id) {
      clearCart.mutate(user_id)
    }
  }

  if (items.length === 0) {
    return (
      <div className='min-h-screen bg-gray-50 py-8'>
        <div className='max-w-7xl mx-auto px-4'>
          <div className='text-center py-16'>
            <ShoppingCart className='w-24 h-24 text-gray-300 mx-auto mb-6' />
            <h2 className='text-2xl font-bold text-gray-800 mb-4'>Giỏ hàng trống</h2>
            <p className='text-gray-600 mb-8'>Bạn chưa có sản phẩm nào trong giỏ hàng</p>
            <Link to='/products'>
              {/* Replaced Button with a standard button/link styled with Tailwind */}
              <button className='inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-teal-600 text-white shadow hover:bg-teal-700 h-9 px-4 py-2'>
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
      <div className='max-w-7xl mx-auto px-4'>
        {/* Header */}
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-gray-800 mb-2'>Giỏ hàng</h1>
          <p className='text-gray-600'>Bạn có {total_items} sản phẩm trong giỏ hàng</p>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Left Column - Cart Items */}
          <div className='lg:col-span-2'>
            <div className='bg-white rounded-lg border border-gray-200 overflow-hidden'>
              {/* Table Header */}
              <div className='grid grid-cols-12 gap-4 p-4 bg-gray-50 border-b border-gray-200 text-sm font-medium text-gray-600'>
                <div className='col-span-5'>Mặt hàng</div>
                <div className='col-span-2 text-center'>Đơn giá</div>
                <div className='col-span-2 text-center'>Số lượng</div>
                <div className='col-span-2 text-center'>Thành tiền</div>
                <div className='col-span-1 text-center'>Thao tác</div>
              </div>

              {/* Product Items */}
              <div className='divide-y divide-gray-200'>
                {items.map((item) => (
                  <div key={item.item_id} className='grid grid-cols-12 gap-4 p-4 hover:bg-gray-50 transition-colors'>
                    {/* Product Info - 5 columns */}
                    <div className='col-span-5 flex items-center space-x-3'>
                      <div className='w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0'>
                        <img
                          src={item.image_url || '/placeholder.svg'}
                          alt={item.name}
                          width={64}
                          height={64}
                          className='w-full h-full object-contain'
                        />
                      </div>
                      <div className='min-w-0 flex-1'>
                        <h3 className='font-medium text-gray-800 line-clamp-2'>{item.name}</h3>
                      </div>
                    </div>

                    {/* Unit Price - 2 columns */}
                    <div className='col-span-2 flex items-center justify-center'>
                      <div className='text-center'>
                        <p className='font-semibold text-gray-800'>{formatPrices(item.price)}</p>
                      </div>
                    </div>

                    {/* Quantity - 2 columns */}
                    <div className='col-span-2 flex items-center justify-center'>
                      <div className='flex items-center space-x-2 border border-gray-300 rounded-lg'>
                        {/* Replaced Button with a standard button styled with Tailwind */}
                        <button
                          onClick={() => handleUpdateQuantityChange(item.item_id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className='inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 w-8 h-8 p-0 hover:bg-gray-100'
                        >
                          <Minus className='w-4 h-4' />
                        </button>
                        <span className='w-12 text-center font-medium'>{item.quantity}</span>
                        {/* Replaced Button with a standard button styled with Tailwind */}
                        <button
                          onClick={() => handleUpdateQuantityChange(item.item_id, item.quantity + 1)}
                          className='inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 w-8 h-8 p-0 hover:bg-gray-100'
                        >
                          <Plus className='w-4 h-4' />
                        </button>
                      </div>
                    </div>

                    {/* Total Price - 2 columns */}
                    <div className='col-span-2 flex items-center justify-center'>
                      <p className='font-bold text-blue-600'>{formatPrices(item.price * item.quantity)}</p>
                    </div>

                    {/* Actions - 1 column */}
                    <div className='col-span-1 flex items-center justify-center'>
                      {/* Replaced Button with a standard button styled with Tailwind */}
                      <button
                        onClick={() => handleRemoveFromCart(item.item_id)}
                        className='inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 text-red-600 hover:text-red-700 hover:bg-red-50 h-9 px-4 py-2'
                      >
                        <Trash2 className='w-4 h-4' />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className='space-y-6'>
            {/* Update shipping information section */}
            <div className='bg-white rounded-lg border border-gray-200 p-6'>
              <div className='flex items-center justify-between mb-4'>
                <div className='flex items-center space-x-2'>
                  <MapPin className='w-5 h-5 text-blue-600' />
                  <h3 className='font-semibold text-gray-800'>Giao tới</h3>
                </div>
                {/* Replaced Button with a standard button styled with Tailwind */}
                <button className='inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-9 px-4 py-2 border border-blue-600 text-blue-600 hover:bg-blue-50'>
                  Thay đổi
                </button>
              </div>
              <div className='space-y-2'>
                <p className='font-medium text-gray-800'>Thanh Quân</p>
                <p className='text-gray-600'>(+84)888888888</p>
                <p className='text-gray-600'>88/99 Ba Đình, Thành phố Hà nội</p>
              </div>
            </div>

            {/* Shipping Method */}
            <div className='bg-white rounded-lg border border-gray-200 p-6'>
              <div className='flex items-center space-x-2 mb-4'>
                <Truck className='w-5 h-5 text-teal-600' />
                <h3 className='font-semibold text-gray-800'>Phương thức giao hàng</h3>
              </div>
              {/* Replaced RadioGroup and RadioGroupItem with native input[type="radio"] and labels */}
              <div
                role='radiogroup'
                className='grid gap-2'
                value={shippingMethod}
                onChange={(e) => setShippingMethod((e.target as HTMLInputElement).value)}
              >
                <div className='flex items-center space-x-2'>
                  <input
                    type='radio'
                    value='standard'
                    id='standard'
                    name='shippingMethod'
                    className='h-4 w-4 text-primary focus:ring-primary border-gray-300'
                    checked={shippingMethod === 'standard'}
                  />
                  <label
                    htmlFor='standard'
                    className='flex-1 cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                  >
                    <div>
                      <p className='font-medium'>Giao hàng tiêu chuẩn</p>
                      <p className='text-sm text-gray-500'>3-5 ngày làm việc • Miễn phí</p>
                    </div>
                  </label>
                </div>
                <div className='flex items-center space-x-2'>
                  <input
                    type='radio'
                    value='express'
                    id='express'
                    name='shippingMethod'
                    className='h-4 w-4 text-primary focus:ring-primary border-gray-300'
                    checked={shippingMethod === 'express'}
                  />
                  <label
                    htmlFor='express'
                    className='flex-1 cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                  >
                    <div>
                      <p className='font-medium'>Giao hàng nhanh</p>
                      <p className='text-sm text-gray-500'>1-2 ngày làm việc • 50.000₫</p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className='bg-white rounded-lg border border-gray-200 p-6'>
              <div className='flex items-center space-x-2 mb-4'>
                <CreditCard className='w-5 h-5 text-teal-600' />
                <h3 className='font-semibold text-gray-800'>Phương thức thanh toán</h3>
              </div>
              {/* Replaced RadioGroup and RadioGroupItem with native input[type="radio"] and labels */}
              <div
                role='radiogroup'
                className='grid gap-2'
                value={paymentMethod}
                onChange={(e) => setPaymentMethod((e.target as HTMLInputElement).value)}
              >
                <div className='flex items-center space-x-2'>
                  <input
                    type='radio'
                    value='cash'
                    id='cash'
                    name='paymentMethod'
                    className='h-4 w-4 text-primary focus:ring-primary border-gray-300'
                    checked={paymentMethod === 'cash'}
                  />
                  <label
                    htmlFor='cash'
                    className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                  >
                    Thanh toán khi nhận hàng (COD)
                  </label>
                </div>
                <div className='flex items-center space-x-2'>
                  <input
                    type='radio'
                    value='paypal'
                    id='paypal'
                    name='paymentMethod'
                    className='h-4 w-4 text-primary focus:ring-primary border-gray-300'
                    checked={paymentMethod === 'paypal'}
                  />
                  <label
                    htmlFor='paypal'
                    className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                  >
                    PayPal
                  </label>
                </div>
                <div className='flex items-center space-x-2'>
                  <input
                    type='radio'
                    value='bank'
                    id='bank'
                    name='paymentMethod'
                    className='h-4 w-4 text-primary focus:ring-primary border-gray-300'
                    checked={paymentMethod === 'bank'}
                  />
                  <label
                    htmlFor='bank'
                    className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                  >
                    Chuyển khoản ngân hàng
                  </label>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className='bg-white rounded-lg border border-gray-200 p-6'>
              <h3 className='font-semibold text-gray-800 mb-4'>Tổng kết đơn hàng</h3>
              <div className='space-y-3'>
                <div className='flex justify-between'>
                  <span className='text-gray-600'>Tạm tính ({total_items} sản phẩm)</span>
                  <span className='font-medium'>{formatPrices(subtotal)}</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-gray-600'>Phí vận chuyển</span>
                  <span className='font-medium'>{shippingFee > 0 ? formatPrices(shippingFee) : 'Miễn phí'}</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-gray-600'>Thuế (10%)</span>
                  <span className='font-medium'>{formatPrices(tax)}</span>
                </div>
                {/* Replaced Separator with a div with border */}
                <div className='border-t border-gray-200'></div>
                <div className='flex justify-between text-lg'>
                  <span className='font-bold text-gray-800'>Tổng cộng</span>
                  <span className='font-bold text-teal-600'>{formatPrices(total)}</span>
                </div>
              </div>

              {/* Replaced Button with a standard button styled with Tailwind */}
              <button className='w-full mt-6 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 text-lg shadow-lg hover:shadow-xl transition-all duration-300 rounded-md'>
                🛒 Đặt mua
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
