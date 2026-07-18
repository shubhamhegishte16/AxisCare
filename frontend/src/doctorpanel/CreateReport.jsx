import React, { useState, useEffect } from 'react';
import Header from './Header';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { 
  ChevronLeft, 
  UploadCloud,
  ChevronDown
} from 'lucide-react';
import { doctorService } from '../services/doctorService';

const CreateReport = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const [patients, setPatients] = useState([]);
  const [patientSearch, setPatientSearch] = useState('');
  const [showPatientDropdown, setShowPatientDropdown] = useState(false);
  const [formData, setFormData] = useState({
    patientName: '',
    patientIdString: 'P-0001',
    ageGender: '',
    reportType: 'Consultation Report',
    priority: 'NORMAL',
    visitDate: new Date().toISOString().split('T')[0],
    visitTime: '10:00',
    chiefComplaint: '',
    symptoms: '',
    diagnosis: '',
    clinicalObservations: '',
    vitalSigns: {
      temperature: '36.5',
      bloodPressure: '120/80',
      pulseRate: '72',
      respiratoryRate: '18',
      spO2: '98',
      weight: '',
      height: '',
      bmi: ''
    },
    treatmentSummary: {
      treatmentProvided: '',
      medicationsGiven: '',
      proceduresPerformed: ''
    },
    laboratoryAndImaging: {
      labReports: '',
      imaging: ''
    },
    followUpAdvice: '',
    lifestyleAdvice: '',
    additionalNotes: '',
    status: 'Draft'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    doctorService.getPatients()
      .then(res => { if (res.success) setPatients(res.data); })
      .catch(e => console.error(e));

    if (isEditMode) {
      doctorService.getReportById(id)
        .then(res => {
          if (res.success) {
            const r = res.data;
            setPatientSearch(r.patientName || '');
            setFormData({
              patientName: r.patientName || '',
              patientId: r.patientId || '',
              patientIdString: r.patientIdString || 'P-0001',
              ageGender: r.ageGender || '',
              reportType: r.reportType || 'Consultation Report',
              priority: r.priority || 'NORMAL',
              visitDate: r.visitDate || new Date().toISOString().split('T')[0],
              visitTime: r.visitTime || '10:00',
              chiefComplaint: r.chiefComplaint || '',
              symptoms: r.symptoms || '',
              diagnosis: r.diagnosis || '',
              clinicalObservations: r.clinicalObservations || '',
              vitalSigns: r.vitalSigns || { temperature: '36.5', bloodPressure: '120/80', pulseRate: '72', respiratoryRate: '18', spO2: '98', weight: '', height: '', bmi: '' },
              treatmentSummary: r.treatmentSummary || { treatmentProvided: '', medicationsGiven: '', proceduresPerformed: '' },
              laboratoryAndImaging: r.laboratoryAndImaging || { labReports: '', imaging: '' },
              followUpAdvice: r.followUpAdvice || '',
              lifestyleAdvice: r.lifestyleAdvice || '',
              additionalNotes: r.additionalNotes || '',
              status: r.status || 'Draft'
            });
          }
        })
        .catch(e => console.error(e));
    }
  }, [id, isEditMode]);

  const handleSelectPatient = (patient) => {
    setFormData(prev => ({
      ...prev,
      patientName: patient.fullName,
      patientId: patient.userId || '',
      patientIdString: patient.patientId?.toString().substring(0, 8).toUpperCase() || 'P-0001',
      ageGender: `${patient.age} / ${patient.gender}`
    }));
    setPatientSearch(patient.fullName);
    setShowPatientDropdown(false);
  };

  const filteredPatients = patients.filter(p =>
    p.fullName.toLowerCase().includes(patientSearch.toLowerCase())
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNestedChange = (category, field, value) => {
    setFormData(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value
      }
    }));
  };

  const handleStatusChange = (status) => {
    setFormData(prev => ({ ...prev, status }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (isEditMode) {
        await doctorService.updateReport(id, formData);
      } else {
        await doctorService.createReport(formData);
      }
      navigate('/doctordashboard/reports');
    } catch (err) {
      setError(err.message || 'Failed to save report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Header />
      <main className="flex-1 p-6 lg:p-8 max-w-[1200px] mx-auto w-full">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div className="flex items-start gap-3">
            <Link to="/doctordashboard/reports" className="flex items-center text-gray-500 hover:text-gray-900 mt-1.5 transition-colors">
              <ChevronLeft className="w-4 h-4" /> Back</Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">{isEditMode ? 'Edit Report' : 'New Report'}</h1>
              <p className="text-gray-500 text-sm">{isEditMode ? 'Update the medical report details' : 'Create a new medical report for the patient'}</p></div></div>
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => handleStatusChange('Draft')} className="bg-white border border-gray-200 px-4 py-2 rounded-lg text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 transition-colors">Save Draft</button>
            <button type="button" onClick={handleSubmit} className="bg-[#00B9D6] text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-sm hover:bg-[#00a3bd] transition-colors">{loading ? 'Saving...' : 'Generate PDF & Save'}</button></div></div>
        
        {error && <div className="mb-4 bg-red-50 text-red-500 p-3 rounded">{error}</div>}

        {/* Form Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* Left Column */}
          <div className="flex flex-col gap-6">
            {/* 1. Patient Information */}
            <SectionCard title="1. Patient Information">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 relative">
                  <FieldLabel required>Select Patient</FieldLabel>
                  <div className="relative">
                    <input
                      type="text"
                      value={patientSearch}
                      onChange={(e) => { setPatientSearch(e.target.value); setShowPatientDropdown(true); }}
                      onFocus={() => setShowPatientDropdown(true)}
                      onBlur={() => setTimeout(() => setShowPatientDropdown(false), 150)}
                      placeholder="Search patient by name..."
                      className={inputCls}
                    />
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                  {showPatientDropdown && filteredPatients.length > 0 && (
                    <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                      {filteredPatients.map((patient, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onMouseDown={() => handleSelectPatient(patient)}
                          className="w-full text-left px-4 py-2.5 hover:bg-blue-50 transition-colors border-b border-gray-50 last:border-0"
                        >
                          <p className="text-xs font-bold text-gray-900">{patient.fullName}</p>
                          <p className="text-[10px] text-gray-400">{patient.age} / {patient.gender} &bull; Last visit: {patient.lastVisitDate}</p>
                        </button>
                      ))}
                    </div>
                  )}
                  {showPatientDropdown && patientSearch && filteredPatients.length === 0 && (
                    <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-sm px-4 py-3">
                      <p className="text-xs text-gray-400">No patients found. You can type a name manually below.</p>
                    </div>
                  )}
                </div>
                <div>
                  <FieldLabel required>Patient Name</FieldLabel>
                  <input type="text" name="patientName" value={formData.patientName} onChange={handleChange} className={inputCls} placeholder="Or enter manually" required />
                </div>
                <div>
                  <FieldLabel>Patient ID</FieldLabel>
                  <input type="text" name="patientIdString" value={formData.patientIdString} onChange={handleChange} className={inputCls} />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <FieldLabel required>Visit Date</FieldLabel>
                    <input type="date" name="visitDate" value={formData.visitDate} onChange={handleChange} className={inputCls} required /></div>
                  <div>
                    <FieldLabel required>Visit Time</FieldLabel>
                    <input type="time" name="visitTime" value={formData.visitTime} onChange={handleChange} className={inputCls} required /></div></div>
                <div>
                  <FieldLabel>Age / Gender</FieldLabel>
                  <input type="text" name="ageGender" value={formData.ageGender} onChange={handleChange} placeholder="e.g. 45 / Male" className={inputCls} />
                </div>
              </div></SectionCard>
            
            {/* 3. Chief Complaint */}
            <SectionCard title="3. Chief Complaint">
              <div>
                <textarea name="chiefComplaint" value={formData.chiefComplaint} onChange={handleChange} placeholder="Enter chief complaint..." className={textareaCls} rows={4}></textarea>
              </div>
            </SectionCard>

            {/* 4. Clinical Findings */}
            <SectionCard title="4. Clinical Findings">
              <div className="flex flex-col gap-4">
                <div>
                  <FieldLabel>Symptoms</FieldLabel>
                  <textarea name="symptoms" value={formData.symptoms} onChange={handleChange} placeholder="Enter symptoms..." className={textareaCls} rows={3}></textarea>
                </div>
                <div>
                  <FieldLabel>Diagnosis</FieldLabel>
                  <textarea name="diagnosis" value={formData.diagnosis} onChange={handleChange} placeholder="Enter diagnosis..." className={textareaCls} rows={3}></textarea>
                </div>
                <div>
                  <FieldLabel>Clinical Observations</FieldLabel>
                  <textarea name="clinicalObservations" value={formData.clinicalObservations} onChange={handleChange} placeholder="Enter clinical observations..." className={textareaCls} rows={4}></textarea>
                </div></div></SectionCard>
            
            {/* 7. Laboratory & Imaging */}
            <SectionCard title="7. Laboratory & Imaging">
              <div className="flex flex-col gap-4">
                <div>
                  <FieldLabel>Lab Reports</FieldLabel>
                  <input type="text" value={formData.laboratoryAndImaging.labReports} onChange={(e) => handleNestedChange('laboratoryAndImaging', 'labReports', e.target.value)} className={inputCls} placeholder="Select lab reports" />
                </div>
                <div>
                  <FieldLabel>Imaging / Radiology</FieldLabel>
                  <input type="text" value={formData.laboratoryAndImaging.imaging} onChange={(e) => handleNestedChange('laboratoryAndImaging', 'imaging', e.target.value)} className={inputCls} placeholder="Select imaging reports" />
                </div></div></SectionCard>

            {/* 8. Recommendations */}
            <SectionCard title="8. Recommendations">
              <div className="flex flex-col gap-4">
                <div>
                  <FieldLabel>Follow-up Advice</FieldLabel>
                  <textarea name="followUpAdvice" value={formData.followUpAdvice} onChange={handleChange} placeholder="Enter follow-up advice..." className={textareaCls} rows={3}></textarea>
                </div>
                <div>
                  <FieldLabel>Lifestyle / Dietary Advice</FieldLabel>
                  <textarea name="lifestyleAdvice" value={formData.lifestyleAdvice} onChange={handleChange} placeholder="Enter lifestyle or dietary advice..." className={textareaCls} rows={3}></textarea>
                </div></div></SectionCard>
            
            {/* 10. Doctor Notes (Internal) */}
            <SectionCard title="10. Doctor Notes (Internal)">
              <div>
                <FieldLabel>Additional Notes</FieldLabel>
                <textarea name="additionalNotes" value={formData.additionalNotes} onChange={handleChange} placeholder="Enter additional notes..." className={textareaCls} rows={4}></textarea>
                </div></SectionCard></div>
          
          {/* Right Column */}
          <div className="flex flex-col gap-6">
            {/* 2. Report Type */}
            <SectionCard title="2. Report Type">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <FieldLabel required>Report Type</FieldLabel>
                  <select name="reportType" value={formData.reportType} onChange={handleChange} className={inputCls}>
                    <option value="Consultation Report">Consultation Report</option>
                    <option value="Medical Certificate">Medical Certificate</option>
                    <option value="Progress Report">Progress Report</option>
                    <option value="Discharge Summary">Discharge Summary</option>
                  </select>
                </div>
                <div>
                  <FieldLabel>Priority</FieldLabel>
                  <select name="priority" value={formData.priority} onChange={handleChange} className={inputCls}>
                    <option value="NORMAL">NORMAL</option>
                    <option value="URGENT">URGENT</option>
                  </select>
                </div></div></SectionCard>

            {/* 5. Vital Signs */}
            <SectionCard title="5. Vital Signs">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <FieldLabel>Temperature (°C)</FieldLabel>
                  <input type="text" value={formData.vitalSigns.temperature} onChange={(e) => handleNestedChange('vitalSigns', 'temperature', e.target.value)} className={inputCls} /></div>
                <div>
                  <FieldLabel>Blood Pressure</FieldLabel>
                  <input type="text" value={formData.vitalSigns.bloodPressure} onChange={(e) => handleNestedChange('vitalSigns', 'bloodPressure', e.target.value)} className={inputCls} /></div>
                <div>
                  <FieldLabel>Pulse Rate (bpm)</FieldLabel>
                  <input type="text" value={formData.vitalSigns.pulseRate} onChange={(e) => handleNestedChange('vitalSigns', 'pulseRate', e.target.value)} className={inputCls} /></div>
                <div>
                  <FieldLabel>Respiratory Rate</FieldLabel>
                  <input type="text" value={formData.vitalSigns.respiratoryRate} onChange={(e) => handleNestedChange('vitalSigns', 'respiratoryRate', e.target.value)} className={inputCls} /></div>
                <div>
                  <FieldLabel>SpO2 (%)</FieldLabel>
                  <input type="text" value={formData.vitalSigns.spO2} onChange={(e) => handleNestedChange('vitalSigns', 'spO2', e.target.value)} className={inputCls} /></div>
                <div>
                  <FieldLabel>Weight (kg)</FieldLabel>
                  <input type="text" value={formData.vitalSigns.weight} onChange={(e) => handleNestedChange('vitalSigns', 'weight', e.target.value)} placeholder="--" className={inputCls} /></div>
                <div>
                  <FieldLabel>Height (cm)</FieldLabel>
                  <input type="text" value={formData.vitalSigns.height} onChange={(e) => handleNestedChange('vitalSigns', 'height', e.target.value)} placeholder="--" className={inputCls} /></div>
                <div>
                  <FieldLabel>BMI</FieldLabel>
                  <input type="text" value={formData.vitalSigns.bmi} onChange={(e) => handleNestedChange('vitalSigns', 'bmi', e.target.value)} placeholder="--" className={inputCls} /></div></div></SectionCard>
            
            {/* 6. Treatment Summary */}
            <SectionCard title="6. Treatment Summary">
              <div className="flex flex-col gap-4">
                <div>
                  <FieldLabel>Treatment Provided</FieldLabel>
                  <textarea value={formData.treatmentSummary.treatmentProvided} onChange={(e) => handleNestedChange('treatmentSummary', 'treatmentProvided', e.target.value)} placeholder="Enter treatment provided..." className={textareaCls} rows={3}></textarea>
                </div>
                <div>
                  <FieldLabel>Medications Given</FieldLabel>
                  <textarea value={formData.treatmentSummary.medicationsGiven} onChange={(e) => handleNestedChange('treatmentSummary', 'medicationsGiven', e.target.value)} placeholder="Enter medications given..." className={textareaCls} rows={3}></textarea>
                </div>
                <div>
                  <FieldLabel>Procedures Performed</FieldLabel>
                  <textarea value={formData.treatmentSummary.proceduresPerformed} onChange={(e) => handleNestedChange('treatmentSummary', 'proceduresPerformed', e.target.value)} placeholder="Enter procedures performed..." className={textareaCls} rows={3}></textarea>
                </div></div></SectionCard>

            {/* 9. Attachments */}
            <SectionCard title="9. Attachments">
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center bg-gray-50/50 hover:bg-gray-50 transition-colors cursor-pointer text-center">
                <div className="w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center mb-3 shadow-sm">
                  <UploadCloud className="w-5 h-5 text-gray-500" /></div>
                <p className="text-sm font-bold text-gray-900 mb-1">Upload files</p>
                <p className="text-[10px] text-gray-500 font-medium max-w-[200px]">Drag & drop files here or click to browse</p>
                <p className="text-[9px] text-gray-400 mt-1">Supports: PDF, JPG, PNG (Max 10MB)</p></div>
              <p className="text-[10px] text-gray-400 text-center mt-3">No files uploaded</p></SectionCard>
            
            {/* 11. Report Status */}
            <SectionCard title="11. Report Status">
              <div className="flex items-center gap-6 mb-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="status" checked={formData.status === 'Draft'} onChange={() => handleStatusChange('Draft')} className="w-4 h-4 text-[#00B9D6] focus:ring-[#00B9D6]" />
                  <span className="text-sm font-semibold text-gray-700">Draft</span></label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="status" checked={formData.status === 'Completed'} onChange={() => handleStatusChange('Completed')} className="w-4 h-4 text-[#00B9D6] focus:ring-[#00B9D6]" />
                  <span className="text-sm font-semibold text-gray-700">Completed</span></label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="status" checked={formData.status === 'Signed'} onChange={() => handleStatusChange('Signed')} className="w-4 h-4 text-[#00B9D6] focus:ring-[#00B9D6]" />
                  <span className="text-sm font-semibold text-gray-700">Signed</span></label>
                </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => navigate('/doctordashboard/reports')} className="bg-white border border-gray-200 px-6 py-2 rounded-lg text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 transition-colors">Cancel</button>
                <button type="button" onClick={handleSubmit} disabled={loading} className="bg-[#00B9D6] text-white px-6 py-2 rounded-lg text-sm font-semibold shadow-sm hover:bg-[#00a3bd] transition-colors">{loading ? 'Saving...' : 'Save Report'}</button></div></SectionCard></div></div></main></div>
  );
};
const inputCls = "w-full p-2.5 bg-white border border-gray-200 rounded-lg text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#00B9D6] focus:border-transparent transition-all";
const textareaCls = "w-full p-3 bg-white border border-gray-200 rounded-lg text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#00B9D6] focus:border-transparent transition-all resize-none";
const FieldLabel = ({ children, required }) => (
  <label className="block text-[10px] text-gray-600 mb-1.5">{children} {required && <span className="text-red-500">*</span>}</label>
);
const SectionCard = ({ title, children }) => (
  <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex flex-col h-full">
    <h3 className="text-sm font-bold text-gray-900 mb-5">{title}</h3>
    <div className="flex-1 flex flex-col">{children}</div></div>
);
export default CreateReport;
