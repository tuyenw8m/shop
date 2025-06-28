interface PasswordFormProps {
  passwordData: { currentPassword: string; newPassword: string; confirmPassword: string };
  setPasswordData: (data: { currentPassword: string; newPassword: string; confirmPassword: string }) => void;
  passwordError: string | null;
  isLoadingPassword: boolean;
  handleChangePassword: () => void;
}

export default function PasswordForm({ passwordData, setPasswordData, passwordError, isLoadingPassword, handleChangePassword }: PasswordFormProps) {
  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Đổi Mật Khẩu</h2>
      <p className="text-sm text-gray-500 mb-6">Đổi mật khẩu để tăng cường bảo mật tài khoản</p>
      {passwordError && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg border border-red-200">{passwordError}</div>
      )}
      <div className="space-y-6 max-w-lg">
        <div>
          <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-2">Mật khẩu hiện tại</label>
          <input
            id="currentPassword"
            type="password"
            value={passwordData.currentPassword}
            onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200"
          />
        </div>
        <div>
          <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">Mật khẩu mới</label>
          <input
            id="newPassword"
            type="password"
            value={passwordData.newPassword}
            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200"
          />
        </div>
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">Xác nhận mật khẩu mới</label>
          <input
            id="confirmPassword"
            type="password"
            value={passwordData.confirmPassword}
            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200"
          />
        </div>
        <button
          onClick={handleChangePassword}
          className="w-full py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:bg-orange-300 transition-colors duration-200"
          disabled={isLoadingPassword}
        >
          {isLoadingPassword ? 'Đang xử lý...' : 'Lưu'}
        </button>
      </div>
    </div>
  );
}