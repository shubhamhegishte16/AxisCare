import React, { useState, useEffect } from 'react';
import {
  CalendarDays,
  Users,
  CheckCircle2,
  XCircle,
  Search,
  Plus,
  ChevronDown,
  Clock,
  Stethoscope,
  User,
  Loader2,
  X,
  AlertCircle,
} from 'lucide-react';
import { appointmentService } from '../services/appointmentService';
import ReceptionistLayout from './ReceptionistLayout';

const today = new Date().toLocaleDateString('en-GB', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

/* ---------------- Small building blocks (match ReceptionistDashboard) ---------------- */

const StatCard = ({ icon: Icon, iconColor, label, value, sub }) => (
  <div className="bg-white rounded-[18px] border border-slate-100 shadow-sm p-5 flex items-center justify-between hover:-translate-y-0.5 hover:shadow-md transition-all duration-200">
    <div>
      <p className="text-xs font-bold text-slate-400 tracking-wide uppercase mb-2">{label}</p>
      <p className="text-3xl font-extrabold text-slate-800">{value}</p>
      {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
    </div>
    <div className="w-12 h-12 rounded-2xl bg-[#EFF6FF] flex items-center justify-center">
      <Icon className={`w-6 h-6 ${iconColor}`} />
    </div>
  </div>
);

const Field = ({ label, ...props }) => (
  <div>
    <label className="block text-xs font-bold text-slate-500 mb-1.5">{label}</label>
    <input
      {...props}
      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-[#F8FAFC] text-sm outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]/40 transition-all"
    />
  </div>
);

const appointmentStatusStyles = {
  Scheduled: 'bg-emerald-50 text-emerald-600',
  Rescheduled: 'bg-amber-50 text-amber-600',
  Cancelled: 'bg-red-50 text-red-500',
  Pending: 'bg-blue-50 text-[#2563EB]',
};

const emptyNewAppointment = {
  phoneNumber: '', fullName: '', email: '', age: '', gender: '', address: '',
  department: '', doctor: '', appointmentType: 'In-Person',
  preferredDate: '', preferredTime: '', reasonForVisit: '', symptoms: '',
};

export default function ReceptionistAppointments() {
  const [search, setSearch] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [actionLoading, setActionLoading] = useState({});

  const [showNewModal, setShowNewModal] = useState(false);
  const [newAppointment, setNewAppointment] = useState(emptyNewAppointment);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState('');

  const fetchAll = async () => {
    try {
      const res = await appointmentService.getAllAppointments();
      if (res.success) {
        setAppointments(res.data);
        setRequests(res.data.filter((a) => a.status === 'Pending'));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingRequests(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleRequestAction = async (id, status) => {
    setActionLoading((prev) => ({ ...prev, [id]: status }));
    try {
      const res = await appointmentService.updateAppointmentStatus(id, status);
      if (res.success) {
        setRequests((prev) => prev.filter((r) => r._id !== id));
        setAppointments((prev) => prev.map((a) => (a._id === id ? { ...a, status } : a)));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoading((prev) => ({ ...prev, [id]: null }));
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      const res = await appointmentService.updateAppointmentStatus(id, status);
      if (res.success) setAppointments((prev) => prev.map((a) => (a._id === id ? { ...a, status } : a)));
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreateAppointment = async (e) => {
    e.preventDefault();
    const required = ['phoneNumber', 'fullName', 'department', 'doctor', 'appointmentType', 'preferredDate', 'preferredTime', 'reasonForVisit'];
    const missing = required.some((f) => !newAppointment[f]);
    if (missing) {
      setCreateError('Please fill all required fields (marked *).');
      return;
    }
    setCreateError('');
    setCreating(true);
    try {
      const res = await appointmentService.createAppointmentByReceptionist(newAppointment);
      if (res.success) {
        setAppointments((prev) => [res.data, ...prev]);
        setNewAppointment(emptyNewAppointment);
        setShowNewModal(false);
      }
    } catch (err) {
      setCreateError(err.message || 'Failed to create appointment. Make sure the patient is registered first.');
    } finally {
      setCreating(false);
    }
  };

  const filtered = appointments.filter(
    (a) =>
      (a.fullName || '').toLowerCase().includes(search.toLowerCase()) ||
      (a.doctor || '').toLowerCase().includes(search.toLowerCase()) ||
      (a.department || '').toLowerCase().includes(search.toLowerCase())
  );

  const stats = [
    { icon: CalendarDays, iconColor: 'text-[#2563EB]', label: "Today's Appointments", value: appointments.length },
    { icon: Users, iconColor: 'text-[#2563EB]', label: 'Confirmation Pending', value: requests.length },
    { icon: CheckCircle2, iconColor: 'text-emerald-500', label: 'Completed', value: appointments.filter((a) => a.status === 'Completed').length, sub: 'Completed today' },
    { icon: XCircle, iconColor: 'text-red-500', label: 'Cancelled', value: appointments.filter((a) => a.status === 'Cancelled').length },
  ];

  return (
    <ReceptionistLayout>
      {/* Title + Date */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <h1 className="text-2xl font-extrabold text-slate-800">Today's Appointments</h1>
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-500 bg-white border border-slate-100 rounded-full px-4 py-2 shadow-sm cursor-pointer">
          <CalendarDays className="w-4 h-4 text-[#2563EB]" />
          {today}
          <ChevronDown className="w-4 h-4 text-slate-400" />
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      {/* Appointment requests */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-base font-bold text-slate-800">Appointment Requests</h2>
          <span className="bg-amber-50 text-amber-600 text-xs font-bold px-2.5 py-1 rounded-full">
            {requests.length} Pending
          </span>
        </div>

        {loadingRequests ? (
          <div className="flex items-center justify-center gap-2 py-10 bg-white rounded-[18px] border border-slate-100 shadow-sm">
            <Loader2 className="w-5 h-5 text-[#2563EB] animate-spin" />
            <span className="text-sm text-slate-400">Loading requests...</span>
          </div>
        ) : requests.length === 0 ? (
          <div className="bg-white rounded-[18px] border border-slate-100 shadow-sm py-10 text-center text-sm text-slate-400">
            No pending appointment requests
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {requests.map((r) => (
              <div key={r._id} className="bg-white rounded-[18px] border border-slate-100 shadow-sm p-5 flex flex-col gap-3">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-bold text-slate-800">{r.fullName}</p>
                    <p className="text-xs text-slate-400 font-medium">{r.appointmentId}</p>
                  </div>
                  <span className="bg-amber-50 text-amber-600 text-[10px] font-bold px-2 py-1 rounded-full whitespace-nowrap">
                    PENDING
                  </span>
                </div>
                <div className="space-y-1.5 text-xs text-slate-500">
                  <div className="flex items-center gap-2">
                    <Stethoscope className="w-3.5 h-3.5 text-[#2563EB] shrink-0" />
                    <span className="font-semibold text-slate-700">{r.doctor}</span>
                    <span className="text-slate-300">·</span>
                    <span>{r.department}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-[#2563EB] shrink-0" />
                    <span>{r.preferredDate} at {r.preferredTime}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-[#2563EB] shrink-0" />
                    <span>{r.appointmentType} · {r.reasonForVisit}</span>
                  </div>
                </div>
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => handleRequestAction(r._id, 'Scheduled')}
                    disabled={!!actionLoading[r._id]}
                    className="flex-1 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-60 text-white text-xs font-bold py-2 rounded-xl transition-colors"
                  >
                    {actionLoading[r._id] === 'Scheduled' ? '...' : '✓ Accept'}
                  </button>
                  <button
                    onClick={() => handleRequestAction(r._id, 'Cancelled')}
                    disabled={!!actionLoading[r._id]}
                    className="flex-1 bg-red-50 hover:bg-red-100 disabled:opacity-60 text-red-500 text-xs font-bold py-2 rounded-xl transition-colors"
                  >
                    {actionLoading[r._id] === 'Cancelled' ? '...' : '✕ Reject'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Appointment table */}
      <div className="bg-white rounded-[18px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b border-slate-100">
          <h2 className="text-base font-bold text-slate-800">Appointment Table</h2>
          <button
            onClick={() => setShowNewModal(true)}
            className="flex items-center justify-center gap-1.5 bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> New Appointment
          </button>
        </div>

        {/* Search */}
        <div className="px-5 py-3 border-b border-slate-100">
          <div className="relative max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              className="w-full pl-11 pr-4 py-2.5 rounded-full bg-[#F8FAFC] border border-slate-100 text-sm outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]/40 transition-all"
              placeholder="Search appointments by patient name"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-slate-400 uppercase tracking-wide bg-[#F8FAFC]">
                {['Time', 'Patient', 'Doctor', 'Department', 'View', 'Status'].map((h) => (
                  <th key={h} className="px-5 py-3 font-bold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-sm text-slate-400">No appointments found</td>
                </tr>
              ) : (
                filtered.map((a) => (
                  <tr key={a._id} className="border-t border-slate-50 hover:bg-[#F8FAFC]/70 transition-colors">
                    <td className="px-5 py-3 font-semibold text-slate-600 whitespace-nowrap">{a.preferredTime || '—'}</td>
                    <td className="px-5 py-3 font-bold text-slate-800 whitespace-nowrap">{a.fullName}</td>
                    <td className="px-5 py-3 text-slate-500 whitespace-nowrap">{a.doctor}</td>
                    <td className="px-5 py-3 text-slate-500 whitespace-nowrap">{a.department}</td>
                    <td className="px-5 py-3">
                      <button className="bg-blue-50 hover:bg-blue-100 text-[#2563EB] text-[10px] font-bold px-3 py-1.5 rounded-full transition-colors whitespace-nowrap">
                        VIEW DETAILS
                      </button>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <button
                          onClick={() => handleStatusChange(a._id, 'Scheduled')}
                          className={`text-[10px] font-bold px-2.5 py-1 rounded-full transition-colors whitespace-nowrap ${
                            a.status === 'Scheduled' ? 'bg-emerald-500 text-white' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                          }`}
                        >
                          CHECK-IN
                        </button>
                        <button
                          onClick={() => handleStatusChange(a._id, 'Rescheduled')}
                          className={`text-[10px] font-bold px-2.5 py-1 rounded-full transition-colors whitespace-nowrap ${
                            a.status === 'Rescheduled' ? 'bg-amber-500 text-white' : 'bg-amber-50 text-amber-600 hover:bg-amber-100'
                          }`}
                        >
                          RESCHEDULE
                        </button>
                        <button
                          onClick={() => handleStatusChange(a._id, 'Cancelled')}
                          className={`text-[10px] font-bold px-2.5 py-1 rounded-full transition-colors whitespace-nowrap ${
                            a.status === 'Cancelled' ? 'bg-red-500 text-white' : 'bg-red-50 text-red-500 hover:bg-red-100'
                          }`}
                        >
                          CANCEL
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Appointment Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <div className="bg-white rounded-[18px] shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 sticky top-0 bg-white rounded-t-[18px]">
              <h2 className="text-base font-bold text-slate-800">New Appointment</h2>
              <button
                onClick={() => { setShowNewModal(false); setCreateError(''); }}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateAppointment} className="p-6 flex flex-col gap-4">
              {createError && (
                <div className="flex items-center gap-2 bg-red-50 text-red-600 text-sm font-semibold px-4 py-3 rounded-xl">
                  <AlertCircle className="w-4 h-4 shrink-0" /> {createError}
                </div>
              )}
              <p className="text-xs text-slate-400 -mt-1">
                Patient must already be registered. We look them up by phone number.
              </p>

              <Field
                label="Patient Phone Number *"
                placeholder="Registered phone number"
                value={newAppointment.phoneNumber}
                onChange={(e) => setNewAppointment({ ...newAppointment, phoneNumber: e.target.value })}
              />
              <Field
                label="Patient Full Name *"
                placeholder="Full name"
                value={newAppointment.fullName}
                onChange={(e) => setNewAppointment({ ...newAppointment, fullName: e.target.value })}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field
                  label="Email"
                  type="email"
                  placeholder="patient@email.com"
                  value={newAppointment.email}
                  onChange={(e) => setNewAppointment({ ...newAppointment, email: e.target.value })}
                />
                <Field
                  label="Age"
                  placeholder="Age"
                  value={newAppointment.age}
                  onChange={(e) => setNewAppointment({ ...newAppointment, age: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field
                  label="Department *"
                  placeholder="e.g. Cardiology"
                  value={newAppointment.department}
                  onChange={(e) => setNewAppointment({ ...newAppointment, department: e.target.value })}
                />
                <Field
                  label="Doctor *"
                  placeholder="e.g. Dr. Ananya Sharma"
                  value={newAppointment.doctor}
                  onChange={(e) => setNewAppointment({ ...newAppointment, doctor: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5">Type *</label>
                  <select
                    value={newAppointment.appointmentType}
                    onChange={(e) => setNewAppointment({ ...newAppointment, appointmentType: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-[#F8FAFC] text-sm outline-none focus:ring-2 focus:ring-[#2563EB]/20"
                  >
                    <option>In-Person</option>
                    <option>Video Consult</option>
                  </select>
                </div>
                <Field
                  label="Date *"
                  type="date"
                  value={newAppointment.preferredDate}
                  onChange={(e) => setNewAppointment({ ...newAppointment, preferredDate: e.target.value })}
                />
                <Field
                  label="Time *"
                  type="time"
                  value={newAppointment.preferredTime}
                  onChange={(e) => setNewAppointment({ ...newAppointment, preferredTime: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5">Reason for Visit *</label>
                <input
                  value={newAppointment.reasonForVisit}
                  onChange={(e) => setNewAppointment({ ...newAppointment, reasonForVisit: e.target.value })}
                  placeholder="Brief reason for visit"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-[#F8FAFC] text-sm outline-none focus:ring-2 focus:ring-[#2563EB]/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5">Symptoms</label>
                <textarea
                  rows={2}
                  value={newAppointment.symptoms}
                  onChange={(e) => setNewAppointment({ ...newAppointment, symptoms: e.target.value })}
                  placeholder="Optional"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-[#F8FAFC] text-sm outline-none focus:ring-2 focus:ring-[#2563EB]/20 resize-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={creating}
                  className="flex-1 bg-[#2563EB] hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-bold py-2.5 rounded-xl transition-colors"
                >
                  {creating ? 'Creating…' : 'Create Appointment'}
                </button>
                <button
                  type="button"
                  onClick={() => { setShowNewModal(false); setCreateError(''); }}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-bold py-2.5 rounded-xl transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </ReceptionistLayout>
  );
}
