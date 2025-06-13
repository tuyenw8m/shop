// src/pages/Register.tsx
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Link } from 'react-router-dom';
import { type FormDataTypeRegister } from 'src/utils/rulesValidate';
import { schema } from 'src/utils/rulesValidate';
import LeftImage from '../leftimages/leftre.jpg';
import { useState } from 'react';

export default function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormDataTypeRegister>({
    resolver: yupResolver(schema),
  });
  const [apiError, setApiError] = useState<string | null>(null);

  const onSubmit = async (data: FormDataTypeRegister) => {
    setApiError(null);
    console.log('Dữ liệu gửi đi:', data);
    const { confirm_password, ...dataToSend } = data;
    try {
      const response = await fetch('http://localhost:8888/shop/api/v1/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Phản hồi từ server không hợp lệ!');
      }

      const result = await response.json();
      console.log('Phản hồi từ server:', result); // Log toàn bộ phản hồi

      if (!response.ok) {
        throw new Error(result.message || result.error || 'Đăng ký thất bại!');
      }

      console.log('Dữ liệu phản hồi thành công:', result);
      alert('✅ Đăng ký thành công!');
    } catch (error: any) {
      console.error('Lỗi chi tiết:', error);
      setApiError(error.message || 'Có lỗi xảy ra khi đăng ký!');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-cover bg-center bg-[#E7E7E7] overflow-hidden">
      <div className="flex-1 flex items-center justify-center w-full">
        <div className="bg-white rounded-3xl border-4 border-[#EADCCF] max-w-6xl w-full min-h-[500px] flex shadow-lg bg-gradient-to-br from-white to-gray-100 overflow-hidden animate-scaleIn">
          <div
            className="hidden md:block w-1/2 bg-cover bg-center"
            style={{ backgroundImage: `url(${LeftImage})` }}
          ></div>
          <div className="w-full md:w-1/2 p-6 flex flex-col justify-center items-center">
            <h2 className="text-center text-2xl font-bold text-gray-800 mb-6">ĐĂNG KÝ</h2>
            {apiError && (
              <div className="text-red-500 text-sm text-center mb-4">{apiError}</div>
            )}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full max-w-md" noValidate>
              <div>
                <input
                  type="text"
                  placeholder="Name"
                  className="w-full px-5 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500 bg-gray-50 text-gray-700 placeholder-gray-400 transition-all duration-200"
                  {...register('name')}
                />
                {errors?.name && (
                  <span className="text-red-500 text-sm block mt-1">{errors.name.message}</span>
                )}
              </div>
              <div>
                <input
                  type="email"
                  placeholder="abcd@gmail.com"
                  className="w-full px-5 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500 bg-gray-50 text-gray-700 placeholder-gray-400 transition-all duration-200"
                  {...register('email')}
                />
                {errors?.email && (
                  <span className="text-red-500 text-sm block mt-1">{errors.email.message}</span>
                )}
              </div>
              <div>
                <input
                  type="password"
                  placeholder="Mật khẩu"
                  className="w-full px-5 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500 bg-gray-50 text-gray-700 placeholder-gray-400 transition-all duration-200"
                  {...register('password')}
                />
                {errors?.password && (
                  <span className="text-red-500 text-sm block mt-1">{errors.password.message}</span>
                )}
              </div>
              <div>
                <input
                  type="password"
                  placeholder="Xác Nhận Mật Khẩu"
                  className="w-full px-5 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500 bg-gray-50 text-gray-700 placeholder-gray-400 transition-all duration-200"
                  {...register('confirm_password')}
                />
                {errors?.confirm_password && (
                  <span className="text-red-500 text-sm block mt-1">{errors.confirm_password.message}</span>
                )}
              </div>
              <div>
                <input
                  type="tel"
                  placeholder="Số điện thoại"
                  className="w-full px-5 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500 bg-gray-50 text-gray-700 placeholder-gray-400 transition-all duration-200"
                  {...register('phone')}
                />
                {errors?.phone && (
                  <span className="text-red-500 text-sm block mt-1">{errors.phone.message}</span>
                )}
              </div>
              <button
                type="submit"
                className="w-full bg-[#1C2A37] text-white py-3 rounded-full hover:bg-teal-700 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Đăng Ký
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}