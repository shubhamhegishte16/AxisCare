import React, { useState } from 'react';
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
const notificationsData = [
  { id: 1, type: 'APPOINTMENT', icon: Calendar, iconColor: 'text-blue-500', bgColor: 'bg-blue-50', title: 'New Appointment Booked', desc: 'Rahul Mehta has booked an appointment on 24 May 2025 at 10:30 AM.', time: '2 min ago', unread: true, badgeColor: 'bg-blue-50 text-blue-600' },
  { id: 2, type: 'LAB & REPORTS', icon: FlaskConical, iconColor: 'text-green-500', bgColor: 'bg-green-50', title: 'Lab Report Ready', desc: 'Lab report for Amit Kumar is ready to view.', time: '15 min ago', unread: true, badgeColor: 'bg-green-50 text-green-600' },
  { id: 3, type: 'PRESCRIPTIONS', icon: FileText, iconColor: 'text-orange-500', bgColor: 'bg-orange-50', title: 'New Prescription Added', desc: 'You have added a new prescription for Neha Sharma.', time: '1 hour ago', unread: true, badgeColor: 'bg-orange-50 text-orange-500' },
  { id: 4, type: 'PATIENTS', icon: User, iconColor: 'text-indigo-500', bgColor: 'bg-indigo-50', title: 'Patient Update', desc: 'Patient Priya Singh has updated her medical history.', time: '2 hours ago', unread: false, badgeColor: 'bg-indigo-50 text-indigo-600' },
  { id: 5, type: 'LAB REQUESTS', icon: ClipboardList, iconColor: 'text-cyan-500', bgColor: 'bg-cyan-50', title: 'Lab Request Received', desc: 'New lab request for Vikram Patel has been received.', time: '3 hours ago', unread: false, badgeColor: 'bg-cyan-50 text-cyan-600' },
  { id: 6, type: 'SYSTEM', icon: Settings, iconColor: 'text-gray-500', bgColor: 'bg-gray-100', title: 'System Maintenance Scheduled', desc: 'System maintenance is scheduled on 25 May 2025 from 01:00 AM to 03:00 AM.', time: '1 day ago', unread: false, badgeColor: 'bg-gray-100 text-gray-600' },
  { id: 7, type: 'REPORTS', icon: FileBarChart, iconColor: 'text-emerald-500', bgColor: 'bg-emerald-50', title: 'Report Generated', desc: 'Monthly patient visit report for April 2025 is ready.', time: '2 days ago', unread: false, badgeColor: 'bg-emerald-50 text-emerald-600' },
  { id: 8, type: 'SYSTEM', icon: AlertTriangle, iconColor: 'text-red-500', bgColor: 'bg-red-50', title: 'Critical Alert', desc: 'High priority: Patient Arjun Verma has abnormal ECG results.', time: '2 days ago', unread: false, badgeColor: 'bg-red-50 text-red-600' },
];
const Notifications = () => {
  const [activeTab, setActiveTab] = useState('All');
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
              <TabButton active={activeTab === 'All'} onClick={() => setActiveTab('All')} icon={Bell} label="All" count={8} />
              <TabButton active={activeTab === 'Unread'} onClick={() => setActiveTab('Unread')} icon={Mail} label="Unread" count={5} />
              <TabButton active={activeTab === 'Appointments'} onClick={() => setActiveTab('Appointments')} icon={Calendar} label="Appointments" count={3} />
              <TabButton active={activeTab === 'Lab & Reports'} onClick={() => setActiveTab('Lab & Reports')} icon={FlaskConical} label="Lab & Reports" count={2} />
              <TabButton active={activeTab === 'System'} onClick={() => setActiveTab('System')} icon={Settings} label="System" count={1} /></div>
            <button className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 whitespace-nowrap pb-2 sm:pb-0">
              <CheckCircle2 className="w-3.5 h-3.5" /> Mark all as read</button></div>
          {/* Notification List */}
          <div className="flex flex-col gap-4">
            {notificationsData.map((notif) => (
              <div key={notif.id} className="border border-gray-100 rounded-xl p-5 flex items-start gap-4 hover:border-gray-200 transition-colors bg-white">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${notif.bgColor}`}>
                  <notif.icon className={`w-5 h-5 ${notif.iconColor}`} /></div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-1">
                    <h3 className="text-sm font-bold text-gray-900 truncate pr-4">{notif.title}</h3>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] font-bold text-gray-400">{notif.time}</span>
                      {notif.unread ? (
                        <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                      ) : (
                        <div className="w-2 h-2 rounded-full bg-gray-200"></div>
                      )}
                    </div></div>
                  <p className="text-xs text-gray-600 mb-3 leading-relaxed">{notif.desc}</p>
                  <span className={`inline-block px-2 py-0.5 rounded text-[8px] font-extrabold tracking-wider uppercase ${notif.badgeColor}`}>
                    {notif.type}</span></div></div>
            ))}
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
