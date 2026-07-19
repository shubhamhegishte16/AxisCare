import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users, Stethoscope, HeartPulse, CalendarCheck, ClipboardList, IndianRupee,
  UserPlus, Building2, PillBottle, FileBarChart,
} from 'lucide-react';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  PieChart, Pie, Cell, Legend, BarChart, Bar,
} from 'recharts';
import AdminLayout from './AdminLayout';
import { StatCard, Card, StatusBadge, RoleBadge } from './UI';
import { adminService } from '../services/adminService';


const quickActions = [
  { label: 'Add User', icon: UserPlus, path: '/admin/users' },
  { label: 'Add Department', icon: Building2, path: '/admin/departments' },
  { label: 'Pharmacy Overview', icon: PillBottle, path: '/admin/pharmacy' },
  { label: 'View Reports', icon: FileBarChart, path: '/admin/reports' },
];

const emptyDashboard = {
  stats: {
    totalUsers: 0,
    totalDoctors: 0,
    totalPatients: 0,
    appointmentsToday: 0,
    pendingApprovals: 0,
    revenueThisMonth: 0,
  },
  userGrowth: [],
  roleDistribution: [],
  departmentLoad: [],
  pendingApprovalsList: [],
  recentActivity: [],
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState(emptyDashboard);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const res = await adminService.getDashboard();
        if (!cancelled) {
          if (res.success) {
            setDashboard(res.data);
            setError(null);
          } else {
            setError(res.message || 'Failed to load dashboard');
          }
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.response?.data?.message || err.message || 'Failed to load dashboard');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchDashboard();
    return () => { cancelled = true; };
  }, []);

  const {
    stats: dashboardStats,
    userGrowth,
    roleDistribution,
    departmentLoad,
    pendingApprovalsList,
    recentActivity,
  } = dashboard;

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64 text-gray-500">Loading dashboard...</div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center h-64 gap-2 text-center">
          <p className="text-red-500 font-semibold">Couldn't load dashboard data</p>
          <p className="text-gray-400 text-sm">{error}</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Admin Dashboard</h1>
        <p className="text-gray-500 text-sm">System-wide overview of AxisCare</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
        <StatCard title="TOTAL USERS" value={dashboardStats.totalUsers.toLocaleString()} icon={Users} iconColor="text-blue-600" bgColor="bg-blue-50" />
        <StatCard title="DOCTORS" value={dashboardStats.totalDoctors} icon={Stethoscope} iconColor="text-green-600" bgColor="bg-green-50" />
        <StatCard title="PATIENTS" value={dashboardStats.totalPatients.toLocaleString()} icon={HeartPulse} iconColor="text-pink-600" bgColor="bg-pink-50" />
        <StatCard title="APPOINTMENTS TODAY" value={dashboardStats.appointmentsToday} icon={CalendarCheck} iconColor="text-indigo-600" bgColor="bg-indigo-50" />
        <StatCard title="PENDING APPROVALS" value={dashboardStats.pendingApprovals} icon={ClipboardList} iconColor="text-amber-500" bgColor="bg-amber-50" />
        <StatCard title="REVENUE (MONTH)" value={`Rs. ${dashboardStats.revenueThisMonth.toLocaleString()}`} icon={IndianRupee} iconColor="text-emerald-600" bgColor="bg-emerald-50" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card title="User Growth" className="lg:col-span-2">
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={userGrowth}>
              <defs>
                <linearGradient id="userFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <Tooltip />
              <Area type="monotone" dataKey="users" stroke="#3B82F6" strokeWidth={2.5} fill="url(#userFill)" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card title="User Roles">
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={roleDistribution} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={2}>
                {roleDistribution.map((r) => <Cell key={r.name} fill={r.color} />)}
              </Pie>
              <Tooltip />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card title="Department Load (Today)" className="lg:col-span-2">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={departmentLoad}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
              <XAxis dataKey="department" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <Tooltip />
              <Bar dataKey="appointments" fill="#3B82F6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Quick Actions">
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
      </div>

      {/* Approvals + activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Pending Approvals" action={<button onClick={() => navigate('/admin/users')} className="text-blue-600 text-sm font-semibold hover:underline">View all</button>}>
          <div className="overflow-x-auto -m-5 mt-0 p-5 pt-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-400 text-xs uppercase">
                  <th className="pb-3 font-semibold">Name</th>
                  <th className="pb-3 font-semibold">Role</th>
                  <th className="pb-3 font-semibold">Requested</th>
                  <th className="pb-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {pendingApprovalsList.map((req) => (
                  <tr key={req.id} className="border-t border-gray-50">
                    <td className="py-3 font-semibold text-gray-800">{req.name}</td>
                    <td className="py-3"><RoleBadge role={req.role} /></td>
                    <td className="py-3 text-gray-500">{req.date}</td>
                    <td className="py-3 text-right">
                      <button onClick={() => navigate('/admin/users')} className="text-blue-600 text-xs font-semibold hover:underline">Review</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card title="Recent Activity">
          <div className="flex flex-col gap-4">
            {recentActivity.map((a, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 shrink-0" />
                <div>
                  <p className="text-sm text-gray-800">{a.text}</p>
                  <p className="text-xs text-gray-400">{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
