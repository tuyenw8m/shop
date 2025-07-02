type AccountFormProps = {
  editData: { name: string; email: string; phone: string };
  setEditData: React.Dispatch<React.SetStateAction<{
    name: string;
    email: string;
    phone: string;
  }>>;
  error: string | null;
  isLoadingProfile: boolean;
  handleSaveProfile: () => Promise<void>;
  successMessage?: string | null;
};

export default function AccountForm({
  editData,
  setEditData,
  error,
  isLoadingProfile,
  handleSaveProfile,
  successMessage,
}: AccountFormProps) {
  // Tạo email ẩn dạng **
  const maskEmail = (email: string) => {
    if (!email) return '';
    const [localPart, domain] = email.split('@');
    if (!domain) return email;
    
    const maskedLocal = localPart.length > 2 
      ? localPart.charAt(0) + '*'.repeat(localPart.length - 2) + localPart.charAt(localPart.length - 1)
      : localPart;
    
    return `${maskedLocal}@${domain}`;
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-4 lg:p-8">
        <div className="mb-6 lg:mb-8">
          <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2">Thông Tin Tài Khoản</h2>
          <p className="text-sm lg:text-base text-gray-600">Cập nhật thông tin cá nhân của bạn</p>
        </div>

        {error && (
          <div className="mb-4 lg:mb-6 p-3 lg:p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-4 w-4 lg:h-5 lg:w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-xs lg:text-sm text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        {successMessage && (
          <div className="mb-4 lg:mb-6 p-3 lg:p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center">
              <svg className="h-4 w-4 lg:h-5 lg:w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="ml-2 text-green-800 text-xs lg:text-sm font-medium">{successMessage}</span>
            </div>
          </div>
        )}

        <div className="space-y-4 lg:space-y-6">
          <div>
            <label className="block text-xs lg:text-sm font-medium text-gray-700 mb-2">
              Họ và tên <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={editData.name}
              onChange={(e) => setEditData({ ...editData, name: e.target.value })}
              className="w-full px-3 lg:px-4 py-2 lg:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200 text-sm lg:text-base"
              placeholder="Nhập họ và tên của bạn"
            />
          </div>

          <div>
            <label className="block text-xs lg:text-sm font-medium text-gray-700 mb-2">
              Email <span className="text-gray-500 text-xs">(Chỉ hiển thị)</span>
            </label>
            <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-3 space-y-2 lg:space-y-0">
              <input
                type="text"
                value={maskEmail(editData.email)}
                className="flex-1 px-3 lg:px-4 py-2 lg:py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed text-sm lg:text-base"
                placeholder="Email của bạn"
                readOnly
                disabled
              />
              <div className="flex items-center text-xs text-gray-500 bg-gray-100 px-2 lg:px-3 py-2 lg:py-3 rounded-lg">
                <svg className="w-3 h-3 lg:w-4 lg:h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                Bảo mật
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Email được bảo vệ để đảm bảo an toàn tài khoản. Liên hệ admin nếu cần thay đổi.
            </p>
          </div>

          <div>
            <label className="block text-xs lg:text-sm font-medium text-gray-700 mb-2">
              Số điện thoại
            </label>
            <input
              type="tel"
              value={editData.phone}
              onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
              className="w-full px-3 lg:px-4 py-2 lg:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200 text-sm lg:text-base"
              placeholder="Nhập số điện thoại"
            />
          </div>

          <div className="flex justify-end pt-4 lg:pt-6 border-t border-gray-200">
            <button
              onClick={handleSaveProfile}
              className="w-full lg:w-auto px-6 lg:px-8 py-2 lg:py-3 bg-gradient-to-r from-green-400 to-green-600 text-white rounded-lg hover:from-green-500 hover:to-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-md text-sm lg:text-base"
              disabled={isLoadingProfile}
            >
              {isLoadingProfile ? (
                <div className="flex items-center justify-center lg:justify-start space-x-2">
                  <svg className="animate-spin h-3 w-3 lg:h-4 lg:w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
    </div>
  );
}