// src/components/testCall.tsx
import { useAuth } from '../pages/contexts/AuthContext';
import { useEffect } from 'react';

export default function testCall() {
  const { user } = useAuth();

  const fetchtestCall = async () => {
    if (!user) {
      alert('Vui lòng đăng nhập!');
      return;
    }

    try {
      const response = await fetch('http://localhost:8888/shop/api/v1/private-data', {
        headers: {
          'Authorization': `Bearer ${user.token}`,
        },
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || 'Lỗi khi gọi API!');
      }
      console.log('Dữ liệu riêng tư:', result);
      alert('Dữ liệu riêng tư: ' + JSON.stringify(result));
    } catch (error: any) {
      console.error('Lỗi chi tiết:', error);
      alert(error.message);
    }
  };

  return (
    <div>
      {user ? (
        <>
          <p>Chào {user.name || user.email}!</p>
          <button onClick={fetchtestCall} className="px-4 py-2 bg-blue-500 text-white rounded">
            Lấy dữ liệu riêng tư
          </button>
        </>
      ) : (
        <p>Vui lòng đăng nhập để xem nội dung này.</p>
      )}
    </div>
  );
}