import { useNotifications } from '../context/NotificationContext';
import { FaTrash, FaCheckDouble } from 'react-icons/fa';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

export default function NotificationsPage() {
  const { notifications, markAsRead, markAllAsRead, deleteNotification } = useNotifications();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm px-6 py-4 flex items-center gap-4">
        <button
          onClick={() => navigate('/dashboard')}
          className="text-blue-500 hover:text-blue-700"
        >
          ← Back
        </button>
        <h1 className="text-xl font-bold text-gray-800">🔔 Notifications</h1>
      </nav>

      <main className="max-w-3xl mx-auto p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-700">
            All Notifications ({notifications.length})
          </h2>
          <button
            onClick={markAllAsRead}
            className="flex items-center gap-2 text-blue-500 hover:text-blue-700 text-sm"
          >
            <FaCheckDouble size={14} />
            Mark all as read
          </button>
        </div>

        <div className="space-y-3">
          {notifications.length === 0 ? (
            <div className="bg-white rounded-xl p-8 text-center text-gray-400">
              No notifications yet 🔔
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                onClick={() => !notification.read && markAsRead(notification.id)}
                className={`bg-white rounded-xl p-5 shadow-sm cursor-pointer
                           hover:shadow-md transition-shadow
                           ${!notification.read ? 'border-l-4 border-blue-500' : ''}`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-gray-800">
                      {notification.title}
                    </p>
                    <p className="text-gray-600 text-sm mt-1">
                      {notification.message}
                    </p>
                    <p className="text-gray-400 text-xs mt-2">
                      {format(new Date(notification.createdAt), 'MMM dd, yyyy - HH:mm')}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    {!notification.read && (
                      <span className="text-xs bg-blue-100 text-blue-600
                                       px-2 py-1 rounded-full">
                        New
                      </span>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification(notification.id);
                      }}
                      className="text-red-400 hover:text-red-600"
                    >
                      <FaTrash size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}