import React, { useState, useEffect } from 'react';
import { CalendarDays, Users, CheckCircle2, XCircle, Search, Plus, ChevronDown, BriefcaseMedical, Bell, Settings, Clock, Stethoscope, User, Loader2 } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { appointmentService } from '../services/appointmentService';
const NAV_ITEMS = ['Dashboard', 'Patient Registration', 'Appointments', 'Billing', 'Patient Queue'];
const NAV_PATHS = { Dashboard: '/receptionist/dashboard', 'Patient Registration': '/receptionist/patient-registration', Appointments: '/receptionist/appointments', Billing: '/receptionist/billing', 'Patient Queue': '/receptionist/patient-queue' };

const today = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

export default function ReceptionistAppointments() {
  const [search, setSearch] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [actionLoading, setActionLoading] = useState({});
  // Fetch all appointments from backend
  const fetchAll = async () => {
    try {
      const res = await appointmentService.getAllAppointments();
      if (res.success) {
        setAppointments(res.data);
        setRequests(res.data.filter(a => a.status === 'Pending'));
      }
    } catch (e) { console.error(e); }
    finally { setLoadingRequests(false); }
  };
  useEffect(() => { fetchAll(); }, []);
  const handleRequestAction = async (id, status) => {
    setActionLoading(prev => ({ ...prev, [id]: status }));
    try {
      const res = await appointmentService.updateAppointmentStatus(id, status);
      if (res.success) {
        setRequests(prev => prev.filter(r => r._id !== id));
        setAppointments(prev => prev.map(a => a._id === id ? { ...a, status } : a));
      }
    } catch(e) { console.error(e); }
    finally { setActionLoading(prev => ({ ...prev, [id]: null })); }
  };
  const filtered = appointments.filter(a =>
    (a.fullName || '').toLowerCase().includes(search.toLowerCase()) ||
    (a.doctor || '').toLowerCase().includes(search.toLowerCase()) ||
    (a.department || '').toLowerCase().includes(search.toLowerCase())
  );
  const handleStatusChange = async (id, status) => {
    try {
      const res = await appointmentService.updateAppointmentStatus(id, status);
      if (res.success) setAppointments(prev => prev.map(a => a._id === id ? { ...a, status } : a));
    } catch(e) { console.error(e); }
  };
  const stats = [
    { icon: <CalendarDays className="w-6 h-6 text-[#0487BD]" />, label: "TODAY'S APPOINTMENTS", value: appointments.length },
    { icon: <Users className="w-6 h-6 text-[#0487BD]" />, label: 'CONFIRMATION PENDING', value: requests.length },
    { icon: <CheckCircle2 className="w-6 h-6 text-green-500" />, label: 'COMPLETED', value: appointments.filter(a => a.status === 'Completed').length, sub: 'Completed today' },
    { icon: <XCircle className="w-6 h-6 text-red-500" />, label: 'CANCELLED', value: appointments.filter(a => a.status === 'Cancelled').length, sub: 'View and upload' },
  ];

  return (
    <div className="min-h-screen bg-[#F0F4F8] font-sans">
      {/* Navbar — Doctor panel style */}
      <header className="bg-white border-b border-gray-100 py-3 px-6 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        {/* Logo — Landing/Doctor panel style */}
        <div className="flex items-center gap-2">
          <BriefcaseMedical className="w-7 h-7 text-blue-600" />
          <span className="text-xl font-extrabold bg-gradient-to-r from-[#00B9D6] to-[#004AC6] bg-clip-text text-transparent mr-4">AxisCare</span>
        </div>
        {/* Nav links */}
        <nav className="hidden lg:flex items-center gap-1">
          {NAV_ITEMS.map(name => (
            <NavLink key={name} to={NAV_PATHS[name]} className={({ isActive }) => `flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${isActive ? 'bg-[#00B9D6] text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}>{name}</NavLink>
          ))}
        </nav>
        {/* Right side — Doctor panel style */}
        <div className="flex items-center gap-4">
          <button className="text-gray-400 hover:text-gray-600 relative transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
          </button>
          <button className="text-gray-400 hover:text-gray-600 transition-colors"><Settings className="w-5 h-5" /></button>
          <div className="h-8 w-px bg-gray-200 mx-2" />
          <div className="flex items-center gap-3 cursor-pointer group">
            <div className="text-right hidden sm:block group-hover:opacity-80 transition-opacity">
              <p className="text-sm font-bold text-gray-800 leading-tight">Axis Reception</p>
              <p className="text-xs text-gray-500 font-medium leading-tight">Receptionist</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#00B9D6] flex items-center justify-center text-white font-bold text-sm border-2 border-white shadow-sm">A</div>
            <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-6">
        {/* Title + Date */}
        <div className="flex items-center justify-between mb-5">
          <h1 className="text-2xl font-bold text-[#0a3d6a]">Today's Appointments..</h1>
          <div className="flex items-center gap-2 border border-gray-300 rounded-md px-3 py-1.5 text-sm text-gray-600 bg-white shadow-sm cursor-pointer">
            <CalendarDays className="w-4 h-4 text-[#0487BD]" />
            {today}
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {stats.map((s, i) => (
            <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex flex-col gap-1">
              <div className="flex items-center gap-2">{s.icon}<span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide leading-tight">{s.label}</span></div>
              <span className="text-2xl font-bold text-[#0a3d6a]">{s.value}</span>
              {s.sub && <span className="text-[10px] text-gray-400">{s.sub}</span>}
            </div>
          ))}
        </div>

        {/* Appointment Requests */}
        <div className="mb-6">
          <h2 className="text-sm font-extrabold text-[#0a3d6a] tracking-wide mb-3">APPOINTMENT REQUESTS <span className="ml-2 bg-yellow-100 text-yellow-700 text-[10px] font-bold px-2 py-0.5 rounded-full">{requests.length} Pending</span></h2>
          {loadingRequests ? (
            <div className="flex items-center justify-center py-10 bg-white rounded-xl border border-gray-100"><Loader2 className="w-6 h-6 text-[#0487BD] animate-spin" /><span className="ml-2 text-sm text-gray-400">Loading requests...</span></div>
          ) : requests.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-100 py-10 text-center text-gray-400 text-sm">No pending appointment requests</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {requests.map(r => (
                <div key={r._id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex flex-col gap-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-bold text-[#0a3d6a]">{r.fullName}</p>
                      <p className="text-[11px] text-gray-400 font-medium">{r.appointmentId}</p>
                    </div>
                    <span className="bg-yellow-100 text-yellow-700 text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap">PENDING</span>
                  </div>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-center gap-2 text-gray-600"><Stethoscope className="w-3.5 h-3.5 text-[#0487BD] flex-shrink-0" /><span className="font-semibold">{r.doctor}</span><span className="text-gray-400">·</span><span>{r.department}</span></div>
                    <div className="flex items-center gap-2 text-gray-600"><Clock className="w-3.5 h-3.5 text-[#0487BD] flex-shrink-0" /><span>{r.preferredDate} at {r.preferredTime}</span></div>
                    <div className="flex items-center gap-2 text-gray-600"><User className="w-3.5 h-3.5 text-[#0487BD] flex-shrink-0" /><span>{r.appointmentType} · {r.reasonForVisit}</span></div>
                  </div>
                  <div className="flex gap-2 pt-1">
                    <button onClick={() => handleRequestAction(r._id, 'Scheduled')} disabled={!!actionLoading[r._id]} className="flex-1 bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white text-xs font-bold py-1.5 rounded-lg transition-colors">
                      {actionLoading[r._id] === 'Scheduled' ? '...' : '✓ Accept'}
                    </button>
                    <button onClick={() => handleRequestAction(r._id, 'Cancelled')} disabled={!!actionLoading[r._id]} className="flex-1 bg-red-100 hover:bg-red-200 disabled:opacity-60 text-red-700 text-xs font-bold py-1.5 rounded-lg transition-colors">
                      {actionLoading[r._id] === 'Cancelled' ? '...' : '✕ Reject'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Appointment Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h2 className="text-sm font-extrabold text-[#0a3d6a] tracking-wide">APPOINTMENT TABLE:</h2>
            <button className="bg-[#0a3d6a] hover:bg-[#0b4d84] text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-1.5 transition-colors shadow">
              <Plus className="w-3.5 h-3.5" /> NEW APPOINTMENT
            </button>
          </div>

          {/* Search */}
          <div className="px-5 py-3 border-b border-gray-100">
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
              <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <input className="bg-transparent text-sm text-gray-600 outline-none w-full placeholder-gray-400" placeholder="Search appointments by patient name" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[700px]">
              <thead>
                <tr className="bg-[#0487BD] text-white text-xs font-bold uppercase tracking-wide">
                  {['Time', 'Patient', 'Doctor', 'Department', 'View', 'Status'].map(h => (
                    <th key={h} className="py-3.5 px-4 text-left">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.length === 0 ? (
                  <tr><td colSpan={6} className="py-10 text-center text-gray-400 text-sm">No appointments found</td></tr>
                ) : filtered.map(a => (
                  <tr key={a.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-[#0a3d6a] whitespace-nowrap">{a.preferredTime || '—'}</td>
                    <td className="py-3.5 px-4 font-bold text-[#0a3d6a] whitespace-nowrap">{a.fullName}</td>
                    <td className="py-3.5 px-4 font-semibold text-gray-700 whitespace-nowrap">{a.doctor}</td>
                    <td className="py-3.5 px-4 font-bold text-[#0a3d6a] whitespace-nowrap">{a.department}</td>
                    <td className="py-3.5 px-4">
                      <button className="bg-[#0487BD] hover:bg-[#0369a1] text-white text-[10px] font-bold px-3 py-1 rounded-full transition-colors whitespace-nowrap">VIEW DETAILS</button>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <button onClick={() => handleStatusChange(a._id, 'Scheduled')} className={`text-[10px] font-bold px-2.5 py-1 rounded-full transition-colors whitespace-nowrap ${a.status === 'Scheduled' ? 'bg-green-600 text-white' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}>CHECK-IN</button>
                        <button onClick={() => handleStatusChange(a._id, 'Rescheduled')} className={`text-[10px] font-bold px-2.5 py-1 rounded-full transition-colors whitespace-nowrap ${a.status === 'Rescheduled' ? 'bg-orange-500 text-white' : 'bg-orange-100 text-orange-700 hover:bg-orange-200'}`}>RESCHEDULE</button>
                        <button onClick={() => handleStatusChange(a._id, 'Cancelled')} className={`text-[10px] font-bold px-2.5 py-1 rounded-full transition-colors whitespace-nowrap ${a.status === 'Cancelled' ? 'bg-red-600 text-white' : 'bg-red-100 text-red-700 hover:bg-red-200'}`}>CANCEL</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
