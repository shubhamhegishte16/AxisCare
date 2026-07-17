import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Package, ClipboardList, AlertTriangle, IndianRupee,
  Plus, Boxes, Receipt, Truck, BellRing,
} from 'lucide-react';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  PieChart, Pie, Cell, Legend,
} from 'recharts';
import PharmacyNavbar from './PharmacyNavbar';
import { StatCard, StatusBadge, Card, EmptyState } from './UI';
import { pharmacyService } from '../services/pharmacyService';

const quickActions = [
  { label: 'Add Medicine', icon: Plus, path: '/pharmacy/medicines/add' },
  { label: 'View Inventory', icon: Boxes, path: '/pharmacy/inventory' },
  { label: 'Create Bill', icon: Receipt, path: '/pharmacy/billing' },
  { label: 'Purchase Stock', icon: Truck, path: '/pharmacy/orders' },
  { label: 'Stock Alerts', icon: BellRing, path: '/pharmacy/inventory' },
];

const PharmacyDashboard = () => {
  const navigate = useNavigate();

  const emptyStats = { totalMedicines: 0, pendingPrescriptions: 0, lowStock: 0, salesToday: 0 };
  const [stats, setStats] = useState(emptyStats);
  const [weeklySales, setWeeklySales] = useState([]);
  const [categoryDistribution, setCategoryDistribution] = useState([]);
  const [todaysPrescriptionRequests, setTodaysPrescriptionRequests] = useState([]);
  const [inventoryOverview, setInventoryOverview] = useState([]);
  const [activityTimeline, setActivityTimeline] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await pharmacyService.getDashboard();
      const data = res.data || {};
      setStats({ ...emptyStats, ...(data.stats || {}) });
      setWeeklySales(data.weeklySales || []);
      setCategoryDistribution(data.categoryDistribution || []);
      setTodaysPrescriptionRequests(data.todaysPrescriptionRequests || []);
      setInventoryOverview(data.inventoryOverview || []);
      setActivityTimeline(data.activityTimeline || []);
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <PharmacyNavbar />
      <main className="flex-1 p-6 lg:p-8 max-w-7xl mx-auto w-full">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Pharmacy Dashboard</h1>
          <p className="text-gray-500 text-sm">Welcome back! Here's what's happening in your pharmacy</p>
        </div>

        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 px-4 py-2.5 rounded-lg flex items-center justify-between">
            <span>{error}</span>
            <button onClick={loadDashboard} className="font-semibold hover:underline">Retry</button>
          </div>
        )}

        {loading ? (
          <div className="py-16 text-center text-sm text-gray-400">Loading dashboard…</div>
        ) : (
        <>
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
          <StatCard title="TOTAL MEDICINES" value={stats.totalMedicines.toLocaleString()} icon={Package} iconColor="text-blue-600" bgColor="bg-blue-50" />
          <StatCard title="PENDING PRESCRIPTION" value={stats.pendingPrescriptions} icon={ClipboardList} iconColor="text-blue-600" bgColor="bg-blue-50" />
          <StatCard title="LOW STOCK ITEMS" value={stats.lowStock} icon={AlertTriangle} iconColor="text-amber-500" bgColor="bg-amber-50" />
          <StatCard title="TODAY'S SALES" value={`Rs. ${stats.salesToday.toLocaleString()}`} icon={IndianRupee} iconColor="text-green-600" bgColor="bg-green-50" />
        </div>

        {/* Tables row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card title="Today's prescription request" action={<button onClick={() => navigate('/pharmacy/prescriptions')} className="text-blue-600 text-sm font-semibold hover:underline">View all</button>}>
            <div className="overflow-x-auto -m-5 mt-0 p-5 pt-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-400 text-xs uppercase">
                    <th className="pb-3 font-semibold">Patient</th>
                    <th className="pb-3 font-semibold">Doctor</th>
                    <th className="pb-3 font-semibold">Status</th>
                    <th className="pb-3 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {todaysPrescriptionRequests.slice(0, 5).map((rx) => (
                    <tr key={rx.id} className="border-t border-gray-50">
                      <td className="py-3 font-semibold text-gray-800">{rx.patient}</td>
                      <td className="py-3 text-gray-500">{rx.doctor}</td>
                      <td className="py-3"><StatusBadge status={rx.status} /></td>
                      <td className="py-3 text-right">
                        <button onClick={() => navigate('/pharmacy/prescriptions')} className="text-blue-600 text-xs font-semibold hover:underline">Review</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {todaysPrescriptionRequests.length === 0 && <EmptyState text="No prescription requests yet." />}
            </div>
          </Card>

          <Card title="Inventory Overview" action={<button onClick={() => navigate('/pharmacy/inventory')} className="text-blue-600 text-sm font-semibold hover:underline">View all</button>}>
            <div className="overflow-x-auto -m-5 mt-0 p-5 pt-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-400 text-xs uppercase">
                    <th className="pb-3 font-semibold">Medicine</th>
                    <th className="pb-3 font-semibold">Category</th>
                    <th className="pb-3 font-semibold">Available</th>
                    <th className="pb-3 font-semibold">Expiry date</th>
                    <th className="pb-3 font-semibold text-right">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {inventoryOverview.map((item) => (
                    <tr key={item.medicine} className="border-t border-gray-50">
                      <td className="py-3 font-semibold text-gray-800">{item.medicine}</td>
                      <td className="py-3 text-gray-500">{item.category}</td>
                      <td className="py-3 text-gray-500">{item.available}</td>
                      <td className="py-3 text-gray-500">{item.expiry}</td>
                      <td className="py-3 text-right"><StatusBadge status={item.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {inventoryOverview.length === 0 && <EmptyState text="No inventory items yet." />}
            </div>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <Card title="Weekly Sales" className="lg:col-span-2">
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={weeklySales}>
                <defs>
                  <linearGradient id="salesFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                <Tooltip formatter={(v) => [`Rs. ${v.toLocaleString()}`, 'Sales']} />
                <Area type="monotone" dataKey="sales" stroke="#3B82F6" strokeWidth={2.5} fill="url(#salesFill)" />
              </AreaChart>
            </ResponsiveContainer>
          </Card>

          <Card title="Medicine Category Distribution">
            {categoryDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie data={categoryDistribution} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={2}>
                    {categoryDistribution.map((c) => <Cell key={c.name} fill={c.color} />)}
                  </Pie>
                  <Tooltip />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState text="No medicines added yet." />
            )}
          </Card>
        </div>

        {/* Quick actions + activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card title="Quick Actions" className="lg:col-span-1">
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map((qa) => (
                <button
                  key={qa.label}
                  onClick={() => navigate(qa.path)}
                  className="flex flex-col items-center justify-center gap-2 border border-gray-100 rounded-xl py-4 hover:border-blue-200 hover:bg-blue-50/50 transition-colors"
                >
                  <qa.icon className="w-5 h-5 text-blue-600" />
                  <span className="text-xs font-semibold text-gray-700 text-center">{qa.label}</span>
                </button>
              ))}
            </div>
          </Card>

          <Card title="Recent Activity" className="lg:col-span-2">
            <div className="flex flex-col gap-4">
              {activityTimeline.map((a, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 shrink-0" />
                  <div>
                    <p className="text-sm text-gray-800">{a.text}</p>
                    <p className="text-xs text-gray-400">{a.time}</p>
                  </div>
                </div>
              ))}
              {activityTimeline.length === 0 && <EmptyState text="No recent activity." />}
            </div>
          </Card>
        </div>
        </>
        )}
      </main>
    </div>
  );
};

export default PharmacyDashboard;