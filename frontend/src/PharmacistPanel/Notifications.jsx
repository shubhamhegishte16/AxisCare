import React, { useEffect, useState, useCallback } from 'react';
import { Bell, PackagePlus, AlertTriangle, Truck, CalendarClock, Receipt, CheckCheck } from 'lucide-react';
import PharmacyNavbar from './PharmacyNavbar';
import { PageHeader, Card, EmptyState } from './UI';
import { pharmacyService } from '../services/pharmacyService';

const typeIcon = {
  'New Prescription': PackagePlus,
  'Low Stock Alert': AlertTriangle,
  'Purchase Delivered': Truck,
  'Medicine Expiring': CalendarClock,
  'Bill Generated': Receipt,
};

const typeColor = {
  'New Prescription': 'text-blue-600 bg-blue-50',
  'Low Stock Alert': 'text-amber-500 bg-amber-50',
  'Purchase Delivered': 'text-green-600 bg-green-50',
  'Medicine Expiring': 'text-orange-500 bg-orange-50',
  'Bill Generated': 'text-blue-600 bg-blue-50',
};

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await pharmacyService.getNotifications();
      setNotifications(res.data || []);
      setUnreadCount(res.unreadCount || 0);
    } catch (err) {
      setError(err.message || 'Failed to load notifications');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const markAllRead = async () => {
    try {
      await pharmacyService.markAllNotificationsRead();
      await loadData();
    } catch (err) {
      setError(err.message || 'Failed to mark all as read');
    }
  };

  const markRead = async (id) => {
    try {
      await pharmacyService.markNotificationRead(id);
      await loadData();
    } catch (err) {
      setError(err.message || 'Failed to mark notification as read');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <PharmacyNavbar />
      <main className="flex-1 p-6 lg:p-8 max-w-3xl mx-auto w-full">
        <PageHeader
          title="Notifications"
          subtitle={unreadCount > 0 ? `${unreadCount} unread notifications` : 'All caught up'}
          action={
            unreadCount > 0 && (
              <button onClick={markAllRead} className="flex items-center gap-2 text-blue-600 hover:underline text-sm font-semibold">
                <CheckCheck className="w-4 h-4" /> Mark all as read
              </button>
            )
          }
        />

        {error && <div className="mb-4 text-sm text-red-600 bg-red-50 px-4 py-2.5 rounded-lg">{error}</div>}

        <Card>
          <div className="flex flex-col divide-y divide-gray-50">
            {notifications.map((n) => {
              const Icon = typeIcon[n.type] || Bell;
              return (
                <button
                  key={n.id}
                  onClick={() => markRead(n.id)}
                  className={`flex items-start gap-4 py-4 text-left first:pt-0 last:pb-0 ${!n.read ? 'bg-blue-50/30 -mx-5 px-5' : ''}`}
                >
                  <span className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${typeColor[n.type] || 'text-gray-500 bg-gray-50'}`}>
                    <Icon className="w-4 h-4" />
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-gray-800">{n.type}</p>
                      {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />}
                    </div>
                    <p className="text-sm text-gray-500 mt-0.5">{n.text}</p>
                    <p className="text-xs text-gray-400 mt-1">{n.time}</p>
                  </div>
                </button>
              );
            })}
          </div>
          {!loading && notifications.length === 0 && <EmptyState text="No notifications yet." />}
          {loading && <div className="py-10 text-center text-sm text-gray-400">Loading...</div>}
        </Card>
      </main>
    </div>
  );
};

export default Notifications;