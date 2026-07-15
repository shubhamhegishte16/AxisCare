import React from 'react';
import Header from './Header';
import { 
  FileText, 
  Calendar as CalendarIcon, 
  ChevronDown,
  SlidersHorizontal,
  Eye,
  MoreVertical,
  Plus,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Search,
  Download,
  Pencil,
  FileCheck2,
  Award,
  Clock,
  UploadCloud,
  FileBox,
  FilePlus,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
const reportsData = [
  { id: 'RP-2026-1248', patient: 'Rajesh Kumar', pid: 'P10234', reportType: 'Consultation Report', dept: 'Cardiology', date: '11 Jul 2026', time: '09:30 AM', status: 'COMPLETED', img: 'https://i.pravatar.cc/150?img=11', typeIcon: FileText, iconColor: 'text-blue-500' },
  { id: 'RP-2026-1247', patient: 'Priya Mehta', pid: 'P10567', reportType: 'Medical Certificate', dept: 'General', date: '11 Jul 2026', time: '09:15 AM', status: 'COMPLETED', img: 'https://i.pravatar.cc/150?img=5', typeIcon: Award, iconColor: 'text-green-500' },
  { id: 'RP-2026-1246', patient: 'Amit Verma', pid: 'P10890', reportType: 'Progress Report', dept: 'Cardiology', date: '10 Jul 2026', time: '04:20 PM', status: 'DRAFT', img: 'https://i.pravatar.cc/150?img=8', typeIcon: TrendingUp, iconColor: 'text-purple-500' },
  { id: 'RP-2026-1245', patient: 'Neha Patil', pid: 'P11023', reportType: 'Discharge Summary', dept: 'Cardiology', date: '10 Jul 2026', time: '01:05 PM', status: 'COMPLETED', img: 'https://i.pravatar.cc/150?img=20', typeIcon: FileBox, iconColor: 'text-orange-500' },
  { id: 'RP-2026-1244', patient: 'Suresh Chandra', pid: 'P11156', reportType: 'Fitness Certificate', dept: 'General', date: '09 Jul 2026', time: '11:45 AM', status: 'COMPLETED', img: 'https://i.pravatar.cc/150?img=13', typeIcon: FileCheck2, iconColor: 'text-red-500' },
  { id: 'RP-2026-1243', patient: 'Sneha Kapoor', pid: 'P11345', reportType: 'Referral Letter', dept: 'Cardiology', date: '09 Jul 2026', time: '10:30 AM', status: 'PENDING', img: 'https://i.pravatar.cc/150?img=21', typeIcon: FilePlus, iconColor: 'text-yellow-500' },
];
const recentReports = [
  { id: 1, patient: 'Rajesh Kumar', type: 'Consultation Report', status: 'COMPLETED', date: '11 Jul 2026', img: 'https://i.pravatar.cc/150?img=11' },
  { id: 2, patient: 'Priya Mehta', type: 'Medical Certificate', status: 'COMPLETED', date: '11 Jul 2026', img: 'https://i.pravatar.cc/150?img=5' },
];
const Reports = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Header />
      <main className="flex-1 p-6 lg:p-8 max-w-[1400px] mx-auto w-full">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Reports</h1>
            <p className="text-gray-500 text-sm">Create, view and manage all medical reports and documents.</p></div>
          <Link to="/doctordashboard/create-report" className="flex items-center gap-2 bg-[#00B9D6] text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-sm hover:bg-[#00a3bd] transition-colors">
            <Plus className="w-4 h-4" />
            Create Report <ChevronDown className="w-4 h-4 border-l border-white/20 pl-1 ml-1" /></Link></div>
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 items-start">
          {/* Main Content (Left 3 columns) */}
          <div className="xl:col-span-3 flex flex-col gap-6">
            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard title="Total Reports" value="248" subtext="All time" icon={FileText} iconColor="text-blue-500" bgColor="bg-blue-50" />
              <StatCard title="Today's Reports" value="12" subtext={<span className="flex items-center text-green-600"><TrendingUp className="w-3 h-3 mr-1" /> 20% from yesterday</span>} icon={FileCheck2} iconColor="text-green-500" bgColor="bg-green-50" />
              <StatCard title="Certificates" value="56" subtext="23% of total" icon={Award} iconColor="text-orange-500" bgColor="bg-orange-50" />
              <StatCard title="Pending Reports" value="08" subtext="View and complete" icon={Clock} iconColor="text-red-500" bgColor="bg-red-50" /></div>
            {/* Filters & Search */}
            <div className="bg-white p-4 rounded-t-xl border border-gray-200 border-b-0 flex flex-col lg:flex-row items-center gap-4">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search by patient name, report ID or type..." 
                  className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00B9D6] focus:border-transparent transition-all"
                /></div>
              <div className="flex items-center gap-3 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0 hide-scrollbar">
                <button className="flex items-center gap-2 bg-white border border-gray-200 px-3 py-2.5 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 whitespace-nowrap min-w-[200px]">
                  <CalendarIcon className="w-4 h-4 text-gray-500" />
                  11 Jul 2026 - 11 Jul 2026</button>
                <button className="flex items-center justify-between gap-2 bg-white border border-gray-200 px-3 py-2.5 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 whitespace-nowrap min-w-[150px]">
                  All Report Types <ChevronDown className="w-4 h-4 text-gray-500" /></button>
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
                    <th className="px-6 py-4">Report ID</th>
                    <th className="px-6 py-4">Patient</th>
                    <th className="px-6 py-4">Report Type</th>
                    <th className="px-6 py-4">Created Date</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th></tr></thead>
                <tbody className="divide-y divide-gray-100">
                  {reportsData.map((rep) => (
                    <tr key={rep.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-bold text-blue-600 whitespace-nowrap">
                        {rep.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <img src={rep.img} alt={rep.patient} className="w-10 h-10 rounded-full object-cover bg-gray-100" />
                          <div>
                            <p className="text-sm font-bold text-gray-900">{rep.patient}</p>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">PID: {rep.pid}</p></div></div></td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-gray-50 shrink-0 border border-gray-100`}>
                            <rep.typeIcon className={`w-4 h-4 ${rep.iconColor}`} /></div>
                          <div>
                            <p className="text-sm font-bold text-gray-900">{rep.reportType}</p>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wide">{rep.dept}</p></div></div></td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="text-sm font-bold text-gray-900">{rep.date}</p>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wide">{rep.time}</p></td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={rep.status} /></td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center justify-end gap-3 text-gray-400">
                          <button className="hover:text-gray-900 transition-colors"><Eye className="w-4 h-4" /></button>
                          <button className="hover:text-gray-900 transition-colors">
                            {rep.status === 'COMPLETED' ? <Download className="w-4 h-4" /> : <Pencil className="w-4 h-4" />}</button>
                          <button className="hover:text-gray-900 transition-colors"><MoreVertical className="w-4 h-4" /></button></div></td></tr>
                  ))}
                </tbody></table></div>
            {/* Pagination */}
            <div className="flex items-center justify-between py-2">
              <p className="text-sm text-gray-500 font-medium">Showing 1 to 8 of 248 reports</p>
              <div className="flex items-center gap-1">
                <button className="w-8 h-8 flex items-center justify-center rounded border border-gray-200 text-gray-500 hover:bg-gray-50"><ChevronLeft className="w-4 h-4" /></button>
                <button className="w-8 h-8 flex items-center justify-center rounded bg-[#0b3363] text-white font-semibold text-sm">1</button>
                <button className="w-8 h-8 flex items-center justify-center rounded border border-gray-200 text-gray-600 hover:bg-gray-50 font-semibold text-sm">2</button>
                <button className="w-8 h-8 flex items-center justify-center rounded border border-gray-200 text-gray-600 hover:bg-gray-50 font-semibold text-sm">3</button>
                <span className="w-8 h-8 flex items-center justify-center text-gray-400">...</span>
                <button className="w-8 h-8 flex items-center justify-center rounded border border-gray-200 text-gray-600 hover:bg-gray-50 font-semibold text-sm">31</button>
                <button className="w-8 h-8 flex items-center justify-center rounded border border-gray-200 text-gray-500 hover:bg-gray-50"><ChevronRight className="w-4 h-4" /></button></div></div></div>
          {/* Sidebar (Right column) */}
          <div className="xl:col-span-1 flex flex-col gap-6">
            {/* Recent Reports */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-sm font-bold text-gray-900">Recent Reports</h3>
                <button className="text-[10px] font-bold text-blue-600 uppercase tracking-wide hover:underline">View All</button></div>
              <div className="flex flex-col gap-5">
                {recentReports.map(rr => (
                  <div key={rr.id} className="flex items-start gap-3">
                    <img src={rr.img} alt={rr.patient} className="w-9 h-9 rounded-full object-cover bg-gray-100 shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-bold text-gray-900 leading-tight">{rr.patient}</p>
                      <p className="text-[10px] text-gray-500 font-medium mb-1">{rr.type}</p>
                      <div className="flex items-center justify-between">
                        <StatusBadge status={rr.status} />
                        <span className="text-[9px] font-bold text-gray-400 uppercase">{rr.date}</span></div></div></div>
                ))}
              </div>
              <button className="mt-5 w-full flex items-center justify-center gap-2 text-xs font-bold text-blue-600 hover:text-blue-700 py-2">
                View All Recent Reports <ArrowRight className="w-3.5 h-3.5" /></button></div>
            {/* Quick Actions */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5">
              <h3 className="text-sm font-bold text-gray-900 mb-5">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                <Link to="/doctordashboard/create-report" className="flex flex-col items-center justify-center p-4 bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-100 rounded-xl gap-2 h-24">
                  <FilePlus className="w-5 h-5 text-blue-600 mb-1" />
                  <span className="text-[10px] font-bold text-gray-900 text-center leading-tight">Create Report</span></Link>
                <QuickActionCard icon={UploadCloud} title="Upload Document" />
                <QuickActionCard icon={Award} title="Medical Certificate" />
                <QuickActionCard icon={Download} title="Download All" /></div></div></div></div>
        {/* Footer */}
        <footer className="mt-12 py-6 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
            <span className="text-lg">©</span> 2026 AxisCare Medical Systems. All rights reserved.</div>
          <div className="flex items-center gap-4 text-xs font-bold text-gray-600">
            <button className="hover:text-gray-900 transition-colors">Privacy Policy</button>
            <button className="hover:text-gray-900 transition-colors">Terms of Service</button>
            <button className="hover:text-gray-900 transition-colors">Help Center</button></div></footer></main></div>
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
      case 'COMPLETED':
        return 'bg-green-50 text-green-600';
      case 'DRAFT':
        return 'bg-blue-50 text-blue-600';
      case 'PENDING':
        return 'bg-orange-50 text-orange-500';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };
  return (
    <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold tracking-wider uppercase ${getStyles()}`}>
      {status}</span>
  );
};
const QuickActionCard = ({ icon: Icon, title }) => (
  <button className="flex flex-col items-center justify-center p-4 bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-100 rounded-xl gap-2 h-24">
    <Icon className="w-5 h-5 text-blue-600 mb-1" />
    <span className="text-[10px] font-bold text-gray-900 text-center leading-tight">{title}</span></button>
);
export default Reports;
