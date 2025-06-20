// src/pages/Login.tsx
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import LeftImage from '../leftimages/leftimages.jpg';
import type { AuthContextType } from '../contexts/AuthContext'; // ✅ Đúng



const schema = yup.object({
  email: yup.string().required('Vui lòng nhập email'),
  password: yup.string().min(6, 'Mật khẩu phải ít nhất 6 ký tự').required('Vui lòng nhập mật khẩu'),
});

type LoginForm = {
  email: string;
  password: string;
};

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({ resolver: yupResolver(schema) });

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useContext(AuthContext) as AuthContextType;

  const onSubmit = async (data: LoginForm) => {
  setLoading(true);
  setApiError(null);
  try {
    const response = await fetch('http://localhost:8888/shop/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Phản hồi từ server không hợp lệ!');
    }

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Đăng nhập thất bại!');
    }

    login(result.data.token, result.data.user); // Gọi AuthContext
    alert('✅ Đăng nhập thành công!');
    navigate('/');
 } catch (error: unknown) {
  const errorMessage = error instanceof Error ? error.message : 'Có lỗi xảy ra khi đăng nhập!';
  console.error('Lỗi:', error);
  setApiError(errorMessage);
}

};


  return (
    <div className="min-h-screen flex bg-[#E7E7E7]">
      <div className="flex-1 flex justify-center items-center">
        <div className="bg-white rounded-3xl border-4 border-[#EADCCF] max-w-6xl w-full min-h-[500px] flex shadow-lg">
          <div
            className="hidden md:block w-1/2 bg-cover bg-center"
            style={{ backgroundImage: `url(${LeftImage})` }}
          ></div>
          <div className="w-full md:w-1/2 p-6 flex flex-col justify-center items-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">ĐĂNG NHẬP</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full max-w-md">
              <input
                type="text"
                {...register('email')}
                placeholder="abcd@gmail.com"
                className="w-full px-5 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500 bg-gray-50 text-gray-700 placeholder-gray-400 transition-all duration-200"
              />
              {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}

              <input
                type={showPassword ? 'text' : 'password'}
                {...register('password')}
                placeholder="Mật khẩu"
                className="w-full px-5 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500 bg-gray-50 text-gray-700 placeholder-gray-400 transition-all duration-200"
              />
              {errors.password && (
                <span className="text-red-500 text-sm">{errors.password.message}</span>
              )}

              <div className="flex justify-between text-sm text-gray-600">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="mr-2 accent-teal-600"
                    onChange={() => setShowPassword(!showPassword)}
                  />
                  Hiển thị mật khẩu
                </label>
                <div>
                  <Link to="/forgot-password" className="text-teal-600 hover:underline">
                    Quên mật khẩu
                  </Link>
                  <span className="mx-2">|</span>
                  <Link to="/register" className="text-teal-600 hover:underline">
                    Đăng ký
                  </Link>
                </div>
              </div>

              {apiError && <div className="text-red-500 text-sm text-center">{apiError}</div>}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#1C2A37] text-white py-3 rounded-full hover:bg-teal-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
              </button>

              <button
                type="button"
               
                disabled={loading}
                className="w-full bg-red-600 text-white py-3 rounded-full hover:bg-red-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Đang xử lý...' : 'Đăng nhập bằng SĐT'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )}
