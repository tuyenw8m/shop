import { useState } from 'react'

interface ProductData {
  id: string
  name: string
  price: number
  original_price: number
  discount: number
  description: string
  technical_specs: Array<{ label: string; value: string }>
  highlight_specs: string[]
  stock: number
  sold: number
  rating: number
  review_count: number
  images: string[]
  promotions: string[]
  features: string[]
  category_name: string[]
}

export default function ProductPage() {
  const initialProduct: ProductData = {
    id: '0017faec-a7d9-4e84-a9c6-a938f1e4624d',
    name: 'PC i12 Gen 8K',
    price: 3090000.0,
    original_price: 3590000.0,
    discount: 14,
    description: 'PC mạnh nhất mọi thời đại siiiuuuuu !!!',
    technical_specs: [
      {
        label: 'Dung lượng',
        value: '1TB'
      },
      {
        label: 'Chuẩn kết nối',
        value: 'M.2 NVMe PCIe Gen3 x4'
      },
      {
        label: 'Tốc độ đọc',
        value: '3500MB/s'
      },
      {
        label: 'Tốc độ ghi',
        value: '3000MB/s'
      },
      {
        label: 'Độ bền',
        value: '600TBW'
      }
    ],
    highlight_specs: ['Hiệu năng cao cho gaming và đồ họa', 'Tương thích với hầu hết mainboard', 'Bảo hành 5 năm'],
    stock: 47,
    sold: 125,
    rating: 4.5,
    review_count: 24,
    images: [
      'https://tinhocanhphat.vn/media/product/19304_dq802508.jpg',
      'https://cdn2.fptshop.com.vn/unsafe/1920x0/filters:format(webp):quality(75)/2022_1_21_637783762740907156_untitled-1.png',
      'https://www.messoanuovo.it/cdn/shop/articles/PC-gaming-scaled.jpg?v=1707413030'
    ],
    promotions: ['Miễn phí vận chuyển', 'Bảo hành chính hãng'],
    features: ['Hỗ trợ TRIM', 'Tương thích LDPC ECC', 'Công nghệ SLC Caching'],
    category_name: ['Ổ cứng SSD', 'Linh kiện máy tính']
  }

  const [product, setProduct] = useState<ProductData | null>(initialProduct)
  const [selectedImage, setSelectedImage] = useState(0)
  const [rating, setRating] = useState(0)
  const [review, setReview] = useState({
    name: '',
    content: ''
  })

  if (!product) {
    return <div className='text-center py-10'>Đang tải sản phẩm...</div>
  }

  const handleAddToCart = () => {
    console.log('Thêm vào giỏ hàng:', product.id)
  }

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Đánh giá:', { ...review, rating })
  }

  return (
    <div className='max-w-7xl mx-auto px-4 py-6'>
      <div className='grid lg:grid-cols-2 gap-8'>
        <div className='space-y-4'>
          <div className='relative'>
            {product.discount > 0 && (
              <div className='absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded text-sm font-bold z-10'>
                GIẢM {product.discount}%
              </div>
            )}
            <div className='aspect-square bg-gray-100 rounded-lg overflow-hidden relative'>
              <img src={product.images[selectedImage]} alt={product.name} className='w-full h-full object-contain' />
            </div>
          </div>

          <div className='flex space-x-2'>
            {product.images.map((img, i) => (
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

          <div className='bg-gray-50 p-4 rounded-lg'>
            <h3 className='font-semibold mb-2 text-gray-800'> ƯU ĐÃI ĐẶC BIỆT</h3>
            <ul className='text-sm space-y-1 text-gray-700'>
              {product.promotions.map((promo, i) => (
                <li key={i}>✅ {promo}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className='space-y-6'>
          <div>
            <h1 className='text-2xl font-bold text-gray-900 mb-3'>{product.name}</h1>

            <div className='flex items-center space-x-4 mb-4'>
              <div className='flex items-center'>
                <span className='ml-2 text-sm text-gray-600'>({product.review_count} đánh giá)</span>
              </div>
              <span className='text-sm text-gray-600'>| Đã bán: {product.sold}</span>
            </div>

            <div className='flex items-center space-x-2 mb-6'>
              <span className='bg-red-600 text-white px-2 py-1 rounded text-xs font-bold'>Trả góp 0%</span>
              <span className='bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs'>Bảo hành chính hãng</span>
            </div>
          </div>

          <div className='space-y-4'>
            <div className='flex items-baseline space-x-4'>
              <span className='text-4xl font-bold text-red-600'>
                {new Intl.NumberFormat('vi-VN').format(product.price)}₫
              </span>
              {product.original_price > product.price && (
                <>
                  <span className='text-lg text-gray-500 line-through'>
                    {new Intl.NumberFormat('vi-VN').format(product.original_price)}₫
                  </span>
                  <span className='bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-bold'>
                    -{product.discount}%
                  </span>
                </>
              )}
            </div>

            <div className='text-right'>
              <span className='text-sm text-gray-600'>Giá trả góp từ:</span>
              <span className='font-bold text-lg ml-1'>
                {new Intl.NumberFormat('vi-VN').format(Math.round(product.price / 12))}₫/tháng
              </span>
            </div>
          </div>

          <div className='space-y-4'>
            <div className='flex space-x-4'>
              <button
                onClick={handleAddToCart}
                className='flex-1 bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-lg font-bold flex items-center justify-center space-x-2 transition-colors'
              >
                <span>THÊM VÀO GIỎ</span>
              </button>
              <button className='flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-bold transition-colors'>
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
              {product.highlight_specs.map((spec, i) => (
                <p key={i}>🔹 {spec}</p>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className='mt-12'>
        <h2 className='text-2xl font-bold mb-6 text-gray-900'>MÔ TẢ SẢN PHẨM</h2>
        <div className='grid md:grid-cols-2 gap-8'>
          <div>
            <h3 className='text-lg font-bold mb-4 text-gray-800 bg-gray-100 p-3 rounded'>THÔNG SỐ KỸ THUẬT</h3>
            <div className='bg-white border border-gray-200 rounded-lg overflow-hidden'>
              <div className='divide-y divide-gray-200'>
                {product.technical_specs.map((spec, i) => (
                  <div key={i} className='flex justify-between py-3 px-4 hover:bg-gray-50'>
                    <span className='text-gray-600 font-medium'>{spec.label}</span>
                    <span className='text-gray-900 text-right max-w-xs'>{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <h3 className='text-lg font-bold mb-4 text-gray-800 bg-gray-100 p-3 rounded'>TÍNH NĂNG NỔI BẬT</h3>
            <div className='space-y-4'>
              {product.features.map((feature, i) => (
                <div
                  key={i}
                  className='border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer'
                >
                  <div className='flex space-x-4'>
                    <div className='w-16 h-12 bg-gray-100 rounded flex items-center justify-center text-2xl'>
                      {i === 0 ? '⚡' : i === 1 ? '🔧' : '🚀'}
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

      <div className='mt-12'>
        <h2 className='text-2xl font-bold mb-6 text-gray-900'>ĐÁNH GIÁ SẢN PHẨM</h2>
        <div className='bg-gray-50 border border-gray-200 p-6 rounded-lg'>
          <form onSubmit={handleReviewSubmit}>
            <div className='flex items-center space-x-4 mb-4'>
              <span className='font-medium'>Đánh giá của bạn:</span>
              <div className='flex space-x-1'>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type='button'
                    onClick={() => setRating(star)}
                    className={`text-2xl ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>
            <div className='space-y-4'>
              <input
                type='text'
                placeholder='Họ và tên của bạn'
                className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500'
                value={review.name}
                onChange={(e) => setReview({ ...review, name: e.target.value })}
                required
              />
              <textarea
                className='w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-red-500'
                rows={4}
                placeholder='Nội dung đánh giá của bạn về sản phẩm...'
                value={review.content}
                onChange={(e) => setReview({ ...review, content: e.target.value })}
                required
              />
              <button
                type='submit'
                className='bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition-colors'
              >
                GỬI ĐÁNH GIÁ
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
