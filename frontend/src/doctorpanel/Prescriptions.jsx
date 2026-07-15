import React from 'react';
import Header from './Header';
import { 
  FileText, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Search, 
  Calendar as CalendarIcon, 
  ChevronDown,
  SlidersHorizontal,
  Eye,
  Printer,
  MoreVertical,
  Plus,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  BookMarked
} from 'lucide-react';
import { Link } from 'react-router-dom';
const prescriptionsData = [
  { id: 'RX-2026-1250', patient: 'Rajesh Kumar', age: '56', gender: 'Male', diagnosis: 'Hypertension', medsCount: '3', date: '11 Jul 2026', doctor: 'Dr. Ananya Sharma', status: 'DISPENSED', img: 'https://i.pravatar.cc/150?img=11' },
  { id: 'RX-2026-1249', patient: 'Priya Mehta', age: '34', gender: 'Female', diagnosis: 'Chest Pain', medsCount: '4', date: '11 Jul 2026', doctor: 'Dr. Ananya Sharma', status: 'PENDING', img: 'https://i.pravatar.cc/150?img=5' },
  { id: 'RX-2026-1248', patient: 'Amit Verma', age: '45', gender: 'Male', diagnosis: 'Asthma', medsCount: '2', date: '10 Jul 2026', doctor: 'Dr. Ananya Sharma', status: 'DISPENSED', img: 'https://i.pravatar.cc/150?img=8' },
  { id: 'RX-2026-1247', patient: 'Neha Patil', age: '29', gender: 'Female', diagnosis: 'Knee Pain', medsCount: '3', date: '10 Jul 2026', doctor: 'Dr. Ananya Sharma', status: 'PENDING', img: 'https://i.pravatar.cc/150?img=20' },
  { id: 'RX-2026-1246', patient: 'Suresh Chandra', age: '62', gender: 'Male', diagnosis: 'Diabetes Type 2', medsCount: '5', date: '09 Jul 2026', doctor: 'Dr. Ananya Sharma', status: 'DISPENSED', img: 'https://i.pravatar.cc/150?img=13' },
  { id: 'RX-2026-1245', patient: 'Sneha Kapoor', age: '31', gender: 'Female', diagnosis: 'Migraine', medsCount: '2', date: '09 Jul 2026', doctor: 'Dr. Ananya Sharma', status: 'CANCELLED', img: 'https://i.pravatar.cc/150?img=21' },
];
const Prescriptions = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Header />
      <main className="flex-1 p-6 lg:p-8 max-w-7xl mx-auto w-full">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Prescriptions</h1>
            <p className="text-gray-500 text-sm">View and manage all prescriptions issued to patients.</p></div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-lg text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 transition-colors">
              <BookMarked className="w-4 h-4 text-gray-500" />
              My Drafts</button>
            <Link to="/doctordashboard/new-prescription" className="flex items-center gap-2 bg-[#00B9D6] text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-sm hover:bg-[#00a3bd] transition-colors">
              <Plus className="w-4 h-4" />
              New Prescription</Link></div></div>
        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <StatCard title="TOTAL PRESCRIPTIONS" value="1,248" subtext="All time" icon={FileText} iconColor="text-blue-500" bgColor="bg-blue-50" />
          <StatCard title="THIS MONTH" value="156" subtext={<span className="flex items-center text-green-600"><TrendingUp className="w-3 h-3 mr-1" /> 18% from last month</span>} icon={Calendar} iconColor="text-blue-500" bgColor="bg-blue-50" />
          <StatCard title="DISPENSED" value="1,050" subtext={<span className="text-green-600">84% of total</span>} icon={CheckCircle2} iconColor="text-green-500" bgColor="bg-green-50" />
          <StatCard title="PENDING" value="128" subtext={<span className="text-orange-500">10% of total</span>} icon={Clock} iconColor="text-orange-500" bgColor="bg-orange-50" />
          <StatCard title="CANCELLED" value="70" subtext={<span className="text-red-500">6% of total</span>} icon={XCircle} iconColor="text-red-500" bgColor="bg-red-50" /></div>
        {/* Filters & Search */}
        <div className="bg-white p-4 rounded-t-xl border border-gray-200 border-b-0 flex flex-col xl:flex-row items-center justify-between gap-4">
          <div className="relative flex-1 w-full xl:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by patient name, medication or diagnosis..." 
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00B9D6] focus:border-transparent transition-all"
            /></div>
          <div className="flex items-center gap-3 w-full xl:w-auto overflow-x-auto hide-scrollbar">
            <button className="flex items-center gap-2 bg-white border border-gray-200 px-3 py-2.5 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 whitespace-nowrap min-w-[200px]">
              <CalendarIcon className="w-4 h-4 text-gray-500" />
              11 Jul 2026 - 11 Jul 2026</button>
            <button className="flex items-center justify-between gap-2 bg-white border border-gray-200 px-3 py-2.5 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 whitespace-nowrap min-w-[130px]">
              All Patients <ChevronDown className="w-4 h-4 text-gray-500" /></button>
            <button className="flex items-center justify-between gap-2 bg-white border border-gray-200 px-3 py-2.5 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 whitespace-nowrap min-w-[120px]">
              All Status <ChevronDown className="w-4 h-4 text-gray-500" /></button>
            <button className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2.5 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 whitespace-nowrap">
              <SlidersHorizontal className="w-4 h-4" />
              Filters</button></div></div>
        {/* Table */}
        <div className="bg-white border border-gray-200 rounded-b-xl shadow-sm overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                <th className="px-6 py-4">PRESCRIPTION ID</th>
                <th className="px-6 py-4">PATIENT</th>
                <th className="px-6 py-4">DIAGNOSIS</th>
                <th className="px-6 py-4">MEDICATIONS</th>
                <th className="px-6 py-4">DATE</th>
                <th className="px-6 py-4">STATUS</th>
                <th className="px-6 py-4 text-right">ACTIONS</th></tr></thead>
            <tbody className="divide-y divide-gray-100">
              {prescriptionsData.map((rx) => (
                <tr key={rx.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-bold text-blue-600 whitespace-nowrap">
                    {rx.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <img src={rx.img} alt={rx.patient} className="w-10 h-10 rounded-full object-cover bg-gray-100" />
                      <div>
                        <p className="text-sm font-bold text-gray-900">{rx.patient}</p>
                        <p className="text-xs text-gray-500 font-medium">{rx.age} / {rx.gender}</p></div></div></td>
                  <td className="px-6 py-4 text-sm text-gray-600 font-medium whitespace-nowrap">
                    {rx.diagnosis}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm font-bold text-gray-900">{rx.medsCount} Medications</p>
                    <button className="text-xs font-bold text-blue-600 hover:underline">View Details</button></td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm font-bold text-gray-900">{rx.date}</p>
                    <p className="text-xs text-gray-500 font-medium">{rx.doctor}</p></td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={rx.status} /></td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center justify-end gap-3 text-gray-500">
                      <button className="hover:text-gray-900 transition-colors"><Eye className="w-5 h-5" /></button>
                      <button className="hover:text-gray-900 transition-colors"><Printer className="w-5 h-5" /></button>
                      <button className="hover:text-gray-900 transition-colors"><MoreVertical className="w-5 h-5" /></button></div></td></tr>
              ))}
            </tbody></table></div>
        {/* Pagination */}
        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm text-gray-600 font-medium">Showing 1 to 8 of 156 prescriptions</p>
          <div className="flex items-center gap-1">
            <button className="w-8 h-8 flex items-center justify-center rounded border border-gray-200 text-gray-500 hover:bg-gray-50"><ChevronLeft className="w-4 h-4" /></button>
            <button className="w-8 h-8 flex items-center justify-center rounded bg-[#0b3363] text-white font-semibold text-sm">1</button>
            <button className="w-8 h-8 flex items-center justify-center rounded border border-gray-200 text-gray-600 hover:bg-gray-50 font-semibold text-sm">2</button>
            <button className="w-8 h-8 flex items-center justify-center rounded border border-gray-200 text-gray-600 hover:bg-gray-50 font-semibold text-sm">3</button>
            <button className="w-8 h-8 flex items-center justify-center rounded border border-gray-200 text-gray-600 hover:bg-gray-50 font-semibold text-sm">4</button>
            <button className="w-8 h-8 flex items-center justify-center rounded border border-gray-200 text-gray-600 hover:bg-gray-50 font-semibold text-sm">5</button>
            <span className="w-8 h-8 flex items-center justify-center text-gray-400">...</span>
            <button className="w-8 h-8 flex items-center justify-center rounded border border-gray-200 text-gray-600 hover:bg-gray-50 font-semibold text-sm">20</button>
            <button className="w-8 h-8 flex items-center justify-center rounded border border-gray-200 text-gray-500 hover:bg-gray-50"><ChevronRight className="w-4 h-4" /></button></div></div></main></div>
  );
};
const StatCard = ({ title, value, subtext, icon: Icon, iconColor, bgColor }) => (
  <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between h-full gap-4 relative">
    <div className="flex items-start gap-4">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${bgColor}`}>
        <Icon className={`w-5 h-5 ${iconColor}`} /></div>
      <div>
        <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-1 leading-tight">{title}</h3>
        <p className="text-2xl font-extrabold text-gray-900 leading-none mb-1">{value}</p>
        <div className="text-[10px] font-bold mt-1 text-gray-400">{subtext}</div></div></div></div>
);
const StatusBadge = ({ status }) => {
  const getStyles = () => {
    switch (status) {
      case 'DISPENSED':
        return 'bg-green-50 text-green-600';
      case 'PENDING':
        return 'bg-orange-50 text-orange-500';
      case 'CANCELLED':
        return 'bg-red-50 text-red-500';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };
  return (
    <span className={`px-2 py-1 rounded text-[10px] font-extrabold tracking-wider uppercase ${getStyles()}`}>
      {status}</span>
  );
};
export default Prescriptions;
