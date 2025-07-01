import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import type { ProductCardSale } from 'src/types/product.type' // Đảm bảo bạn có kiểu Product này
import { formatPrices, getCategoryStyle, getProfileLocalStorage } from 'src/utils/utils'
import ProductQuickOverview from '../ProductQuickOverview' // Đảm bảo component này tồn tại
import RatingProduct from '../RatingProduct/RatingProduct' // Đảm bảo component này tồn tại
import { Eye } from 'lucide-react'
import { useCartMutations } from 'src/hooks/useCartMutations'

interface ProductType {
  product: ProductCardSale
}

export function ProductCardSale({ product }: ProductType) {
  const userProfile = getProfileLocalStorage()
  const user_id = userProfile?.id
  const navigate = useNavigate()

  const { addItemToCart } = useCartMutations(user_id)

  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false)

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

  const discountPercent =
    product.original_price > product.price
      ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
      : 0

  return (
    <>
      {isQuickViewOpen && <ProductQuickOverview product={product} onClose={handleCloseQuickView} />}
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
            {product.promotions && (
              <div className='bg-red-50 text-red-600 text-xs px-2 py-1 rounded'>{product.promotions}</div>
            )}
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
              <button
                onClick={handleAddToCart}
                className='w-full bg-teal-600 hover:bg-teal-700 text-white text-sm rounded-md py-2 transition-colors'
              >
                Thêm vào giỏ
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
