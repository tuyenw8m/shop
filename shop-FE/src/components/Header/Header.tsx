import loginImage from '../logoshop/logo.png';

interface HeaderProps {
  isProductPage?: boolean;
}

export default function Header({ isProductPage = false }: HeaderProps) {
  return (
    <header className="bg-teal-800 text-white p-4 flex items-center justify-between w-full">
      <div className="flex items-center">
        <img src={loginImage} alt="Logo" className="w-10 h-10 mr-2" />
        <span className="text-xl font-bold">STQ shop</span>
      </div>
      {isProductPage && (
        <>
          <div className="flex-1 mx-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                className="w-full p-2 rounded-full text-black bg-white"
              />
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-yellow-500 text-white p-2 rounded-full">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1116.65 5.65 7.5 7.5 0 1116.65 16.65z"
                  />
                </svg>
              </button>
            </div>
          </div>
          <div className="flex space-x-4">
            <a href="#" className="hover:underline">Trang chủ</a>
            <a href="#" className="hover:underline">Liên hệ</a>
          </div>
        </>
      )}
    </header>
  );
}