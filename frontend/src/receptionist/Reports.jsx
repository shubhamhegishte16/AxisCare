import React, { useState, useEffect } from 'react';
import { Download, Loader2 } from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';
import ReceptionistLayout from './ReceptionistLayout';
import { receptionistService } from '../services/receptionistService';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DONUT_COLORS = ['#2563EB', '#06B6D4', '#60A5FA', '#A5F3FC', '#CBD5E1', '#93C5FD'];

const formatMonthly = (arr, key) =>
  (arr || []).map((item) => ({ month: MONTHS[item._id.month - 1], [key]: item.count }));

const Reports = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await receptionistService.getReportsSummary();
        if (res.success) setSummary(res.data);
      } catch (err) {
        setError(err.message || 'Failed to load reports.');
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

  if (loading) {
    return (
      <ReceptionistLayout>
        <div className="flex items-center justify-center gap-2 py-24 bg-white rounded-[18px] border border-slate-100 shadow-sm">
          <Loader2 className="w-5 h-5 text-[#2563EB] animate-spin" />
          <span className="text-sm text-slate-400">Loading reports...</span>
        </div>
      </ReceptionistLayout>
    );
  }

  if (error || !summary) {
    return (
      <ReceptionistLayout>
        <div className="bg-red-50 text-red-600 text-sm font-semibold px-4 py-3 rounded-xl">
          {error || 'No report data available.'}
        </div>
      </ReceptionistLayout>
    );
  }

  const appointmentsTrend = formatMonthly(summary.appointmentsByMonth, 'appts');
  const registrationsTrend = formatMonthly(summary.patientsByMonth, 'reg');
  const revenueByDept = (summary.revenueByDept || []).map((d, i) => ({
    name: d._id || 'General',
    value: d.total,
    color: DONUT_COLORS[i % DONUT_COLORS.length],
  }));

  const summaryCards = [
    { label: 'Total Appointments', value: summary.totalAppointments },
    { label: 'Total Patients', value: summary.totalPatients },
    { label: 'Revenue Collected', value: `₹${summary.revenueCollected.toLocaleString('en-IN')}` },
    { label: 'Revenue Pending', value: `₹${summary.revenuePending.toLocaleString('en-IN')}` },
  ];

  return (
    <ReceptionistLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">Reports</h1>
          <p className="text-sm text-slate-400 mt-1">Front-desk performance and trends overview.</p>
        </div>
        <button className="flex items-center gap-2 bg-white border border-slate-200 hover:border-[#2563EB]/40 text-slate-700 text-sm font-bold px-4 py-2.5 rounded-xl transition-colors">
          <Download className="w-4 h-4" /> Export Report
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mb-6">
        {summaryCards.map((s) => (
          <div key={s.label} className="bg-white rounded-[18px] border border-slate-100 shadow-sm p-5">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">{s.label}</p>
            <p className="text-2xl font-extrabold text-slate-800">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-white rounded-[18px] border border-slate-100 shadow-sm p-5">
          <h2 className="text-base font-bold text-slate-800 mb-4">Appointments — Last 6 Months</h2>
          {appointmentsTrend.length === 0 ? (
            <p className="text-sm text-slate-400 py-16 text-center">No appointment data yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={appointmentsTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                <Tooltip />
                <Line type="monotone" dataKey="appts" stroke="#2563EB" strokeWidth={3} dot={{ r: 3, fill: '#2563EB' }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="bg-white rounded-[18px] border border-slate-100 shadow-sm p-5">
          <h2 className="text-base font-bold text-slate-800 mb-4">Revenue by Department</h2>
          {revenueByDept.length === 0 ? (
            <p className="text-sm text-slate-400 py-16 text-center">No billing data yet</p>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={revenueByDept} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={2} dataKey="value" stroke="none">
                    {revenueByDept.map((d, i) => <Cell key={i} fill={d.color} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-y-2 gap-x-2 text-xs mt-2">
                {revenueByDept.map((d) => (
                  <div key={d.name} className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
                    <span className="text-slate-500 font-medium truncate">{d.name}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="xl:col-span-3 bg-white rounded-[18px] border border-slate-100 shadow-sm p-5">
          <h2 className="text-base font-bold text-slate-800 mb-4">New Registrations — Last 6 Months</h2>
          {registrationsTrend.length === 0 ? (
            <p className="text-sm text-slate-400 py-16 text-center">No registration data yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={registrationsTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                <Tooltip />
                <Bar dataKey="reg" fill="#06B6D4" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </ReceptionistLayout>
  );
};

export default Reports;
