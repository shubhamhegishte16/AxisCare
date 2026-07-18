import React, { useState } from 'react';
import { Bell, ShieldAlert, AlertTriangle, FileBarChart, Settings2, CheckCheck } from 'lucide-react';
import AdminLayout from './AdminLayout';
import { PageHeader, Card, EmptyState } from './UI';
import { notifications as mockNotifications } from './mockData';

const iconFor = (type) => {
  switch (type) {
    case 'Approval': return ShieldAlert;
    case 'Alert': return AlertTriangle;
    case 'Report': return FileBarChart;
    default: return Settings2;
  }
};

const AdminNotifications = () => {
  const [notifications, setNotifications] = useState(mockNotifications);

  const markAllRead = () => setNotifications((prev) => prev.map((n) => ({ ...n, status: 'Read' })));
  const markRead = (id) => setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, status: 'Read' } : n)));

  const unreadCount = notifications.filter((n) => n.status === 'Unread').length;

  return (
    <AdminLayout>
      <PageHeader
        title="Notifications"
        subtitle={`${unreadCount} unread notification${unreadCount === 1 ? '' : 's'}`}
        action={
          <button onClick={markAllRead} className="flex items-center gap-2 border border-gray-200 text-gray-600 text-sm font-semibold px-4 py-2.5 rounded-lg hover:bg-gray-50">
            <CheckCheck className="w-4 h-4" /> Mark all as read
          </button>
        }
      />

      <Card>
        <div className="divide-y divide-gray-50">
          {notifications.map((n) => {
            const Icon = iconFor(n.type);
            return (
              <div key={n.id} className={`flex items-start gap-3 py-4 ${n.status === 'Unread' ? 'bg-blue-50/30 -mx-5 px-5' : ''}`}>
                <span className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${n.status === 'Unread' ? 'bg-blue-100' : 'bg-gray-100'}`}>
                  <Icon className={`w-4.5 h-4.5 ${n.status === 'Unread' ? 'text-blue-600' : 'text-gray-400'}`} />
                </span>
                <div className="flex-1">
                  <p className="text-sm text-gray-800">{n.text}</p>
                  <p className="text-xs text-gray-400 mt-1">{n.time}</p>
                </div>
                {n.status === 'Unread' && (
                  <button onClick={() => markRead(n.id)} className="text-blue-600 text-xs font-semibold hover:underline shrink-0">
                    Mark read
                  </button>
                )}
              </div>
            );
          })}
        </div>
        {notifications.length === 0 && <EmptyState text="No notifications yet." />}
      </Card>
    </AdminLayout>
  );
};

export default AdminNotifications;
