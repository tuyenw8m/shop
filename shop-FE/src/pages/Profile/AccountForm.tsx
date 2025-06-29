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
  handleSaveProfile: () => Promise<void>;
  handleSaveEmail?: () => Promise<void>;
};

export default function AccountForm({
  editData,
  setEditData,
  error,
  isLoadingProfile,
  handleSaveProfile,
  handleSaveEmail,
}: AccountFormProps) {
  const [showEmailModal, setShowEmailModal] = useState(false);

  const handleEmailUpdate = async () => {
    if (handleSaveEmail) {
      try {
        await handleSaveEmail();
        setShowEmailModal(false);
      } catch (error) {
        // Error is handled in the parent component
        console.error('Email update failed:', error);
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Thông Tin Tài Khoản</h2>
          <p className="text-gray-600">Cập nhật thông tin cá nhân của bạn</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Họ và tên <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={editData.name}
              onChange={(e) => setEditData({ ...editData, name: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
              placeholder="Nhập họ và tên của bạn"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email <span className="text-red-500">*</span>
            </label>
            <div className="flex space-x-3">
              <input
                type="email"
                value={editData.email}
                onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
                placeholder="Nhập email của bạn"
                readOnly={!showEmailModal}
              />
              {handleSaveEmail && (
                <button
                  onClick={() => setShowEmailModal(true)}
                  className="px-6 py-3 bg-gradient-to-r from-green-400 to-green-600 text-white rounded-lg hover:from-green-500 hover:to-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-md"
                  disabled={isLoadingProfile}
                >
                  {isLoadingProfile ? 'Đang xử lý...' : 'Cập nhật'}
                </button>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Số điện thoại
            </label>
            <input
              type="tel"
              value={editData.phone}
              onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
              placeholder="Nhập số điện thoại"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Địa chỉ
            </label>
            <textarea
              value={editData.address}
              onChange={(e) => setEditData({ ...editData, address: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200 resize-none"
              placeholder="Nhập địa chỉ của bạn"
            />
          </div>

          <div className="flex justify-end pt-6 border-t border-gray-200">
            <button
              onClick={handleSaveProfile}
              className="px-8 py-3 bg-gradient-to-r from-green-400 to-green-600 text-white rounded-lg hover:from-green-500 hover:to-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-md"
              disabled={isLoadingProfile}
            >
              {isLoadingProfile ? (
                <div className="flex items-center space-x-2">
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Đang lưu...</span>
                </div>
              ) : (
                'Lưu thay đổi'
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Email Update Modal */}
      {showEmailModal && handleSaveEmail && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="ml-3 text-lg font-medium text-gray-900">Xác nhận cập nhật email</h3>
            </div>
            <p className="text-sm text-gray-600 mb-6">
              Bạn có chắc chắn muốn cập nhật email thành: <span className="font-medium text-gray-900">{editData.email}</span>?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowEmailModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                disabled={isLoadingProfile}
              >
                Hủy
              </button>
              <button
                onClick={handleEmailUpdate}
                className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-green-400 to-green-600 rounded-lg hover:from-green-500 hover:to-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200"
                disabled={isLoadingProfile}
              >
                {isLoadingProfile ? 'Đang xử lý...' : 'Xác nhận'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}