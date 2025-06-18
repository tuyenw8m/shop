import { useState, useContext, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../pages/contexts/AuthContext';
import CategoryMenu from './CategoryMenu';
import { CircleUserRound, HelpCircle, Menu, MenuSquare, Search, ShoppingCart } from 'lucide-react';

export  function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const { user, logout } = useContext(AuthContext);
  console.log('Header user:', user);
  const navigate = useNavigate();
  const profileRef = useRef<HTMLDivElement>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
  };


  const handleLogout = () => {
    logout();
    navigate('/login');
    setShowProfileMenu(false);
  };

  // Đóng dropdown khi click bên ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="py-4 sticky top-0 z-50 bg-white shadow-md">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="flex items-center justify-between gap-4">
          {/* MENU Mobile */}
          <button onClick={() => setMenuOpen(true)} className="lg:hidden p-2">
            <Menu />
          </button>

          {/* Mobile Menu */}
          <CategoryMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} isDesktop={false} />

          {/* Desktop - Mobile Logo */}
          <div className="px-4 flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-teal-600 font-bold text-xl sm:text-2xl">STQ</span>
              <span className="text-teal-800 font-bold text-xl sm:text-2xl">MUABAN.COM</span>
            </Link>
          </div>

          {/* Search Desktop */}
          <div className="hidden md:flex flex-1 max-w-xl mx-6">
            <form
              onSubmit={handleSearch}
              className="flex items-center bg-white rounded-lg border border-gray-300 overflow-hidden w-full"
            >
              <input
                type="text"
                className="flex-grow px-4 py-2 outline-none text-sm"
                placeholder="Hôm nay bạn muốn tìm gì nào?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                type="submit"
                className="flex items-center px-4 py-2 text-teal-600 hover:bg-teal-100 border-l border-teal-600 text-sm whitespace-nowrap"
              >
                <Search size={20} /> Tìm kiếm
              </button>
            </form>
          </div>

          {/* Actions của user */}
          <div className="flex items-center lg:w-1/4 justify-end w-full">
            <div className="flex items-center relative" ref={profileRef}>
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center text-teal-600 hover:bg-teal-100 text-sm p-2 rounded cursor-pointer"
              >
                <CircleUserRound size={20} />
                
              </button>
              {user && showProfileMenu && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-xl z-50">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-teal-100 hover:text-teal-600"
                    onClick={() => setShowProfileMenu(false)}
                  >
                    Hồ sơ
                  </Link>
                  <Link
                    to="/orders"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-teal-100 hover:text-teal-600"
                    onClick={() => setShowProfileMenu(false)}
                  >
                    Đơn hàng
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-teal-100 hover:text-teal-600"
                  >
                    Đăng xuất
                  </button>
                </div>
              )}
              {!user && (
                <Link
                  to="/login"
                  className="text-teal-600 hover:bg-teal-100 text-sm p-2 rounded cursor-pointer"
                >
                  Đăng nhập
                </Link>
              )}
            </div>

            <button className="flex items-center text-teal-600 hover:bg-teal-100 text-sm p-2 rounded cursor-pointer">
              <HelpCircle size={20} />
              <span className="hidden md:inline ml-1 text-sm overflow-hidden text-ellipsis whitespace-nowrap">
                CSKH
              </span>
            </button>

            <button className="flex items-center text-teal-600 hover:bg-teal-100 text-sm p-2 relative rounded cursor-pointer">
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                0
              </span>
              <ShoppingCart size={20} />
              <span className="hidden md:inline ml-1 text-sm overflow-hidden text-ellipsis whitespace-nowrap">
                Giỏ hàng
              </span>
            </button>
          </div>
        </div>

        {/* Mobile search */}
        <div className="md:hidden px-4 pt-4">
          <form onSubmit={handleSearch} className="flex w-full border border-gray-300 rounded-lg overflow-hidden">
            <input
              type="text"
              placeholder="Hôm nay bạn muốn tìm gì nào?"
              className="flex-grow px-4 py-2 text-sm focus:outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              type="submit"
              className="flex items-center px-4 text-teal-600 hover:bg-teal-100 border-l border-teal-600 text-sm"
            >
              Tìm kiếm
            </button>
          </form>
        </div>

        {/* Desktop Navigation */}
        <div className="flex flex-col lg:flex-row justify-between items-center mt-4 grid grid-cols-3">
          <nav className="hidden lg:flex flex items-center space-x-8 col-span-1">
            {/* Category Menu Button */}
            <div className="relative">
              <button
                onClick={() => setShowCategoryMenu(!showCategoryMenu)}
                className="flex items-center space-x-2 bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors"
              >
                <MenuSquare size={20} />
                <span>Danh mục sản phẩm</span>
              </button>

              {/* Desktop Category Menu */}
              <CategoryMenu isOpen={showCategoryMenu} onClose={() => setShowCategoryMenu(false)} isDesktop={true} />
            </div>
          </nav>

          {/* Trending Keywords */}
          <div className="hidden lg:flex col-span-2 text-gray-600 text-sm gap-x-4 gap-y-1">
            <span className="text-teal-600 font-semibold">Từ khóa xu hướng</span>
            <span className="hover:text-teal-600 cursor-pointer">Gaming</span>
            <span className="hover:text-teal-600 cursor-pointer">iPhone 16</span>
            <span className="hover:text-teal-600 cursor-pointer">PC</span>
            <span className="hover:text-teal-600 cursor-pointer">Modem Wifi 6</span>
          </div>
        </div>
      </div>
    </header>
  );
}