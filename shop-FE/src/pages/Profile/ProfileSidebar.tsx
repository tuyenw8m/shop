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

  const getTabIcon = (tab: TabType) => {
    switch (tab) {
      case 'notifications':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.19 4.19A2 2 0 004 6v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-1.81 1.19z" />
          </svg>
        );
      case 'account':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        );
      case 'bank':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
        );
      case 'address':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        );
      case 'password':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        );
      case 'purchase':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full lg:w-80 bg-white shadow-lg">
      {/* User Profile Header */}
      <div className="p-4 lg:p-6 border-b border-gray-200">
        <div className="flex flex-col items-center">
          <h3 className="text-lg font-semibold text-gray-900">{profileData.name || 'Người dùng'}</h3>
          <p className="text-sm text-gray-500">{maskEmail(profileData.email)}</p>
          <div className="mt-2 px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
            Thành viên
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="p-2 lg:p-4">
        <div className="space-y-1 lg:space-y-2">
          {/* Notifications */}
          <button
            onClick={() => setActiveTab('notifications')}
            className={`w-full flex items-center space-x-2 lg:space-x-3 px-3 lg:px-4 py-2 lg:py-3 rounded-lg transition-colors duration-200 text-sm lg:text-base ${
              activeTab === 'notifications'
                ? 'bg-green-50 text-green-700 border border-green-200'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            {getTabIcon('notifications')}
            <span className="font-medium">Thông Báo</span>
            <div className="ml-auto w-2 h-2 bg-red-500 rounded-full"></div>
          </button>

          {/* Account Management Section */}
          <div className="pt-2 lg:pt-4">
            <h4 className="px-3 lg:px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 lg:mb-2">
              Tài Khoản Của Tôi
            </h4>
            <div className="space-y-1">
              <button
                onClick={() => setActiveTab('account')}
                className={`w-full flex items-center space-x-2 lg:space-x-3 px-3 lg:px-4 py-2 lg:py-3 rounded-lg transition-colors duration-200 text-sm lg:text-base ${
                  activeTab === 'account'
                    ? 'bg-green-50 text-green-700 border border-green-200'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {getTabIcon('account')}
                <span className="font-medium">Hồ sơ</span>
              </button>

              <button
                onClick={() => setActiveTab('bank')}
                className={`w-full flex items-center space-x-2 lg:space-x-3 px-3 lg:px-4 py-2 lg:py-3 rounded-lg transition-colors duration-200 text-sm lg:text-base ${
                  activeTab === 'bank'
                    ? 'bg-green-50 text-green-700 border border-green-200'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {getTabIcon('bank')}
                <span className="font-medium">Hồ sơ ngân hàng</span>
              </button>

              <button
                onClick={() => setActiveTab('address')}
                className={`w-full flex items-center space-x-2 lg:space-x-3 px-3 lg:px-4 py-2 lg:py-3 rounded-lg transition-colors duration-200 text-sm lg:text-base ${
                  activeTab === 'address'
                    ? 'bg-green-50 text-green-700 border border-green-200'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {getTabIcon('address')}
                <span className="font-medium">Địa chỉ</span>
              </button>

              <button
                onClick={() => setActiveTab('password')}
                className={`w-full flex items-center space-x-2 lg:space-x-3 px-3 lg:px-4 py-2 lg:py-3 rounded-lg transition-colors duration-200 text-sm lg:text-base ${
                  activeTab === 'password'
                    ? 'bg-green-50 text-green-700 border border-green-200'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {getTabIcon('password')}
                <span className="font-medium">Đổi mật khẩu</span>
              </button>
            </div>
          </div>

          {/* Orders Section */}
          <div className="pt-2 lg:pt-4">
            <h4 className="px-3 lg:px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 lg:mb-2">
              Đơn Hàng
            </h4>
            <button
              onClick={() => setActiveTab('purchase')}
              className={`w-full flex items-center space-x-2 lg:space-x-3 px-3 lg:px-4 py-2 lg:py-3 rounded-lg transition-colors duration-200 text-sm lg:text-base ${
                activeTab === 'purchase'
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              {getTabIcon('purchase')}
              <span className="font-medium">Đơn mua</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Quick Stats */}
      <div className="p-2 lg:p-4 border-t border-gray-200">
        <div className="grid grid-cols-2 gap-2 lg:gap-4">
          <div className="text-center p-2 lg:p-3 bg-gray-50 rounded-lg">
            <div className="text-sm lg:text-lg font-semibold text-gray-900">0</div>
            <div className="text-xs text-gray-500">Đơn hàng</div>
          </div>
          <div className="text-center p-2 lg:p-3 bg-gray-50 rounded-lg">
            <div className="text-sm lg:text-lg font-semibold text-gray-900">0</div>
            <div className="text-xs text-gray-500">Đánh giá</div>
          </div>
        </div>
      </div>
    </div>
  );
}