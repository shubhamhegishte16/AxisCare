import React, { useState } from 'react';
import Header from './Header';
import { 
  Calendar, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Search, 
  Calendar as CalendarIcon, 
  ChevronDown,
  Filter,
  Eye,
  MessageSquare,
  MoreVertical,
  User,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const appointmentsData = [
  { id: '1', time: '09:00 AM', patient: 'Rajesh Kumar', pid: 'P10234', age: 56, gender: 'Male', reason: 'Follow-up Consultation', subReason: 'Regular checkup', status: 'Completed', type: 'In-Person', img: 'https://i.pravatar.cc/150?img=11' },
  { id: '2', time: '10:00 AM', patient: 'Priya Mehta', pid: 'P10567', age: 34, gender: 'Female', reason: 'Chest Pain', subReason: 'Since 2 days', status: 'Completed', type: 'In-Person', img: 'https://i.pravatar.cc/150?img=5' },
  { id: '3', time: '11:00 AM', patient: 'Amit Verma', pid: 'P10890', age: 45, gender: 'Male', reason: 'Breathing Issue', subReason: 'Mild breathlessness', status: 'In Progress', type: 'In-Person', img: 'https://i.pravatar.cc/150?img=8' },
  { id: '4', time: '12:00 PM', patient: 'Neha Patil', pid: 'P11023', age: 29, gender: 'Female', reason: 'Post-surgery Follow-up', subReason: 'Knee surgery', status: 'Upcoming', type: 'In-Person', img: 'https://i.pravatar.cc/150?img=20' },
  { id: '5', time: '01:30 PM', patient: 'Suresh Chandra', pid: 'P11156', age: 62, gender: 'Male', reason: 'Heart Health Assessment', subReason: 'Routine evaluation', status: 'Upcoming', type: 'In-Person', img: 'https://i.pravatar.cc/150?img=13' },
  { id: '6', time: '03:00 PM', patient: 'Sneha Kapoor', pid: 'P11345', age: 31, gender: 'Female', reason: 'Palpitations', subReason: 'Occasional dizziness', status: 'Upcoming', type: 'In-Person', img: 'https://i.pravatar.cc/150?img=21' },
  { id: '7', time: '04:30 PM', patient: 'Vikram Singh', pid: 'P11478', age: 39, gender: 'Male', reason: 'BP Check & Consultation', subReason: 'High BP', status: 'Cancelled', type: 'In-Person', img: 'https://i.pravatar.cc/150?img=33' },
];

const Appointments = () => {
  const [activeTab, setActiveTab] = useState('All Appointments');
  const tabs = ['All Appointments', 'Today', 'Upcoming', 'Completed', 'Cancelled'];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Header />
      <main className="flex-1 p-6 lg:p-8 max-w-7xl mx-auto w-full">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Appointments</h1>
          <p className="text-gray-500 text-sm">Manage and view all your appointments</p></div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard title="Today's Appointments" value="18" subtext="↑ 20% from yesterday" subtextColor="text-green-500" icon={Calendar} iconColor="text-blue-500" bgColor="bg-blue-50" />
          <StatCard title="Upcoming" value="24" subtext="Next 7 days" icon={Clock} iconColor="text-blue-500" bgColor="bg-blue-50" />
          <StatCard title="Completed" value="156" subtext="This month" icon={CheckCircle2} iconColor="text-green-500" bgColor="bg-green-50" />
          <StatCard title="Cancelled" value="12" subtext="This month" icon={XCircle} iconColor="text-red-500" bgColor="bg-red-50" /></div>

        {/* Filters & Search */}
        <div className="bg-white p-4 rounded-t-xl border border-gray-200 border-b-0 flex flex-col xl:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-6 overflow-x-auto w-full xl:w-auto hide-scrollbar border-b border-gray-100 xl:border-none pb-2 xl:pb-0">
            {tabs.map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`whitespace-nowrap text-sm font-semibold pb-2 border-b-2 transition-colors ${
                  activeTab === tab ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab}</button>
            ))}</div>
          <div className="flex items-center gap-3 w-full xl:w-auto overflow-x-auto hide-scrollbar">
            <div className="relative w-full xl:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search patient..." 
                className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00B9D6] focus:border-transparent transition-all"
              /></div>
            <button className="flex items-center gap-2 bg-gray-50 border border-gray-200 px-3 py-2 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-100 whitespace-nowrap">
              <CalendarIcon className="w-4 h-4 text-gray-500" />
              11 July 2026</button>
            <button className="flex items-center gap-2 bg-gray-50 border border-gray-200 px-3 py-2 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-100 whitespace-nowrap">
              All Status <ChevronDown className="w-4 h-4 text-gray-500" /></button>
            <button className="flex items-center justify-center bg-gray-50 border border-gray-200 w-9 h-9 rounded-lg text-gray-700 hover:bg-gray-100 shrink-0">
              <Filter className="w-4 h-4" /></button></div></div>

        {/* Table */}
        <div className="bg-white border border-gray-200 rounded-b-xl shadow-sm overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-[11px] text-gray-500 font-bold uppercase tracking-wider">
                <th className="px-6 py-4">TIME</th>
                <th className="px-6 py-4">PATIENT</th>
                <th className="px-6 py-4">AGE / GENDER</th>
                <th className="px-6 py-4">REASON</th>
                <th className="px-6 py-4">STATUS</th>
                <th className="px-6 py-4">TYPE</th>
                <th className="px-6 py-4 text-right">ACTIONS</th></tr></thead>
            <tbody className="divide-y divide-gray-100">
              {appointmentsData.map((appointment) => (
                <tr key={appointment.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-bold text-gray-900 whitespace-nowrap">
                    {appointment.time}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <img src={appointment.img} alt={appointment.patient} className="w-10 h-10 rounded-full object-cover bg-gray-100" />
                      <div>
                        <p className="text-sm font-bold text-gray-900">{appointment.patient}</p>
                        <p className="text-xs text-gray-500 font-medium">PID: {appointment.pid}</p></div></div></td>
                  <td className="px-6 py-4 text-sm text-gray-600 font-medium whitespace-nowrap">
                    {appointment.age} / {appointment.gender}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm font-bold text-gray-900">{appointment.reason}</p>
                    <p className="text-xs text-gray-500 font-medium">{appointment.subReason}</p></td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={appointment.status} /></td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1.5 text-blue-600 font-semibold text-sm">
                      <User className="w-4 h-4" /> {appointment.type}</div></td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center justify-end gap-3 text-gray-500">
                      <button className="hover:text-gray-900 transition-colors"><Eye className="w-5 h-5" /></button>
                      <button className="hover:text-gray-900 transition-colors"><MessageSquare className="w-5 h-5" /></button>
                      <button className="hover:text-gray-900 transition-colors"><MoreVertical className="w-5 h-5" /></button></div></td></tr>
              ))}
            </tbody></table></div>

        {/* Pagination */}
        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm text-gray-600 font-medium">Showing 1 to 7 of 28 appointments</p>
          <div className="flex items-center gap-1">
            <button className="w-8 h-8 flex items-center justify-center rounded border border-gray-200 text-gray-500 hover:bg-gray-50"><ChevronLeft className="w-4 h-4" /></button>
            <button className="w-8 h-8 flex items-center justify-center rounded bg-[#00B9D6] text-white font-semibold text-sm">1</button>
            <button className="w-8 h-8 flex items-center justify-center rounded border border-gray-200 text-gray-600 hover:bg-gray-50 font-semibold text-sm">2</button>
            <button className="w-8 h-8 flex items-center justify-center rounded border border-gray-200 text-gray-600 hover:bg-gray-50 font-semibold text-sm">3</button>
            <button className="w-8 h-8 flex items-center justify-center rounded border border-gray-200 text-gray-600 hover:bg-gray-50 font-semibold text-sm">4</button>
            <button className="w-8 h-8 flex items-center justify-center rounded border border-gray-200 text-gray-500 hover:bg-gray-50"><ChevronRight className="w-4 h-4" /></button></div></div></main></div>
  );
};

const StatCard = ({ title, value, subtext, subtextColor = "text-gray-500", icon: Icon, iconColor, bgColor }) => (
  <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between h-full gap-4">
    <div className="flex items-center gap-3">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${bgColor}`}>
        <Icon className={`w-5 h-5 ${iconColor}`} /></div></div>
    <div>
      <h3 className="text-[11px] font-bold text-gray-500 uppercase tracking-wide mb-1">{title}</h3>
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-extrabold text-gray-900 leading-none">{value}</span>
        <span className={`text-xs font-bold ${subtextColor}`}>{subtext}</span></div></div></div>
);

const StatusBadge = ({ status }) => {
  const getStyles = () => {
    switch (status) {
      case 'Completed':
        return 'bg-green-50 text-green-600';
      case 'In Progress':
        return 'bg-blue-100 text-blue-700';
      case 'Upcoming':
        return 'bg-indigo-50 text-indigo-600';
      case 'Cancelled':
        return 'bg-red-50 text-red-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wide uppercase ${getStyles()}`}>
      {status}</span>
  );
};

export default Appointments;
