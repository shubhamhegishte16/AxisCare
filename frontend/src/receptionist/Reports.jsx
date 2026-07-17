import React from 'react';
import { BarChart3, Download } from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';
import ReceptionistLayout from './ReceptionistLayout';

const monthlyAppointments = [
  { month: 'Feb', appts: 620 }, { month: 'Mar', appts: 710 }, { month: 'Apr', appts: 680 },
  { month: 'May', appts: 790 }, { month: 'Jun', appts: 860 }, { month: 'Jul', appts: 910 },
];

const registrationsData = [
  { month: 'Feb', reg: 88 }, { month: 'Mar', reg: 102 }, { month: 'Apr', reg: 95 },
  { month: 'May', reg: 118 }, { month: 'Jun', reg: 134 }, { month: 'Jul', reg: 142 },
];

const revenueByDept = [
  { name: 'Cardiology', value: 34, color: '#2563EB' },
  { name: 'Orthopedics', value: 26, color: '#06B6D4' },
  { name: 'Neurology', value: 18, color: '#60A5FA' },
  { name: 'Dermatology', value: 14, color: '#A5F3FC' },
  { name: 'Others', value: 8, color: '#CBD5E1' },
];

const summary = [
  { label: 'Total Appointments (MTD)', value: '910' },
  { label: 'New Registrations (MTD)', value: '142' },
  { label: 'Revenue Collected (MTD)', value: '₹4.8L' },
  { label: 'Avg. Wait Time', value: '12 min' },
];

const Reports = () => (
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
      {summary.map((s) => (
        <div key={s.label} className="bg-white rounded-[18px] border border-slate-100 shadow-sm p-5">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">{s.label}</p>
          <p className="text-2xl font-extrabold text-slate-800">{s.value}</p>
        </div>
      ))}
    </div>

    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      <div className="xl:col-span-2 bg-white rounded-[18px] border border-slate-100 shadow-sm p-5">
        <h2 className="text-base font-bold text-slate-800 mb-4">Appointments — Last 6 Months</h2>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={monthlyAppointments}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
            <Tooltip />
            <Line type="monotone" dataKey="appts" stroke="#2563EB" strokeWidth={3} dot={{ r: 3, fill: '#2563EB' }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-[18px] border border-slate-100 shadow-sm p-5">
        <h2 className="text-base font-bold text-slate-800 mb-4">Revenue by Department</h2>
        <div className="relative">
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={revenueByDept} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={2} dataKey="value" stroke="none">
                {revenueByDept.map((d, i) => <Cell key={i} fill={d.color} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-2 gap-y-2 gap-x-2 text-xs mt-2">
          {revenueByDept.map((d) => (
            <div key={d.name} className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
              <span className="text-slate-500 font-medium truncate">{d.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="xl:col-span-3 bg-white rounded-[18px] border border-slate-100 shadow-sm p-5">
        <h2 className="text-base font-bold text-slate-800 mb-4">New Registrations — Last 6 Months</h2>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={registrationsData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
            <Tooltip />
            <Bar dataKey="reg" fill="#06B6D4" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  </ReceptionistLayout>
);

export default Reports;
