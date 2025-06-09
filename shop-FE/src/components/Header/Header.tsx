export default function Header() {
  return (
    <header className='py-4 sticky top-0 z-50 bg-white shadow-md'>
      <div className='max-w-screen-xl mx-auto px-4'>
        <div className='flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4'>
          {/* Logo */}
          <div className='flex items-center space-x-2 lg:w-1/4'>
            <span className='text-teal-600 font-bold text-xl sm:text-2xl'>STQ</span>
            <span className='text-teal-800 font-bold text-xl sm:text-2xl'>MUABAN.COM</span>
          </div>

          {/* Search box */}
          <div className='flex-1 w-full'>
            <form className='flex items-center bg-white rounded-full border border-gray-300 overflow-hidden w-full'>
              <input
                type='text'
                className='flex-grow px-4 py-2 outline-none text-sm'
                placeholder='Hôm nay bạn muốn tìm gì nào?'
              />
              <button
                type='submit'
                className='flex items-center px-4 py-2 text-teal-600 hover:bg-teal-100 border-l border-teal-600 text-sm whitespace-nowrap'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='size-5 mr-1'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z'
                  />
                </svg>
                Tìm kiếm
              </button>
            </form>
          </div>

          {/* Icons */}
          <div className='flex items-center space-x-4 lg:w-1/4 justify-end w-full'>
            {/* Tài khoản */}
            <button className='flex items-center text-teal-600 hover:bg-teal-100 text-sm p-2 rounded cursor-pointer'>
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
                  d='M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z'
                />
              </svg>
              Tài khoản
            </button>

            {/* CSKH */}
            <button className='flex items-center text-teal-600 hover:bg-teal-100 text-sm p-2 rounded cursor-pointer'>
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
                  d='M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z'
                />
              </svg>
              CSKH
            </button>

            {/* Giỏ hàng */}
            <button className='relative text-teal-600 hover:text-teal-700'>
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
                  d='M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z'
                />
              </svg>
              <span className='absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center'>
                0
              </span>
            </button>
          </div>
        </div>

        {/* Trending Keywords - chỉ hiển thị trên sm trở lên */}
        <div className='hidden sm:flex flex-wrap justify-center items-center text-gray-600 mt-2 px-2 text-sm gap-x-4 gap-y-1'>
          <span className='text-teal-600 font-semibold'>Từ khóa xu hướng</span>
          <span>Gaming</span>
          <span>iPhone 16</span>
          <span>PC</span>
          <span>Modem Wifi 6</span>
        </div>
      </div>
    </header>
  )
}
