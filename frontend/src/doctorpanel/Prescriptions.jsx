import React, { useState, useEffect } from 'react';
import Header from './Header';
import { 
  FileText, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Search, 
  Calendar as CalendarIcon, 
  ChevronDown,
  SlidersHorizontal,
  Eye,
  Printer,
  MoreVertical,
  Plus,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  BookMarked,
  Loader2,
  Trash2,
  CheckSquare
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { prescriptionService } from '../services/prescriptionService';

const Prescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Generated'); // 'Generated' or 'Draft'
  const [search, setSearch] = useState('');
  const [menuOpenId, setMenuOpenId] = useState(null);
  
  // Modal State
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    try {
      setLoading(true);
      const res = await prescriptionService.getDoctorPrescriptions();
      if (res.success) {
        setPrescriptions(res.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this prescription?')) return;
    try {
      const res = await prescriptionService.deletePrescription(id);
      if (res.success) {
        setPrescriptions(prev => prev.filter(p => p._id !== id));
      }
    } catch (e) {
      alert(e.message || 'Failed to delete');
    }
    setMenuOpenId(null);
  };

  const handleGenerate = async (id) => {
    if (!window.confirm('Confirm and generate this prescription?')) return;
    try {
      const res = await prescriptionService.updatePrescriptionStatus(id, 'Generated');
      if (res.success) {
        setPrescriptions(prev => prev.map(p => p._id === id ? { ...p, status: 'Generated' } : p));
        alert('Prescription generated successfully');
      }
    } catch (e) {
      alert(e.message || 'Failed to generate');
    }
    setMenuOpenId(null);
  };

  const handlePrint = (rx) => {
    const printWindow = window.open('', '_blank');
    const medicinesHTML = rx.medicines && rx.medicines.length > 0 
      ? rx.medicines.map(m => `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>${m.name}</strong></td>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${m.dosage}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${m.frequency}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${m.duration}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${m.instructions || '-'}</td>
        </tr>
      `).join('')
      : '<tr><td colspan="5" style="padding: 10px; text-align: center;">No medications prescribed</td></tr>';

    const vitalsHTML = rx.vitals 
      ? Object.entries(rx.vitals)
          .filter(([_, val]) => val && val.trim() !== '')
          .map(([key, val]) => `<div style="margin-bottom: 6px;"><strong>${key.replace(/([A-Z])/g, ' $1').toUpperCase()}:</strong> ${val}</div>`)
          .join('')
      : '';

    printWindow.document.write(`
      <html>
        <head>
          <title>Prescription - ${rx.prescriptionId}</title>
          <style>
            body { font-family: sans-serif; color: #333; margin: 40px; }
            .header { display: flex; justify-content: space-between; border-bottom: 2px solid #00B9D6; padding-bottom: 20px; margin-bottom: 30px; }
            .logo { font-size: 24px; font-weight: bold; color: #0b3363; }
            .doctor-info { text-align: right; }
            .patient-card { background: #f8f9fa; border: 1px solid #eee; padding: 15px; border-radius: 8px; margin-bottom: 30px; display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
            .section-title { font-size: 16px; font-weight: bold; color: #0b3363; margin-top: 20px; border-bottom: 1px solid #eee; padding-bottom: 5px; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th { background: #f4f6f8; padding: 10px; text-align: left; font-size: 12px; font-weight: bold; color: #555; }
            .footer { margin-top: 80px; display: flex; justify-content: space-between; align-items: flex-end; }
            .signature { border-top: 1px dashed #ccc; width: 200px; text-align: center; padding-top: 5px; }
            .sig-text { font-family: serif; font-size: 24px; font-style: italic; margin-bottom: 5px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="logo">AxisCare</div>
              <div>Multi-Specialty Hospital</div>
            </div>
            <div class="doctor-info">
              <h3>Dr. ${rx.doctorName}</h3>
              <div>${rx.department}</div>
            </div>
          </div>

          <div class="patient-card">
            <div>
              <strong>Patient Name:</strong> ${rx.patientName}<br>
              <strong>Age / Gender:</strong> ${rx.patientAge} / ${rx.patientGender}<br>
              <strong>Contact:</strong> ${rx.patientContact || 'N/A'}
            </div>
            <div>
              <strong>Prescription ID:</strong> ${rx.prescriptionId}<br>
              <strong>Date:</strong> ${new Date(rx.createdAt).toLocaleDateString()}<br>
              <strong>Visit Type:</strong> ${rx.visitType || 'In-Person'}
            </div>
          </div>

          ${vitalsHTML ? `
            <div class="section-title">Vitals</div>
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-top: 10px; font-size: 13px;">
              ${vitalsHTML}
            </div>
          ` : ''}

          <div class="section-title">Diagnosis</div>
          <p><strong>Primary:</strong> ${rx.diagnosisPrimary}</p>
          ${rx.diagnosisNotes ? `<p><strong>Notes:</strong> ${rx.diagnosisNotes}</p>` : ''}

          ${rx.chiefComplaint ? `
            <div class="section-title">Chief Complaint</div>
            <p>${rx.chiefComplaint}</p>
          ` : ''}

          ${rx.symptoms ? `
            <div class="section-title">Symptoms</div>
            <p>${rx.symptoms}</p>
          ` : ''}

          <div class="section-title">Rx Medicines</div>
          <table>
            <thead>
              <tr>
                <th>MEDICINE NAME</th>
                <th>DOSAGE</th>
                <th>FREQUENCY</th>
                <th>DURATION</th>
                <th>INSTRUCTIONS</th>
              </tr>
            </thead>
            <tbody>
              ${medicinesHTML}
            </tbody>
          </table>

          ${rx.exercises ? `
            <div class="section-title">Exercises / Physiotherapy</div>
            <p>${rx.exercises}</p>
          ` : ''}

          ${rx.dietAdvice ? `
            <div class="section-title">Diet Advice</div>
            <p>${rx.dietAdvice}</p>
          ` : ''}

          ${rx.additionalNotes ? `
            <div class="section-title">Additional Notes</div>
            <p>${rx.additionalNotes}</p>
          ` : ''}

          <div class="footer">
            <div>
              <strong>Reg No:</strong> N/A
            </div>
            <div class="signature">
              <div class="sig-text">${rx.doctorName.split(' ')[0]}</div>
              Dr. ${rx.doctorName}
            </div>
          </div>

          <script>
            window.onload = function() {
              window.print();
              window.onafterprint = function() {
                window.close();
              }
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const filtered = prescriptions.filter(p => {
    if (activeTab === 'Draft' && p.status !== 'Draft') return false;
    if (activeTab === 'Generated' && p.status !== 'Generated') return false;
    if (search && !p.patientName.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Header />
      <main className="flex-1 p-6 lg:p-8 max-w-7xl mx-auto w-full">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Prescriptions</h1>
            <p className="text-gray-500 text-sm">View and manage all prescriptions issued to patients.</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setActiveTab(activeTab === 'Draft' ? 'Generated' : 'Draft')}
              className={`flex items-center gap-2 border px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm
                ${activeTab === 'Draft' ? 'bg-[#0b3363] text-white border-[#0b3363]' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'}`}
            >
              <BookMarked className={`w-4 h-4 ${activeTab === 'Draft' ? 'text-white' : 'text-gray-500'}`} />
              {activeTab === 'Draft' ? 'View Generated' : 'My Drafts'}
            </button>
            <Link to="/doctordashboard/new-prescription" className="flex items-center gap-2 bg-[#00B9D6] text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-sm hover:bg-[#00a3bd] transition-colors">
              <Plus className="w-4 h-4" />
              New Prescription
            </Link>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard title="TOTAL PRESCRIPTIONS" value={prescriptions.length} subtext="All time" icon={FileText} iconColor="text-blue-500" bgColor="bg-blue-50" />
          <StatCard title="GENERATED" value={prescriptions.filter(p => p.status === 'Generated').length} subtext="Sent to patients" icon={CheckCircle2} iconColor="text-green-500" bgColor="bg-green-50" />
          <StatCard title="DRAFTS" value={prescriptions.filter(p => p.status === 'Draft').length} subtext="Pending completion" icon={Clock} iconColor="text-orange-500" bgColor="bg-orange-50" />
        </div>

        {/* Filters & Search */}
        <div className="bg-white p-4 rounded-t-xl border border-gray-200 border-b-0 flex flex-col xl:flex-row items-center justify-between gap-4">
          <div className="relative flex-1 w-full xl:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by patient name..." 
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00B9D6] focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white border border-gray-200 rounded-b-xl shadow-sm overflow-x-auto min-h-[300px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                <th className="px-6 py-4">PRESCRIPTION ID</th>
                <th className="px-6 py-4">PATIENT</th>
                <th className="px-6 py-4">DIAGNOSIS</th>
                <th className="px-6 py-4">MEDICATIONS</th>
                <th className="px-6 py-4">DATE</th>
                <th className="px-6 py-4">STATUS</th>
                <th className="px-6 py-4 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan={7} className="px-6 py-10 text-center"><Loader2 className="w-6 h-6 text-[#00B9D6] animate-spin mx-auto" /></td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={7} className="px-6 py-10 text-center text-gray-500 font-medium">No prescriptions found.</td></tr>
              ) : filtered.map((rx) => (
                <tr key={rx._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-bold text-blue-600 whitespace-nowrap">
                    {rx.prescriptionId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(rx.patientName)}&background=random`} alt={rx.patientName} className="w-10 h-10 rounded-full object-cover bg-gray-100" />
                      <div>
                        <p className="text-sm font-bold text-gray-900">{rx.patientName}</p>
                        <p className="text-xs text-gray-500 font-medium">{rx.patientAge} / {rx.patientGender}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 font-medium whitespace-nowrap">
                    {rx.diagnosisPrimary}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm font-bold text-gray-900">{rx.medicines?.length || 0} Medications</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm font-bold text-gray-900">{new Date(rx.createdAt).toLocaleDateString()}</p>
                    <p className="text-xs text-gray-500 font-medium">{rx.doctorName}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={rx.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center justify-end gap-3 text-gray-500 relative">
                      <button onClick={() => { setSelectedPrescription(rx); setIsModalOpen(true); }} className="hover:text-gray-900 transition-colors" title="View Details"><Eye className="w-5 h-5" /></button>
                      
                      {rx.status === 'Generated' && (
                        <button onClick={() => handlePrint(rx)} className="hover:text-gray-900 transition-colors" title="Print Prescription"><Printer className="w-5 h-5" /></button>
                      )}
                      
                      {rx.status === 'Draft' && (
                        <button onClick={() => handleGenerate(rx._id)} className="hover:text-green-600 text-green-500 transition-colors" title="Confirm & Generate"><CheckSquare className="w-5 h-5" /></button>
                      )}

                      <button onClick={() => setMenuOpenId(menuOpenId === rx._id ? null : rx._id)} className="hover:text-gray-900 transition-colors"><MoreVertical className="w-5 h-5" /></button>
                      
                      {menuOpenId === rx._id && (
                        <div className="absolute right-0 top-full mt-1 w-44 bg-white rounded-md shadow-lg border border-gray-100 z-10 py-1 flex flex-col">
                           {rx.status === 'Draft' && (
                             <button onClick={() => handleGenerate(rx._id)} className="w-full text-left px-4 py-2 text-sm text-green-600 hover:bg-green-50 font-medium flex items-center gap-2 border-b border-gray-50">
                               <CheckSquare className="w-4 h-4" /> Confirm & Generate
                             </button>
                           )}
                           <button onClick={() => handleDelete(rx._id)} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-medium flex items-center gap-2">
                             <Trash2 className="w-4 h-4" /> Remove
                           </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* View Details Modal */}
        {isModalOpen && selectedPrescription && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-xl flex flex-col">
              <div className="p-6 border-b border-gray-150 flex justify-between items-center bg-gray-50 rounded-t-xl">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Prescription Details</h3>
                  <p className="text-xs text-gray-500 font-semibold">{selectedPrescription.prescriptionId} | {new Date(selectedPrescription.createdAt).toLocaleString()}</p>
                </div>
                <button onClick={() => { setIsModalOpen(false); setSelectedPrescription(null); }} className="text-gray-400 hover:text-gray-600 text-2xl font-semibold leading-none">&times;</button>
              </div>

              <div className="p-6 space-y-6 flex-1">
                {/* Patient Header */}
                <div className="bg-gray-50 p-4 rounded-lg flex justify-between gap-4 flex-wrap">
                  <div>
                    <h4 className="font-bold text-gray-800">{selectedPrescription.patientName}</h4>
                    <p className="text-xs text-gray-500">{selectedPrescription.patientAge} / {selectedPrescription.patientGender}</p>
                    <p className="text-xs text-gray-500">Contact: {selectedPrescription.patientContact || 'N/A'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500"><strong>Dept:</strong> {selectedPrescription.department}</p>
                    <p className="text-xs text-gray-500"><strong>Type:</strong> {selectedPrescription.visitType}</p>
                  </div>
                </div>

                {/* Vitals */}
                {selectedPrescription.vitals && Object.values(selectedPrescription.vitals).some(v => v && v.trim() !== '') && (
                  <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Vitals</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-gray-50/50 p-3 rounded-lg text-xs">
                      {selectedPrescription.vitals.bloodPressure && <div><strong>BP:</strong> {selectedPrescription.vitals.bloodPressure}</div>}
                      {selectedPrescription.vitals.pulseRate && <div><strong>Pulse:</strong> {selectedPrescription.vitals.pulseRate}</div>}
                      {selectedPrescription.vitals.temperature && <div><strong>Temp:</strong> {selectedPrescription.vitals.temperature}</div>}
                      {selectedPrescription.vitals.weight && <div><strong>Weight:</strong> {selectedPrescription.vitals.weight}</div>}
                      {selectedPrescription.vitals.height && <div><strong>Height:</strong> {selectedPrescription.vitals.height}</div>}
                      {selectedPrescription.vitals.spO2 && <div><strong>SpO2:</strong> {selectedPrescription.vitals.spO2}</div>}
                      {selectedPrescription.vitals.bloodSugar && <div className="col-span-2"><strong>Blood Sugar (RBS):</strong> {selectedPrescription.vitals.bloodSugar}</div>}
                    </div>
                  </div>
                )}

                {/* Diagnosis */}
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Diagnosis</h4>
                  <div className="p-3 bg-teal-50/40 border border-teal-100 rounded-lg text-sm">
                    <p className="font-semibold text-teal-800">Primary: {selectedPrescription.diagnosisPrimary || 'N/A'}</p>
                    {selectedPrescription.diagnosisNotes && <p className="text-xs text-gray-600 mt-1">Notes: {selectedPrescription.diagnosisNotes}</p>}
                  </div>
                </div>

                {/* Clinical Notes */}
                {(selectedPrescription.chiefComplaint || selectedPrescription.symptoms) && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {selectedPrescription.chiefComplaint && (
                      <div>
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Chief Complaint</h4>
                        <p className="text-sm text-gray-700 bg-gray-50/40 p-2.5 rounded border border-gray-100">{selectedPrescription.chiefComplaint}</p>
                      </div>
                    )}
                    {selectedPrescription.symptoms && (
                      <div>
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Symptoms</h4>
                        <p className="text-sm text-gray-700 bg-gray-50/40 p-2.5 rounded border border-gray-100">{selectedPrescription.symptoms}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Medicines */}
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Prescribed Medicines</h4>
                  <div className="border border-gray-100 rounded-lg overflow-hidden">
                    <table className="w-full text-xs">
                      <thead className="bg-gray-50 text-gray-500 font-bold uppercase border-b border-gray-100">
                        <tr>
                          <th className="p-2.5">Medicine</th>
                          <th className="p-2.5">Dosage</th>
                          <th className="p-2.5">Frequency</th>
                          <th className="p-2.5">Duration</th>
                          <th className="p-2.5">Instructions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {selectedPrescription.medicines && selectedPrescription.medicines.length > 0 ? (
                          selectedPrescription.medicines.map((med, idx) => (
                            <tr key={idx} className="text-gray-700">
                              <td className="p-2.5 font-semibold">{med.name}</td>
                              <td className="p-2.5">{med.dosage}</td>
                              <td className="p-2.5">{med.frequency}</td>
                              <td className="p-2.5">{med.duration}</td>
                              <td className="p-2.5 italic">{med.instructions || '-'}</td>
                            </tr>
                          ))
                        ) : (
                          <tr><td colSpan={5} className="p-4 text-center text-gray-400">No medicines prescribed</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Advice / Recommendations */}
                {(selectedPrescription.exercises || selectedPrescription.dietAdvice || selectedPrescription.additionalNotes || selectedPrescription.labTests) && (
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Advice & Investigations</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-gray-700">
                      {selectedPrescription.exercises && <div><strong>Exercises:</strong> <p className="mt-1 bg-gray-50 p-2 rounded">{selectedPrescription.exercises}</p></div>}
                      {selectedPrescription.dietAdvice && <div><strong>Diet:</strong> <p className="mt-1 bg-gray-50 p-2 rounded">{selectedPrescription.dietAdvice}</p></div>}
                      {selectedPrescription.labTests && <div><strong>Lab Tests Recommended:</strong> <p className="mt-1 bg-gray-50 p-2 rounded">{selectedPrescription.labTests}</p></div>}
                      {selectedPrescription.additionalNotes && <div><strong>Doctor Notes:</strong> <p className="mt-1 bg-gray-50 p-2 rounded">{selectedPrescription.additionalNotes}</p></div>}
                    </div>
                  </div>
                )}
              </div>

              <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50 rounded-b-xl">
                {selectedPrescription.status === 'Draft' && (
                  <button 
                    onClick={() => { handleGenerate(selectedPrescription._id); setIsModalOpen(false); }}
                    className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors shadow-sm"
                  >
                    <CheckSquare className="w-4 h-4" /> Confirm & Generate
                  </button>
                )}
                {selectedPrescription.status === 'Generated' && (
                  <button 
                    onClick={() => handlePrint(selectedPrescription)}
                    className="flex items-center gap-1.5 bg-[#0b3363] hover:bg-[#082449] text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors shadow-sm"
                  >
                    <Printer className="w-4 h-4" /> Print PDF
                  </button>
                )}
                <button 
                  onClick={() => { setIsModalOpen(false); setSelectedPrescription(null); }}
                  className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-bold px-4 py-2 rounded-lg transition-colors shadow-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

const StatCard = ({ title, value, subtext, icon: Icon, iconColor, bgColor }) => (
  <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between h-full gap-4 relative">
    <div className="flex items-start gap-4">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${bgColor}`}>
        <Icon className={`w-5 h-5 ${iconColor}`} />
      </div>
      <div>
        <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-1 leading-tight">{title}</h3>
        <p className="text-2xl font-extrabold text-gray-900 leading-none mb-1">{value}</p>
        <div className="text-[10px] font-bold mt-1 text-gray-400">{subtext}</div>
      </div>
    </div>
  </div>
);

const StatusBadge = ({ status }) => {
  const getStyles = () => {
    switch (status) {
      case 'Generated':
        return 'bg-green-50 text-green-600';
      case 'Draft':
        return 'bg-orange-50 text-orange-500';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };
  return (
    <span className={`px-2 py-1 rounded text-[10px] font-extrabold tracking-wider uppercase ${getStyles()}`}>
      {status === 'Generated' ? 'DISPENSED' : 'PENDING DRAFT'}
    </span>
  );
};

export default Prescriptions;
