import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Loader2, AlertCircle, Upload, ChevronDown } from 'lucide-react';
import LabHeader from './LabHeader';
import { labService } from '../services/labService';
import { getTestTemplate, METHODS } from './testParams';

const Badge = ({ text, type }) => {
  const cls = type === 'success' ? 'bg-emerald-100 text-emerald-600 border-emerald-200'
    : type === 'info' ? 'bg-blue-100 text-blue-600 border-blue-200'
    : 'bg-amber-100 text-amber-600 border-amber-200';
  return <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold border ${cls}`}>{text}</span>;
};

const InfoField = ({ label, children }) => (
  <div><p className="text-gray-400 font-semibold text-xs">{label}</p><div className="mt-0.5 text-sm font-bold text-gray-900">{children}</div></div>
);

const ProcessTest = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [testData, setTestData] = useState({});
  const [sample, setSample] = useState({ collectedOn: '', receivedOn: '', receivedTime: '', startedOn: '', completedOn: '', verifiedBy: '' });
  const [remarks, setRemarks] = useState('');
  
  const today = new Date().toISOString().split('T')[0];
  const now = new Date().toTimeString().slice(0, 5);

  useEffect(() => { fetchData(); }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await labService.getRequestById(id);
      if (res.success && res.data) {
        setRequest(res.data);
        setSample({ collectedOn: today, receivedOn: today, receivedTime: now, startedOn: today, completedOn: today, verifiedBy: '' });
        const init = {};
        (res.data.labTests || []).forEach(t => {
          init[t.testName] = {};
          getTestTemplate(t.testName).forEach(s => s.params.forEach(p => { init[t.testName][p.name] = { result: '', method: p.method, remarks: '' }; }));
        });
        setTestData(init);
      }
    } catch { setError('Failed to load request.'); }
    finally { setLoading(false); }
  };

  const updateParam = (test, param, field, val) => setTestData(p => ({ ...p, [test]: { ...p[test], [param]: { ...p[test][param], [field]: val } } }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true); setError(null);
    try {
      const results = request.labTests.map(t => {
        const payload = {
          testName: t.testName,
          testData: testData[t.testName] || {},
          sample,
          remarks
        };
        return { _id: t._id, result: JSON.stringify(payload) };
      });
      const res = await labService.completeRequest(id, results);
      res.success ? navigate('/lab/requests') : setError(res.message || 'Failed.');
    } catch { setError('Error saving results.'); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="min-h-screen bg-gray-50/50 flex flex-col"><LabHeader activePage="requests" /><div className="flex-1 flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-[#00B9D6]" /><p className="ml-3 text-gray-500 font-semibold">Loading...</p></div></div>;
  if (!request) return <div className="min-h-screen bg-gray-50/50 flex flex-col"><LabHeader activePage="requests" /><div className="flex-1 flex items-center justify-center"><div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center gap-3"><AlertCircle className="w-5 h-5" /><p className="font-bold">Request not found.</p><button onClick={() => navigate('/lab/requests')} className="ml-4 underline text-sm">Go Back</button></div></div></div>;

  const done = request.status === 'Completed';
  const shortId = request._id.slice(-5).toUpperCase();
  const testNames = (request.labTests || []).map(t => t.testName).join(', ');

  return (
    <div className="min-h-screen bg-gray-50/50 pb-12">
      <LabHeader activePage="requests" />
      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 mt-4">
        <button onClick={() => navigate('/lab/requests')} className="flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-[#00B9D6] mb-4"><ArrowLeft className="w-4 h-4" />Back to Requests</button>
        <h1 className="text-xl font-extrabold text-gray-900">Start Processing - Lab Test Request</h1>
        <p className="text-sm text-gray-400 font-medium mb-5">Enter test results and observations. All fields marked with * are required.</p>

        {error && <div className="mb-5 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-semibold flex items-center gap-2"><AlertCircle className="w-4 h-4" />{error}</div>}

        {/* Info Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
            <h2 className="text-sm font-bold text-gray-900 mb-4">Request Information</h2>
            <div className="grid grid-cols-2 gap-x-8 gap-y-3">
              <InfoField label="Request ID">{shortId}</InfoField>
              <InfoField label="Doctor">{request.referringDoctor || 'Self Requested'}</InfoField>
              <InfoField label="Requested Date">{new Date(request.appointmentDate || request.createdAt).toLocaleDateString()} at {request.appointmentTime || ''}</InfoField>
              <InfoField label="Priority"><Badge text="NORMAL" type="success" /></InfoField>
              <InfoField label="Requested Tests">{testNames}</InfoField>
              <InfoField label="Status"><Badge text={done ? 'Completed' : 'In Progress'} type={done ? 'success' : 'info'} /></InfoField>
            </div>
          </div>
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
            <h2 className="text-sm font-bold text-gray-900 mb-4">Patient Information</h2>
            <div className="grid grid-cols-2 gap-x-8 gap-y-3">
              <InfoField label="Patient Name">{request.patientName}</InfoField>
              <InfoField label="Age / Gender">{request.patientAge} Y / {request.patientGender}</InfoField>
              <InfoField label="Patient ID">{(request.patientId || '').slice(-5).toUpperCase()}</InfoField>
              <InfoField label="Sample Type">Whole Blood (EDTA)</InfoField>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Test Tables */}
            <div className="lg:col-span-3 space-y-6">
              {(request.labTests || []).map(test => (
                <div key={test._id} className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-100"><h3 className="text-base font-bold text-gray-900">{test.testName}</h3></div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead><tr className="border-b border-gray-100 bg-gray-50/60">
                        {['Test Parameter','Result *','Unit','Reference Range','Remarks'].map(h => <th key={h} className="py-3 px-4 text-[10px] uppercase tracking-wider font-bold text-gray-400">{h}</th>)}
                      </tr></thead>
                      <tbody>
                        {getTestTemplate(test.testName).map((sec, si) => (
                          <React.Fragment key={si}>
                            <tr><td colSpan="6" className="py-2 px-5"><span className="text-[11px] font-extrabold text-[#00B9D6] uppercase tracking-wider">{sec.section}</span></td></tr>
                            {sec.params.map((p, pi) => {
                              const d = testData[test.testName]?.[p.name] || { result: '', method: p.method, remarks: '' };
                              return (
                                <tr key={pi} className="border-b border-gray-50 hover:bg-gray-50/30">
                                  <td className="py-2 px-5 text-sm font-semibold text-gray-700">{p.name}</td>
                                  <td className="py-1.5 px-4"><input type="text" value={d.result} onChange={e => updateParam(test.testName, p.name, 'result', e.target.value)} className="w-full px-2 py-1.5 border border-gray-200 rounded-lg text-sm font-semibold outline-none focus:ring-1 focus:ring-[#00B9D6]/30 focus:border-[#00B9D6]" placeholder="-" disabled={done} required /></td>
                                  <td className="py-2 px-4 text-xs text-gray-500 font-semibold">{p.unit}</td>
                                  <td className="py-2 px-4 text-xs text-gray-500 font-semibold">{p.range}</td>
                                  <td className="py-1.5 px-4"><input type="text" value={d.remarks} onChange={e => updateParam(test.testName, p.name, 'remarks', e.target.value)} className="w-full px-2 py-1.5 border border-gray-200 rounded-lg text-xs outline-none focus:ring-1 focus:ring-[#00B9D6]/30 bg-white" placeholder="-" disabled={done} /></td>
                                </tr>
                              );
                            })}
                          </React.Fragment>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-5">
              <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                <h3 className="text-sm font-bold text-gray-900 mb-4">Sample & Processing Details</h3>
                <div className="space-y-3">
                  {[['Sample Collected On','collectedOn','date'],['Sample Received On','receivedOn','date'],['Sample Received Time','receivedTime','time'],['Test Started On','startedOn','date'],['Test Completed On','completedOn','date']].map(([label,key,type]) => (
                    <div key={key}><label className="block text-[11px] font-bold text-gray-500 mb-1">{label} *</label><input type={type} value={sample[key]} onChange={e => setSample(p => ({...p,[key]:e.target.value}))} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm font-semibold outline-none focus:ring-1 focus:ring-[#00B9D6]/30 focus:border-[#00B9D6]" disabled={done} required /></div>
                  ))}
                  <div><label className="block text-[11px] font-bold text-gray-500 mb-1">Verified By *</label><input type="text" value={sample.verifiedBy} onChange={e => setSample(p => ({...p,verifiedBy:e.target.value}))} placeholder="Enter name" className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm font-semibold outline-none focus:ring-1 focus:ring-[#00B9D6]/30 focus:border-[#00B9D6]" disabled={done} required /></div>
                </div>
              </div>
              <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                <h3 className="text-sm font-bold text-gray-900 mb-3">Attachments (Optional)</h3>
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-5 text-center hover:border-[#00B9D6]/40 cursor-pointer">
                  <Upload className="w-5 h-5 text-gray-300 mx-auto mb-1.5" /><p className="text-xs font-bold text-gray-500">Click to upload or drag & drop</p><p className="text-[10px] text-gray-400 mt-0.5">JPG, PNG, PDF (Max 5MB)</p>
                </div>
              </div>
              <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                <h3 className="text-sm font-bold text-gray-900 mb-3">Technician Remarks (Optional)</h3>
                <textarea value={remarks} onChange={e => setRemarks(e.target.value)} placeholder="Enter any remarks..." rows="3" maxLength="500" className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:ring-1 focus:ring-[#00B9D6]/30 resize-none" disabled={done} />
                <p className="text-right text-[10px] text-gray-400 mt-1">{remarks.length}/500</p>
              </div>
            </div>
          </div>

          {!done && (
            <div className="flex justify-end gap-3 mt-8 pt-5 border-t border-gray-100">
              <button type="button" onClick={() => navigate('/lab/requests')} className="px-6 py-2.5 rounded-xl border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50" disabled={saving}>Cancel</button>
              <button type="submit" disabled={saving} className="px-6 py-2.5 rounded-xl bg-[#00B9D6] hover:bg-[#00a8c3] text-white text-sm font-bold flex items-center gap-2 disabled:opacity-70 shadow-sm">
                {saving ? <><Loader2 className="w-4 h-4 animate-spin" />Submitting...</> : <><CheckCircle className="w-4 h-4" />Submit Results</>}
              </button>
            </div>
          )}
        </form>
      </main>
    </div>
  );
};

export default ProcessTest;
