import React from 'react';
import { IndianRupee, TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';
import AdminLayout from './AdminLayout';
import { PageHeader, StatCard, Card } from './UI';
import { revenueByMonth } from './mockData';

const AdminBilling = () => {
  const latest = revenueByMonth[revenueByMonth.length - 1];
  const profit = latest.revenue - latest.expenses;
  const totalRevenueYtd = revenueByMonth.reduce((sum, m) => sum + m.revenue, 0);

  return (
    <AdminLayout>
      <PageHeader title="Billing & Revenue" subtitle="Hospital-wide financial overview across all departments" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="REVENUE (THIS MONTH)" value={`Rs. ${latest.revenue.toLocaleString()}`} icon={IndianRupee} iconColor="text-green-600" bgColor="bg-green-50" />
        <StatCard title="EXPENSES (THIS MONTH)" value={`Rs. ${latest.expenses.toLocaleString()}`} icon={TrendingDown} iconColor="text-red-500" bgColor="bg-red-50" />
        <StatCard title="NET PROFIT" value={`Rs. ${profit.toLocaleString()}`} icon={Wallet} iconColor="text-blue-600" bgColor="bg-blue-50" />
        <StatCard title="REVENUE (YTD)" value={`Rs. ${totalRevenueYtd.toLocaleString()}`} icon={TrendingUp} iconColor="text-indigo-600" bgColor="bg-indigo-50" />
      </div>

      <Card title="Revenue vs Expenses">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={revenueByMonth}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
            <Tooltip formatter={(v) => `Rs. ${v.toLocaleString()}`} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="revenue" name="Revenue" fill="#3B82F6" radius={[6, 6, 0, 0]} />
            <Bar dataKey="expenses" name="Expenses" fill="#F87171" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </AdminLayout>
  );
};

export default AdminBilling;
