import React from 'react';

interface ConfirmCancelModalProps {
  onConfirm: () => void;
  onClose: () => void;
  productName?: string;
  productImage?: string;
}

export default function ConfirmCancelModal({ onConfirm, onClose, productName, productImage }: ConfirmCancelModalProps) {
  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white/90 p-6 rounded-lg shadow-xl w-full max-w-md border border-gray-200">
        <h2 className="text-xl font-bold mb-4">Xác nhận hủy đơn hàng</h2>
        <div className="flex gap-4 mb-4 items-center">
          <img src={productImage || '/placeholder.svg'} alt={productName || 'Sản phẩm'} className="w-20 h-20 object-cover rounded" />
          <div>
            <div><b>Sản phẩm:</b> {productName || 'Không xác định'}</div>
          </div>
        </div>
        <div className="mb-4 text-red-600 font-medium">Bạn có chắc chắn muốn hủy đơn hàng này không?</div>
        <div className="flex justify-end gap-2 mt-6">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">Đóng</button>
          <button onClick={onConfirm} className="px-4 py-2 bg-red-500 text-white rounded">Xác nhận hủy</button>
        </div>
      </div>
    </div>
  );
} 