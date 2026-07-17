import React, { useState, useEffect } from 'react';
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
  Plus,
  Loader2
} from 'lucide-react';
import { appointmentService } from '../services/appointmentService';

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await appointmentService.getDoctorPatients();
        if (res.success) {
          setPatients(res.data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchPatients();
  }, []);

  const filtered = patients.filter(p => 
    search === '' || 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.contact.includes(search)
  );

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
          <StatCard title="Total Patients" value={patients.length} subtext="All time patients" icon={Users} iconColor="text-blue-500" bgColor="bg-blue-50" />
          <StatCard title="New Patients" value={patients.length} subtext="This month" icon={UserPlus} iconColor="text-teal-500" bgColor="bg-teal-50" />
          <StatCard title="Active Patients" value={patients.filter(p => p.status === 'Active').length} subtext="Currently in treatment" icon={Calendar} iconColor="text-purple-500" bgColor="bg-purple-50" />
          <StatCard title="Follow-up Due" value={patients.filter(p => p.status === 'Follow-up Due').length} subtext="Need attention" icon={Heart} iconColor="text-yellow-500" bgColor="bg-yellow-50" />
          <StatCard title="Records" value={patients.length} subtext="Total medical records" icon={FileText} iconColor="text-green-500" bgColor="bg-green-50" /></div>
        {/* Filters & Search */}
        <div className="bg-white p-4 rounded-t-xl border border-gray-200 border-b-0 flex flex-col lg:flex-row items-center gap-4">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search patients by name, ID or phone number..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
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
              {loading ? (
                <tr><td colSpan={7} className="px-6 py-10 text-center"><Loader2 className="w-6 h-6 text-[#00B9D6] animate-spin mx-auto" /></td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={7} className="px-6 py-10 text-center text-gray-500 font-medium">No patients found.</td></tr>
              ) : filtered.map((patient) => (
                <tr key={patient.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={patient.img} alt={patient.name} className="w-10 h-10 rounded-full object-cover bg-gray-100" />
                      <div>
                        <p className="text-sm font-bold text-gray-900">{patient.name}</p>
                        <p className="text-xs text-gray-500">{patient.id}</p></div></div></td>
                  <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                    {patient.age} / {patient.gender}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                    {patient.contact}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 truncate max-w-[150px]">
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
          <p className="text-sm text-gray-600 font-medium">Showing {filtered.length} of {patients.length} patients</p>
        </div>
      </main>
    </div>
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
