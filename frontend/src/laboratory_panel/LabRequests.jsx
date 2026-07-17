import React, { useState } from 'react';
import {
  Search, Filter, Download, Eye, ChevronRight,
  ChevronLeft, ChevronsLeft, ChevronsRight, ChevronDown,
  FileText, Clock, CheckCircle, AlertTriangle, ClipboardList, X
} from 'lucide-react';
import LabHeader from './LabHeader';

const REQUESTS = [
  { id: 'LR-2026-0142', patient: 'Rajesh Kumar', pid: 'P-10024', age: 45, gender: 'M', doctor: 'Dr. Ananya Sharma', specialization: 'Cardiologist', tests: ['Complete Blood Count (CBC)', 'Lipid Profile', 'Liver Function Test'], priority: 'URGENT', date: '14 July 2026', time: '09:15 AM', status: 'Pending' },
  { id: 'LR-2026-0141', patient: 'Priya Mehta', pid: 'P-10025', age: 32, gender: 'F', doctor: 'Dr. Ananya Sharma', specialization: 'Cardiologist', tests: ['Lipid Profile'], priority: 'HIGH', date: '14 July 2026', time: '09:05 AM', status: 'Pending' },
  { id: 'LR-2026-0140', patient: 'Amit Verma', pid: 'P-10026', age: 38, gender: 'M', doctor: 'Dr. Rohan Patel', specialization: 'General Physician', tests: ['Liver Function Test (LFT)'], priority: 'NORMAL', date: '14 July 2026', time: '08:55 AM', status: 'In Progress' },
  { id: 'LR-2026-0139', patient: 'Neha Patil', pid: 'P-10027', age: 29, gender: 'F', doctor: 'Dr. Rohan Patel', specialization: 'General Physician', tests: ['Thyroid Profile (T3, T4, TSH)'], priority: 'HIGH', date: '14 July 2026', time: '08:30 AM', status: 'Pending' },
  { id: 'LR-2026-0138', patient: 'Suresh Chandra', pid: 'P-10028', age: 60, gender: 'M', doctor: 'Dr. Meera Joshi', specialization: 'Nephrologist', tests: ['Urine Routine & Microscopy'], priority: 'NORMAL', date: '14 July 2026', time: '08:20 AM', status: 'In Progress' },
  { id: 'LR-2026-0137', patient: 'Sneha Kapoor', pid: 'P-10029', age: 27, gender: 'F', doctor: 'Dr. Ananya Sharma', specialization: 'Cardiologist', tests: ['D-Dimer Test'], priority: 'URGENT', date: '14 July 2026', time: '08:10 AM', status: 'Pending' },
  { id: 'LR-2026-0136', patient: 'Vikas Sharma', pid: 'P-10030', age: 55, gender: 'M', doctor: 'Dr. Meera Joshi', specialization: 'Nephrologist', tests: ['Creatinine', 'BUN'], priority: 'HIGH', date: '14 July 2026', time: '08:00 AM', status: 'Completed' },
  { id: 'LR-2026-0135', patient: 'Kavita Singh', pid: 'P-10031', age: 44, gender: 'F', doctor: 'Dr. Rohan Patel', specialization: 'General Physician', tests: ['Complete Blood Count (CBC)'], priority: 'NORMAL', date: '14 July 2026', time: '07:50 AM', status: 'Cancelled' },
];

const TABS = ['All Requests', 'Pending', 'In Progress', 'Completed', 'Cancelled'];

const STATS = [
  { label: 'Total Requests', value: 74, sub: 'This Month', icon: FileText, color: 'text-blue-500', bg: 'bg-blue-50' },
  { label: 'Pending Requests', value: 32, sub: 'Awaiting Processing', icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50' },
  { label: 'In Progress', value: 18, sub: 'Tests in Progress', icon: ClipboardList, color: 'text-purple-500', bg: 'bg-purple-50' },
  { label: 'Completed Today', value: 28, sub: 'Completed', icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  { label: 'Urgent Requests', value: 6, sub: 'Requires Attention', icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-50' },
];

const getPriorityBadge = (priority) => {
  switch (priority) {
    case 'URGENT': return 'bg-red-100 text-red-600 border border-red-200';
    case 'HIGH': return 'bg-orange-100 text-orange-600 border border-orange-200';
    default: return 'bg-emerald-100 text-emerald-600 border border-emerald-200';
  }
};

const getStatusBadge = (status) => {
  switch (status) {
    case 'Pending': return 'bg-blue-50 text-blue-600 border border-blue-200';
    case 'In Progress': return 'bg-purple-50 text-purple-600 border border-purple-200';
    case 'Completed': return 'bg-emerald-50 text-emerald-600 border border-emerald-200';
    case 'Cancelled': return 'bg-gray-100 text-gray-500 border border-gray-200';
    default: return 'bg-gray-100 text-gray-500';
  }
};

const DetailModal = ({ request, onClose }) => {
  if (!request) return null;
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 relative" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X className="w-5 h-5" />
        </button>
        <h3 className="text-lg font-bold text-gray-900 mb-1">{request.id}</h3>
        <p className="text-sm text-gray-400 font-semibold mb-5">Full Request Details</p>

        <div className="grid grid-cols-2 gap-4 text-xs mb-5">
          <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
            <p className="text-gray-400 uppercase tracking-wider font-bold mb-1">Patient</p>
            <p className="text-gray-900 font-bold text-sm">{request.patient}</p>
            <p className="text-gray-500">PID: {request.pid} | {request.age} Y/{request.gender}</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
            <p className="text-gray-400 uppercase tracking-wider font-bold mb-1">Doctor</p>
            <p className="text-gray-900 font-bold text-sm">{request.doctor}</p>
            <p className="text-gray-500">{request.specialization}</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
            <p className="text-gray-400 uppercase tracking-wider font-bold mb-1">Priority</p>
            <span className={`inline-block px-2 py-0.5 rounded-lg text-xs font-bold ${getPriorityBadge(request.priority)}`}>{request.priority}</span>
          </div>
          <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
            <p className="text-gray-400 uppercase tracking-wider font-bold mb-1">Status</p>
            <span className={`inline-block px-2 py-0.5 rounded-lg text-xs font-bold ${getStatusBadge(request.status)}`}>{request.status}</span>
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 mb-5">
          <p className="text-gray-400 uppercase tracking-wider font-bold text-xs mb-2">Tests Requested</p>
          <ul className="space-y-1">
            {request.tests.map((t, i) => (
              <li key={i} className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0"></span>
                {t}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center justify-between text-xs text-gray-400 font-semibold border-t border-gray-50 pt-4">
          <span>{request.date} at {request.time}</span>
          <button className="bg-[#00B9D6] text-white px-4 py-2 rounded-xl font-bold text-xs hover:bg-[#00a8c3] transition-colors">
            Start Processing
          </button>
        </div>
      </div>
    </div>
  );
};

const LabRequests = () => {
  const [activeTab, setActiveTab] = useState('All Requests');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('Requested Time (Newest)');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showFilter, setShowFilter] = useState(false);

  const filtered = REQUESTS.filter(r => {
    const tabMatch = activeTab === 'All Requests' || r.status === activeTab;
    const searchLower = search.toLowerCase();
    const searchMatch = !search ||
      r.patient.toLowerCase().includes(searchLower) ||
      r.id.toLowerCase().includes(searchLower) ||
      r.tests.some(t => t.toLowerCase().includes(searchLower));
    return tabMatch && searchMatch;
  });

  const totalPages = Math.ceil(filtered.length / rowsPerPage);
  const paginated = filtered.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  return (
    <div className="min-h-screen bg-gray-50/50 pb-12">
      <LabHeader activePage="requests" />

      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mt-6">

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">Lab Test Requests</h1>
            <p className="text-sm text-gray-400 font-medium mt-0.5">View and manage all incoming lab test requests from doctors.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by patient name, ID or test..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-white outline-none focus:ring-2 focus:ring-[#00B9D6]/30 focus:border-[#00B9D6] w-72 transition-all"
              />
            </div>
            <button
              onClick={() => setShowFilter(!showFilter)}
              className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 bg-white hover:bg-gray-50 transition-colors"
            >
              <Filter className="w-4 h-4" />
              Filter
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-7">
          {STATS.map((stat, i) => (
            <div key={i} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center gap-2 mb-3">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${stat.bg}`}>
                  <stat.icon className={`w-4 h-4 ${stat.color}`} />
                </div>
              </div>
              <p className="text-[10px] uppercase tracking-wider font-bold text-gray-400">{stat.label}</p>
              <p className="text-3xl font-extrabold text-gray-900 mt-1">{stat.value}</p>
              <p className="text-[10px] text-gray-400 font-semibold mt-1">{stat.sub}</p>
            </div>
          ))}
        </div>

        {/* Main Table Card */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">

          {/* Tabs + Sort */}
          <div className="px-6 pt-5 pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-50">
            <div>
              <h2 className="text-base font-bold text-gray-900 mb-3">All Lab Test Requests</h2>
              <div className="flex items-center gap-0">
                {TABS.map(tab => (
                  <button
                    key={tab}
                    onClick={() => { setActiveTab(tab); setCurrentPage(1); }}
                    className={`pb-3 px-4 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${
                      activeTab === tab
                        ? 'border-[#00B9D6] text-[#00B9D6]'
                        : 'border-transparent text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-3 pb-3">
              <div className="flex items-center gap-2 text-sm text-gray-500 font-semibold">
                <span>Sort by:</span>
                <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-xs font-bold text-gray-700 cursor-pointer hover:bg-gray-50">
                  <span>{sortBy}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                </div>
              </div>
              <button className="flex items-center gap-1.5 bg-[#00B9D6] hover:bg-[#00a8c3] text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors shadow-sm">
                <Download className="w-3.5 h-3.5" />
                Export
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-50 bg-gray-50/50">
                  <th className="py-3.5 px-6 text-[10px] uppercase tracking-wider font-bold text-gray-400">Request ID</th>
                  <th className="py-3.5 px-6 text-[10px] uppercase tracking-wider font-bold text-gray-400">Patient Details</th>
                  <th className="py-3.5 px-6 text-[10px] uppercase tracking-wider font-bold text-gray-400">Doctor</th>
                  <th className="py-3.5 px-6 text-[10px] uppercase tracking-wider font-bold text-gray-400">Tests Requested</th>
                  <th className="py-3.5 px-6 text-[10px] uppercase tracking-wider font-bold text-gray-400">Priority</th>
                  <th className="py-3.5 px-6 text-[10px] uppercase tracking-wider font-bold text-gray-400">Requested Time</th>
                  <th className="py-3.5 px-6 text-[10px] uppercase tracking-wider font-bold text-gray-400">Status</th>
                  <th className="py-3.5 px-6 text-[10px] uppercase tracking-wider font-bold text-gray-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {paginated.map((req) => (
                  <tr key={req.id} className="hover:bg-blue-50/20 transition-colors group">
                    <td className="py-4 px-6">
                      <span className="text-sm font-bold text-[#00B9D6] cursor-pointer hover:underline">{req.id}</span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-400 flex-shrink-0">
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/></svg>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900">{req.patient}</p>
                          <p className="text-[11px] text-gray-400 font-semibold">PID: {req.pid} | {req.age} Y/{req.gender}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-sm font-bold text-gray-800">{req.doctor}</p>
                      <p className="text-[11px] text-gray-400 font-semibold">{req.specialization}</p>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-sm font-semibold text-gray-700">{req.tests[0]}</p>
                      {req.tests.length > 1 && (
                        <p className="text-[11px] text-[#00B9D6] font-bold cursor-pointer hover:underline">
                          + {req.tests.length - 1} more test{req.tests.length > 2 ? 's' : ''}
                        </p>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-block px-2.5 py-1 text-[11px] font-bold rounded-lg ${getPriorityBadge(req.priority)}`}>
                        {req.priority}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-sm font-semibold text-gray-700">{req.date}</p>
                      <p className="text-[11px] text-gray-400 font-semibold">{req.time}</p>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-block px-2.5 py-1 text-[11px] font-bold rounded-lg ${getStatusBadge(req.status)}`}>
                        {req.status}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setSelectedRequest(req)}
                          className="p-2 rounded-xl text-[#00B9D6] hover:bg-blue-50 transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 rounded-xl text-gray-400 hover:bg-gray-50 transition-colors">
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {paginated.length === 0 && (
                  <tr>
                    <td colSpan="8" className="py-16 text-center text-gray-400 font-semibold">
                      No requests found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-gray-50 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-gray-400 font-semibold">
              Showing {filtered.length === 0 ? 0 : (currentPage - 1) * rowsPerPage + 1} to {Math.min(currentPage * rowsPerPage, filtered.length)} of {filtered.length} requests
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg border border-gray-200 text-gray-400 hover:bg-gray-50 disabled:opacity-40 transition-colors"
              >
                <ChevronsLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg border border-gray-200 text-gray-400 hover:bg-gray-50 disabled:opacity-40 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 rounded-lg text-sm font-bold transition-colors ${
                    page === currentPage
                      ? 'bg-[#00B9D6] text-white shadow-sm'
                      : 'border border-gray-200 text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
              {totalPages > 5 && (
                <>
                  <span className="text-gray-400 text-sm">...</span>
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    className="w-8 h-8 rounded-lg text-sm font-bold border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors"
                  >
                    {totalPages}
                  </button>
                </>
              )}
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages || totalPages === 0}
                className="p-1.5 rounded-lg border border-gray-200 text-gray-400 hover:bg-gray-50 disabled:opacity-40 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages || totalPages === 0}
                className="p-1.5 rounded-lg border border-gray-200 text-gray-400 hover:bg-gray-50 disabled:opacity-40 transition-colors"
              >
                <ChevronsRight className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-2 ml-4">
                <span className="text-xs text-gray-400 font-semibold">Rows per page:</span>
                <select
                  value={rowsPerPage}
                  onChange={e => { setRowsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                  className="border border-gray-200 rounded-lg text-xs font-bold text-gray-600 py-1.5 px-2 outline-none bg-white"
                >
                  {[5, 10, 20, 50].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Detail Modal */}
      {selectedRequest && (
        <DetailModal request={selectedRequest} onClose={() => setSelectedRequest(null)} />
      )}
    </div>
  );
};

export default LabRequests;
