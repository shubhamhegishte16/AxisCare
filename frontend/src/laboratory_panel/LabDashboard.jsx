import React, { useState } from 'react';
import { 
  FileText, 
  CheckCircle, 
  Upload, 
  AlertTriangle, 
  BarChart3, 
  Calendar as CalendarIcon, 
  ChevronDown,
  ArrowRight,
  TrendingUp,
  FileSpreadsheet,
  ArrowDown
} from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import LabHeader from './LabHeader';
import { Link } from 'react-router-dom';

const LabDashboard = () => {

  const [selectedDate, setSelectedDate] = useState('14 July 2026, Monday');

  // Stats data
  const stats = [
    {
      title: 'Pending Test Requests',
      value: '32',
      change: '↑ 12% from yesterday',
      trendType: 'up',
      color: 'blue',
      icon: FileText
    },
    {
      title: 'Tests Completed Today',
      value: '28',
      change: '↑ 8% from yesterday',
      trendType: 'up',
      color: 'emerald',
      icon: CheckCircle
    },
    {
      title: 'Reports Awaiting Upload',
      value: '14',
      change: '↓ 5% from yesterday',
      trendType: 'down',
      color: 'amber',
      icon: Upload
    },
    {
      title: 'Urgent Tests',
      value: '6',
      change: 'REQUIRES IMMEDIATE ATTENTION',
      trendType: 'warning',
      color: 'rose',
      icon: AlertTriangle
    },
    {
      title: 'Total Tests This Month',
      value: '356',
      change: 'Till now this month',
      trendType: 'neutral',
      color: 'indigo',
      icon: BarChart3
    }
  ];

  // Today's requests data
  const todayRequests = [
    { id: 'LR-2026-0142', name: 'Rajesh Kumar', test: 'Complete Blood Count (CBC)', priority: 'Urgent', time: '09:15 AM', status: 'Pending' },
    { id: 'LR-2026-0141', name: 'Priya Mehta', test: 'Lipid Profile', priority: 'High', time: '09:05 AM', status: 'Pending' },
    { id: 'LR-2026-0140', name: 'Amit Verma', test: 'Liver Function Test (LFT)', priority: 'Normal', time: '08:50 AM', status: 'Pending' },
    { id: 'LR-2026-0139', name: 'Neha Patil', test: 'Thyroid Profile (T3, T4, TSH)', priority: 'High', time: '08:30 AM', status: 'Pending' },
    { id: 'LR-2026-0138', name: 'Suresh Chandra', test: 'Urine Routine & Microscopy', priority: 'Normal', time: '08:20 AM', status: 'Pending' }
  ];

  // Urgent requests list
  const urgentRequests = [
    { id: 'LR-2026-0142', name: 'Rajesh Kumar', test: 'Complete Blood Count (CBC)', time: '09:15 AM' },
    { id: 'LR-2026-0137', name: 'Sneha Kapoor', test: 'D-Dimer Test', time: '08:10 AM' },
    { id: 'LR-2026-0133', name: 'Vikram Singh', test: 'Troponin I Test', time: 'Yesterday' }
  ];

  // Donut Chart Data
  const donutData = [
    { name: 'Pending', value: 32, color: '#00B9D6', percentage: '25%' },
    { name: 'In Progress', value: 18, color: '#F59E0B', percentage: '14%' },
    { name: 'Completed', value: 28, color: '#10B981', percentage: '22%' },
    { name: 'Awaiting Upload', value: 14, color: '#8B5CF6', percentage: '11%' },
    { name: 'Cancelled', value: 6, color: '#EF4444', percentage: '5%' },
    { name: 'Others', value: 30, color: '#6B7280', percentage: '23%' }
  ];

  // Bar Chart Data
  const barData = [
    { name: 'Hematology', value: 132, fill: '#FF5A5F' },
    { name: 'Biochemistry', value: 98, fill: '#FFB400' },
    { name: 'Immunology', value: 45, fill: '#8CE071' },
    { name: 'Microbiology', value: 36, fill: '#00D1C1' },
    { name: 'Others', value: 12, fill: '#D390FF' }
  ];

  // Recently uploaded reports
  const recentlyUploaded = [
    { id: 'RR-2026-0089', name: 'Priya Mehta', test: 'Lipid Profile', time: '10:30 AM' },
    { id: 'RR-2026-0088', name: 'Amit Verma', test: 'Liver Function Test', time: '10:15 AM' },
    { id: 'RR-2026-0087', name: 'Neha Patil', test: 'Thyroid Profile', time: '09:45 AM' },
    { id: 'RR-2026-0086', name: 'Rajesh Kumar', test: 'Complete Blood Count', time: '09:30 AM' },
    { id: 'RR-2026-0085', name: 'Suresh Chandra', test: 'Urine Routine', time: '09:10 AM' }
  ];

  const getPriorityStyle = (priority) => {
    switch (priority) {
      case 'Urgent':
        return 'bg-red-50 text-red-600 border-red-100';
      case 'High':
        return 'bg-amber-50 text-amber-600 border-amber-100';
      default:
        return 'bg-emerald-50 text-emerald-600 border-emerald-100';
    }
  };

  const getCardColorClasses = (color) => {
    switch (color) {
      case 'blue':
        return { bg: 'bg-blue-50 text-blue-600', trend: 'text-blue-600' };
      case 'emerald':
        return { bg: 'bg-emerald-50 text-emerald-600', trend: 'text-emerald-600' };
      case 'amber':
        return { bg: 'bg-amber-50 text-amber-600', trend: 'text-amber-600' };
      case 'rose':
        return { bg: 'bg-red-50 text-red-600', trend: 'text-red-500 font-bold' };
      case 'indigo':
        return { bg: 'bg-indigo-50 text-indigo-600', trend: 'text-gray-400' };
      default:
        return { bg: 'bg-gray-50 text-gray-600', trend: 'text-gray-500' };
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 pb-12">
      <LabHeader />

      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        
        {/* Welcome and Date Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-sm text-gray-500 mt-0.5">Welcome back, Rahul! Here's what's happening in the lab today.</p>
          </div>
          
          <div className="flex items-center gap-2 bg-white border border-gray-100 px-4 py-2.5 rounded-xl shadow-sm text-sm font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer self-start md:self-auto transition-colors">
            <CalendarIcon className="w-4 h-4 text-gray-400" />
            <span>{selectedDate}</span>
            <ChevronDown className="w-4 h-4 text-gray-400 ml-1" />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 mb-8">
          {stats.map((stat, idx) => {
            const classes = getCardColorClasses(stat.color);
            return (
              <div key={idx} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between">
                <div>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${classes.bg}`}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-semibold text-gray-400 mt-4 leading-tight">{stat.title}</p>
                  <p className="text-3xl font-extrabold text-gray-900 mt-2">{stat.value}</p>
                </div>
                <div className={`text-xs mt-3 flex items-center gap-1 ${classes.trend}`}>
                  {stat.trendType === 'up' && <TrendingUp className="w-3.5 h-3.5" />}
                  {stat.trendType === 'down' && <ArrowDown className="w-3.5 h-3.5 text-amber-500" />}
                  <span>{stat.change}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Middle Row: Test Requests Table & Urgent Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          
          {/* Today's Test Requests */}
          <div className="lg:col-span-2 bg-white border border-gray-100 rounded-2xl shadow-sm p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-base font-bold text-gray-800">Today's Test Requests</h2>
                <button className="text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors cursor-default">
                  View All
                </button>
              </div>

              <div className="overflow-x-auto -mx-6">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/50 text-[10px] uppercase font-bold tracking-wider text-gray-400">
                      <th className="py-3 px-6">Request ID</th>
                      <th className="py-3 px-6">Patient Name</th>
                      <th className="py-3 px-6">Test</th>
                      <th className="py-3 px-6 text-center">Priority</th>
                      <th className="py-3 px-6">Requested Time</th>
                      <th className="py-3 px-6">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {todayRequests.map((req) => (
                      <tr key={req.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="py-4 px-6 text-sm font-bold text-blue-600">
                          {req.id}
                        </td>
                        <td className="py-4 px-6 text-sm font-medium text-gray-700">{req.name}</td>
                        <td className="py-4 px-6 text-sm text-gray-500 font-medium">{req.test}</td>
                        <td className="py-4 px-6 text-center">
                          <span className={`inline-block px-2.5 py-1 text-[11px] font-bold rounded-lg border ${getPriorityStyle(req.priority)}`}>
                            {req.priority}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-sm text-gray-500 font-semibold">{req.time}</td>
                        <td className="py-4 px-6">
                          <span className="inline-block px-2.5 py-1 text-[11px] font-bold rounded-lg border bg-blue-50 text-blue-600 border-blue-100">
                            {req.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-gray-50 flex justify-center">
              <button 
                className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors cursor-default"
              >
                <span>View All Requests</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Urgent Requests */}
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-base font-bold text-gray-800">Urgent Requests</h2>
                <button className="text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors cursor-default">
                  View All
                </button>
              </div>

              <div className="space-y-4">
                {urgentRequests.map((req) => (
                  <div 
                    key={req.id} 
                    className="border border-red-100 bg-red-50/20 rounded-xl p-4 flex items-start justify-between relative overflow-hidden group hover:shadow-sm transition-shadow"
                  >
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500"></div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-red-600 bg-red-50 border border-red-100 px-1.5 py-0.5 rounded-md">Urgent</span>
                        <span className="text-xs font-bold text-gray-800">{req.id}</span>
                      </div>
                      <h4 className="text-sm font-bold text-gray-900 mt-1">{req.name}</h4>
                      <p className="text-xs text-gray-500 font-medium mt-0.5">{req.test}</p>
                    </div>
                    <span className="text-[10px] font-bold text-red-500">{req.time}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-gray-50 flex justify-center">
              <button 
                className="flex items-center gap-1.5 text-xs font-bold text-red-600 hover:text-red-700 transition-colors cursor-default"
              >
                <span>View All Urgent</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Row: Test Status Overview, Tests by Category, & Recently Uploaded Reports */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {/* Test Status Overview */}
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-base font-bold text-gray-800">Test Status Overview</h2>
                <div className="flex items-center gap-1 bg-gray-50 hover:bg-gray-100 border border-gray-100 px-2.5 py-1 rounded-lg text-xs font-bold text-gray-600 cursor-pointer transition-colors">
                  <span>Today</span>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                </div>
              </div>

              {/* Chart & Legend Container */}
              <div className="flex flex-col sm:flex-row items-center gap-6">
                {/* Pie Chart */}
                <div className="w-36 h-36 relative flex-shrink-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={donutData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={65}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {donutData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  {/* Center Text */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-2xl font-extrabold text-gray-900 leading-none">128</span>
                    <span className="text-[10px] font-semibold text-gray-400 mt-1 uppercase tracking-wider">Total Tests</span>
                  </div>
                </div>

                {/* Legend list */}
                <div className="flex-1 w-full space-y-1.5">
                  {donutData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></span>
                        <span className="font-semibold text-gray-500">{item.name}</span>
                      </div>
                      <span className="font-bold text-gray-800">{item.value} ({item.percentage})</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Tests by Category */}
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-baseline gap-1.5">
                  <h2 className="text-base font-bold text-gray-800">Tests by Category</h2>
                  <span className="text-xs text-gray-400 font-semibold">(This Month)</span>
                </div>
                <button className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors cursor-default">
                  View Report
                </button>
              </div>

              {/* Bar Chart */}
              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#9CA3AF', fontSize: 10, fontWeight: 600 }}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#9CA3AF', fontSize: 10, fontWeight: 600 }}
                    />
                    <Tooltip cursor={{ fill: 'transparent' }} />
                    <Bar 
                      dataKey="value" 
                      radius={[4, 4, 0, 0]}
                      barSize={24}
                    >
                      {barData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Legend stats */}
              <div className="grid grid-cols-5 gap-2 mt-4 text-center border-t border-gray-50 pt-3">
                {barData.map((item, idx) => (
                  <div key={idx}>
                    <p className="text-[11px] font-extrabold text-gray-800">{item.value}</p>
                    <p className="text-[9px] text-gray-400 font-bold truncate mt-0.5" title={item.name}>{item.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recently Uploaded Reports */}
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-base font-bold text-gray-800">Recently Uploaded Reports</h2>
                <button className="text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors cursor-default">
                  View All
                </button>
              </div>

              <div className="space-y-3.5">
                {recentlyUploaded.map((report) => (
                  <div key={report.id} className="flex items-center justify-between hover:bg-gray-50/50 p-1.5 rounded-lg transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                        <FileSpreadsheet className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-gray-800">{report.id}</h4>
                        <p className="text-[10px] text-gray-500 font-semibold mt-0.5">{report.name} • {report.test}</p>
                      </div>
                    </div>
                    <span className="text-[10px] text-gray-400 font-bold">{report.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

      </main>
    </div>
  );
};

export default LabDashboard;
