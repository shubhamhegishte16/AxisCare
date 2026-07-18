import React, { useState, useEffect } from 'react';
import Header from './Header';
import {
  FileText,
  FlaskConical,
  CheckCircle2,
  Clock,
  XCircle,
  Search,
  Calendar,
  ChevronDown,
  Filter,
  Eye,
  Download,
  MoreVertical
} from 'lucide-react';
import { doctorService } from '../services/doctorService';
import LabReportView from '../shared/LabReportView';

const StatCard = ({ icon: Icon, title, value, subtext, subtextColor, bgColor, iconColor }) => (
  <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${bgColor} ${iconColor}`}>
      <Icon className="w-6 h-6" />
    </div>
    <div>
      <p className="text-sm font-semibold text-gray-500 mb-0.5">{title}</p>
      <div className="flex items-end gap-2">
        <h3 className="text-xl font-bold text-gray-900">{value}</h3>
      </div>
      {subtext && <p className={`text-xs font-bold mt-1 ${subtextColor}`}>{subtext}</p>}
    </div>
  </div>
);

export default function LabReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal states
  const [selectedReport, setSelectedReport] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const res = await doctorService.getLabReports();
      if (res.success) {
        setReports(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusPill = (status) => {
    switch (status) {
      case 'Completed': return <span className="px-2.5 py-1 text-[11px] font-bold rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">Completed</span>;
      case 'Pending': return <span className="px-2.5 py-1 text-[11px] font-bold rounded-full bg-orange-50 text-orange-600 border border-orange-100">Pending</span>;
      case 'Cancelled': return <span className="px-2.5 py-1 text-[11px] font-bold rounded-full bg-red-50 text-red-600 border border-red-100">Cancelled</span>;
      default: return <span className="px-2.5 py-1 text-[11px] font-bold rounded-full bg-gray-50 text-gray-600 border border-gray-100">{status}</span>;
    }
  };

  const inferResult = (resultText) => {
    if (!resultText) return <span className="text-gray-400">—</span>;
    const lower = resultText.toLowerCase();
    if (lower.includes('abnormal') || lower.includes('high') || lower.includes('low')) {
      return <span className="px-2.5 py-1 text-[11px] font-bold rounded-full bg-rose-50 text-rose-600 border border-rose-100">Abnormal</span>;
    }
    return <span className="px-2.5 py-1 text-[11px] font-bold rounded-full bg-green-50 text-green-600 border border-green-100">Normal</span>;
  };

  const filteredReports = reports.filter(r => 
    r.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.labTests?.some(t => t.testName?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const stats = {
    total: reports.length,
    thisMonth: reports.filter(r => new Date(r.createdAt).getMonth() === new Date().getMonth()).length,
    completed: reports.filter(r => r.status === 'Completed').length,
    pending: reports.filter(r => r.status === 'Pending').length,
    cancelled: reports.filter(r => r.status === 'Cancelled').length,
  };

  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-col">
      <Header />
      
      <main className="flex-1 p-6 lg:p-8 max-w-[1600px] mx-auto w-full">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-extrabold text-gray-900 mb-1">Lab Reports</h1>
          <p className="text-sm font-medium text-gray-500">View and manage lab reports received from the laboratory.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          <StatCard icon={FileText} title="Total Reports" value={stats.total} subtext="All time" subtextColor="text-gray-400" bgColor="bg-blue-50" iconColor="text-blue-500" />
          <StatCard icon={FlaskConical} title="This Month" value={stats.thisMonth} subtext="18% from last month" subtextColor="text-blue-600" bgColor="bg-blue-50" iconColor="text-blue-600" />
          <StatCard icon={CheckCircle2} title="Completed" value={stats.completed} subtext={`${stats.total ? Math.round((stats.completed/stats.total)*100) : 0}% of total`} subtextColor="text-emerald-500" bgColor="bg-emerald-50" iconColor="text-emerald-500" />
          <StatCard icon={Clock} title="Pending" value={stats.pending} subtext={`${stats.total ? Math.round((stats.pending/stats.total)*100) : 0}% of total`} subtextColor="text-orange-500" bgColor="bg-orange-50" iconColor="text-orange-500" />
          <StatCard icon={XCircle} title="Cancelled" value={stats.cancelled} subtext={`${stats.total ? Math.round((stats.cancelled/stats.total)*100) : 0}% of total`} subtextColor="text-red-500" bgColor="bg-red-50" iconColor="text-red-500" />
        </div>

        {/* Filters */}
        <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm mb-6 flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[280px] relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by patient name, report ID or test name..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>
          
          <div className="relative group cursor-pointer">
            <div className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl bg-gray-50/50 hover:bg-gray-50 transition-colors">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-bold text-gray-700">11 Jul 2026 - 11 Jul 2026</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl bg-gray-50/50 hover:bg-gray-50 transition-colors cursor-pointer">
            <span className="text-sm font-bold text-gray-700">All Patients</span>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </div>
          
          <div className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl bg-gray-50/50 hover:bg-gray-50 transition-colors cursor-pointer">
            <span className="text-sm font-bold text-gray-700">All Test Types</span>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </div>
          
          <div className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl bg-gray-50/50 hover:bg-gray-50 transition-colors cursor-pointer">
            <span className="text-sm font-bold text-gray-700">All Status</span>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </div>
          
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl bg-white hover:bg-gray-50 transition-colors ml-auto shadow-sm">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-bold text-gray-700">Filters</span>
          </button>
        </div>

        {/* Table */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden flex flex-col">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100">
                  <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Report ID</th>
                  <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Patient</th>
                  <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Test Name</th>
                  <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Sample Date</th>
                  <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Reported Date</th>
                  <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Results</th>
                  <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  <tr><td colSpan="8" className="py-8 text-center text-sm text-gray-500">Loading reports...</td></tr>
                ) : filteredReports.length === 0 ? (
                  <tr><td colSpan="8" className="py-8 text-center text-sm text-gray-500">No lab reports found.</td></tr>
                ) : (
                  filteredReports.map((report) => (
                    report.labTests?.map((test, index) => {
                      const shortId = `LR-${String(report._id).slice(-6).toUpperCase()}-${index+1}`;
                      const patientPid = `P${String(report.patientId || '10234').slice(-5).toUpperCase()}`;
                      
                      return (
                        <tr key={`${report._id}-${index}`} className="hover:bg-gray-50/50 transition-colors">
                          <td className="py-4 px-6">
                            <span className="text-sm font-bold text-blue-600">{shortId}</span>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-gray-200 border border-gray-300 overflow-hidden">
                                <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(report.patientName)}&background=random`} alt="Avatar" className="w-full h-full object-cover" />
                              </div>
                              <div>
                                <p className="text-sm font-bold text-gray-900 leading-tight">{report.patientName}</p>
                                <p className="text-[11px] text-gray-500 font-medium">PID: {patientPid}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <p className="text-sm font-semibold text-gray-800 leading-tight">{test.testName}</p>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide mt-0.5">{test.category || 'TEST'}</p>
                          </td>
                          <td className="py-4 px-6">
                            <span className="text-sm font-semibold text-gray-600">{report.appointmentDate || new Date(report.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                          </td>
                          <td className="py-4 px-6">
                            {test.status === 'Completed' ? (
                              <div>
                                <p className="text-sm font-semibold text-gray-800 leading-tight">
                                  {new Date(report.updatedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}, {new Date(report.updatedAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                                </p>
                                <p className="text-[10px] text-gray-400 font-medium mt-0.5">Dr. Lab Technician</p>
                              </div>
                            ) : <span className="text-gray-400">—</span>}
                          </td>
                          <td className="py-4 px-6">
                            {getStatusPill(test.status || report.status)}
                          </td>
                          <td className="py-4 px-6">
                            {test.status === 'Completed' ? inferResult(test.results) : <span className="text-gray-400">—</span>}
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center justify-end gap-3 text-gray-400">
                              <button onClick={() => { setSelectedReport({ ...report, test }); setIsModalOpen(true); }} className="hover:text-blue-500 transition-colors" title="View Report">
                                <Eye className="w-4 h-4" />
                              </button>
                              <button className="hover:text-blue-500 transition-colors" title="Download">
                                <Download className="w-4 h-4" />
                              </button>
                              <button className="hover:text-gray-600 transition-colors">
                                <MoreVertical className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/30">
            <p className="text-sm font-semibold text-gray-500">Showing 1 to {filteredReports.length} of {stats.total} reports</p>
            <div className="flex items-center gap-1">
              <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:bg-gray-50 disabled:opacity-50">{'<'}</button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-sm">1</button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 font-bold text-sm hover:bg-gray-50">2</button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 font-bold text-sm hover:bg-gray-50">3</button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:bg-gray-50 disabled:opacity-50">{'>'}</button>
            </div>
          </div>
        </div>
      </main>

      {/* View Result Modal */}
      {isModalOpen && selectedReport && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
          <div className="bg-gray-50 rounded-2xl shadow-xl w-full max-w-5xl overflow-hidden flex flex-col max-h-[92vh]">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Lab Report</h3>
                <p className="text-xs text-gray-400 font-medium mt-0.5">Detailed test results for {selectedReport.patientName}</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 bg-white rounded-full p-1 border border-gray-200"><XCircle className="w-5 h-5" /></button>
            </div>
            <div className="p-6 overflow-y-auto">
              <LabReportView report={selectedReport} test={selectedReport.test} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
