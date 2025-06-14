import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { Product } from 'src/types/product.type'
import { formatPrices, getCategoryStyle, salePercent } from 'src/utils/utils'
import ProductQuickOverview from '../ProductQuickOverview'
import RatingProduct from '../RatingProduct/RatingProduct'

interface ProductType {
  product: Product
}
export function ProductCard({ product }: ProductType) {
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false)

  const handleQuickView = () => {
    setIsQuickViewOpen(true)
  }

  const handleCloseQuickView = () => {
    setIsQuickViewOpen(false)
  }

  return (
    <>
      {isQuickViewOpen && <ProductQuickOverview product={product} onClose={handleCloseQuickView} />}
      <div className='group bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-200 overflow-hidden flex flex-col'>
        <div className='relative overflow-hidden pt-[100%]'>
          {/* Kiểm tra xem thuộc dòng sản phẩm nào seal, hot deal,.... */}
          {product.rating && (
            <div
              className={`absolute top-2 left-2 z-10 py-1 px-2 rounded text-xs font-bold text-white
      ${
        product.rating === 5
          ? 'bg-blue-600'
          : product.rating === 1
            ? 'bg-green-600'
            : product.rating === 3
              ? 'bg-orange-600'
              : product.rating === 4
                ? 'bg-purple-600'
                : 'bg-red-600'
      }`}
            >
              {product.rating === 5
                ? 'BEST SELLER'
                : product.rating === 1
                  ? 'NEW ARRIVAL'
                  : product.rating === 3
                    ? 'FLASH SALE'
                    : product.rating === 4
                      ? 'TOP RATED'
                      : 'DEFAULT TEXT'}
            </div>
          )}

          <div className='absolute top-2 right-2 z-10 bg-red-600 text-white font-bold text-xs rounded-full w-7 h-7 flex items-center justify-center'>
            {product.stock}
          </div>

          <img
            src={product.image_url[0]}
            alt={product.name}
            className='object-contain absolute top-0 left-0 w-full h-full p-4 group-hover:scale-105 transition-transform duration-300'
          />

          <div className='absolute inset-0 bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center'>
            <button
              onClick={() => handleQuickView()}
              className='bg-white text-gray-800 py-2 px-2 rounded-full font-medium transform -translate-y-4 group-hover:translate-y-0 transition-transform duration-300'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={1.5}
                stroke='currentColor'
                className='size-6'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z'
                />
                <path strokeLinecap='round' strokeLinejoin='round' d='M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z' />
              </svg>
            </button>
          </div>
        </div>

        {/* Phần nội dung */}
        <Link to={`/product/${product.id}`}>
          <div className='pt-2 pl-4 pr-4 flex flex-col flex-grow '>
            <div className='flex flex-wrap items-center gap-2 mb-auto min-h-[32px]'>
              {product.children_category_name &&
                product.children_category_name.map((categoryItem, index) => (
                  <span key={index} className={`${getCategoryStyle(index)} text-xs font-semibold px-2 py-1 rounded`}>
                    {categoryItem}
                  </span>
                ))}
            </div>
            <h3 className='text-sm mt-2 font-bold text-gray-700 mb-1 line-clamp-2 min-h-[2.5rem]'>{product.name}</h3>
            {/* Đánh giá */}
            <div className='flex items-center mt-1'>
              <RatingProduct ratingValue={product.rating} />
              <span className='text-xs text-gray-600 ml-1'> - Đã bán {product.sold}</span>
            </div>
            <div className='mt-auto'>
              <div className='flex items-baseline gap-2'>
                <span className='text-lg font-bold text-red-600'>{formatPrices(product.price)}₫</span>
                {product.original_price > product.price && (
                  <>
                    <span className='text-sm line-through text-gray-500'>{formatPrices(product.original_price)}₫</span>
                    <span className='text-sm text-green-600 font-semibold'>
                      -{salePercent(product.original_price, product.price)}%
                    </span>
                  </>
                )}
              </div>
              {product.stock <= 5 && <p className='text-xs text-orange-600 mt-1'>Chỉ còn {product.stock} sản phẩm</p>}
            </div>
          </div>
        </Link>

        <div className='mt-auto p-3 pt-1'>
          {product.stock === 0 ? (
            <button className='w-full bg-red-500 hover:bg-red-600 text-white text-sm rounded-md py-2 transition-colors'>
              Liên Hệ Đặt Hàng
            </button>
          ) : (
            <button className='w-full bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md py-2 transition-colors'>
              Thêm vào giỏ
            </button>
          )}
        </div>
      </div>
    </>
  )
}
