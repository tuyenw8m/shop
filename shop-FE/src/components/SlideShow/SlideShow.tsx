import { useEffect, useState } from 'react'

// Danh sách ảnh cho slideshow
const listImage = [
  'https://salt.tikicdn.com/cache/w750/ts/tikimsp/29/11/d3/950d7887ca65318bdd0b28515bbd9aa9.jpg.webp',
  'https://cdn2.fptshop.com.vn/unsafe/1920x0/filters:format(webp):quality(75)/desk_header_3_6e32e78711.png',
  'https://cdn2.fptshop.com.vn/unsafe/1920x0/filters:format(webp):quality(75)/H2_614x212_0325295dc7.png'
]

const Slideshow = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const nextSlide = () => {
    if (!isAnimating) {
      setIsAnimating(true)
      setCurrentIndex((prevIndex) => (prevIndex + 1) % listImage.length)
      setTimeout(() => setIsAnimating(false), 500)
    }
  }

  const prevSlide = () => {
    if (!isAnimating) {
      setIsAnimating(true)
      setCurrentIndex((prevIndex) => (prevIndex - 1 + listImage.length) % listImage.length)
      setTimeout(() => setIsAnimating(false), 500)
    }
  }

  // useEffect để tự động chuyển sang ảnh tiếp theo sau mỗi 5 giây
  useEffect(() => {
    const intervalId = setInterval(() => {
      nextSlide()
    }, 5000)

    return () => clearInterval(intervalId)
  }, [currentIndex])

  return (
    <div
      className='relative h-[400px] overflow-hidden rounded-2xl shadow-lg group'
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`absolute inset-0 z-10 flex items-center justify-between px-4 transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <button
          onClick={prevSlide}
          className='p-2 bg-white/80 rounded-full shadow hover:scale-110 transition-transform'
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={1.5}
            stroke='currentColor'
            className='size-6'
          >
            <path strokeLinecap='round' strokeLinejoin='round' d='M15.75 19.5 8.25 12l7.5-7.5' />
          </svg>
        </button>
        <button
          onClick={nextSlide}
          className='p-2 bg-white/80 rounded-full shadow hover:scale-110 transition-transform'
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={1.5}
            stroke='currentColor'
            className='size-6'
          >
            <path strokeLinecap='round' strokeLinejoin='round' d='m8.25 4.5 7.5 7.5-7.5 7.5' />
          </svg>
        </button>
      </div>

      <div className='relative h-full w-full'>
        {listImage.map((image, index) => (
          <div
            key={index}
            className='absolute w-full h-full transition-transform duration-500 ease-in-out'
            style={{
              transform: `translateX(${(index - currentIndex) * 100}%)`
            }}
          >
            <img src={image} alt={`Slide ${index}`} className='w-full h-full object-cover' />
            <div className='absolute inset-0 bg-gradient-to-b from-transparent to-black/20' />
          </div>
        ))}
      </div>

      <div className='absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-20'>
        {listImage.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              currentIndex === index ? 'w-8 bg-white' : 'w-2 bg-white/60 hover:bg-white'
            }`}
          />
        ))}
      </div>
    </div>
  )
}

export default Slideshow
