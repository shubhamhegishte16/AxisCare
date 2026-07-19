import React, { useState, useEffect } from 'react';
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
  MoreVertical,
  User,
  ChevronLeft,
  ChevronRight,
  X,
  Loader2
} from 'lucide-react';
import { appointmentService } from '../services/appointmentService';
import { apiOriginUrl } from '../config/api';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All Appointments');
  const [search, setSearch] = useState('');
  const [selectedApt, setSelectedApt] = useState(null);
  const [menuOpenId, setMenuOpenId] = useState(null);

  const tabs = ['All Appointments', 'Today', 'Upcoming', 'Completed', 'Cancelled'];

  const fetchAppointments = async () => {
    try {
      const res = await appointmentService.getDoctorAppointments();
      if (res.success) {
        setAppointments(res.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return;
    try {
      const res = await appointmentService.cancelAppointmentByDoctor(id);
      if (res.success) {
        setAppointments(prev => prev.map(a => a._id === id ? { ...a, status: 'Cancelled' } : a));
      }
    } catch (e) {
      alert(e.message || 'Failed to cancel appointment');
    }
    setMenuOpenId(null);
  };

  const handleComplete = async (id) => {
    if (!window.confirm('Mark this appointment as completed?')) return;
    try {
      const res = await appointmentService.completeAppointmentByDoctor(id);
      if (res.success) {
        setAppointments(prev => prev.map(a => a._id === id ? { ...a, status: 'Completed' } : a));
      }
    } catch (e) {
      alert(e.message || 'Failed to complete appointment');
    }
    setMenuOpenId(null);
  };

  const filtered = appointments.filter(a => {
    if (search && !a.fullName.toLowerCase().includes(search.toLowerCase())) return false;
    if (activeTab === 'Completed' && a.status !== 'Completed') return false;
    if (activeTab === 'Cancelled' && a.status !== 'Cancelled') return false;
    if (activeTab === 'Upcoming' && a.status !== 'Scheduled') return false;
    // Today logic could be added based on preferredDate, simplifying for now
    return true;
  });

  const todayStr = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

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
          <StatCard title="Total Appointments" value={appointments.length} subtext="All time" subtextColor="text-blue-500" icon={Calendar} iconColor="text-blue-500" bgColor="bg-blue-50" />
          <StatCard title="Upcoming" value={appointments.filter(a => a.status === 'Scheduled').length} subtext="Scheduled" icon={Clock} iconColor="text-blue-500" bgColor="bg-blue-50" />
          <StatCard title="Completed" value={appointments.filter(a => a.status === 'Completed').length} subtext="All time" icon={CheckCircle2} iconColor="text-green-500" bgColor="bg-green-50" />
          <StatCard title="Cancelled" value={appointments.filter(a => a.status === 'Cancelled').length} subtext="All time" icon={XCircle} iconColor="text-red-500" bgColor="bg-red-50" /></div>
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
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00B9D6] focus:border-transparent transition-all"
              /></div>
          </div></div>
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
              {loading ? (
                <tr><td colSpan={7} className="px-6 py-10 text-center"><Loader2 className="w-6 h-6 text-blue-500 animate-spin mx-auto" /></td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={7} className="px-6 py-10 text-center text-gray-500 font-medium">No appointments found.</td></tr>
              ) : filtered.map((appointment) => (
                <tr key={appointment._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-bold text-gray-900 whitespace-nowrap">
                    {appointment.preferredDate}<br/><span className="text-gray-500 font-medium text-xs">{appointment.preferredTime}</span></td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">{appointment.fullName.charAt(0)}</div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">{appointment.fullName}</p>
                        <p className="text-xs text-gray-500 font-medium">{appointment.appointmentId}</p></div></div></td>
                  <td className="px-6 py-4 text-sm text-gray-600 font-medium whitespace-nowrap">
                    {appointment.age} / {appointment.gender}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm font-bold text-gray-900 max-w-[150px] truncate">{appointment.reasonForVisit}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={appointment.status} /></td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1.5 text-blue-600 font-semibold text-sm">
                      <User className="w-4 h-4" /> {appointment.appointmentType}</div></td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center justify-end gap-3 text-gray-500 relative">
                      <button onClick={() => setSelectedApt(appointment)} className="hover:text-blue-600 transition-colors" title="View Details"><Eye className="w-5 h-5" /></button>
                      <button onClick={() => setMenuOpenId(menuOpenId === appointment._id ? null : appointment._id)} className="hover:text-gray-900 transition-colors relative"><MoreVertical className="w-5 h-5" /></button>
                      
                      {menuOpenId === appointment._id && (
                        <div className="absolute right-0 top-full mt-1 w-36 bg-white rounded-md shadow-lg border border-gray-100 z-10 py-1 flex flex-col">
                           {appointment.status !== 'Completed' && appointment.status !== 'Cancelled' && (
                             <>
                               <button onClick={() => handleComplete(appointment._id)} className="w-full text-left px-4 py-2 text-sm text-green-600 hover:bg-green-50 font-medium">Complete Apt</button>
                               <button onClick={() => handleCancel(appointment._id)} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-medium">Cancel Apt</button>
                             </>
                           )}
                        </div>
                      )}
                    </div></td></tr>
              ))}
            </tbody></table></div>
        {/* Pagination */}
        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm text-gray-600 font-medium">Showing {filtered.length} of {appointments.length} appointments</p>
        </div>
      </main>

      {/* Appointment Details Modal */}
      {selectedApt && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50">
              <h2 className="text-lg font-bold text-gray-900">Appointment Details</h2>
              <button onClick={() => setSelectedApt(null)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              
              <div className="flex items-center gap-4">
                 <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xl">{selectedApt.fullName.charAt(0)}</div>
                 <div>
                    <h3 className="text-xl font-bold text-gray-900">{selectedApt.fullName}</h3>
                    <p className="text-sm text-gray-500 font-medium">{selectedApt.appointmentId} • {selectedApt.age} yrs • {selectedApt.gender}</p>
                 </div>
                 <div className="ml-auto">
                    <StatusBadge status={selectedApt.status} />
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-6">
                 <div>
                   <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Date & Time</p>
                   <p className="text-sm font-semibold text-gray-900">{selectedApt.preferredDate} at {selectedApt.preferredTime}</p>
                 </div>
                 <div>
                   <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Type</p>
                   <p className="text-sm font-semibold text-gray-900">{selectedApt.appointmentType}</p>
                 </div>
                 <div>
                   <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Contact</p>
                   <p className="text-sm font-semibold text-gray-900">{selectedApt.phoneNumber}</p>
                   <p className="text-sm text-gray-500">{selectedApt.email}</p>
                 </div>
                 <div>
                   <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Address</p>
                   <p className="text-sm font-semibold text-gray-900">{selectedApt.address}</p>
                 </div>
              </div>

              <div className="border-t border-gray-100 pt-6">
                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-2">Reason for Visit</p>
                <p className="text-sm text-gray-800 bg-gray-50 p-3 rounded-lg border border-gray-100">{selectedApt.reasonForVisit}</p>
              </div>

              {selectedApt.symptoms && (
                <div>
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-2">Symptoms & Notes</p>
                  <p className="text-sm text-gray-800 bg-orange-50 p-3 rounded-lg border border-orange-100 whitespace-pre-wrap">{selectedApt.symptoms}</p>
                </div>
              )}

              {selectedApt.documentPath && (
                 <div className="flex justify-end">
                    <a href={apiOriginUrl(selectedApt.documentPath)} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 font-semibold hover:underline">View Uploaded Document</a>
                 </div>
              )}

            </div>
            <div className="p-4 border-t bg-gray-50 flex justify-end">
              <button onClick={() => setSelectedApt(null)} className="px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-bold rounded-lg hover:bg-gray-100">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
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
      case 'Scheduled':
        return 'bg-blue-100 text-blue-700';
      case 'Pending':
        return 'bg-yellow-50 text-yellow-600';
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
