import React from 'react';
import Header from './Header';
import { 
  Users, 
  UserPlus, 
  Calendar, 
  Heart, 
  FileText, 
  Search, 
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Eye,
  MoreVertical,
  Plus
} from 'lucide-react';

const patientsData = [
  { id: 'P10234', name: 'Rajesh Kumar', age: 56, gender: 'Male', contact: '+91 98765 43210', condition: 'Hypertension', lastVisit: '11 Jul 2026', status: 'Active', img: 'https://i.pravatar.cc/150?img=11' },
  { id: 'P10567', name: 'Priya Mehta', age: 34, gender: 'Female', contact: '+91 87654 32109', condition: 'Chest Pain', lastVisit: '09 Jul 2026', status: 'Active', img: 'https://i.pravatar.cc/150?img=5' },
  { id: 'P10890', name: 'Amit Verma', age: 45, gender: 'Male', contact: '+91 76543 21098', condition: 'Asthma', lastVisit: '08 Jul 2026', status: 'Active', img: 'https://i.pravatar.cc/150?img=8' },
  { id: 'P11023', name: 'Neha Patil', age: 29, gender: 'Female', contact: '+91 65432 10987', condition: 'Knee Pain', lastVisit: '07 Jul 2026', status: 'Follow-up Due', img: 'https://i.pravatar.cc/150?img=20' },
  { id: 'P11156', name: 'Suresh Chandra', age: 62, gender: 'Male', contact: '+91 54321 09876', condition: 'Diabetes Type 2', lastVisit: '05 Jul 2026', status: 'Active', img: 'https://i.pravatar.cc/150?img=13' },
  { id: 'P11345', name: 'Sneha Kapoor', age: 31, gender: 'Female', contact: '+91 43210 98765', condition: 'Migraine', lastVisit: '04 Jul 2026', status: 'Follow-up Due', img: 'https://i.pravatar.cc/150?img=21' },
  { id: 'P11478', name: 'Vikram Singh', age: 39, gender: 'Male', contact: '+91 32109 87654', condition: 'High Cholesterol', lastVisit: '02 Jul 2026', status: 'Inactive', img: 'https://i.pravatar.cc/150?img=33' },
  { id: 'P11590', name: 'Meera Joshi', age: 58, gender: 'Female', contact: '+91 21098 76543', condition: 'Thyroid', lastVisit: '30 Jun 2026', status: 'Active', img: 'https://i.pravatar.cc/150?img=22' },
];

const Patients = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Header />
      <main className="flex-1 p-6 lg:p-8 max-w-7xl mx-auto w-full">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Patients</h1>
            <p className="text-gray-500 text-sm">Manage and view all patients registered in your practice.</p></div>
          <button className="flex items-center gap-2 bg-[#00B9D6] text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-sm hover:bg-[#00a3bd] transition-colors">
            <Plus className="w-4 h-4" />
            Add New Patient</button></div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <StatCard title="Total Patients" value="248" subtext="All time patients" icon={Users} iconColor="text-blue-500" bgColor="bg-blue-50" />
          <StatCard title="New Patients" value="18" subtext="This month" icon={UserPlus} iconColor="text-teal-500" bgColor="bg-teal-50" />
          <StatCard title="Active Patients" value="142" subtext="Currently in treatment" icon={Calendar} iconColor="text-purple-500" bgColor="bg-purple-50" />
          <StatCard title="Follow-up Due" value="32" subtext="Need attention" icon={Heart} iconColor="text-yellow-500" bgColor="bg-yellow-50" />
          <StatCard title="Records" value="1,248" subtext="Total medical records" icon={FileText} iconColor="text-green-500" bgColor="bg-green-50" /></div>

        {/* Filters & Search */}
        <div className="bg-white p-4 rounded-t-xl border border-gray-200 border-b-0 flex flex-col lg:flex-row items-center gap-4">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search patients by name, ID or phone number..." 
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00B9D6] focus:border-transparent transition-all"
            /></div>
          <div className="flex items-center gap-3 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0 hide-scrollbar">
            <select className="bg-white border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-[#00B9D6] focus:border-[#00B9D6] block p-2.5 min-w-[120px]">
              <option>All Gender</option>
              <option>Male</option>
              <option>Female</option>
            </select>
            <select className="bg-white border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-[#00B9D6] focus:border-[#00B9D6] block p-2.5 min-w-[140px]">
              <option>All Age Groups</option>
              <option>0-18 Years</option>
              <option>19-40 Years</option>
              <option>41-60 Years</option>
              <option>60+ Years</option>
            </select>
            <select className="bg-white border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-[#00B9D6] focus:border-[#00B9D6] block p-2.5 min-w-[140px]">
              <option>All Conditions</option>
              <option>Hypertension</option>
              <option>Diabetes</option>
              <option>Asthma</option>
            </select>
            <select className="bg-white border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-[#00B9D6] focus:border-[#00B9D6] block p-2.5 min-w-[120px]">
              <option>All Status</option>
              <option>Active</option>
              <option>Follow-up Due</option>
              <option>Inactive</option>
            </select>
            <button className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2.5 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 whitespace-nowrap">
              <SlidersHorizontal className="w-4 h-4" />
              Filters</button></div></div>

        {/* Table */}
        <div className="bg-white border border-gray-200 rounded-b-xl shadow-sm overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-xs text-gray-500 font-semibold uppercase tracking-wider">
                <th className="px-6 py-4">Patient</th>
                <th className="px-6 py-4">Age / Gender</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Condition</th>
                <th className="px-6 py-4">Last Visit</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th></tr></thead>
            <tbody className="divide-y divide-gray-100">
              {patientsData.map((patient) => (
                <tr key={patient.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={patient.img} alt={patient.name} className="w-10 h-10 rounded-full object-cover bg-gray-100" />
                      <div>
                        <p className="text-sm font-bold text-gray-900">{patient.name}</p>
                        <p className="text-xs text-gray-500">PID: {patient.id}</p></div></div></td>
                  <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                    {patient.age} / {patient.gender}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                    {patient.contact}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {patient.condition}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                    {patient.lastVisit}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={patient.status} /></td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-3 text-gray-400">
                      <button className="hover:text-gray-600 transition-colors"><Eye className="w-4 h-4" /></button>
                      <button className="hover:text-gray-600 transition-colors"><Calendar className="w-4 h-4" /></button>
                      <button className="hover:text-gray-600 transition-colors"><MoreVertical className="w-4 h-4" /></button></div></td></tr>
              ))}
            </tbody></table></div>

        {/* Pagination */}
        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm text-gray-600 font-medium">Showing 1 to 8 of 248 patients</p>
          <div className="flex items-center gap-1">
            <button className="w-8 h-8 flex items-center justify-center rounded border border-gray-200 text-gray-500 hover:bg-gray-50"><ChevronLeft className="w-4 h-4" /></button>
            <button className="w-8 h-8 flex items-center justify-center rounded bg-[#00B9D6] text-white font-semibold text-sm">1</button>
            <button className="w-8 h-8 flex items-center justify-center rounded border border-gray-200 text-gray-600 hover:bg-gray-50 font-semibold text-sm">2</button>
            <button className="w-8 h-8 flex items-center justify-center rounded border border-gray-200 text-gray-600 hover:bg-gray-50 font-semibold text-sm">3</button>
            <button className="w-8 h-8 flex items-center justify-center rounded border border-gray-200 text-gray-600 hover:bg-gray-50 font-semibold text-sm">4</button>
            <button className="w-8 h-8 flex items-center justify-center rounded border border-gray-200 text-gray-600 hover:bg-gray-50 font-semibold text-sm">5</button>
            <span className="w-8 h-8 flex items-center justify-center text-gray-400">...</span>
            <button className="w-8 h-8 flex items-center justify-center rounded border border-gray-200 text-gray-600 hover:bg-gray-50 font-semibold text-sm">31</button>
            <button className="w-8 h-8 flex items-center justify-center rounded border border-gray-200 text-gray-500 hover:bg-gray-50"><ChevronRight className="w-4 h-4" /></button></div></div></main></div>
  );
};

const StatCard = ({ title, value, subtext, icon: Icon, iconColor, bgColor }) => (
  <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col gap-4">
    <div className="flex items-center gap-3">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${bgColor}`}>
        <Icon className={`w-5 h-5 ${iconColor}`} /></div>
      <div>
        <h3 className="text-xs font-bold text-gray-500">{title}</h3>
        <p className="text-2xl font-extrabold text-gray-900 leading-none mt-1">{value}</p></div></div>
    <p className="text-xs text-gray-400 font-medium">{subtext}</p></div>
);

const StatusBadge = ({ status }) => {
  const getStyles = () => {
    switch (status) {
      case 'Active':
        return 'bg-green-50 text-green-600';
      case 'Follow-up Due':
        return 'bg-yellow-50 text-yellow-600';
      case 'Inactive':
        return 'bg-gray-100 text-gray-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${getStyles()}`}>
      {status}</span>
  );
};

export default Patients;
