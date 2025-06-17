import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

export default function Profile() {
  const { user } = useContext(AuthContext);

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-8">
      <h1>Hồ sơ người dùng</h1>
      <p>Tên: {user?.name || 'Không có thông tin'}</p>
      <p>Email: Chưa có thông tin</p>
      {/* Thêm các thông tin khác nếu cần */}
    </div>
  );
}