export default function HeaderAuth() {
  return (
    <header className='py-4  bg-white shadow-md'>
      <div className='max-w-screen-xl mx-auto px-4'>
        <div className='flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4'>
          {/* Logo */}
          <div className='flex items-center space-x-2 lg:w-1/4'>
            <span className='text-teal-600 font-bold text-xl sm:text-2xl'>STQ</span>
            <span className='text-teal-800 font-bold text-xl sm:text-2xl'>MUABAN.COM</span>
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
          </div>
        </div>
      </div>
    </header>
  )
}
