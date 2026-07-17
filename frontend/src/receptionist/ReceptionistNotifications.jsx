import React, { useState } from 'react';
import { CalendarCheck, Users, FileCheck2, Receipt, AlertTriangle, Bell, Check } from 'lucide-react';
import ReceptionistLayout from './ReceptionistLayout';

const initialNotifications = [
  { id: 1, title: 'Appointment Reminder', desc: 'Rajesh Kumar in 15 minutes', time: '9m ago', unread: true, icon: CalendarCheck },
  { id: 2, title: 'New Walk-in', desc: 'Ritu Singh added to queue', time: '18m ago', unread: true, icon: Users },
  { id: 3, title: 'Lab Report Ready', desc: 'Amit Verma — CBC report', time: '32m ago', unread: false, icon: FileCheck2 },
  { id: 4, title: 'Billing Completed', desc: 'Invoice #2291 settled', time: '1h ago', unread: false, icon: Receipt },
  { id: 5, title: 'Emergency Case', desc: 'Ritu Singh flagged priority', time: '2h ago', unread: true, icon: AlertTriangle },
  { id: 6, title: 'Appointment Reminder', desc: 'Priya Mehta in 30 minutes', time: '2h ago', unread: false, icon: CalendarCheck },
];

const ReceptionistNotifications = () => {
  const [notifications, setNotifications] = useState(initialNotifications);
  const unreadCount = notifications.filter((n) => n.unread).length;

  const markAllRead = () => setNotifications((n) => n.map((item) => ({ ...item, unread: false })));
  const markRead = (id) => setNotifications((n) => n.map((item) => (item.id === id ? { ...item, unread: false } : item)));

  return (
    <ReceptionistLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">Notifications</h1>
          <p className="text-sm text-slate-400 mt-1">{unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={markAllRead}
          className="flex items-center gap-2 bg-white border border-slate-200 hover:border-[#2563EB]/40 text-slate-700 text-sm font-bold px-4 py-2.5 rounded-xl transition-colors"
        >
          <Check className="w-4 h-4" /> Mark all as read
        </button>
      </div>

      <div className="bg-white rounded-[18px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="flex items-center gap-2 p-5 border-b border-slate-100">
          <Bell className="w-4 h-4 text-slate-400" />
          <h2 className="text-base font-bold text-slate-800">All Notifications</h2>
        </div>
        <div className="flex flex-col divide-y divide-slate-50">
          {notifications.map((n) => (
            <button
              key={n.id}
              onClick={() => markRead(n.id)}
              className={`flex items-center gap-4 px-5 py-4 text-left hover:bg-[#F8FAFC]/70 transition-colors ${n.unread ? 'bg-blue-50/30' : ''}`}
            >
              <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] flex items-center justify-center shrink-0">
                <n.icon className="w-5 h-5 text-[#2563EB]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-800">{n.title}</p>
                <p className="text-xs text-slate-400">{n.desc}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs text-slate-400">{n.time}</span>
                {n.unread && <span className="w-2 h-2 rounded-full bg-[#2563EB]" />}
              </div>
            </button>
          ))}
        </div>
      </div>
    </ReceptionistLayout>
  );
};

export default ReceptionistNotifications;
