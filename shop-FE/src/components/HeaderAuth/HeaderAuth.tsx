import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../pages/contexts/AuthContext';
import { CircleUserRound, HelpCircle } from 'lucide-react';
import type { AuthContextType } from '../../pages/contexts/AuthContext';

export default function HeaderAuth() {
  const { user, logout } = useContext(AuthContext) as AuthContextType;
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="py-4 bg-white shadow-md">
      <div className="max-w-screen-xl mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-teal-600 font-bold text-xl">STQ</span>
          <span className="text-teal-800 font-bold text-xl">MUABAN.COM</span>
        </Link>

        {/* Icons */}
        <div className="flex items-center space-x-4">
          {/* Tài khoản */}
          <div className="flex items-center">
            <Link
              to={user ? '/profile' : '/login'} // Điều hướng tới /profile khi đã đăng nhập
              className="flex items-center text-teal-600 hover:bg-teal-100 text-sm p-2 rounded cursor-pointer"
            >
              <CircleUserRound size={20} />
              <span className="ml-1">
                {user ? 'Tài khoản' : 'Đăng nhập'}
              </span>
            </Link>
            {user && (
              <button
                onClick={handleLogout}
                className="text-teal-600 hover:bg-teal-100 text-sm p-2 rounded cursor-pointer"
              >
                Đăng xuất
              </button>
            )}
          </div>

          {/* CSKH */}
          <Link
            to="/support"
            className="flex items-center text-teal-600 hover:bg-teal-100 text-sm p-2 rounded cursor-pointer"
          >
            <HelpCircle size={20} />
            <span className="ml-1">CSKH</span>
          </Link>
        </div>
      </div>
    </div>
  );
}