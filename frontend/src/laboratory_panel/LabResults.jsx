import React, { useState } from 'react';
import {
  Search, Download, Eye, ChevronDown, X,
  CheckCircle2, Clock, AlertTriangle, Hourglass,
  FileText, ChevronLeft, ChevronRight
} from 'lucide-react';
import LabHeader from './LabHeader';

const RESULTS = [
  {
    id: 'TR-2025-0516-001',
    patient: 'Amit Kumar',
    pid: 'P-10024',
    gender: 'Male',
    age: 45,
    mobile: '+91 98765 43210',
    testType: 'Complete Blood Count (CBC)',
    sampleType: 'Blood',
    collectedOn: '22 May 2025, 09:00 AM',
    resultDate: '23 May 2025, 10:30 AM',
    status: 'Completed',
    attachment: 'CBC_Report_AmitKumar.pdf',
    attachmentSize: '245 KB',
  }
];

const TAB_FILTERS = [
  { key: 'All Results', count: 32, icon: null },
  { key: 'Completed', count: 18, icon: CheckCircle2, color: 'text-emerald-500' },
  { key: 'In Review', count: 6, icon: Clock, color: 'text-amber-500' },
  { key: 'Abnormal', count: 4, icon: AlertTriangle, color: 'text-red-500' },
  { key: 'Pending', count: 4, icon: Hourglass, color: 'text-blue-400' },
];

const getStatusBadge = (status) => {
  switch (status) {
    case 'Completed': return 'bg-emerald-50 text-emerald-600 border border-emerald-200';
    case 'In Review': return 'bg-amber-50 text-amber-600 border border-amber-200';
    case 'Abnormal': return 'bg-red-50 text-red-600 border border-red-200';
    case 'Pending': return 'bg-blue-50 text-blue-500 border border-blue-200';
    default: return 'bg-gray-100 text-gray-500';
  }
};

const ResultDetailPanel = ({ result, onClose }) => {
  if (!result) return null;
  return (
    <div className="w-80 flex-shrink-0 bg-white border border-[#00B9D6]/30 rounded-2xl shadow-md p-5 relative self-start">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-gray-900">Selected Result</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Patient Avatar + Info */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-12 h-12 rounded-full bg-blue-50 border-2 border-blue-100 flex items-center justify-center text-blue-400 flex-shrink-0">
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
          </svg>
        </div>
        <div>
          <h4 className="text-base font-bold text-gray-900">{result.patient}</h4>
          <p className="text-xs text-gray-400 font-semibold">PID: {result.pid} · {result.gender}, {result.age} Y</p>
          <p className="text-xs text-gray-400 font-semibold">Mobile: {result.mobile}</p>
        </div>
      </div>

      {/* Test Details */}
      <div className="mb-4">
        <h5 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">Test Details</h5>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'TEST ID', value: result.id },
            { label: 'TEST TYPE', value: result.testType },
            { label: 'SAMPLE TYPE', value: result.sampleType },
            { label: 'COLLECTED ON', value: result.collectedOn },
            { label: 'RESULT DATE', value: result.resultDate || 'Awaiting' },
            { label: 'STATUS', value: result.status, isStatus: true },
          ].map((item, i) => (
            <div key={i}>
              <p className="text-[9px] uppercase tracking-wider font-bold text-gray-400 mb-0.5">{item.label}</p>
              {item.isStatus ? (
                <span className={`inline-block px-2 py-0.5 text-[11px] font-bold rounded-lg ${getStatusBadge(item.value)}`}>{item.value}</span>
              ) : (
                <p className="text-xs font-semibold text-gray-800">{item.value}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Attachments */}
      {result.attachment && (
        <div className="mb-4">
          <h5 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">Attachments</h5>
          <div className="flex items-center justify-between bg-gray-50 border border-gray-100 rounded-xl p-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-red-50 border border-red-100 flex items-center justify-center">
                <FileText className="w-4 h-4 text-red-500" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-800 leading-tight">{result.attachment}</p>
                <p className="text-[10px] text-gray-400 font-semibold">{result.attachmentSize}</p>
              </div>
            </div>
            <button className="text-gray-400 hover:text-[#00B9D6] transition-colors p-1.5 rounded-lg hover:bg-blue-50">
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* View Full Report */}
      <button className="w-full bg-[#00B9D6] hover:bg-[#00a8c3] text-white font-bold text-sm py-3 rounded-xl transition-colors shadow-sm">
        View Full Report
      </button>
    </div>
  );
};

const LabResults = () => {
  const [activeTab, setActiveTab] = useState('All Results');
  const [search, setSearch] = useState('');
  const [testTypeFilter, setTestTypeFilter] = useState('All Tests');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [selectedResult, setSelectedResult] = useState(RESULTS[0]);
  const [dateRange, setDateRange] = useState('16 May 2025 - 23 May 2025');
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = RESULTS.filter(r => {
    const tabMatch = activeTab === 'All Results' || r.status === activeTab;
    const searchLower = search.toLowerCase();
    const searchMatch = !search ||
      r.patient.toLowerCase().includes(searchLower) ||
      r.id.toLowerCase().includes(searchLower) ||
      r.testType.toLowerCase().includes(searchLower);
    const statusMatch = statusFilter === 'All Status' || r.status === statusFilter;
    return tabMatch && searchMatch && statusMatch;
  });

  const rowsPerPage = 5;
  const totalPages = Math.ceil(filtered.length / rowsPerPage);
  const paginated = filtered.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  return (
    <div className="min-h-screen bg-gray-50/50 pb-12">
      <LabHeader activePage="results" />

      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mt-6">

        {/* Page Header */}
        <div className="bg-white border border-dashed border-[#00B9D6]/50 rounded-2xl p-5 mb-5 shadow-sm">
          <h1 className="text-2xl font-extrabold text-gray-900">Test Results</h1>
          <p className="text-sm text-gray-400 font-medium mt-0.5">View and manage all laboratory test results.</p>
        </div>

        {/* Search & Filter Row */}
        <div className="bg-white border border-gray-100 rounded-2xl p-4 mb-5 shadow-sm">
          <div className="flex flex-wrap items-end gap-4">
            {/* Search */}
            <div className="relative flex-1 min-w-48">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by Patient Name, ID or Test ID..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50/50 outline-none focus:ring-2 focus:ring-[#00B9D6]/30 focus:border-[#00B9D6] focus:bg-white transition-all"
              />
            </div>

            {/* Date Range */}
            <div className="min-w-44">
              <p className="text-[9px] uppercase tracking-wider font-bold text-gray-400 mb-1">Date Range</p>
              <div className="flex items-center justify-between gap-2 border border-gray-200 rounded-xl px-3 py-2.5 bg-white cursor-pointer hover:bg-gray-50 transition-colors">
                <span className="text-xs font-bold text-gray-700">{dateRange}</span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
              </div>
            </div>

            {/* Test Type */}
            <div className="min-w-36">
              <p className="text-[9px] uppercase tracking-wider font-bold text-gray-400 mb-1">Test Type</p>
              <div className="flex items-center justify-between gap-2 border border-gray-200 rounded-xl px-3 py-2.5 bg-white">
                <select
                  value={testTypeFilter}
                  onChange={e => setTestTypeFilter(e.target.value)}
                  className="text-xs font-bold text-gray-700 bg-transparent outline-none cursor-pointer w-full"
                >
                  <option>All Tests</option>
                  <option>Complete Blood Count</option>
                  <option>Lipid Profile</option>
                  <option>Liver Function Test</option>
                  <option>Thyroid Profile</option>
                  <option>Urine Routine</option>
                </select>
              </div>
            </div>

            {/* Status */}
            <div className="min-w-32">
              <p className="text-[9px] uppercase tracking-wider font-bold text-gray-400 mb-1">Status</p>
              <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2.5 bg-white">
                <select
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                  className="text-xs font-bold text-gray-700 bg-transparent outline-none cursor-pointer w-full"
                >
                  <option>All Status</option>
                  <option>Completed</option>
                  <option>In Review</option>
                  <option>Abnormal</option>
                  <option>Pending</option>
                </select>
              </div>
            </div>

            {/* Export */}
            <button className="flex items-center gap-2 bg-white border border-[#00B9D6] text-[#00B9D6] hover:bg-[#00B9D6] hover:text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-sm self-end">
              <Download className="w-3.5 h-3.5" />
              Export Report
            </button>
          </div>
        </div>

        {/* Main content area: table + detail panel */}
        <div className="flex gap-5 items-start">

          {/* Left: Results table */}
          <div className="flex-1 bg-white border border-dashed border-[#00B9D6]/40 rounded-2xl shadow-sm overflow-hidden">

            {/* Tabs */}
            <div className="flex items-center gap-0 px-4 pt-4 border-b border-gray-100 overflow-x-auto">
              {TAB_FILTERS.map(tab => (
                <button
                  key={tab.key}
                  onClick={() => { setActiveTab(tab.key); setCurrentPage(1); }}
                  className={`flex items-center gap-1.5 pb-3 px-3 text-xs font-bold border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.key
                      ? 'border-[#00B9D6] text-[#00B9D6]'
                      : 'border-transparent text-gray-400 hover:text-gray-600'
                  }`}
                >
                  {tab.icon && <tab.icon className={`w-3.5 h-3.5 ${tab.color}`} />}
                  {tab.key}
                  <span className={`ml-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                    activeTab === tab.key ? 'bg-[#00B9D6] text-white' : 'bg-gray-100 text-gray-500'
                  }`}>{tab.count}</span>
                </button>
              ))}
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-50">
                    <th className="py-3 px-5 text-[10px] uppercase tracking-wider font-bold text-gray-400">Test ID</th>
                    <th className="py-3 px-5 text-[10px] uppercase tracking-wider font-bold text-gray-400">Patient Name</th>
                    <th className="py-3 px-5 text-[10px] uppercase tracking-wider font-bold text-gray-400">Test Type</th>
                    <th className="py-3 px-5 text-[10px] uppercase tracking-wider font-bold text-gray-400">Sample Type</th>
                    <th className="py-3 px-5 text-[10px] uppercase tracking-wider font-bold text-gray-400">Result Date</th>
                    <th className="py-3 px-5 text-[10px] uppercase tracking-wider font-bold text-gray-400">Status</th>
                    <th className="py-3 px-5 text-[10px] uppercase tracking-wider font-bold text-gray-400">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {paginated.map((result) => (
                    <tr
                      key={result.id}
                      className={`hover:bg-blue-50/30 transition-colors cursor-pointer ${selectedResult?.id === result.id ? 'bg-blue-50/40' : ''}`}
                      onClick={() => setSelectedResult(result)}
                    >
                      <td className="py-4 px-5">
                        <span className="text-xs font-bold text-gray-700">{result.id}</span>
                      </td>
                      <td className="py-4 px-5">
                        <span className="text-sm font-bold text-gray-900">{result.patient}</span>
                      </td>
                      <td className="py-4 px-5">
                        <span className="text-xs font-semibold text-gray-600 leading-tight">{result.testType}</span>
                      </td>
                      <td className="py-4 px-5">
                        <span className="text-xs font-semibold text-gray-600">{result.sampleType}</span>
                      </td>
                      <td className="py-4 px-5">
                        {result.resultDate ? (
                          <span className="text-xs font-semibold text-gray-600 leading-tight">{result.resultDate}</span>
                        ) : (
                          <span className="text-xs font-semibold text-gray-300">Awaiting</span>
                        )}
                      </td>
                      <td className="py-4 px-5">
                        <span className={`inline-block px-2.5 py-1 text-[11px] font-bold rounded-lg ${getStatusBadge(result.status)}`}>
                          {result.status}
                        </span>
                      </td>
                      <td className="py-4 px-5">
                        <button
                          onClick={(e) => { e.stopPropagation(); setSelectedResult(result); }}
                          className="text-[#00B9D6] hover:bg-blue-50 p-1.5 rounded-lg transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {paginated.length === 0 && (
                    <tr>
                      <td colSpan="7" className="py-14 text-center text-gray-400 font-semibold text-sm">
                        No results found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-5 py-3.5 border-t border-gray-50 flex items-center justify-between">
              <p className="text-xs text-gray-400 font-semibold">
                Showing 1 to {Math.min(rowsPerPage, filtered.length)} of {filtered.length} results
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-1.5 rounded-lg border border-gray-200 text-gray-400 hover:bg-gray-50 disabled:opacity-40 transition-colors"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-7 h-7 rounded-lg text-xs font-bold transition-colors ${
                      page === currentPage
                        ? 'bg-[#00B9D6] text-white shadow-sm'
                        : 'border border-gray-200 text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className="p-1.5 rounded-lg border border-gray-200 text-gray-400 hover:bg-gray-50 disabled:opacity-40 transition-colors"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>

          {/* Right: Detail Panel */}
          {selectedResult && (
            <ResultDetailPanel
              result={selectedResult}
              onClose={() => setSelectedResult(null)}
            />
          )}

        </div>
      </main>
    </div>
  );
};

export default LabResults;
