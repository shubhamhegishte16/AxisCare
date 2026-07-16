import React from 'react';
import {
  ResponsiveContainer, BarChart, Bar, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, PieChart, Pie, Cell, Legend,
} from 'recharts';
import { TrendingUp, TrendingDown } from 'lucide-react';
import PharmacyNavbar from './PharmacyNavbar';
import { PageHeader, Card } from './UI';
import { monthlyRevenue, categoryDistribution, topSellingMedicines, reportHighlights } from './mockData';

const Reports = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <PharmacyNavbar />
      <main className="flex-1 p-6 lg:p-8 max-w-7xl mx-auto w-full">
        <PageHeader title="Reports" subtitle="Performance overview for your pharmacy" />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
          {reportHighlights.map((h) => (
            <div key={h.label} className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
              <p className="text-xs font-semibold text-gray-400 tracking-wide mb-2">{h.label.toUpperCase()}</p>
              <div className="flex items-end justify-between">
                <span className="text-2xl font-bold text-gray-900">{h.value}</span>
                <span className={`flex items-center gap-1 text-xs font-semibold ${h.positive ? 'text-green-600' : 'text-red-500'}`}>
                  {h.positive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                  {h.change}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <Card title="Monthly Revenue" className="lg:col-span-2">
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                <Tooltip formatter={(v) => [`Rs. ${v.toLocaleString()}`, 'Revenue']} />
                <Line type="monotone" dataKey="revenue" stroke="#3B82F6" strokeWidth={2.5} dot={{ r: 4, fill: '#3B82F6' }} />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          <Card title="Category Distribution">
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={categoryDistribution} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={2}>
                  {categoryDistribution.map((c) => <Cell key={c.name} fill={c.color} />)}
                </Pie>
                <Tooltip />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>

        <Card title="Top Selling Medicines">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={topSellingMedicines} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F1F5F9" />
              <XAxis type="number" tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 12, fill: '#475569' }} axisLine={false} tickLine={false} width={150} />
              <Tooltip formatter={(v) => [`${v} units`, 'Sold']} />
              <Bar dataKey="sold" fill="#3B82F6" radius={[0, 6, 6, 0]} barSize={18} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </main>
    </div>
  );
};

export default Reports;