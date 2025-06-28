import { Notification } from './types';

interface NotificationsTabProps {
  notifications: Notification[];
}

export default function NotificationsTab({ notifications }: NotificationsTabProps) {
  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Thông Báo</h2>
      {notifications.length > 0 ? (
        <ul className="space-y-4">
          {notifications.map((notif) => (
            <li
              key={notif.id}
              className={`p-4 rounded-lg ${
                notif.read ? 'bg-gray-100 text-gray-600' : 'bg-orange-50 text-gray-800 font-medium'
              } transition-colors duration-200`}
            >
              {notif.message}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 text-center py-4">Không có thông báo nào.</p>
      )}
    </div>
  );
}