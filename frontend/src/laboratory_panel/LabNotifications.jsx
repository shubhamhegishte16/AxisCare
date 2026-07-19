import React, { useEffect, useState } from 'react';
import { AlertTriangle, Bell, CheckCircle2, ClipboardList, FlaskConical, Mail, Settings } from 'lucide-react';
import LabHeader from './LabHeader';
import { labService } from '../services/labService';

const timeAgo = (value) => {
  const diff = Date.now() - new Date(value).getTime();
  const minutes = Math.max(1, Math.floor(diff / 60000));
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `about ${hours} hour${hours > 1 ? 's' : ''} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? 's' : ''} ago`;
};

const getIcon = (type) => {
  switch (type) {
    case 'TestRequest': return ClipboardList;
    case 'Result': return FlaskConical;
    case 'System': return Settings;
    case 'Alert': return AlertTriangle;
    default: return Bell;
  }
};

const getColors = (type) => {
  switch (type) {
    case 'TestRequest': return { icon: 'text-blue-500', bg: 'bg-blue-50', badge: 'bg-blue-50 text-blue-600' };
    case 'Result': return { icon: 'text-cyan-500', bg: 'bg-cyan-50', badge: 'bg-cyan-50 text-cyan-600' };
    case 'System': return { icon: 'text-gray-500', bg: 'bg-gray-100', badge: 'bg-gray-100 text-gray-600' };
    case 'Alert': return { icon: 'text-red-500', bg: 'bg-red-50', badge: 'bg-red-50 text-red-600' };
    default: return { icon: 'text-gray-500', bg: 'bg-gray-100', badge: 'bg-gray-100 text-gray-600' };
  }
};

const TabButton = ({ active, onClick, icon: Icon, label, count }) => (
  <button onClick={onClick} className={`flex items-center gap-2 pb-3 border-b-2 transition-colors whitespace-nowrap ${active ? 'border-[#00B9D6] text-[#00B9D6]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
    <Icon className="w-4 h-4" />
    <span className="text-sm font-bold">{label}</span>
    {count > 0 && <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${active ? 'bg-cyan-50 text-[#00B9D6]' : 'bg-gray-100 text-gray-500'}`}>{count}</span>}
  </button>
);

export default function LabNotifications() {
  const [activeTab, setActiveTab] = useState('All');
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await labService.getNotifications();
      if (res.success) setNotifications(res.data || []);
    } catch (err) {
      console.error(err);
      setError('Failed to load notifications.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchNotifications(); }, []);

  const markAllRead = async () => {
    try {
      await labService.markAllNotificationsRead();
      setNotifications(prev => prev.map(item => ({ ...item, read: true })));
    } catch (err) {
      console.error(err);
      setError('Failed to mark notifications as read.');
    }
  };

  const markRead = async (notification) => {
    if (notification.read) return;
    setNotifications(prev => prev.map(item => item._id === notification._id ? { ...item, read: true } : item));
    try {
      await labService.markNotificationRead(notification._id);
    } catch (err) {
      console.error(err);
      setNotifications(prev => prev.map(item => item._id === notification._id ? { ...item, read: false } : item));
    }
  };

  const filtered = notifications.filter(item => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Unread') return !item.read;
    return item.type === activeTab;
  });
  const count = (type) => {
    if (type === 'All') return notifications.length;
    if (type === 'Unread') return notifications.filter(item => !item.read).length;
    return notifications.filter(item => item.type === type).length;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <LabHeader activePage="notifications" />
      <main className="flex-1 p-6 lg:p-8 max-w-[1000px] mx-auto w-full">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 lg:p-8">
          <div className="mb-8"><h1 className="text-2xl font-bold text-gray-900 mb-1">Notifications</h1><p className="text-gray-500 text-sm">Stay updated with important lab alerts and reminders.</p></div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100 mb-6 gap-4">
            <div className="flex items-center gap-6 overflow-x-auto pb-2 sm:pb-0">
              <TabButton active={activeTab === 'All'} onClick={() => setActiveTab('All')} icon={Bell} label="All" count={count('All')} />
              <TabButton active={activeTab === 'Unread'} onClick={() => setActiveTab('Unread')} icon={Mail} label="Unread" count={count('Unread')} />
              <TabButton active={activeTab === 'TestRequest'} onClick={() => setActiveTab('TestRequest')} icon={ClipboardList} label="Test Requests" count={count('TestRequest')} />
              <TabButton active={activeTab === 'Result'} onClick={() => setActiveTab('Result')} icon={FlaskConical} label="Results" count={count('Result')} />
              <TabButton active={activeTab === 'System'} onClick={() => setActiveTab('System')} icon={Settings} label="System" count={count('System')} />
            </div>
            <button onClick={markAllRead} className="flex items-center gap-1.5 text-xs font-bold text-[#00B9D6] hover:text-[#00a8c3] whitespace-nowrap pb-2 sm:pb-0"><CheckCircle2 className="w-3.5 h-3.5" /> Mark all as read</button>
          </div>
          {error && <div className="mb-4 bg-red-50 border border-red-100 text-red-600 rounded-xl px-4 py-3 text-sm font-semibold">{error}</div>}
          <div className="flex flex-col gap-4">
            {loading ? <p className="text-center text-gray-500 py-8">Loading notifications...</p> : filtered.length === 0 ? <p className="text-center text-gray-500 py-8">No notifications found.</p> : filtered.map(item => {
              const Icon = getIcon(item.type), colors = getColors(item.type);
              return <button key={item._id} onClick={() => markRead(item)} className="text-left border border-gray-100 rounded-xl p-5 flex items-start gap-4 hover:border-gray-200 transition-colors bg-white">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${colors.bg}`}><Icon className={`w-5 h-5 ${colors.icon}`} /></div>
                <div className="flex-1 min-w-0"><div className="flex items-start justify-between gap-4 mb-1"><h3 className="text-sm font-bold text-gray-900 truncate pr-4">{item.title}</h3><div className="flex items-center gap-2 shrink-0"><span className="text-[10px] font-bold text-gray-400">{timeAgo(item.createdAt)}</span><div className={`w-2 h-2 rounded-full ${item.read ? 'bg-gray-200' : 'bg-[#00B9D6]'}`} /></div></div><p className="text-xs text-gray-600 mb-3 leading-relaxed">{item.message}</p><span className={`inline-block px-2 py-0.5 rounded text-[8px] font-extrabold tracking-wider uppercase ${colors.badge}`}>{item.type}</span></div>
              </button>;
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
