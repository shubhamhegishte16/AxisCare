import React, { useState, useEffect, useRef } from 'react';
import { X, UploadCloud } from 'lucide-react';
import { patientService } from '../services/patientService';
import { appointmentService } from '../services/appointmentService';
const FIELD_CLS = 'w-full border border-gray-300 rounded-md p-2 outline-none focus:border-[#00B4D8]';
const LABEL_CLS = 'block text-sm text-gray-600 mb-1';
const REQ = <span className="text-red-500">*</span>;
const DEPARTMENTS = ['Cardiology', 'Neurology', 'Orthopedics', 'ENT', 'Dermatology', 'General Medicine'];
export default function BookAppointmentModal({ isOpen, onClose }) {
  const [form, setForm] = useState({ fullName: '', phoneNumber: '', email: '', age: '', gender: 'Male', address: '', department: 'Cardiology', doctor: '', doctorProfileId: '', appointmentType: 'In-Person', preferredDate: '', preferredTime: '', reasonForVisit: '', symptoms: '' });
  const [doctors, setDoctors] = useState([]);
  const [docFile, setDocFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fileRef = useRef();
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  // Pre-fill patient info and fetch doctors when modal opens
  useEffect(() => {
    if (!isOpen) return;
    setError(''); setSuccess('');
    patientService.getOrCreateProfile().then(res => {
      if (res.success) {
        const p = res.data;
        const dob = p.dateOfBirth;
        let age = '';
        if (dob) {
          const parts = dob.split('/');
          if (parts.length === 3) {
            const birth = new Date(parts[2], parts[0] - 1, parts[1]);
            age = String(new Date().getFullYear() - birth.getFullYear());
          }
        }
        setForm(f => ({ ...f, fullName: `${p.firstName} ${p.lastName}`.trim(), phoneNumber: p.phoneNumber || '', email: p.email || '', age, gender: p.gender || 'Male', address: p.address || '' }));
      }
    }).catch(() => {});
    fetchDoctors();
  }, [isOpen]);
  const fetchDoctors = async () => {
    try {
      const res = await appointmentService.getDoctors();
      if (res.success) {
        setDoctors(res.data);
        if (res.data.length > 0) setForm(f => ({ ...f, doctor: res.data[0].fullName, doctorProfileId: res.data[0]._id }));
        else setForm(f => ({ ...f, doctor: '', doctorProfileId: '' }));
      }
    } catch { setDoctors([]); }
  };
  const handleDeptChange = (dept) => { set('department', dept); };
  const handleDoctorChange = (fullName) => {
    const found = doctors.find(d => d.fullName === fullName);
    setForm(f => ({ ...f, doctor: fullName, doctorProfileId: found?._id || '' }));
  };
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 5 * 1024 * 1024) { setError('File must be under 5MB.'); return; }
    setDocFile(file); setError('');
  };
  const handleSubmit = async () => {
    setError(''); setSuccess('');
    const required = ['fullName', 'phoneNumber', 'email', 'age', 'gender', 'address', 'department', 'doctor', 'appointmentType', 'preferredDate', 'preferredTime', 'reasonForVisit'];
    const missing = required.find(k => !form[k]);
    if (missing) return setError('Please fill all required fields.');
    setSubmitting(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (docFile) fd.append('document', docFile);
      const res = await appointmentService.bookAppointment(fd);
      if (res.success) { setSuccess('Appointment request submitted! You will receive a confirmation soon.'); setTimeout(() => { onClose(); }, 2500); }
      else setError(res.message || 'Failed to book appointment.');
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally { setSubmitting(false); }
  };
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto font-sans">
        {/* Header */}
        <div className="flex justify-between items-center p-6 pb-4 border-b">
          <h2 className="text-2xl font-bold text-gray-800">Book Appointment</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700"><X className="w-6 h-6" /></button>
        </div>
        {/* Body */}
        <div className="p-6 space-y-8">
          {/* 1. Patient Information */}
          <section>
            <h3 className="text-[#0a3d6a] font-bold mb-4">1. Patient Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div><label className={LABEL_CLS}>Full Name</label><input className={FIELD_CLS} value={form.fullName} onChange={e => set('fullName', e.target.value)} /></div>
              <div><label className={LABEL_CLS}>Phone Number</label><input className={FIELD_CLS} value={form.phoneNumber} onChange={e => set('phoneNumber', e.target.value)} /></div>
              <div><label className={LABEL_CLS}>Email Address</label><input type="email" className={FIELD_CLS} value={form.email} onChange={e => set('email', e.target.value)} /></div>
              <div><label className={LABEL_CLS}>Age</label><input className={FIELD_CLS} value={form.age} onChange={e => set('age', e.target.value)} /></div>
              <div><label className={LABEL_CLS}>Gender</label>
                <select className={FIELD_CLS} value={form.gender} onChange={e => set('gender', e.target.value)}>
                  {['Male', 'Female', 'Other', 'Prefer not to say'].map(g => <option key={g}>{g}</option>)}
                </select>
              </div>
              <div><label className={LABEL_CLS}>Address</label><input className={FIELD_CLS} value={form.address} onChange={e => set('address', e.target.value)} /></div>
            </div>
          </section>
          {/* 2. Appointment Details */}
          <section>
            <h3 className="text-[#0a3d6a] font-bold mb-4">2. Appointment Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div><label className={LABEL_CLS}>Department {REQ}</label>
                <select className={FIELD_CLS} value={form.department} onChange={e => handleDeptChange(e.target.value)}>
                  {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div><label className={LABEL_CLS}>Doctor {REQ}</label>
                <select className={FIELD_CLS} value={form.doctor} onChange={e => handleDoctorChange(e.target.value)}>
                  {doctors.length === 0 ? <option value="">No doctors available</option> : doctors.map(d => <option key={d._id} value={d.fullName}>{d.fullName}</option>)}
                </select>
              </div>
              <div><label className={LABEL_CLS}>Appointment Type {REQ}</label>
                <select className={FIELD_CLS} value={form.appointmentType} onChange={e => set('appointmentType', e.target.value)}>
                  <option>In-Person</option>
                  <option>Video Consult</option>
                </select>
              </div>
              <div><label className={LABEL_CLS}>Preferred Date {REQ}</label><input type="date" className={FIELD_CLS} value={form.preferredDate} onChange={e => set('preferredDate', e.target.value)} /></div>
              <div><label className={LABEL_CLS}>Preferred Time {REQ}</label><input type="time" className={FIELD_CLS} value={form.preferredTime} onChange={e => set('preferredTime', e.target.value)} /></div>
              <div><label className={LABEL_CLS}>Reason for Visit {REQ}</label><input className={FIELD_CLS} value={form.reasonForVisit} onChange={e => set('reasonForVisit', e.target.value)} /></div>
            </div>
          </section>
          {/* 3. Additional Information */}
          <section>
            <h3 className="text-[#0a3d6a] font-bold mb-4">3. Additional Information</h3>
            <label className={LABEL_CLS}>Symptoms / Notes (Optional)</label>
            <textarea className={`${FIELD_CLS} resize-none h-24`} value={form.symptoms} onChange={e => set('symptoms', e.target.value)} maxLength={300} />
            <div className="text-right text-xs text-gray-400 mt-1">{form.symptoms.length}/300</div>
          </section>
          {/* 4. Upload Documents */}
          <section>
            <h3 className="text-[#0a3d6a] font-bold mb-4">4. Upload Documents (Optional)</h3>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => fileRef.current.click()}>
                <input ref={fileRef} type="file" accept=".jpg,.jpeg,.png,.pdf" className="hidden" onChange={handleFileChange} />
                <UploadCloud className="w-8 h-8 text-gray-400 mb-2" />
                {docFile ? <p className="text-sm text-green-600 font-medium">{docFile.name}</p> : <><p className="text-sm text-gray-600">Click to upload or drag and drop</p><p className="text-xs text-gray-400">Supports: JPG, PNG, PDF (Max 5MB)</p></>}
              </div>
              <div className="flex-1 bg-[#F0F6FA] rounded-lg p-4">
                <h4 className="text-[#0a3d6a] font-semibold text-sm mb-2">Note:</h4>
                <ul className="text-sm text-[#0a3d6a] space-y-1 list-disc list-inside">
                  <li>Your appointment request will be reviewed by our receptionist.</li>
                  <li>You will get a confirmation once the appointment is scheduled.</li>
                </ul>
              </div>
            </div>
          </section>
          {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
          {success && <p className="text-green-600 text-sm font-medium">{success}</p>}
        </div>
        {/* Footer */}
        <div className="flex justify-end items-center gap-4 p-6 border-t bg-white sticky bottom-0 rounded-b-xl">
          <button onClick={onClose} className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50 transition-colors">Cancel</button>
          <button onClick={handleSubmit} disabled={submitting} className="px-6 py-2 bg-[#00B4D8] hover:bg-[#0096B4] disabled:opacity-60 text-white rounded-md font-medium transition-colors">
            {submitting ? 'Submitting...' : 'Submit Request'}
          </button>
        </div>
      </div>
    </div>
  );
}
