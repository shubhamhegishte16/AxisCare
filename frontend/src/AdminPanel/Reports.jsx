import React from 'react';
import { Download } from 'lucide-react';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  PieChart, Pie, Cell, Legend, BarChart, Bar,
} from 'recharts';
import AdminLayout from './AdminLayout';
import { PageHeader, Card } from './UI';
import { userGrowth, roleDistribution, departmentLoad, revenueByMonth } from './mockData';

const AdminReports = () => (
  <AdminLayout>
    <PageHeader
      title="Reports"
      subtitle="System-wide analytics across users, appointments, and revenue"
      action={
        <button className="flex items-center gap-2 border border-gray-200 text-gray-600 text-sm font-semibold px-4 py-2.5 rounded-lg hover:bg-gray-50">
          <Download className="w-4 h-4" /> Export
        </button>
      }
    />

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <Card title="User Growth Trend">
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={userGrowth}>
            <defs>
              <linearGradient id="reportUserFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#3B82F6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
            <Tooltip />
            <Area type="monotone" dataKey="users" stroke="#3B82F6" strokeWidth={2.5} fill="url(#reportUserFill)" />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      <Card title="Revenue Trend">
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={revenueByMonth}>
            <defs>
              <linearGradient id="reportRevenueFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10B981" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#10B981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
            <Tooltip formatter={(v) => `Rs. ${v.toLocaleString()}`} />
            <Area type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={2.5} fill="url(#reportRevenueFill)" />
          </AreaChart>
        </ResponsiveContainer>
      </Card>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card title="Appointments by Department">
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={departmentLoad}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
            <XAxis dataKey="department" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
            <Tooltip />
            <Bar dataKey="appointments" fill="#3B82F6" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card title="User Role Distribution">
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie data={roleDistribution} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={2}>
              {roleDistribution.map((r) => <Cell key={r.name} fill={r.color} />)}
            </Pie>
            <Tooltip />
            <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
          </PieChart>
        </ResponsiveContainer>
      </Card>
    </div>
  </AdminLayout>
);

export default AdminReports;
