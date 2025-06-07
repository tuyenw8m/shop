import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Link } from 'react-router-dom';
import loginImage from '../Logo/logo.png';
import LeftImage from '../Logo/leftimages.jpg'; // Đảm bảo ảnh này tồn tại đúng vị trí

// Yup schema validation
const schema = yup.object({
  fullname: yup.string().required('Vui lòng nhập tên đăng nhập'),
  password: yup.string().min(6, 'Mật khẩu phải ít nhất 6 ký tự').required('Vui lòng nhập mật khẩu'),
});

type LoginForm = {
  fullname: string;
  password: string;
};

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data: LoginForm) => {
    console.log('Dữ liệu gửi:', data);
    alert('✅ Đăng nhập thành công!');
  };

  return (
    <div className="min-h-screen flex flex-col bg-cover bg-center bg-[#E7E7E7] overflow-hidden">
      {/* Header Section */}
      <header className="bg-teal-800 text-white p-4 flex items-center justify-between w-full">
        <div className="flex items-center">
          <img src={loginImage} alt="Logo" className="w-10 h-10 mr-2" />
          <span className="text-xl font-bold">STQ shop</span>
        </div>
        <div className="flex-1 mx-4"></div>
        <div className="flex space-x-4">
          <a href="#" className="hover:underline">
            Contact
          </a>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center w-full">
        <div className="bg-white rounded-3xl border-4 border-[#EADCCF] max-w-6xl w-full min-h-[500px] flex shadow-lg bg-gradient-to-br from-white to-gray-100 overflow-hidden animate-scaleIn">
          {/* Left Section (image) */}
          <div
            className="hidden md:block w-1/2 bg-cover bg-center"
            style={{ backgroundImage: `url(${LeftImage})` }}
          ></div>

          {/* Right Section (form) */}
          <div className="w-full md:w-1/2 p-6 flex flex-col justify-center items-center">
            <h2 className="text-center text-2xl font-bold text-gray-800 mb-6">ĐĂNG NHẬP</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full max-w-md">
              <div>
                <input
                  type="text"
                  {...register('fullname')}
                  placeholder="Tên đăng nhập"
                  className="w-full px-5 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500 bg-gray-50 text-gray-700 placeholder-gray-400 transition-all duration-200"
                />
                {errors.fullname && (
                  <span className="text-red-500 text-sm block mt-1">{errors.fullname.message}</span>
                )}
              </div>

              <div>
                <input
                  type="password"
                  {...register('password')}
                  placeholder="Mật khẩu"
                  className="w-full px-5 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500 bg-gray-50 text-gray-700 placeholder-gray-400 transition-all duration-200"
                />
                {errors.password && (
                  <span className="text-red-500 text-sm block mt-1">{errors.password.message}</span>
                )}
              </div>

              <div className="flex justify-between items-center text-sm text-gray-600">
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2 accent-teal-600" /> Hiển thị mật khẩu
                </label>
                <div className="flex space-x-2">
                  <Link to="/forgot-password" className="text-teal-600 hover:underline">
                    Quên mật khẩu
                  </Link>
                  <span>|</span>
                  <Link to="/register" className="text-teal-600 hover:underline">
                    Đăng ký
                  </Link>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#1C2A37] text-white py-3 rounded-full hover:bg-teal-700 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Đăng nhập
              </button>

              <button
                type="button"
                className="w-full bg-red-600 text-white py-3 rounded-full hover:bg-red-700 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Đăng nhập qua Gmail
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
