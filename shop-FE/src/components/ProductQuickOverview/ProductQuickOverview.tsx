import { useState, useEffect, useRef, useId } from 'react'
import { createPortal } from 'react-dom'
import type { Product } from 'src/types/product.type'
import { formatPrices, getProfileLocalStorage } from 'src/utils/utils'
import RatingProduct from '../RatingProduct/RatingProduct'
import { useNavigate } from 'react-router-dom'
import { useCartMutations } from 'src/hooks/useCartMutations'
import type { User } from 'src/pages/contexts/auth.types'

interface Props {
  product: Product
  onClose: () => void
  handleShowOrderModal: () => void
}

export default function ProductQuickOverview({ product, onClose, handleShowOrderModal }: Props) {
  const navigate = useNavigate()
  const user: User | null = getProfileLocalStorage()
  const { addItemToCart } = useCartMutations(user?.id)

  const [quantity, setQuantity] = useState(1)
  const [mounted, setMounted] = useState(false)
  const [selectedImage, setSelectedImage] = useState(0)
  const modalRef = useRef<HTMLDivElement>(null)
  const idElement = useId()

  useEffect(() => {
    if (!document.getElementById(idElement)) {
      const portalRoot = document.createElement('div')
      portalRoot.id = idElement
      document.body.appendChild(portalRoot)
    }
    setMounted(true)
    document.body.style.overflow = 'hidden'
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [onClose])

  const handleQuantityChange = (value: number) => {
    const newQuantity = quantity + value
    return newQuantity >= 1 && newQuantity <= product.stock ? setQuantity(newQuantity) : setQuantity(quantity)
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  const handleAddToCart = () => {
    if (!user) {
      navigate('/login')
      return
    }
    addItemToCart.mutate({ product, quantity })
  }

  const handleBuyNow = () => {
    if (user) {
      onClose()
      handleShowOrderModal(true)
    } else {
      navigate('/login')
    }
  }

  if (!mounted) return null

  return createPortal(
    <div className='fixed inset-0  backdrop-blur-sm z-50 flex items-center justify-center p-4'>
      <div
        ref={modalRef}
        className='bg-white rounded-lg w-full max-w-2xl max-h-[80vh] overflow-y-auto shadow-xl transform transition-all'
      >
        <div className='flex justify-between items-center pl-4 pr-4 pt-4 pb-2 sticky top-0 bg-white z-10'>
          <h2 className='text-xl uppercase font-bold'>Xem nhanh sản phẩm</h2>
          <button onClick={onClose} className='p-1 rounded-full hover:bg-gray-100 transition-colors' aria-label='Đóng'>
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
                d='m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z'
              />
            </svg>
          </button>
        </div>

        <div className='grid md:grid-cols-2 gap-6 p-6'>
          <div className='space-y-4'>
            <div className='aspect-square bg-gray-100 rounded-lg flex items-center justify-center'>
              <img
                src={product.image_url[selectedImage]}
                alt={product.name}
                className='max-h-full max-w-full object-contain'
              />
            </div>
            <div className='flex space-x-2 overflow-x-auto py-2'>
              {product.image_url.slice(0, 4).map((img, index) => (
                <div
                  key={index}
                  className='flex-shrink-0 w-16 h-16 border rounded overflow-hidden cursor-pointer hover:border-blue-500 transition-colors'
                >
                  <img
                    src={img}
                    alt={`${product.name} ${index}`}
                    onClick={() => setSelectedImage(index)}
                    className='w-full h-full object-cover'
                  />
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className='mb-4'>
              <span className='text-sm text-gray-500'>
                {product.parent_category_name}/{product.branch_name}
              </span>
              <h1 className='text-xl font-bold mt-1 line-clamp-2'>{product.name}</h1>
              <div className='flex items-center mt-2'>
                <span className='text-sm text-gray-500'>{product.highlight_specs}</span>
              </div>
            </div>

            <div className='flex items-center mb-4'>
              <div className='flex text-yellow-400 mr-2'>
                <RatingProduct ratingValue={product.rating} />
              </div>
              <span className='text-sm text-gray-600'>({product.sold} đã bán)</span>
            </div>

            {/* Price */}
            <div className='mb-6'>
              <div className='flex items-baseline space-x-2'>
                <span className='text-2xl font-bold text-red-600'>{formatPrices(product.price)}đ</span>
                <span className='text-lg text-gray-500 line-through'>{formatPrices(product.original_price)}đ</span>
                <span className='bg-green-100 text-white px-2 py-1 rounded text-sm font-bold'>
                  {1 - (product.original_price - product.price) * 100} %
                </span>
              </div>
              <div className='text-green-600 font-medium mt-1'>
                Tiết kiệm: {formatPrices(product.price - product.price)}đ
              </div>
            </div>

            <div className='mb-6'>
              <div className='text-gray-700'>
                Còn lại: <span className='font-medium'>{product.stock} sản phẩm</span>
              </div>
            </div>

            <div className='flex items-center mb-8'>
              <span className='mr-4'>Số lượng:</span>
              <div className='flex border rounded-lg overflow-hidden'>
                <button
                  onClick={() => handleQuantityChange(-1)}
                  className='px-3 py-1 bg-gray-100 hover:bg-gray-200 transition-colors'
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className='px-4 py-1 border-x flex items-center justify-center w-12'>{quantity}</span>
                <button
                  onClick={() => handleQuantityChange(1)}
                  className='px-3 py-1 bg-gray-100 hover:bg-gray-200 transition-colors'
                  disabled={quantity >= product.stock}
                >
                  +
                </button>
              </div>
            </div>

            <div className='flex space-x-4'>
              <button
                className='flex-1 bg-sky-600 hover:bg-sky-500 text-white py-3 px-6 rounded-lg font-bold transition-colors'
                onClick={() => handleAddToCart()}
              >
                Thêm vào giỏ
              </button>
              <button
                className='flex-1 bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-lg font-bold transition-colors'
                onClick={() => handleBuyNow()}
              >
                Mua ngay
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.getElementById(idElement) as HTMLElement
  )
}
