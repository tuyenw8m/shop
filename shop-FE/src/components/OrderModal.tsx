import React from 'react';

interface OrderModalProps {
  user: {
    name: string;
    email: string;
    phone?: string;
    address?: string;
  };
  product: {
    id: string;
    name: string;
    price: number;
    image_url?: string[];
  };
  onConfirm: () => void;
  onClose: () => void;
  error?: string | null;
  successMessage?: string;
}

export default function OrderModal({ user, product, onConfirm, onClose, error, successMessage }: OrderModalProps) {
  return (
    <div className="fixed inset-0 bg-white bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Xác nhận đơn hàng</h2>
        <div className="flex gap-4 mb-4">
          <img src={product.image_url?.[0] || '/placeholder.svg'} alt={product.name} className="w-20 h-20 object-cover rounded" />
          <div>
            <div><b>Sản phẩm:</b> {product.name}</div>
            <div><b>Giá:</b> {product.price.toLocaleString()}₫</div>
          </div>
        </div>
        <div className="mb-4">
          <div><b>Tên:</b> {user.name}</div>
          <div><b>Email:</b> {user.email}</div>
          <div><b>SĐT:</b> {user.phone || <span className="text-red-500">Chưa cập nhật</span>}</div>
          <div><b>Địa chỉ:</b> {user.address || <span className="text-red-500">Chưa cập nhật</span>}</div>
        </div>
        {error && <div className="text-red-500 mb-2">{error}</div>}
        <div className="flex justify-end gap-2 mt-6">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">Hủy</button>
          <button onClick={onConfirm} className="px-4 py-2 bg-green-500 text-white rounded">Xác nhận đặt hàng</button>
        </div>
      </div>
      {successMessage && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-green-100 text-green-700 px-6 py-2 rounded shadow z-50 transition-all duration-300">
          {successMessage}
        </div>
      )}
    </div>
  );
} 