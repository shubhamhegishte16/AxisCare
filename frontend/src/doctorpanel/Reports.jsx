import React, { useState, useEffect } from 'react';
import Header from './Header';
import { 
  FileText, 
  Calendar as CalendarIcon, 
  ChevronDown,
  SlidersHorizontal,
  Eye,
  MoreVertical,
  Plus,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Search,
  Download,
  Pencil,
  FileCheck2,
  Award,
  Clock,
  UploadCloud,
  FileBox,
  FilePlus,
  ArrowRight,
  Trash2
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { doctorService } from '../services/doctorService';

const Reports = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [menuOpenId, setMenuOpenId] = useState(null);

  useEffect(() => {
    const handleClickOutside = () => setMenuOpenId(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const res = await doctorService.getReports();
      if (res.success) {
        setReports(res.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async (reportId) => {
    if (!window.confirm('Publish this report? The patient will be notified.')) return;
    try {
      const res = await doctorService.updateReportStatus(reportId, 'Final');
      if (res.success) {
        setReports(prev => prev.map(r => r._id === reportId ? { ...r, status: 'Final' } : r));
      }
    } catch (e) {
      alert(e.message || 'Failed to publish report');
    }
  };

  const handleDelete = async (reportId) => {
    if (!window.confirm('Delete this draft report? This cannot be undone.')) return;
    try {
      const res = await doctorService.deleteReport(reportId);
      if (res.success) {
        setReports(prev => prev.filter(r => r._id !== reportId));
      }
    } catch (e) {
      alert(e.message || 'Failed to delete report');
    }
    setMenuOpenId(null);
  };

  const handlePrint = (report) => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Report - ${report._id}</title>
          <style>
            body { font-family: sans-serif; color: #333; margin: 40px; }
            .header { display: flex; justify-content: space-between; border-bottom: 2px solid #00B9D6; padding-bottom: 20px; margin-bottom: 30px; }
            .logo { font-size: 24px; font-weight: bold; color: #0b3363; }
            .patient-card { background: #f8f9fa; border: 1px solid #eee; padding: 15px; border-radius: 8px; margin-bottom: 30px; display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
            .section-title { font-size: 16px; font-weight: bold; color: #0b3363; margin-top: 20px; border-bottom: 1px solid #eee; padding-bottom: 5px; }
            .content { margin-top: 10px; font-size: 14px; line-height: 1.6; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="logo">AxisCare</div>
              <div>Medical Report</div>
            </div>
            <div style="text-align: right">
              <h3>${report.reportType}</h3>
              <div>Date: ${report.visitDate}</div>
            </div>
          </div>
          <div class="patient-card">
            <div>
              <strong>Patient Name:</strong> ${report.patientName}<br>
            </div>
            <div>
              <strong>Report ID:</strong> ${report._id}<br>
              <strong>Status:</strong> ${report.status}
            </div>
          </div>
          
          <div class="section-title">Clinical Findings</div>
          <div class="content">
            <strong>Symptoms:</strong> ${report.symptoms || 'None'}<br><br>
            <strong>Diagnosis:</strong> ${report.diagnosis || 'None'}<br><br>
            <strong>Observations:</strong> ${report.clinicalObservations || 'None'}
          </div>

          <div class="section-title">Recommendations</div>
          <div class="content">
            <strong>Follow-up Advice:</strong> ${report.followUpAdvice || 'None'}<br><br>
            <strong>Lifestyle Advice:</strong> ${report.lifestyleAdvice || 'None'}
          </div>
          
          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const filteredReports = reports.filter(r => 
    r.patientName.toLowerCase().includes(search.toLowerCase()) || 
    r.reportType.toLowerCase().includes(search.toLowerCase())
  );

  const getTypeIcon = (type) => {
    if (type.includes('Certificate')) return Award;
    if (type.includes('Progress')) return TrendingUp;
    return FileText;
  };

  const getIconColor = (type) => {
    if (type.includes('Certificate')) return 'text-green-500';
    if (type.includes('Progress')) return 'text-purple-500';
    return 'text-blue-500';
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Header />
      <main className="flex-1 p-6 lg:p-8 max-w-[1400px] mx-auto w-full">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Reports</h1>
            <p className="text-gray-500 text-sm">Create, view and manage all medical reports and documents.</p></div>
          <Link to="/doctordashboard/create-report" className="flex items-center gap-2 bg-[#00B9D6] text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-sm hover:bg-[#00a3bd] transition-colors">
            <Plus className="w-4 h-4" />
            Create Report <ChevronDown className="w-4 h-4 border-l border-white/20 pl-1 ml-1" /></Link></div>
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 items-start">
          {/* Main Content (Left 3 columns) */}
          <div className="xl:col-span-3 flex flex-col gap-6">
            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard title="Total Reports" value={reports.length} subtext="All time" icon={FileText} iconColor="text-blue-500" bgColor="bg-blue-50" />
              <StatCard title="Today's Reports" value={reports.filter(r => r.visitDate === new Date().toISOString().split('T')[0]).length} subtext="Today" icon={FileCheck2} iconColor="text-green-500" bgColor="bg-green-50" />
              <StatCard title="Certificates" value={reports.filter(r => r.reportType.includes('Certificate')).length} subtext="Total" icon={Award} iconColor="text-orange-500" bgColor="bg-orange-50" />
              <StatCard title="Draft Reports" value={reports.filter(r => r.status === 'Draft').length} subtext="View and complete" icon={Clock} iconColor="text-red-500" bgColor="bg-red-50" /></div>
            {/* Filters & Search */}
            <div className="bg-white p-4 rounded-t-xl border border-gray-200 border-b-0 flex flex-col lg:flex-row items-center gap-4">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="text" 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by patient name, report ID or type..." 
                  className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00B9D6] focus:border-transparent transition-all"
                /></div>
            </div>
            
            {/* Table */}
            <div className="bg-white border border-gray-200 rounded-b-xl shadow-sm overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                    <th className="px-6 py-4">Report ID</th>
                    <th className="px-6 py-4">Patient</th>
                    <th className="px-6 py-4">Report Type</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th></tr></thead>
                <tbody className="divide-y divide-gray-100">
                  {loading ? (
                    <tr><td colSpan="6" className="text-center py-8 text-gray-500">Loading reports...</td></tr>
                  ) : filteredReports.length === 0 ? (
                    <tr><td colSpan="6" className="text-center py-8 text-gray-500">No reports found.</td></tr>
                  ) : filteredReports.map((rep) => {
                    const TypeIcon = getTypeIcon(rep.reportType);
                    const iconColor = getIconColor(rep.reportType);
                    return (
                    <tr key={rep._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-bold text-blue-600 whitespace-nowrap">
                        {rep._id.substring(0, 8).toUpperCase()}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-200 text-gray-600 font-bold">
                            {rep.patientName.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-900">{rep.patientName}</p>
                          </div></div></td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-gray-50 shrink-0 border border-gray-100`}>
                            <TypeIcon className={`w-4 h-4 ${iconColor}`} /></div>
                          <div>
                            <p className="text-sm font-bold text-gray-900">{rep.reportType}</p>
                          </div></div></td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="text-sm font-bold text-gray-900">{rep.visitDate}</p>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wide">{rep.visitTime}</p></td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={rep.status} /></td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center justify-end gap-2 text-gray-400">
                            {rep.status === 'Draft' && (
                              <button
                                onClick={() => handlePublish(rep._id)}
                                title="Publish Report"
                                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#00B9D6] text-white text-[10px] font-bold hover:bg-[#00a3bd] transition-colors"
                              >
                                Publish
                              </button>
                            )}
                            <button onClick={() => handlePrint(rep)} title="View/Print" className="hover:text-gray-900 transition-colors"><Eye className="w-4 h-4" /></button>
                            <button onClick={() => handlePrint(rep)} title="Download" className="hover:text-gray-900 transition-colors">
                              <Download className="w-4 h-4" />
                            </button>
                            <div className="relative">
                              <button
                                onClick={(e) => { e.stopPropagation(); setMenuOpenId(menuOpenId === rep._id ? null : rep._id); }}
                                className="hover:text-gray-900 transition-colors"
                                title="More options"
                              >
                                <MoreVertical className="w-4 h-4" />
                              </button>
                              {menuOpenId === rep._id && (
                                <div className="absolute right-0 mt-1 w-40 bg-white border border-gray-200 rounded-xl shadow-lg z-50 py-1 overflow-hidden">
                                  <button
                                    onClick={(e) => { e.stopPropagation(); setMenuOpenId(null); navigate(`/doctordashboard/edit-report/${rep._id}`); }}
                                    className="w-full text-left px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                  >
                                    <Pencil className="w-3.5 h-3.5 text-blue-500" /> Edit
                                  </button>
                                  {rep.status === 'Draft' && (
                                    <button
                                      onClick={(e) => { e.stopPropagation(); handleDelete(rep._id); }}
                                      className="w-full text-left px-4 py-2.5 text-xs font-semibold text-red-600 hover:bg-red-50 flex items-center gap-2"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" /> Remove
                                    </button>
                                  )}
                                </div>
                              )}
                            </div>
                          </div></td></tr>
                  )})}
                </tbody></table></div>
            </div>
            
          {/* Sidebar (Right column) */}
          <div className="xl:col-span-1 flex flex-col gap-6">
            {/* Recent Reports */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-sm font-bold text-gray-900">Recent Reports</h3>
                </div>
              <div className="flex flex-col gap-5">
                {reports.slice(0, 3).map(rr => (
                  <div key={rr._id} className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center bg-gray-200 text-gray-600 font-bold shrink-0">
                      {rr.patientName.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-gray-900 leading-tight">{rr.patientName}</p>
                      <p className="text-[10px] text-gray-500 font-medium mb-1">{rr.reportType}</p>
                      <div className="flex items-center justify-between">
                        <StatusBadge status={rr.status} />
                        <span className="text-[9px] font-bold text-gray-400 uppercase">{rr.visitDate}</span></div></div></div>
                ))}
                {reports.length === 0 && <p className="text-xs text-gray-400 text-center">No recent reports</p>}
              </div>
            </div>
            {/* Quick Actions */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5">
              <h3 className="text-sm font-bold text-gray-900 mb-5">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => navigate('/doctordashboard/create-report')} className="flex flex-col items-center justify-center p-4 bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-100 rounded-xl gap-2 h-24">
                  <FilePlus className="w-5 h-5 text-blue-600 mb-1" />
                  <span className="text-[10px] font-bold text-gray-900 text-center leading-tight">Create Report</span></button>
                <button onClick={() => navigate('/doctordashboard/create-report')} className="flex flex-col items-center justify-center p-4 bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-100 rounded-xl gap-2 h-24">
                  <UploadCloud className="w-5 h-5 text-blue-600 mb-1" />
                  <span className="text-[10px] font-bold text-gray-900 text-center leading-tight">Upload Document</span></button>
                <button onClick={() => navigate('/doctordashboard/create-report')} className="flex flex-col items-center justify-center p-4 bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-100 rounded-xl gap-2 h-24">
                  <Award className="w-5 h-5 text-blue-600 mb-1" />
                  <span className="text-[10px] font-bold text-gray-900 text-center leading-tight">Medical Certificate</span></button>
              </div></div></div></div>
        </main></div>
  );
};
const StatCard = ({ title, value, subtext, icon: Icon, iconColor, bgColor }) => (
  <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between h-full gap-4 relative">
    <div className="flex items-start gap-4">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${bgColor}`}>
        <Icon className={`w-5 h-5 ${iconColor}`} /></div>
      <div>
        <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-1 leading-tight">{title}</h3>
        <p className="text-2xl font-extrabold text-gray-900 leading-none mb-1">{value}</p>
        <div className="text-[10px] font-bold mt-1 text-gray-400">{subtext}</div></div></div></div>
);
const StatusBadge = ({ status }) => {
  const getStyles = () => {
    switch (status?.toUpperCase()) {
      case 'FINAL':
      case 'COMPLETED':
        return 'bg-green-50 text-green-600';
      case 'DRAFT':
        return 'bg-blue-50 text-blue-600';
      case 'PENDING':
        return 'bg-orange-50 text-orange-500';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };
  return (
    <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold tracking-wider uppercase ${getStyles()}`}>
      {status || 'UNKNOWN'}</span>
  );
};
export default Reports;
