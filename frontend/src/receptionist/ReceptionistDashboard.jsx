import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CalendarCheck,
  Users,
  UserPlus2,
  Stethoscope,
  Eye,
  LogIn,
  RefreshCcw,
  PhoneCall,
  CheckCircle2,
  UserPlus,
  CalendarPlus,
  BadgeCheck,
  Printer,
  Siren,
  Bell,
  FileCheck2,
  Receipt,
  AlertTriangle,
  Loader2,
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import ReceptionistLayout from './ReceptionistLayout';
import { appointmentService } from '../services/appointmentService';
import { patientService } from '../services/patientService';
import { receptionistService } from '../services/receptionistService';

/* ---------------- Static bits with no backing endpoint yet ---------------- */

const quickActionsBase = [
  { label: 'Register Patient', icon: UserPlus, path: '/receptionist/register-patient' },
  { label: 'Book Appointment', icon: CalendarPlus, path: '/receptionist/appointments' },
  { label: 'Generate Patient ID', icon: BadgeCheck, path: '/receptionist/register-patient' },
  { label: 'Print Queue Token', icon: Printer, path: '/receptionist/walk-in-queue' },
  { label: 'Emergency Registration', icon: Siren, danger: true, path: '/receptionist/register-patient' },
];

// No notifications backend/model exists yet — this panel stays illustrative
// until one is built.
const notifications = [
  { title: 'Appointment Reminder', desc: 'Check today\u2019s upcoming appointments', time: 'today', unread: true, icon: CalendarCheck },
  { title: 'New Walk-in', desc: 'Keep an eye on the live queue', time: 'today', unread: true, icon: Users },
  { title: 'Lab Report Ready', desc: 'Coming soon — lab integration', time: '\u2014', unread: false, icon: FileCheck2 },
  { title: 'Billing Completed', desc: 'See the Billing page for invoices', time: 'today', unread: false, icon: Receipt },
  { title: 'Emergency Case', desc: 'Emergency walk-ins are flagged in the queue', time: 'today', unread: true, icon: AlertTriangle },
];

const statusStyles = {
  Pending: 'bg-blue-50 text-blue-600',
  Scheduled: 'bg-blue-50 text-blue-600',
  Rescheduled: 'bg-amber-50 text-amber-600',
  Completed: 'bg-emerald-50 text-emerald-600',
  Cancelled: 'bg-red-50 text-red-500',
};

const doctorStatusStyles = {
  Available: 'bg-emerald-50 text-emerald-600',
  'On Leave': 'bg-red-50 text-red-500',
};

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DONUT_COLORS = ['#2563EB', '#06B6D4', '#60A5FA', '#A5F3FC', '#CBD5E1', '#93C5FD'];

/* ---------------- Small building blocks ---------------- */

const SummaryCard = ({ label, value, icon: Icon, dot }) => (
  <div className="bg-white rounded-[18px] border border-slate-100 shadow-sm p-5 flex items-center justify-between hover:-translate-y-0.5 hover:shadow-md transition-all duration-200">
    <div>
      <p className="text-xs font-bold text-slate-400 tracking-wide uppercase mb-2">{label}</p>
      <p className="text-3xl font-extrabold text-slate-800">{value}</p>
    </div>
    <div className="relative w-12 h-12 rounded-2xl bg-[#EFF6FF] flex items-center justify-center">
      <Icon className="w-6 h-6 text-[#2563EB]" />
      <span className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${dot} border-2 border-white`} />
    </div>
  </div>
);

const QuickAction = ({ label, icon: Icon, danger, onClick }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center justify-center gap-3 rounded-[18px] p-5 border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${
      danger
        ? 'bg-red-50 border-red-100 text-red-600 hover:bg-red-100'
        : 'bg-white border-slate-100 text-slate-700 hover:border-[#2563EB]/30'
    }`}
  >
    <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${danger ? 'bg-red-100' : 'bg-[#EFF6FF]'}`}>
      <Icon className={`w-5 h-5 ${danger ? 'text-red-500' : 'text-[#2563EB]'}`} />
    </div>
    <span className="text-xs font-bold text-center leading-tight">{label}</span>
  </button>
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

/* ---------------- Main component ---------------- */

const ReceptionistDashboard = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: '', phone: '', age: '', gender: '', department: '', doctor: '', symptoms: '',
  });
  const [registering, setRegistering] = useState(false);
  const [registerMsg, setRegisterMsg] = useState('');

  const [appointments, setAppointments] = useState([]);
  const [queue, setQueue] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [reportsSummary, setReportsSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [queueActionLoading, setQueueActionLoading] = useState({});

  const clearForm = () =>
    setForm({ fullName: '', phone: '', age: '', gender: '', department: '', doctor: '', symptoms: '' });

  const loadDashboard = async () => {
    try {
      const [apptRes, queueRes, patientRes, doctorRes, reportsRes] = await Promise.allSettled([
        appointmentService.getAllAppointments(),
        receptionistService.getQueue(),
        patientService.getAllPatients(),
        appointmentService.getDoctors(),
        receptionistService.getReportsSummary(),
      ]);

      if (apptRes.status === 'fulfilled' && apptRes.value.success) setAppointments(apptRes.value.data);
      if (queueRes.status === 'fulfilled' && queueRes.value.success) setQueue(queueRes.value.data);
      if (patientRes.status === 'fulfilled' && patientRes.value.success) setPatients(patientRes.value.data);
      if (doctorRes.status === 'fulfilled' && doctorRes.value.success) setDoctors(doctorRes.value.data);
      if (reportsRes.status === 'fulfilled' && reportsRes.value.success) setReportsSummary(reportsRes.value.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!form.fullName || !form.phone) {
      setRegisterMsg('Full name and phone number are required.');
      return;
    }
    setRegistering(true);
    setRegisterMsg('');
    try {
      const res = await receptionistService.registerPatient(form);
      if (res.success) {
        setRegisterMsg(`Registered — Patient ID ${res.data.patientId}`);
        clearForm();
        loadDashboard();
      }
    } catch (err) {
      setRegisterMsg(err.message || 'Failed to register patient.');
    } finally {
      setRegistering(false);
    }
  };

  const setQueueStatus = async (id, status) => {
    setQueueActionLoading((prev) => ({ ...prev, [id]: true }));
    try {
      const res = await receptionistService.updateQueueStatus(id, status);
      if (res.success) setQueue((q) => q.map((item) => (item._id === id ? res.data : item)));
    } finally {
      setQueueActionLoading((prev) => ({ ...prev, [id]: false }));
    }
  };

  // Derived stats
  const todayStr = new Date().toISOString().slice(0, 10);
  const todaysAppointments = appointments.filter((a) => (a.preferredDate || '').slice(0, 10) === todayStr);
  const activeQueue = queue.filter((q) => q.status !== 'Completed');
  const newRegistrationsToday = patients.filter((p) => (p.createdAt || '').slice(0, 10) === todayStr);
  const availableDoctors = doctors.filter((d) => d.isActive !== false);

  const summaryCards = [
    { label: "Today's Appointments", value: todaysAppointments.length || appointments.length, icon: CalendarCheck, dot: 'bg-blue-500' },
    { label: 'Walk-in Patients', value: activeQueue.length, icon: Users, dot: 'bg-cyan-500' },
    { label: 'New Registrations', value: newRegistrationsToday.length, icon: UserPlus2, dot: 'bg-emerald-500' },
    { label: 'Available Doctors', value: availableDoctors.length, icon: Stethoscope, dot: 'bg-amber-500' },
  ];

  const appointmentRows = (todaysAppointments.length ? todaysAppointments : appointments).slice(0, 6);
  const recentPatients = [...patients]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 4);

  const appointmentsTrend = (reportsSummary?.appointmentsByMonth || []).map((i) => ({
    day: MONTHS[i._id.month - 1], appts: i.count,
  }));
  const registrationsTrend = (reportsSummary?.patientsByMonth || []).map((i) => ({
    day: MONTHS[i._id.month - 1], visits: i.count,
  }));
  const deptData = (reportsSummary?.revenueByDept || []).map((d, i) => ({
    name: d._id || 'General', value: d.total, color: DONUT_COLORS[i % DONUT_COLORS.length],
  }));
  const totalDeptValue = deptData.reduce((s, d) => s + d.value, 0);

  return (
    <ReceptionistLayout>

          {/* Hero */}
          <div className="relative overflow-hidden rounded-[18px] bg-hero-gradient text-white p-6 sm:p-8 mb-6 flex items-center justify-between">
            <div className="relative z-10">
              <h1 className="text-2xl sm:text-3xl font-extrabold mb-2">Good Morning, Sarah 👋</h1>
              <p className="text-white/80 text-sm sm:text-base max-w-md">
                Manage patient registrations, appointments and walk-ins efficiently.
              </p>
            </div>
            <div className="hidden sm:flex relative z-10 items-center justify-center w-28 h-28 rounded-full bg-white/15 backdrop-blur-sm">
              <Users className="w-14 h-14 text-white" strokeWidth={1.5} />
              <CalendarCheck className="w-7 h-7 text-white absolute -top-2 -left-2 bg-cyan-400 p-1.5 rounded-full" />
              <Stethoscope className="w-7 h-7 text-white absolute -bottom-2 -right-2 bg-blue-500 p-1.5 rounded-full" />
            </div>
            <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/10 blur-2xl" />
          </div>

          {/* Summary cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
            {summaryCards.map((c) => <SummaryCard key={c.label} {...c} />)}
          </div>

          {/* Appointments + Walk-in Queue */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
            {/* Appointments table */}
            <div className="xl:col-span-2 bg-white rounded-[18px] border border-slate-100 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                <h2 className="text-base font-bold text-slate-800">Today's Appointments</h2>
                <button onClick={() => navigate('/receptionist/appointments')} className="text-[#2563EB] text-sm font-semibold hover:underline">View All</button>
              </div>
              {loading ? (
                <div className="flex items-center justify-center gap-2 py-12">
                  <Loader2 className="w-5 h-5 text-[#2563EB] animate-spin" />
                  <span className="text-sm text-slate-400">Loading...</span>
                </div>
              ) : appointmentRows.length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-12">No appointments yet</p>
              ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs text-slate-400 uppercase tracking-wide bg-[#F8FAFC]">
                      <th className="px-5 py-3 font-bold">Time</th>
                      <th className="px-5 py-3 font-bold">Patient Name</th>
                      <th className="px-5 py-3 font-bold">Doctor</th>
                      <th className="px-5 py-3 font-bold">Department</th>
                      <th className="px-5 py-3 font-bold">Status</th>
                      <th className="px-5 py-3 font-bold">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointmentRows.map((a) => (
                      <tr key={a._id} className="border-t border-slate-50 hover:bg-[#F8FAFC]/70 transition-colors">
                        <td className="px-5 py-3 font-semibold text-slate-600 whitespace-nowrap">{a.preferredTime || '\u2014'}</td>
                        <td className="px-5 py-3 font-bold text-slate-800 whitespace-nowrap">{a.fullName}</td>
                        <td className="px-5 py-3 text-slate-500 whitespace-nowrap">{a.doctor}</td>
                        <td className="px-5 py-3 text-slate-500 whitespace-nowrap">{a.department}</td>
                        <td className="px-5 py-3">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${statusStyles[a.status] || 'bg-slate-50 text-slate-500'}`}>{a.status}</span>
                        </td>
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-2 whitespace-nowrap">
                            <button onClick={() => navigate('/receptionist/appointments')} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500" title="View"><Eye className="w-4 h-4" /></button>
                            <button onClick={() => navigate('/receptionist/appointments')} className="p-1.5 rounded-lg hover:bg-blue-50 text-[#2563EB]" title="Check-In"><LogIn className="w-4 h-4" /></button>
                            <button onClick={() => navigate('/receptionist/appointments')} className="p-1.5 rounded-lg hover:bg-cyan-50 text-cyan-600" title="Reschedule"><RefreshCcw className="w-4 h-4" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              )}
            </div>

            {/* Walk-in queue */}
            <div className="bg-white rounded-[18px] border border-slate-100 shadow-sm p-5 flex flex-col">
              <h2 className="text-base font-bold text-slate-800 mb-4">Walk-in Queue</h2>
              {loading ? (
                <div className="flex items-center justify-center gap-2 py-8">
                  <Loader2 className="w-5 h-5 text-[#2563EB] animate-spin" />
                </div>
              ) : activeQueue.length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-8">Queue is empty</p>
              ) : (
              <div className="flex flex-col gap-3">
                {activeQueue.slice(0, 3).map((q) => (
                  <div
                    key={q._id}
                    className={`rounded-2xl p-4 border ${
                      q.priority === 'Emergency' ? 'border-red-300 bg-red-50/50' : 'border-slate-100 bg-[#F8FAFC]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-extrabold text-[#2563EB] bg-blue-50 px-2 py-0.5 rounded-full">{q.queueNumber}</span>
                      {q.priority === 'Emergency' && (
                        <span className="text-[10px] font-bold text-red-500 uppercase tracking-wide">Emergency</span>
                      )}
                    </div>
                    <p className="font-bold text-slate-800 text-sm">{q.patientName}</p>
                    <p className="text-xs text-slate-400 mb-3">Arrived {q.arrivalTime}</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setQueueStatus(q._id, 'Serving')}
                        disabled={q.status !== 'Waiting' || queueActionLoading[q._id]}
                        className="flex-1 flex items-center justify-center gap-1 text-xs font-bold text-white bg-[#2563EB] disabled:opacity-40 rounded-lg py-2 hover:bg-blue-700 transition-colors"
                      >
                        <PhoneCall className="w-3.5 h-3.5" /> Call Next
                      </button>
                      <button
                        onClick={() => setQueueStatus(q._id, 'Completed')}
                        disabled={queueActionLoading[q._id]}
                        className="flex-1 flex items-center justify-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 disabled:opacity-40 rounded-lg py-2 hover:bg-emerald-100 transition-colors"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" /> Complete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              )}
            </div>
          </div>

          {/* Quick actions */}
          <div className="mb-6">
            <h2 className="text-base font-bold text-slate-800 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {quickActionsBase.map((q) => <QuickAction key={q.label} {...q} onClick={() => navigate(q.path)} />)}
            </div>
          </div>

          {/* Registration + Doctor availability */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
            {/* Registration form */}
            <form onSubmit={handleRegister} className="xl:col-span-1 bg-white rounded-[18px] border border-slate-100 shadow-sm p-5">
              <h2 className="text-base font-bold text-slate-800 mb-4">Patient Registration</h2>
              <div className="flex flex-col gap-4">
                {registerMsg && (
                  <p className={`text-xs font-semibold px-3 py-2 rounded-lg ${registerMsg.startsWith('Registered') ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                    {registerMsg}
                  </p>
                )}
                <Field label="Full Name" placeholder="Enter patient name" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
                <Field label="Phone Number" placeholder="10-digit number" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Age" placeholder="Age" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} />
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1.5">Gender</label>
                    <select
                      value={form.gender}
                      onChange={(e) => setForm({ ...form, gender: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-[#F8FAFC] text-sm outline-none focus:ring-2 focus:ring-[#2563EB]/20"
                    >
                      <option value="">Select</option>
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>
                <Field label="Department" placeholder="e.g. Cardiology" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} />
                <Field label="Doctor" placeholder="Assign a doctor" value={form.doctor} onChange={(e) => setForm({ ...form, doctor: e.target.value })} />
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5">Symptoms</label>
                  <textarea
                    rows={3}
                    placeholder="Briefly describe symptoms"
                    value={form.symptoms}
                    onChange={(e) => setForm({ ...form, symptoms: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-[#F8FAFC] text-sm outline-none focus:ring-2 focus:ring-[#2563EB]/20 resize-none"
                  />
                </div>
                <div className="flex gap-3 mt-1">
                  <button type="submit" disabled={registering} className="flex-1 bg-[#2563EB] hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-bold py-2.5 rounded-xl transition-colors">
                    {registering ? 'Registering…' : 'Register Patient'}
                  </button>
                  <button type="button" onClick={clearForm} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-bold py-2.5 rounded-xl transition-colors">
                    Clear Form
                  </button>
                </div>
              </div>
            </form>

            {/* Doctor availability + Notifications */}
            <div className="xl:col-span-2 flex flex-col gap-6">
              <div className="bg-white rounded-[18px] border border-slate-100 shadow-sm p-5">
                <h2 className="text-base font-bold text-slate-800 mb-4">Doctor Availability</h2>
                {loading ? (
                  <div className="flex items-center justify-center gap-2 py-8">
                    <Loader2 className="w-5 h-5 text-[#2563EB] animate-spin" />
                  </div>
                ) : doctors.length === 0 ? (
                  <p className="text-sm text-slate-400 text-center py-8">No doctors found</p>
                ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {doctors.slice(0, 4).map((d) => {
                    const status = d.isActive === false ? 'On Leave' : 'Available';
                    return (
                      <div key={d._id} className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-[#F8FAFC] p-3">
                        <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(d.fullName)}&background=2563EB&color=fff`} alt={d.fullName} className="w-11 h-11 rounded-full object-cover" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-slate-800 truncate">{d.fullName}</p>
                          <p className="text-xs text-slate-400">{d.department || '\u2014'}</p>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-1 rounded-full whitespace-nowrap ${doctorStatusStyles[status]}`}>
                          {status}
                        </span>
                      </div>
                    );
                  })}
                </div>
                )}
              </div>

              <div className="bg-white rounded-[18px] border border-slate-100 shadow-sm p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-bold text-slate-800">Today's Notifications</h2>
                  <Bell className="w-4 h-4 text-slate-400" />
                </div>
                <div className="flex flex-col divide-y divide-slate-50">
                  {notifications.map((n) => (
                    <div key={n.title} className="flex items-center gap-3 py-3">
                      <div className="w-9 h-9 rounded-xl bg-[#EFF6FF] flex items-center justify-center shrink-0">
                        <n.icon className="w-4 h-4 text-[#2563EB]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-800 truncate">{n.title}</p>
                        <p className="text-xs text-slate-400 truncate">{n.desc}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs text-slate-400">{n.time}</span>
                        {n.unread && <span className="w-2 h-2 rounded-full bg-[#2563EB]" />}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Analytics */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
            <div className="bg-white rounded-[18px] border border-slate-100 shadow-sm p-5">
              <h2 className="text-base font-bold text-slate-800 mb-4">Appointments Trend</h2>
              {appointmentsTrend.length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-16">No data yet</p>
              ) : (
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={appointmentsTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Line type="monotone" dataKey="appts" stroke="#2563EB" strokeWidth={3} dot={{ r: 3, fill: '#2563EB' }} />
                </LineChart>
              </ResponsiveContainer>
              )}
            </div>

            <div className="bg-white rounded-[18px] border border-slate-100 shadow-sm p-5">
              <h2 className="text-base font-bold text-slate-800 mb-4">New Registrations</h2>
              {registrationsTrend.length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-16">No data yet</p>
              ) : (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={registrationsTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Bar dataKey="visits" fill="#06B6D4" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
              )}
            </div>

            <div className="bg-white rounded-[18px] border border-slate-100 shadow-sm p-5">
              <h2 className="text-base font-bold text-slate-800 mb-4">Revenue by Department</h2>
              {deptData.length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-16">No billing data yet</p>
              ) : (
              <div className="relative">
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={deptData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={2} dataKey="value" stroke="none">
                      {deptData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-2xl font-extrabold text-slate-800">{patients.length}</span>
                  <span className="text-xs text-slate-400">Patients</span>
                </div>
              </div>
              )}
            </div>
          </div>

          {/* Recent patients */}
          <div className="bg-white rounded-[18px] border border-slate-100 shadow-sm overflow-hidden mb-6">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-800">Recent Patients</h2>
              <button onClick={() => navigate('/receptionist/patient-records')} className="text-[#2563EB] text-sm font-semibold hover:underline">View All</button>
            </div>
            {loading ? (
              <div className="flex items-center justify-center gap-2 py-12">
                <Loader2 className="w-5 h-5 text-[#2563EB] animate-spin" />
              </div>
            ) : recentPatients.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-12">No patients yet</p>
            ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-slate-400 uppercase tracking-wide bg-[#F8FAFC]">
                    <th className="px-5 py-3 font-bold">Patient ID</th>
                    <th className="px-5 py-3 font-bold">Patient Name</th>
                    <th className="px-5 py-3 font-bold">Phone</th>
                    <th className="px-5 py-3 font-bold">Registered</th>
                    <th className="px-5 py-3 font-bold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {recentPatients.map((p) => (
                    <tr key={p._id} className="border-t border-slate-50 hover:bg-[#F8FAFC]/70 transition-colors">
                      <td className="px-5 py-3 font-semibold text-slate-500 whitespace-nowrap">{p.patientId}</td>
                      <td className="px-5 py-3 font-bold text-slate-800 whitespace-nowrap">{p.firstName} {p.lastName}</td>
                      <td className="px-5 py-3 text-slate-500 whitespace-nowrap">{p.phoneNumber}</td>
                      <td className="px-5 py-3 text-slate-500 whitespace-nowrap">{p.dateOfRegistration}</td>
                      <td className="px-5 py-3">
                        <button onClick={() => navigate('/receptionist/patient-records')} className="text-xs font-bold text-[#2563EB] hover:underline whitespace-nowrap">View Details</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            )}
          </div>
    </ReceptionistLayout>
  );
};

export default ReceptionistDashboard;
