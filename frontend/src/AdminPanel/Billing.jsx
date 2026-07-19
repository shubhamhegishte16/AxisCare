import React, { useEffect, useState } from 'react';
import { IndianRupee, TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';
import AdminLayout from './AdminLayout';
import { PageHeader, StatCard, Card } from './UI';
import { adminService } from '../services/adminService';

const AdminBilling = () => {
  const [revenueByMonth, setRevenueByMonth] = useState([]);
  const [stats, setStats] = useState({ revenueThisMonth: 0, expensesThisMonth: 0, netProfit: 0, revenueYtd: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const [revRes, statsRes] = await Promise.all([
          adminService.getMonthlyRevenue(),
          adminService.getBillingStats(),
        ]);
        if (!cancelled) {
          if (revRes.success) setRevenueByMonth(revRes.data);
          if (statsRes.success) setStats(statsRes.data);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) setError(err.response?.data?.message || err.message || 'Failed to load billing data');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64 text-gray-500">Loading billing data...</div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center h-64 gap-2 text-center">
          <p className="text-red-500 font-semibold">Couldn't load billing data</p>
          <p className="text-gray-400 text-sm">{error}</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <PageHeader title="Billing & Revenue" subtitle="Hospital-wide financial overview across all departments" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="REVENUE (THIS MONTH)" value={`Rs. ${stats.revenueThisMonth.toLocaleString()}`} icon={IndianRupee} iconColor="text-green-600" bgColor="bg-green-50" />
        <StatCard title="EXPENSES (THIS MONTH)" value={`Rs. ${stats.expensesThisMonth.toLocaleString()}`} icon={TrendingDown} iconColor="text-red-500" bgColor="bg-red-50" />
        <StatCard title="NET PROFIT" value={`Rs. ${stats.netProfit.toLocaleString()}`} icon={Wallet} iconColor="text-blue-600" bgColor="bg-blue-50" />
        <StatCard title="REVENUE (YTD)" value={`Rs. ${stats.revenueYtd.toLocaleString()}`} icon={TrendingUp} iconColor="text-indigo-600" bgColor="bg-indigo-50" />
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
