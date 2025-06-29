import type { Notification } from './types';

interface NotificationsTabProps {
  notifications: Notification[];
}

export default function NotificationsTab({ notifications }: NotificationsTabProps) {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Thông Báo</h2>
          <p className="text-gray-600">Xem tất cả thông báo và cập nhật từ hệ thống</p>
        </div>

        {notifications.length > 0 ? (
          <div className="space-y-4">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                className={`p-4 rounded-lg border transition-all duration-200 ${
                  notif.read 
                    ? 'bg-gray-50 border-gray-200 text-gray-600' 
                    : 'bg-orange-50 border-orange-200 text-gray-800 shadow-sm'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className={`flex-shrink-0 w-2 h-2 rounded-full mt-2 ${
                    notif.read ? 'bg-gray-400' : 'bg-green-500'
                  }`}></div>
                  <div className="flex-1">
                    <p className="text-sm leading-relaxed">{notif.message}</p>
                    {notif.created_at && (
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(notif.created_at).toLocaleString('vi-VN')}
                      </p>
                    )}
                  </div>
                  {!notif.read && (
                    <div className="flex-shrink-0">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                        Mới
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.19 4.19A2 2 0 004 6v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-1.81 1.19z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Không có thông báo</h3>
            <p className="text-gray-500">Bạn sẽ nhận được thông báo khi có cập nhật mới</p>
          </div>
        )}

        {notifications.length > 0 && (
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-500">
                Hiển thị {notifications.length} thông báo
              </p>
              <button className="text-sm text-orange-600 hover:text-orange-700 font-medium">
                Đánh dấu tất cả đã đọc
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}