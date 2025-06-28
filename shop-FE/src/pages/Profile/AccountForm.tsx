import { useState } from 'react';

type AccountFormProps = {
  editData: { name: string; email: string; address: string; phone: string };
  setEditData: React.Dispatch<React.SetStateAction<{
    name: string;
    email: string;
    address: string;
    phone: string;
  }>>;
  error: string | null;
  isLoadingProfile: boolean;
  isLoadingEmail: boolean;
  handleSaveProfile: () => Promise<void>;
  handleSaveEmail: () => Promise<void>;
};

export default function AccountForm({
  editData,
  setEditData,
  error,
  isLoadingProfile,
  isLoadingEmail,
  handleSaveProfile,
  handleSaveEmail,
}: AccountFormProps) {
  const [showEmailModal, setShowEmailModal] = useState(false);

  const handleEmailUpdate = async () => {
    try {
      await handleSaveEmail();
      setShowEmailModal(false);
    } catch (error) {
      // Error is handled in the parent component
      console.error('Email update failed:', error);
    }
  };

  return (
    <div className="space-y-6">
      {error && <div className="text-red-600 text-sm">{error}</div>}
      <div className="flex items-center space-x-4">
        <label className="w-32 text-sm font-medium text-gray-700">Tên</label>
        <input
          type="text"
          value={editData.name}
          onChange={(e) => setEditData({ ...editData, name: e.target.value })}
          className="flex-1 p-2 border rounded text-sm text-gray-700 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Nhập tên của bạn"
        />
      </div>
      <div className="flex items-center space-x-4">
        <label className="w-32 text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          value={editData.email}
          onChange={(e) => setEditData({ ...editData, email: e.target.value })}
          className="flex-1 p-2 border rounded text-sm text-gray-700 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Nhập email của bạn"
          readOnly={!showEmailModal}
        />
        <button
          onClick={() => setShowEmailModal(true)}
          className="px-4 py-2 text-sm text-white bg-green-700 rounded hover:bg-green-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
          disabled={isLoadingEmail}
        >
          {isLoadingEmail ? 'Đang xử lý...' : 'Cập nhật email'}
        </button>
      </div>
      {showEmailModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900">Xác nhận cập nhật email</h3>
            <p className="mt-2 text-sm text-gray-600">Bạn có chắc chắn muốn cập nhật email thành: {editData.email}?</p>
            <div className="mt-4 flex justify-end space-x-4">
              <button
                onClick={() => setShowEmailModal(false)}
                className="px-4 py-2 text-sm text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
                disabled={isLoadingEmail}
              >
                Hủy
              </button>
              <button
                onClick={handleEmailUpdate}
                className="px-4 py-2 text-sm text-white bg-green-700 rounded hover:bg-green-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
                disabled={isLoadingEmail}
              >
                {isLoadingEmail ? 'Đang xử lý...' : 'Xác nhận'}
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="flex items-center space-x-4">
        <label className="w-32 text-sm font-medium text-gray-700">Số điện thoại</label>
        <input
          type="tel"
          value={editData.phone}
          onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
          className="flex-1 p-2 border rounded text-sm text-gray-700 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Nhập số điện thoại"
        />
      </div>
      <div className="flex items-center space-x-4">
        <label className="w-32 text-sm font-medium text-gray-700">Địa chỉ</label>
        <input
          type="text"
          value={editData.address}
          onChange={(e) => setEditData({ ...editData, address: e.target.value })}
          className="flex-1 p-2 border rounded text-sm text-gray-700 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Nhập địa chỉ của bạn"
        />
      </div>
      <div className="flex justify-end">
        <button
          onClick={handleSaveProfile}
          className="px-6 py-2 text-sm text-white bg-green-700 rounded hover:bg-green-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
          disabled={isLoadingProfile}
        >
          {isLoadingProfile ? 'Đang lưu...' : 'Lưu'}
        </button>
      </div>
    </div>
  );
}