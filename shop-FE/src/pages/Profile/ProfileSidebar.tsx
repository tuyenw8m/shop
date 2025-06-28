import { type ProfileUser, type TabType } from './types';

interface ProfileSidebarProps {
  profileData: ProfileUser;
  activeTab: TabType;
  setActiveTab: React.Dispatch<React.SetStateAction<TabType>>;
}

export default function ProfileSidebar({ profileData, activeTab, setActiveTab }: ProfileSidebarProps) {
  const maskEmail = (email: string) => {
    const [name, domain] = email.split('@');
    if (name.length <= 2) return email;
    return `${name[0]}***@${domain}`;
  };

  return (
    <div className="w-1/5 bg-white p-4 shadow">
      <div className="flex flex-col items-center mb-6">
        <img
          src={profileData.avatar_url || '/path-to-avatar.jpg'}
          alt="Avatar"
          className="w-16 h-16 rounded-full mb-2 object-cover"
        />
        <span className="text-sm font-semibold text-gray-800">{profileData.name || 'Người dùng'}</span>
        <span className="text-xs text-gray-500">{maskEmail(profileData.email)}</span>
      </div>
      <ul className="space-y-4 text-sm">
        <li>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`flex items-center space-x-2 w-full text-left text-red-500 hover:text-red-700 ${activeTab === 'notifications' ? 'font-bold' : ''}`}
            aria-label="Xem thông báo"
          >
            <span>🔔</span>
            <span>Thông Báo</span>
          </button>
        </li>
        <li>
          <div className="flex items-center space-x-2 w-full text-left text-blue-500">
            <span>👤</span>
            <span>Tài Khoản Của Tôi</span>
          </div>
          <ul className="pl-6 space-y-2 mt-2">
            <li>
              <button
                onClick={() => setActiveTab('account')}
                className={`flex items-center space-x-2 w-full text-left text-blue-500 hover:text-blue-700 ${activeTab === 'account' ? 'font-bold' : ''}`}
                aria-label="Quản lý hồ sơ cá nhân"
              >
                <span>📝</span>
                <span>Hồ sơ</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab('bank')}
                className={`flex items-center space-x-2 w-full text-left text-blue-500 hover:text-blue-700 ${activeTab === 'bank' ? 'font-bold' : ''}`}
                aria-label="Quản lý hồ sơ ngân hàng"
              >
                <span>🏦</span>
                <span>Hồ sơ ngân hàng</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab('address')}
                className={`flex items-center space-x-2 w-full text-left text-blue-500 hover:text-blue-700 ${activeTab === 'address' ? 'font-bold' : ''}`}
                aria-label="Quản lý địa chỉ"
              >
                <span>📍</span>
                <span>Địa chỉ</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab('password')}
                className={`flex items-center space-x-2 w-full text-left text-blue-500 hover:text-blue-700 ${activeTab === 'password' ? 'font-bold' : ''}`}
                aria-label="Đổi mật khẩu"
              >
                <span>🔒</span>
                <span>Đổi mật khẩu</span>
              </button>
            </li>
          </ul>
        </li>
        <li>
          <button
            onClick={() => setActiveTab('purchase')}
            className={`flex items-center space-x-2 w-full text-left text-blue-500 hover:text-blue-700 ${activeTab === 'purchase' ? 'font-bold' : ''}`}
            aria-label="Xem đơn mua"
          >
            <span>📋</span>
            <span>Đơn Mua</span>
          </button>
        </li>
      </ul>
    </div>
  );
}