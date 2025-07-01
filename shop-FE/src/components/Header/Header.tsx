import { useState, useContext, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../../pages/contexts/AuthContext'
import CategoryMenu from './CategoryMenu'
import { CircleUserRound, HelpCircle, Menu, MenuSquare, ShoppingCart, UserPlus } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { toggleCart } from 'src/features/cartSlice'
import { getProfileLocalStorage } from 'src/utils/utils'
import type { User } from 'src/pages/contexts/auth.types'
import type { RootState } from 'src/app/store'

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [showCategoryMenu, setShowCategoryMenu] = useState(false)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const { user, logout } = useContext(AuthContext)
  const dispatch = useDispatch()
  const cartState = useSelector((state: RootState) => state.cart)
  const { total_items } = cartState
  const navigate = useNavigate()
  const profileRef = useRef<HTMLDivElement>(null)
  const profile: User = getProfileLocalStorage()

  const handleShowMiniCart = () => {
    dispatch(toggleCart(true))
    console.log(123)
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
    setShowProfileMenu(false)
  }

  // Đóng dropdown khi click bên ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <header className='py-4 sticky top-0 z-50 bg-gradient-to-r from-teal-50 to-blue-50 shadow-lg border-b border-teal-100'>
      <div className='max-w-screen-xl mx-auto px-4'>
        <div className='flex items-center justify-between gap-4'>
          {/* MENU Mobile */}
          <button onClick={() => setMenuOpen(true)} className='lg:hidden p-2 hover:bg-teal-100 rounded-lg transition-colors'>
            <Menu className='text-teal-700' />
          </button>

          {/* Mobile Menu */}
          <CategoryMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} isDesktop={false} />

          {/* Desktop - Mobile Logo */}
          <div className='px-4 flex items-center'>
            <Link to='/' className='flex items-center space-x-2 group'>
              <div className='bg-gradient-to-r from-teal-600 to-blue-600 text-white p-2 rounded-lg shadow-md group-hover:shadow-lg transition-all duration-300'>
                <span className='font-bold text-xl sm:text-2xl'>STQ</span>
              </div>
              <div className='flex flex-col'>
                <span className='text-teal-700 font-bold text-xl sm:text-2xl leading-tight'>MUABAN</span>
                <span className='text-teal-500 font-medium text-xs sm:text-sm leading-tight'>TECHNOLOGY</span>
              </div>
            </Link>
          </div>

          {/* Actions của user */}
          <div className='flex items-center gap-2 lg:gap-4'>
            {/* Customer Service */}
            <button className='flex items-center text-teal-700 hover:bg-teal-100 text-sm p-2 rounded-lg transition-all duration-200 hover:shadow-md'>
              <HelpCircle size={20} className='mr-1' />
              <span className='hidden md:inline text-sm font-medium'>CSKH</span>
            </button>

            {/* Cart for logged in users */}
            {user && (
              <button
                onClick={handleShowMiniCart}
                className='flex items-center text-teal-700 hover:bg-teal-100 text-sm p-2 relative rounded-lg transition-all duration-200 hover:shadow-md'
              >
                <span className='absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-sm'>
                  {total_items}
                </span>
                <ShoppingCart size={20} className='mr-1' />
                <span className='hidden md:inline text-sm font-medium'>Giỏ hàng</span>
              </button>
            )}

            {/* User Authentication */}
            <div className='flex items-center relative' ref={profileRef}>
              {user ? (
                // Logged in user
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className='flex items-center bg-gradient-to-r from-teal-600 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-teal-700 hover:to-blue-700 text-sm transition-all duration-200 shadow-md hover:shadow-lg'
                >
                  <CircleUserRound size={18} className='mr-2' />
                  <span className='hidden md:inline text-sm font-medium overflow-hidden text-ellipsis whitespace-nowrap max-w-24'>
                    {profile.name}
                  </span>
                </button>
              ) : (
                // Non-logged in user - Login and Register buttons
                <div className='flex items-center gap-2'>
                  <Link
                    to='/login'
                    className='flex items-center bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 text-sm transition-all duration-200 shadow-md hover:shadow-lg'
                  >
                    <CircleUserRound size={18} className='mr-2' />
                    <span className='hidden md:inline text-sm font-medium'>Đăng nhập</span>
                  </Link>
                  <Link
                    to='/register'
                    className='flex items-center bg-white text-teal-600 border-2 border-teal-600 px-4 py-2 rounded-lg hover:bg-teal-50 text-sm transition-all duration-200 shadow-md hover:shadow-lg'
                  >
                    <UserPlus size={18} className='mr-2' />
                    <span className='hidden md:inline text-sm font-medium'>Đăng ký</span>
                  </Link>
                </div>
              )}

              {/* Profile Dropdown Menu */}
              {user && showProfileMenu && (
                <div className='absolute top-full right-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden'>
                  <div className='p-4 border-b border-gray-100 bg-gradient-to-r from-teal-50 to-blue-50'>
                    <div className='flex items-center'>
                      <div className='w-10 h-10 bg-gradient-to-r from-teal-600 to-blue-600 rounded-full flex items-center justify-center text-white font-bold'>
                        {profile.name?.charAt(0)?.toUpperCase()}
                      </div>
                      <div className='ml-3'>
                        <p className='text-sm font-semibold text-gray-800'>{profile.name}</p>
                        <p className='text-xs text-gray-500'>{profile.email}</p>
                      </div>
                    </div>
                  </div>
                  <div className='py-2'>
                    <Link
                      to='/profile'
                      className='flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-600 transition-colors'
                      onClick={() => setShowProfileMenu(false)}
                    >
                      <CircleUserRound size={16} className='mr-3' />
                      Hồ sơ cá nhân
                    </Link>
                    <Link
                      to='/profile'
                      className='flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-600 transition-colors'
                      onClick={() => setShowProfileMenu(false)}
                    >
                      <ShoppingCart size={16} className='mr-3' />
                      Đơn hàng của tôi
                    </Link>
                    <div className='border-t border-gray-100 my-1'></div>
                    <button
                      onClick={handleLogout}
                      className='flex items-center w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors'
                    >
                      <span className='mr-3'>🚪</span>
                      Đăng xuất
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className='flex flex-col lg:flex-row justify-between items-center mt-6'>
          <nav className='hidden lg:flex items-center space-x-8'>
            {/* Category Menu Button */}
            <div className='relative'>
              <button
                onClick={() => setShowCategoryMenu(!showCategoryMenu)}
                className='flex items-center space-x-2 bg-gradient-to-r from-teal-600 to-blue-600 text-white px-6 py-3 rounded-xl hover:from-teal-700 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg'
              >
                <MenuSquare size={20} />
                <span className='font-medium'>Danh mục sản phẩm</span>
              </button>

              {/* Desktop Category Menu */}
              <CategoryMenu isOpen={showCategoryMenu} onClose={() => setShowCategoryMenu(false)} isDesktop={true} />
            </div>
          </nav>

          {/* Trending Keywords */}
          <div className='hidden lg:flex items-center text-gray-600 text-sm gap-x-6'>
            <span className='text-teal-600 font-semibold text-base'>🔥 Từ khóa xu hướng:</span>
            <div className='flex gap-x-4'>
              <span className='hover:text-teal-600 cursor-pointer transition-colors font-medium'>Gaming</span>
              <span className='hover:text-teal-600 cursor-pointer transition-colors font-medium'>iPhone 16</span>
              <span className='hover:text-teal-600 cursor-pointer transition-colors font-medium'>PC</span>
              <span className='hover:text-teal-600 cursor-pointer transition-colors font-medium'>Modem Wifi 6</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
