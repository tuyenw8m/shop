interface PasswordFormProps {
  passwordData: { currentPassword: string; newPassword: string; confirmPassword: string };
  setPasswordData: (data: { currentPassword: string; newPassword: string; confirmPassword: string }) => void;
  passwordError: string | null;
  isLoadingPassword: boolean;
  handleChangePassword: () => void;
  successMessage?: string | null;
}

export default function PasswordForm({ passwordData, setPasswordData, passwordError, isLoadingPassword, handleChangePassword, successMessage }: PasswordFormProps) {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Đổi Mật Khẩu</h2>
          <p className="text-gray-600">Cập nhật mật khẩu để tăng cường bảo mật tài khoản</p>
        </div>

        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-800">{successMessage}</p>
              </div>
            </div>
          </div>
        )}

        {passwordError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-800">{passwordError}</p>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-6">
          <div>
            <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-2">
              Mật khẩu hiện tại <span className="text-red-500">*</span>
            </label>
            <input
              id="currentPassword"
              type="password"
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
              placeholder="Nhập mật khẩu hiện tại"
            />
          </div>

          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
              Mật khẩu mới <span className="text-red-500">*</span>
            </label>
            <input
              id="newPassword"
              type="password"
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
              placeholder="Nhập mật khẩu mới (tối thiểu 8 ký tự)"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
              Xác nhận mật khẩu mới <span className="text-red-500">*</span>
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
              placeholder="Nhập lại mật khẩu mới"
            />
          </div>

          <div className="flex justify-end pt-6 border-t border-gray-200">
            <button
              onClick={handleChangePassword}
              className="px-8 py-3 bg-gradient-to-r from-green-400 to-green-600 text-white rounded-lg hover:from-green-500 hover:to-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-md"
              disabled={isLoadingPassword}
            >
              {isLoadingPassword ? (
                <div className="flex items-center space-x-2">
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Đang xử lý...</span>
                </div>
              ) : (
                'Cập nhật mật khẩu'
              )}
            </button>
          </div>
        </div>

        {/* Security Tips */}
        <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">Lưu ý bảo mật</h3>
              <div className="mt-2 text-sm text-yellow-700">
                <ul className="list-disc list-inside space-y-1">
                  <li>Mật khẩu phải có ít nhất 8 ký tự</li>
                  <li>Nên sử dụng kết hợp chữ hoa, chữ thường, số và ký tự đặc biệt</li>
                  <li>Không sử dụng thông tin cá nhân dễ đoán</li>
                  <li>Không chia sẻ mật khẩu với người khác</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}