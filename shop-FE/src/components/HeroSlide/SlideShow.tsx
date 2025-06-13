import { useEffect, useState, type SetStateAction } from 'react'

export function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const slides = [
    {
      id: 1,
      title: 'Laptop Gaming Giảm Đến 30%',
      description: 'Hiệu năng mạnh mẽ, giải trí đỉnh cao',
      bgColor: 'bg-gradient-to-r from-blue-700 to-indigo-900',
      buttonColor: 'bg-yellow-500 hover:bg-yellow-600',
      image:
        'https://cdn.tgdd.vn/Products/Images/522/325513/ipad-pro-11-inch-m4-wifi-black-thumb-600x600.jpg?height=300&width=300'
    },
    {
      id: 2,
      title: 'Siêu Sale Camera Sony',
      description: 'Khuyến mãi cực lớn dành cho các dòng máy mới',
      bgColor: 'bg-gradient-to-r from-red-700 to-rose-900',
      buttonColor: 'bg-blue-500 hover:bg-blue-600',
      image:
        'https://thesoncamera.com/wp-content/uploads/2025/05/499865060_4011800315760740_3955780019329244196_n.jpg?height=300&width=400'
    },
    {
      id: 3,
      title: 'Phụ Kiện Chính Hãng',
      description: 'Mua 1 tặng 1 - Chỉ từ 199.000đ',
      bgColor: 'bg-gradient-to-r from-green-700 to-teal-900',
      buttonColor: 'bg-red-500 hover:bg-red-600',
      image:
        'https://cdnv2.tgdd.vn/mwg-static/tgdd/Banner/20/ab/20ab0e60f5450a71d869f18c727a3aca.png?height=300&width=300'
    }
  ]

  // Auto 5s change 1 slide
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1))
    }, 5000)

    return () => clearInterval(interval)
  }, [slides.length])

  const goToSlide = (index: SetStateAction<number>) => {
    setCurrentSlide(index)
  }

  const goToPrevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1))
  }

  const goToNextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1))
  }

  return (
    <div className='relative h-64 sm:h-80 md:h-96 overflow-hidden rounded-lg'>
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out ${
            index === currentSlide ? 'opacity-100' : 'opacity-0 pointer-events-none'
          } ${slide.bgColor}`}
        >
          <div className='container mx-auto h-full flex items-center px-6'>
            <div className='flex flex-col md:flex-row items-center justify-between w-full'>
              <div className='text-white md:w-1/2 mb-6 md:mb-0 text-center md:text-left'>
                <h2 className='text-2xl md:text-4xl font-bold mb-2'>{slide.title}</h2>
                <p className='mb-4 text-white/80'>{slide.description}</p>
                <button className={`${slide.buttonColor} text-white py-2 px-6 rounded-md font-medium`}>Mua Ngay</button>
              </div>
              <div className='md:w-1/2 flex justify-center'>
                <div className='w-60 h-60 relative'>
                  <img src={slide.image || '/placeholder.svg'} alt={slide.title} className='object-contain' />
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation arrows */}
      <button
        className='absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full bg-white/30 hover:bg-white/60 flex items-center justify-center text-white transition-colors'
        onClick={goToPrevSlide}
      >
        <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='currentColor' className='size-5'>
          <path
            fillRule='evenodd'
            d='M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z'
            clipRule='evenodd'
          />
        </svg>
      </button>
      <button
        className='absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full bg-white/30 hover:bg-white/60 flex items-center justify-center text-white transition-colors'
        onClick={goToNextSlide}
      >
        <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='currentColor' className='size-5'>
          <path
            fillRule='evenodd'
            d='M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z'
            clipRule='evenodd'
          />
        </svg>
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
  )
}

export default HeroSlider
