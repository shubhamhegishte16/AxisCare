import React, { useState, useEffect } from 'react';
import Header from './Header';
import { 
  Bell, 
  Mail, 
  Calendar, 
  FlaskConical, 
  Settings, 
  CheckCircle2,
  FileText,
  User,
  ClipboardList,
  FileBarChart,
  AlertTriangle
} from 'lucide-react';
import { doctorService } from '../services/doctorService';
import { formatDistanceToNow } from 'date-fns';

const getNotificationIcon = (type) => {
  switch (type?.toUpperCase()) {
    case 'APPOINTMENTS': return Calendar;
    case 'LABREPORT':
    case 'LAB & REPORTS': return FlaskConical;
    case 'PRESCRIPTION':
    case 'PRESCRIPTIONS': return FileText;
    case 'PATIENT':
    case 'PATIENTS': return User;
    case 'SYSTEM': return Settings;
    case 'MEDICAL': return ClipboardList;
    case 'ALERT': return AlertTriangle;
    default: return Bell;
  }
};

const getNotificationColors = (type) => {
  switch (type?.toUpperCase()) {
    case 'APPOINTMENTS': return { iconColor: 'text-blue-500', bgColor: 'bg-blue-50', badgeColor: 'bg-blue-50 text-blue-600' };
    case 'LABREPORT':
    case 'LAB & REPORTS': return { iconColor: 'text-green-500', bgColor: 'bg-green-50', badgeColor: 'bg-green-50 text-green-600' };
    case 'PRESCRIPTION':
    case 'PRESCRIPTIONS': return { iconColor: 'text-orange-500', bgColor: 'bg-orange-50', badgeColor: 'bg-orange-50 text-orange-500' };
    case 'PATIENT':
    case 'PATIENTS': return { iconColor: 'text-indigo-500', bgColor: 'bg-indigo-50', badgeColor: 'bg-indigo-50 text-indigo-600' };
    case 'MEDICAL': return { iconColor: 'text-cyan-500', bgColor: 'bg-cyan-50', badgeColor: 'bg-cyan-50 text-cyan-600' };
    case 'SYSTEM': return { iconColor: 'text-gray-500', bgColor: 'bg-gray-100', badgeColor: 'bg-gray-100 text-gray-600' };
    case 'ALERT': return { iconColor: 'text-red-500', bgColor: 'bg-red-50', badgeColor: 'bg-red-50 text-red-600' };
    default: return { iconColor: 'text-gray-500', bgColor: 'bg-gray-100', badgeColor: 'bg-gray-100 text-gray-600' };
  }
};

const Notifications = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await doctorService.getNotifications();
      if (res.success) {
        setNotifications(res.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await doctorService.markAllNotificationsRead();
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (e) {
      console.error(e);
    }
  };

  const filteredNotifications = notifications.filter(n => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Unread') return !n.read;
    return n.type === activeTab;
  });

  const getUnreadCount = (type) => {
    if (type === 'All') return notifications.length;
    if (type === 'Unread') return notifications.filter(n => !n.read).length;
    return notifications.filter(n => n.type === type).length;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Header />
      <main className="flex-1 p-6 lg:p-8 max-w-[1000px] mx-auto w-full">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 lg:p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Notifications</h1>
            <p className="text-gray-500 text-sm">Stay updated with important alerts and reminders.</p></div>
          {/* Tabs & Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100 mb-6 gap-4">
            <div className="flex items-center gap-6 overflow-x-auto hide-scrollbar pb-2 sm:pb-0">
              <TabButton active={activeTab === 'All'} onClick={() => setActiveTab('All')} icon={Bell} label="All" count={getUnreadCount('All')} />
              <TabButton active={activeTab === 'Unread'} onClick={() => setActiveTab('Unread')} icon={Mail} label="Unread" count={getUnreadCount('Unread')} />
              <TabButton active={activeTab === 'Appointments'} onClick={() => setActiveTab('Appointments')} icon={Calendar} label="Appointments" count={getUnreadCount('Appointments')} />
              <TabButton active={activeTab === 'LabReport'} onClick={() => setActiveTab('LabReport')} icon={FlaskConical} label="Lab & Reports" count={getUnreadCount('LabReport')} />
              <TabButton active={activeTab === 'System'} onClick={() => setActiveTab('System')} icon={Settings} label="System" count={getUnreadCount('System')} /></div>
            <button onClick={handleMarkAllRead} className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 whitespace-nowrap pb-2 sm:pb-0">
              <CheckCircle2 className="w-3.5 h-3.5" /> Mark all as read</button></div>
          {/* Notification List */}
          <div className="flex flex-col gap-4">
            {loading ? (
               <p className="text-center text-gray-500 py-8">Loading notifications...</p>
            ) : filteredNotifications.length === 0 ? (
               <p className="text-center text-gray-500 py-8">No notifications found.</p>
            ) : filteredNotifications.map((notif) => {
              const Icon = getNotificationIcon(notif.type);
              const colors = getNotificationColors(notif.type);
              
              return (
              <div key={notif._id} className="border border-gray-100 rounded-xl p-5 flex items-start gap-4 hover:border-gray-200 transition-colors bg-white">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${colors.bgColor}`}>
                  <Icon className={`w-5 h-5 ${colors.iconColor}`} /></div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-1">
                    <h3 className="text-sm font-bold text-gray-900 truncate pr-4">{notif.title}</h3>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] font-bold text-gray-400">
                        {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
                      </span>
                      {!notif.read ? (
                        <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                      ) : (
                        <div className="w-2 h-2 rounded-full bg-gray-200"></div>
                      )}
                    </div></div>
                  <p className="text-xs text-gray-600 mb-3 leading-relaxed">{notif.message}</p>
                  <span className={`inline-block px-2 py-0.5 rounded text-[8px] font-extrabold tracking-wider uppercase ${colors.badgeColor}`}>
                    {notif.type}</span></div></div>
            )})}
          </div></div></main></div>
  );
};
const TabButton = ({ active, onClick, icon: Icon, label, count }) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-2 pb-3 border-b-2 transition-colors whitespace-nowrap ${active ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
  >
    <Icon className="w-4 h-4" />
    <span className="text-sm font-bold">{label}</span>
    {count > 0 && (
      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${active ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>
        {count}</span>
    )}
  </button>
);
export default Notifications;
