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
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white/90 p-6 rounded-lg shadow-xl w-full max-w-md border border-gray-200">
        <h2 className="text-xl font-bold mb-4">Xác nhận đơn hàng</h2>
        
        {successMessage && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-green-700 font-medium">{successMessage}</span>
            </div>
          </div>
        )}
        
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
    </div>
  );
} 