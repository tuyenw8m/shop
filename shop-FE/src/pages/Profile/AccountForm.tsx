import { ProfileUser } from './types';

interface AccountFormProps {
  editData: { name: string; email: string; gender: string; birthDate: string; address: string; avatar: File | null };
  setEditData: (data: { name: string; email: string; gender: string; birthDate: string; address: string; avatar: File | null }) => void;
  avatarPreview: string | null;
  setAvatarPreview: (preview: string | null) => void;
  profileData: ProfileUser;
  error: string | null;
  isLoadingProfile: boolean;
  isLoadingEmail: boolean;
  handleSaveProfile: () => void;
  handleSaveEmail: () => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function AccountForm({
  editData,
  setEditData,
  avatarPreview,
  setAvatarPreview,
  profileData,
  error,
  isLoadingProfile,
  isLoadingEmail,
  handleSaveProfile,
  handleSaveEmail,
  handleFileChange,
}: AccountFormProps) {
  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Hồ Sơ</h2>
      <p className="text-sm text-gray-500 mb-6">Quản lý thông tin hồ sơ để bảo mật tài khoản</p>
      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg border border-red-200">{error}</div>
      )}
      <div className="space-y-6 max-w-lg">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Tên</label>
          <input
            id="name"
            type="text"
            value={editData.name}
            onChange={(e) => setEditData({ ...editData, name: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <div className="flex gap-2">
            <input
              id="email"
              type="email"
              value={editData.email}
              onChange={(e) => setEditData({ ...editData, email: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200"
            />
            <button
              onClick={handleSaveEmail}
              className="px-4 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:bg-orange-300 transition-colors duration-200"
              disabled={isLoadingEmail}
            >
              {isLoadingEmail ? 'Đang xử lý...' : 'Cập nhật'}
            </button>
          </div>
          <p className="mt-2 text-xs text-gray-500">Cập nhật email yêu cầu xác minh qua hộp thư.</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Giới tính</label>
          <div className="flex gap-4">
            {['Nam', 'Nữ', 'Khác'].map((gender) => (
              <label key={gender} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="gender"
                  value={gender}
                  checked={editData.gender === gender}
                  onChange={(e) => setEditData({ ...editData, gender: e.target.value })}
                  className="h-4 w-4 text-orange-500 focus:ring-orange-500"
                />
                {gender}
              </label>
            ))}
          </div>
        </div>
        <div>
          <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700 mb-2">Ngày sinh</label>
          <input
            id="birthDate"
            type="date"
            value={editData.birthDate}
            onChange={(e) => setEditData({ ...editData, birthDate: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200"
            max={new Date().toISOString().split('T')[0]}
          />
        </div>
        <div>
          <label htmlFor="avatarUpload" className="block text-sm font-medium text-gray-700 mb-2">Ảnh đại diện</label>
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
              {avatarPreview || profileData.avatar_url ? (
                <img
                  src={avatarPreview || profileData.avatar_url}
                  alt="Avatar Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-2xl text-gray-500">{profileData.name?.[0]?.toUpperCase() || 'U'}</span>
              )}
            </div>
            <div>
              <input
                type="file"
                accept="image/jpeg,image/png"
                onChange={handleFileChange}
                className="hidden"
                id="avatarUpload"
              />
              <label
                htmlFor="avatarUpload"
                className="inline-block px-4 py-2 bg-orange-500 text-white rounded-lg cursor-pointer hover:bg-orange-600 transition-colors duration-200"
              >
                Chọn Ảnh
              </label>
              <p className="mt-2 text-xs text-gray-500">Dung lượng file tối đa 1MB. Định dạng: .JPEG, .PNG</p>
            </div>
          </div>
        </div>
        <button
          onClick={handleSaveProfile}
          className="w-full py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:bg-orange-300 transition-colors duration-200"
          disabled={isLoadingProfile}
        >
          {isLoadingProfile ? 'Đang lưu...' : 'Lưu'}
        </button>
      </div>
    </div>
  );
}