import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Product } from 'src/types/product.type' // Đảm bảo bạn có kiểu Product này
import { formatPrices, getCategoryStyle, getProfileLocalStorage, getAccessToken } from 'src/utils/utils'
import ProductQuickOverview from '../ProductQuickOverview' // Đảm bảo component này tồn tại
import RatingProduct from '../RatingProduct/RatingProduct' // Đảm bảo component này tồn tại
import { Eye } from 'lucide-react'
import { useCartMutations } from 'src/hooks/useCartMutations'
import OrderModal from '../OrderModal'
import { useOrderContext } from 'src/pages/contexts/OrderContext'

interface ProductType {
  product: Product
  onOrderSuccess?: () => void
}

export function ProductCard({ product, onOrderSuccess }: ProductType) {
  const userProfile = getProfileLocalStorage()
  const user_id = userProfile?.id
  const navigate = useNavigate()
  const { refreshOrders } = useOrderContext()

  const { addItemToCart } = useCartMutations(user_id)

  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false)
  const [showOrderModal, setShowOrderModal] = useState(false)
  const [orderError, setOrderError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsQuickViewOpen(true)
  }

  const handleCloseQuickView = () => {
    setIsQuickViewOpen(false)
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (userProfile) {
      return addItemToCart.mutate({ product })
    }
    navigate('/login')
  }

  const handleCardClick = () => {
    navigate(`/product/${product.id}`)
  }

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (userProfile) {
      setShowOrderModal(true)
    } else {
      navigate('/login')
    }
  }

  const handleShowOrderModal = () => {
    setShowOrderModal(true)
  }

  const handleConfirmOrder = async () => {
    setOrderError(null)
    if (!userProfile?.phone || !userProfile?.address) {
      setOrderError('Vui lòng cập nhật số điện thoại và địa chỉ trong hồ sơ!')
      setTimeout(() => {
        setShowOrderModal(false)
        navigate('/profile')
      }, 1500)
      return
    }
    try {
      const response = await fetch('http://localhost:8888/shop/api/v1/orders', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          product_id: product.id,
          quantity: 1,
          comment: ''
        })
      })
      if (!response.ok) {
        const errorText = await response.text()
        setOrderError('Đặt hàng thất bại: ' + errorText)
        return
      }
      setSuccessMessage('Đặt hàng thành công! Đơn hàng đã chuyển sang mục Chờ thanh toán.')
      setTimeout(() => {
        setShowOrderModal(false)
        setSuccessMessage(null)
        refreshOrders()
        navigate('/profile')
      }, 2000)
      if (onOrderSuccess) {
        onOrderSuccess()
      }
    } catch (err) {
      setOrderError('Đặt hàng thất bại!')
      console.error('Order error:', err)
    }
  }

  const discountPercent =
    product.original_price > product.price
      ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
      : 0

  return (
    <>
      {isQuickViewOpen && (
        <ProductQuickOverview
          product={product}
          onClose={handleCloseQuickView}
          handleShowOrderModal={handleShowOrderModal}
        />
      )}
      {showOrderModal && (
        <OrderModal
          user={userProfile}
          product={product}
          onConfirm={handleConfirmOrder}
          onClose={() => setShowOrderModal(false)}
          error={orderError || undefined}
          successMessage={successMessage || undefined}
        />
      )}
      <div
        className='group bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg hover:border-teal-200 transition-all duration-300 transform hover:-translate-y-1 flex flex-col h-full cursor-pointer'
        onClick={handleCardClick}
      >
        <div className='relative overflow-hidden bg-gray-50 h-48 flex items-center justify-center'>
          {discountPercent > 0 && (
            <div className='absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full z-10'>
              -{discountPercent}%
            </div>
          )}
          {product.stock <= 5 && product.stock > 0 && (
            <div className='absolute top-2 right-2 bg-orange-500 text-white text-xs font-medium px-2 py-1 rounded-full z-10'>
              Còn {product.stock}
            </div>
          )}
          {product.stock === 0 && (
            <div className='absolute top-2 right-2 bg-gray-500 text-white text-xs font-medium px-2 py-1 rounded-full z-10'>
              Hết hàng
            </div>
          )}
          <img
            src={product.image_url?.[0] || '/placeholder.svg'}
            alt={product.name}
            className='object-contain w-full h-full p-4 group-hover:scale-105 transition-transform duration-300'
          />
          <div className='absolute inset-0 bg-white/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center'>
            <button
              onClick={handleQuickView}
              className='bg-white text-teal-600 hover:bg-teal-50 transform -translate-y-4 group-hover:translate-y-0 transition-transform duration-300 px-4 py-2 rounded-md flex items-center shadow-md'
            >
              <Eye size={20} strokeWidth={1.75} className='w-4 h-4 mr-2' />
              Xem nhanh
            </button>
          </div>
        </div>
        {/* Nội dung */}
        <div className='p-4 flex flex-col flex-grow'>
          <div className='flex flex-wrap items-center gap-2 mb-2 min-h-[32px]'>
            {product.children_category_name &&
              product.children_category_name.map((categoryItem, index) => (
                <span key={index} className={`${getCategoryStyle(index)} text-xs font-semibold px-2 py-1 rounded`}>
                  {categoryItem}
                </span>
              ))}
          </div>

          <h3 className='text-sm font-medium text-gray-800 mb-2 line-clamp-2 min-h-[2.5rem] group-hover:text-teal-600 transition-colors'>
            {product.name}
          </h3>

          <div className='space-y-1 mt-auto'>
            <div className='flex items-center justify-between mb-3'>
              <div className='flex items-center space-x-1'>
                <RatingProduct ratingValue={product.rating} />
              </div>
              <span className='text-xs text-gray-500'>Đã bán {product.sold}</span>
            </div>
            <div className='flex items-baseline space-x-2'>
              <span className='text-lg font-bold text-red-600'>{formatPrices(product.price)}₫</span>
              {discountPercent > 0 && (
                <span className='text-sm text-gray-500 line-through'>{formatPrices(product.original_price)}₫</span>
              )}
            </div>
            {product.promotions &&
              product.promotions.split('|').map((promotion, index) => (
                <div key={index} className='bg-red-50 text-red-600 text-xs px-2 py-1 rounded'>
                  {promotion}
                </div>
              ))}
          </div>

          <div className='mt-4'>
            {product.stock === 0 ? (
              <button
                className='w-full bg-red-500 hover:bg-red-600 text-white text-sm rounded-md py-2 transition-colors'
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                }}
              >
                Liên Hệ Đặt Hàng
              </button>
            ) : (
              <>
                <button
                  onClick={handleAddToCart}
                  className='w-full bg-teal-600 hover:bg-teal-700 text-white text-sm rounded-md py-2 transition-colors mb-2'
                >
                  Thêm vào giỏ
                </button>
                <button
                  onClick={handleBuyNow}
                  className='w-full bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-md py-2 transition-colors'
                >
                  Mua ngay
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
