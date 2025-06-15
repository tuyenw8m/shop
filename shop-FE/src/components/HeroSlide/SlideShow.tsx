import { ChevronLeft, ChevronRight, Gift, HandCoins, Handshake, Truck } from 'lucide-react'
import { useEffect, useState } from 'react'

export function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const slides = [
    {
      image: 'https://cdn2.fptshop.com.vn/unsafe/1920x0/filters:format(webp):quality(75)/H2_614x212_d9cb419633.png'
    },
    {
      image: 'https://salt.tikicdn.com/cache/w750/ts/tikimsp/25/ae/3b/161bfcfece5a229ddf3a39825e85eae7.jpg.webp'
    },
    {
      image: 'https://salt.tikicdn.com/ts/tka/7f/0b/d3/95916a0bd08a84d64206ce6ef9e72010.png'
    }
  ]

  // Auto 5s đổi 1 slide
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1))
    }, 5000)

    return () => clearInterval(interval)
  }, [slides.length])

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  const goToPrevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1))
  }

  const goToNextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1))
  }

  const currentImage = slides[currentSlide]?.image || '' // Fallback to empty string for safety

  return (
    <div className='grid lg:grid-cols-4 gap-6 mb-8'>
      <div className='lg:col-span-3'>
        <div className='relative h-64 sm:h-80 md:h-96 overflow-hidden rounded-lg'>
          {currentImage && ( // Chỉ render nếu có ảnh
            <img
              key={currentSlide} // Keying by currentSlide index to force re-render for transition
              src={currentImage}
              alt='banner-slide'
              className='object-contain absolute top-0 left-0 w-full h-full transition-opacity duration-500 opacity-100' // Luôn opacity-100 vì chỉ có 1 ảnh
            />
          )}

          <button
            className='absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full bg-green-200 hover:bg-white/60 flex items-center justify-center text-white transition-colors'
            onClick={goToPrevSlide}
          >
            <ChevronLeft size={20} strokeWidth={1.75} />
          </button>
          <button
            className='absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full bg-green-200 hover:bg-white/60 flex items-center justify-center text-white transition-colors'
            onClick={goToNextSlide}
          >
            <ChevronRight size={20} strokeWidth={1.75} />
          </button>

          {/* Indicators */}
          <div className='absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2'>
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 rounded-full transition-colors ${index === currentSlide ? 'bg-white' : 'bg-white/50'}`}
              />
            ))}
          </div>
        </div>
      </div>
      <div className='lg:col-span-1'>
        <div className='bg-white rounded-lg p-6 h-full'>
          <div className='space-y-6'>
            <div className='flex items-start space-x-3'>
              <div className='w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0'>
                <Truck size={20} strokeWidth={1.75} />
              </div>
              <div>
                <h3 className='font-semibold text-gray-800'>Miễn phí vận chuyển</h3>
                <p className='text-sm text-gray-600'>Áp dụng cho đơn hàng giá trị đã thanh toán trước</p>
              </div>
            </div>

            <div className='flex items-start space-x-3'>
              <div className='w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0'>
                <Handshake size={20} strokeWidth={1.75} />
              </div>
              <div>
                <h3 className='font-semibold text-gray-800'>Chính sách bảo hành</h3>
                <p className='text-sm text-gray-600'>
                  Hỗ trợ đổi trả 1-1 nếu có lỗi với sản phẩm, bảo hành 12-36 tháng
                </p>
              </div>
            </div>

            <div className='flex items-start space-x-3'>
              <div className='w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0'>
                <HandCoins size={20} strokeWidth={1.75} />
              </div>
              <div>
                <h3 className='font-semibold text-gray-800'>Thanh toán đa dạng</h3>
                <p className='text-sm text-gray-600'>Nhiều hình thức thanh toán Paypal, Momo, VNPay, tiền mặt</p>
              </div>
            </div>
            <div className='flex items-start space-x-3'>
              <div className='w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0'>
                <Gift size={20} strokeWidth={1.75} />
              </div>
              <div>
                <h3 className='font-semibold text-gray-800'>Ưu đãi</h3>
                <p className='text-sm text-gray-600'>Khuyến mãi sale cực lớn, vourche cực khủng</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HeroSlider
