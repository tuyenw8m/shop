import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import productApi from 'src/apis/ProductService.api'
import ReviewSection from 'src/components/ReviewSection'
import type { Product } from 'src/types/product.type'
import { formatPrices, salePercent, getProfileLocalStorage, getAccessToken } from 'src/utils/utils'
import { useCartMutations } from 'src/hooks/useCartMutations'
import OrderModal from 'src/components/OrderModal'

export default function ProductDetail() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const userProfile = getProfileLocalStorage()
  const { addItemToCart } = useCartMutations(userProfile?.id)

  const { data } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productApi.getProductDetail(id),
    enabled: Boolean(id) // tránh gọi khi id rỗng
  })

  console.log(data?.data?.data)
  const product = data?.data?.data as Product

  const [selectedImage, setSelectedImage] = useState(0)
  const [showOrderModal, setShowOrderModal] = useState(false)
  const [orderError, setOrderError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  if (!product) {
    return <div className='text-center py-10'>404. Sản phẩm không tồn tại...</div>
  }

  const handleAddToCart = () => {
    if (userProfile) {
      addItemToCart.mutate({ product })
      setSuccessMessage('Đã thêm vào giỏ hàng!')
      setTimeout(() => setSuccessMessage(null), 2000)
    } else {
      navigate('/login')
    }
  }

  const handleBuyNow = () => {
    if (userProfile) {
      setShowOrderModal(true)
    } else {
      navigate('/login')
    }
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
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          product_id: product.id,
          quantity: 1,
          comment: ''
        }),
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
        navigate('/profile')
      }, 2000)
    } catch (err) {
      setOrderError('Đặt hàng thất bại!')
      console.error('Order error:', err)
    }
  }

  return (
    <div className='max-w-7xl mx-auto px-12 py-12'>
      {successMessage && (
        <div className='fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-100 text-green-700 px-6 py-2 rounded shadow z-50 transition-all duration-300'>
          {successMessage}
        </div>
      )}
      {showOrderModal && (
        <OrderModal
          user={userProfile}
          product={product}
          onConfirm={handleConfirmOrder}
          onClose={() => setShowOrderModal(false)}
          error={orderError}
          successMessage={successMessage}
        />
      )}
      <div className='grid lg:grid-cols-3 gap-8'>
        <div className='col-span-2 space-y-4'>
          {product.image_url && product.image_url.length > 0 && (
            <div className='relative'>
              <div className='absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded text-sm font-bold z-10'>
                GIẢM {salePercent(product.original_price, product.price)}%
              </div>
              <div className='aspect-square bg-gray-100 rounded-lg overflow-hidden relative'>
                <img
                  src={product.image_url[selectedImage]}
                  alt={product.name}
                  className='h-full w-full object-contain'
                />
              </div>
            </div>
          )}

          {product.image_url && product.image_url.length > 0 && (
            <div className='flex space-x-2'>
              {product.image_url.map((img, i) => (
                <div
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`w-16 h-16 border-2 rounded overflow-hidden cursor-pointer ${
                    selectedImage === i ? 'border-red-500' : 'border-gray-200'
                  }`}
                >
                  <img src={img} alt={`${product.name} ${i + 1}`} className='w-full h-full object-cover' />
                </div>
              ))}
            </div>
          )}

          <div className='bg-red-50 p-4 rounded-xl border border-red-200 shadow-inner'>
            <h3 className='flex items-center font-bold mb-2 text-red-800 text-base'>
              <span className='mr-1.5 text-xl'>🎁</span> ƯU ĐÃI ĐẶC BIỆT
            </h3>
            <ul className='ml-5 text-sm space-y-1 text-gray-800 list-disc'>
              {product.promotions &&
                product.promotions.split(',').map((promotion, i) => <li key={i}>{promotion.trim()}</li>)}
            </ul>
          </div>
        </div>

        <div className='space-y-6'>
          <div>
            <h1 className='text-2xl font-bold text-gray-900 mb-3'>{product.name}</h1>

            <div className='flex items-center space-x-4 mb-4'>
              <div className='flex items-center'>
                <span className='ml-2 text-sm text-gray-600'>({product.rating} đánh giá)</span>
              </div>
              <span className='text-sm text-gray-600'> | Đã bán: {product.sold}</span>
            </div>

            <div className='flex items-center space-x-2 mb-6'>
              <span className='bg-red-600 text-white px-2 py-1 rounded text-xs font-bold'>Trả góp 0%</span>
              <span className='bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs'>Bảo hành chính hãng</span>
            </div>
          </div>

          <div className='space-y-4'>
            <div className='flex items-baseline space-x-4'>
              <span className='text-4xl font-bold text-red-600'>{formatPrices(product.price)}₫</span>
              {product.original_price >= product.price && (
                <>
                  <span className='text-lg text-gray-500 line-through'>{formatPrices(product.original_price)}₫</span>
                  <span className='bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-bold'>
                    -{salePercent(product.original_price, product.price)}%
                  </span>
                </>
              )}
            </div>

            <div className='text-right'>
              <span className='text-sm text-gray-600'>Giá trả góp từ:</span>
              <span className='font-bold text-lg ml-1'>{formatPrices(Math.round(product.price / 12))}₫/tháng</span>
            </div>
          </div>

          <div className='space-y-4'>
            <div className='flex space-x-4'>
              <button
                onClick={handleAddToCart}
                className='bg-gradient-to-r from-teal-400 to-teal-600 hover:from-teal-300 hover:to-teal-500 text-white px-5 py-2 rounded-lg flex items-center gap-2 font-medium shadow'
              >
                <span>THÊM VÀO GIỎ</span>
              </button>
              <button
                onClick={handleBuyNow}
                className='flex-1 bg-blue-500 hover:bg-blue-400 text-white py-3 px-6 rounded-lg font-bold transition-colors'
              >
                MUA NGAY
              </button>
            </div>

            <div className='flex space-x-4'>
              <button className='flex-1 border-2 border-gray-300 hover:border-red-500 text-gray-700 py-2 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors'>
                <span>Yêu thích</span>
              </button>
              <button className='flex-1 border-2 border-blue-300 hover:border-blue-500 text-blue-600 py-2 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors'>
                <span>Chat Zalo</span>
              </button>
            </div>
          </div>

          <div className='bg-blue-50 border border-blue-200 p-4 rounded-lg'>
            <h3 className='font-bold mb-3 text-blue-800'>📋 THÔNG TIN SẢN PHẨM</h3>
            <div className='text-sm space-y-2 text-blue-700'>
              {product.highlight_specs && product.highlight_specs.split(',').map((spec, i) => <p key={i}>🔹 {spec}</p>)}
            </div>
          </div>
        </div>
      </div>

      <div className='mt-12'>
        <h2 className='text-2xl font-bold mb-6 text-gray-900'>MÔ TẢ SẢN PHẨM</h2>
        <div className='grid md:grid-cols-2 gap-8'>
          <div>
            <h3 className='text-lg font-bold mb-4 text-gray-800 bg-gray-100 p-3 border-l-3 border-red-500 rounded'>
              THÔNG SỐ KỸ THUẬT
            </h3>
            <div className='bg-white border border-gray-200 rounded-xl overflow-hidden shadow-md'>
              <div className='divide-y divide-gray-200'>
                {product.technical_specs &&
                  product.technical_specs.split(',').map((spec, i) => {
                    const [key, value] = spec.split(':').map((s) => s.trim())
                    return (
                      <div
                        key={i}
                        className='flex flex-col sm:flex-row justify-between py-3 px-4 hover:bg-gray-50 transition-colors text-sm'
                      >
                        <span className='text-gray-600 font-medium w-full sm:w-1/2'>{key}</span>
                        <span className='text-gray-900 font-semibold mt-0.5 sm:mt-0 w-full sm:w-1/2 text-left sm:text-right'>
                          {value || 'N/A'}
                        </span>
                      </div>
                    )
                  })}
              </div>
            </div>
          </div>

          <div>
            <h3 className='text-lg font-bold mb-4 text-gray-800 bg-gray-100 p-3 border-l-3 border-red-500 rounded'>
              TÍNH NĂNG NỔI BẬT
            </h3>
            <div className='space-y-4'>
              {product.features &&
                product.features.split(',').map((feature, i) => (
                  <div
                    key={i}
                    className='border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer'
                  >
                    <div className='flex space-x-4'>
                      <div className='w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-2xl flex-shrink-0'>
                        {i === 0 ? '🚀' : i === 1 ? '💎' : i === 2 ? '🔒' : '✨'}
                      </div>
                      <div className='flex-1'>
                        <h4 className='font-medium text-sm mb-1 text-gray-900'>{feature}</h4>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      <div className='mt-8 bg-gray-50 p-6 rounded-lg'>
        <p className='text-gray-700 leading-relaxed'>{product.description}</p>
      </div>
      <ReviewSection productId={product.id} />
    </div>
  )
}
