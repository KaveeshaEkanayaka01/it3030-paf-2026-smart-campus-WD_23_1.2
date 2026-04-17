import { useNotifications } from '../../context/NotificationContext';
import { FaTimes, FaTrash, FaCheckDouble } from 'react-icons/fa';
import { format } from 'date-fns';

export default function NotificationPanel({ onClose }) {
  const { notifications, markAsRead, markAllAsRead, deleteNotification } = useNotifications();

  return (
    <div className="absolute right-0 top-12 w-80 bg-white rounded-xl shadow-xl
                    border border-gray-200 z-50 max-h-96 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white">
        <h3 className="font-semibold text-gray-800">Notifications</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={markAllAsRead}
            className="text-blue-500 hover:text-blue-700 text-xs flex items-center gap-1"
          >
            <FaCheckDouble size={12} /> All read
          </button>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <FaTimes size={16} />
          </button>
        </div>
      </div>

      {/* Notification List */}
      {notifications.length === 0 ? (
        <div className="p-6 text-center text-gray-400">
          No notifications yet 🔔
        </div>
      ) : (
        notifications.map((notification) => (
          <div
            key={notification.id}
            onClick={() => !notification.read && markAsRead(notification.id)}
            className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors
                       ${!notification.read ? 'bg-blue-50' : ''}`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <p className="font-medium text-sm text-gray-800">
                  {notification.title}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {notification.message}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {format(new Date(notification.createdAt), 'MMM dd, HH:mm')}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {!notification.read && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteNotification(notification.id);
                  }}
                  className="text-red-400 hover:text-red-600"
                >
                  <FaTrash size={12} />
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}