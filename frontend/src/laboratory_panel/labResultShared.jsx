import React from 'react';
import { ChevronLeft, ChevronRight, Download, FileText, X, XCircle } from 'lucide-react';
import LabReportView from '../shared/LabReportView';

export const statusBadge = (status) => {
  switch (status) {
    case 'Completed': return 'bg-emerald-50 text-emerald-600 border border-emerald-200';
    case 'In Review': return 'bg-amber-50 text-amber-600 border border-amber-200';
    case 'Abnormal': return 'bg-red-50 text-red-600 border border-red-200';
    case 'Pending': return 'bg-blue-50 text-blue-500 border border-blue-200';
    case 'Cancelled': return 'bg-gray-100 text-gray-500 border border-gray-200';
    case 'Replaced': return 'bg-orange-50 text-orange-500 border border-orange-200';
    case 'Rejected': return 'bg-red-50 text-red-600 border border-red-200';
    default: return 'bg-gray-100 text-gray-500';
  }
};
export const formatDateTime = (value) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return `${date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}, ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
};
export const getVerifiedBy = (resultText = '') => {
  if (!resultText) return '';
  try { return JSON.parse(resultText).sample?.verifiedBy || ''; }
  catch { return String(resultText).match(/Verified:\s*([^|\n]+)/i)?.[1]?.trim() || ''; }
};
export const getShortId = (appointmentId, index) => `TR-${String(appointmentId || '').slice(-6).toUpperCase() || 'RESULT'}-${index + 1}`;
export const buildReport = (result) => ({
  _id: result.appointmentId, patientId: result.patientId, patientName: result.patientName,
  patientAge: result.patientAge, patientGender: result.patientGender,
  requestedBy: result.referringDoctor || 'Self Requested', referringDoctor: result.referringDoctor || 'Self Requested',
  appointmentDate: result.appointmentDate, appointmentTime: result.appointmentTime, date: result.appointmentDate,
  createdAt: result.createdAt, updatedAt: result.updatedAt, completedAt: result.completedAt,
});
export const normalizeResult = (result, index) => ({
  id: getShortId(result.appointmentId, index), dbId: result.appointmentId, testId: result.testId,
  patient: result.patientName || 'Unknown Patient', pid: result.patientId ? `P-${String(result.patientId).slice(-5).toUpperCase()}` : 'N/A',
  gender: result.patientGender || 'N/A', age: result.patientAge || 'N/A', mobile: result.patientPhone || 'N/A',
  testType: result.test?.testName || 'Lab Test', sampleType: result.test?.category || 'Other',
  collectedOn: result.appointmentDate && result.appointmentTime ? `${result.appointmentDate}, ${result.appointmentTime}` : result.appointmentDate || formatDateTime(result.createdAt),
  resultDate: formatDateTime(result.completedAt || result.updatedAt), status: result.status || 'Completed',
  attachment: result.test?.reportUrl ? result.test.reportUrl.split('/').pop() : '', attachmentSize: '', raw: result,
  report: buildReport(result), test: result.test,
});
export const normalizeHistory = (result, index) => {
  const base = normalizeResult(result, index);
  return { ...base, type: base.testType, sample: base.sampleType, reqDate: base.collectedOn, resDate: base.resultDate, tech: getVerifiedBy(result.test?.results) || 'Lab Technician' };
};
export function Pager({ total, page, rowsPerPage, onPage }) {
  const totalPages = Math.ceil(total / rowsPerPage), safePage = Math.min(page, totalPages || 1);
  return <div className="flex items-center gap-1"><button onClick={() => onPage(p => Math.max(1, p - 1))} disabled={safePage === 1} className="p-1.5 rounded-lg border border-gray-200 text-gray-400 hover:bg-gray-50 disabled:opacity-40"><ChevronLeft className="w-3.5 h-3.5" /></button>{Array.from({ length: totalPages }, (_, i) => i + 1).slice(0, 5).map(p => <button key={p} onClick={() => onPage(p)} className={`w-7 h-7 rounded-lg text-xs font-bold ${p === safePage ? 'bg-[#00B9D6] text-white' : 'border border-gray-200 text-gray-500 hover:bg-gray-50'}`}>{p}</button>)}<button onClick={() => onPage(p => Math.min(totalPages, p + 1))} disabled={safePage === totalPages || totalPages === 0} className="p-1.5 rounded-lg border border-gray-200 text-gray-400 hover:bg-gray-50 disabled:opacity-40"><ChevronRight className="w-3.5 h-3.5" /></button></div>;
}
export function ReportModal({ item, onClose }) {
  if (!item) return null;
  return <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm"><div className="bg-gray-50 rounded-2xl shadow-xl w-full max-w-5xl overflow-hidden flex flex-col max-h-[92vh]"><div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white"><div><h3 className="text-lg font-bold text-gray-900">Lab Report</h3><p className="text-xs text-gray-400 font-medium mt-0.5">Detailed test results for {item.patient}</p></div><button onClick={onClose} className="text-gray-400 hover:text-gray-600 bg-white rounded-full p-1 border border-gray-200"><XCircle className="w-5 h-5" /></button></div><div className="p-6 overflow-y-auto"><LabReportView report={item.report} test={item.test} /></div></div></div>;
}
export function ResultDetailPanel({ result, onClose, onViewFullReport }) {
  if (!result) return null;
  const details = [ ['TEST ID', result.id], ['TEST TYPE', result.testType], ['SAMPLE TYPE', result.sampleType], ['COLLECTED ON', result.collectedOn], ['RESULT DATE', result.resultDate || 'Awaiting'], ['STATUS', result.status, true] ];
  return <div className="w-80 flex-shrink-0 bg-white border border-[#00B9D6]/30 rounded-2xl shadow-md p-5 relative self-start"><div className="flex items-center justify-between mb-4"><h3 className="text-sm font-bold text-gray-900">Selected Result</h3><button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors"><X className="w-4 h-4" /></button></div><div className="flex items-center gap-3 mb-5"><div className="w-12 h-12 rounded-full bg-blue-50 border-2 border-blue-100 flex items-center justify-center text-blue-400 flex-shrink-0"><svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" /></svg></div><div><h4 className="text-base font-bold text-gray-900">{result.patient}</h4><p className="text-xs text-gray-400 font-semibold">PID: {result.pid} | {result.gender}, {result.age} Y</p><p className="text-xs text-gray-400 font-semibold">Mobile: {result.mobile}</p></div></div><div className="mb-4"><h5 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">Test Details</h5><div className="grid grid-cols-2 gap-3">{details.map(([label, value, isStatus]) => <div key={label}><p className="text-[9px] uppercase tracking-wider font-bold text-gray-400 mb-0.5">{label}</p>{isStatus ? <span className={`inline-block px-2 py-0.5 text-[11px] font-bold rounded-lg ${statusBadge(value)}`}>{value}</span> : <p className="text-xs font-semibold text-gray-800">{value}</p>}</div>)}</div></div>{result.attachment && <div className="mb-4"><h5 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">Attachments</h5><div className="flex items-center justify-between bg-gray-50 border border-gray-100 rounded-xl p-3"><div className="flex items-center gap-2.5"><div className="w-8 h-8 rounded-lg bg-red-50 border border-red-100 flex items-center justify-center"><FileText className="w-4 h-4 text-red-500" /></div><div><p className="text-xs font-bold text-gray-800 leading-tight">{result.attachment}</p>{result.attachmentSize && <p className="text-[10px] text-gray-400 font-semibold">{result.attachmentSize}</p>}</div></div><button className="text-gray-400 hover:text-[#00B9D6] transition-colors p-1.5 rounded-lg hover:bg-blue-50"><Download className="w-4 h-4" /></button></div></div>}<button onClick={onViewFullReport} className="w-full bg-[#00B9D6] hover:bg-[#00a8c3] text-white font-bold text-sm py-3 rounded-xl transition-colors shadow-sm">View Full Report</button></div>;
}