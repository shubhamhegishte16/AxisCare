import React, { useState } from 'react';
import { UserPlus, Printer, CheckCircle2 } from 'lucide-react';
import ReceptionistLayout from './ReceptionistLayout';

const Field = ({ label, ...props }) => (
  <div>
    <label className="block text-xs font-bold text-slate-500 mb-1.5">{label}</label>
    <input
      {...props}
      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-[#F8FAFC] text-sm outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]/40 transition-all"
    />
  </div>
);

const emptyForm = {
  fullName: '', phone: '', email: '', age: '', gender: '', bloodGroup: '',
  address: '', department: '', doctor: '', appointmentType: 'Walk-in', symptoms: '',
};

const RegisterPatient = () => {
  const [form, setForm] = useState(emptyForm);
  const [registered, setRegistered] = useState(null);

  const handleChange = (field) => (e) => setForm({ ...form, [field]: e.target.value });
  const clearForm = () => setForm(emptyForm);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.fullName || !form.phone) return;
    const id = `PT-${Math.floor(2000 + Math.random() * 900)}`;
    setRegistered({ id, ...form });
  };

  return (
    <ReceptionistLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">Register Patient</h1>
          <p className="text-sm text-slate-400 mt-1">Create a new patient record for OPD or walk-in visit.</p>
        </div>
        <div className="hidden sm:flex w-12 h-12 rounded-2xl bg-[#EFF6FF] items-center justify-center">
          <UserPlus className="w-6 h-6 text-[#2563EB]" />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Form */}
        <form onSubmit={handleSubmit} className="xl:col-span-2 bg-white rounded-[18px] border border-slate-100 shadow-sm p-6 flex flex-col gap-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field label="Full Name *" placeholder="Patient full name" value={form.fullName} onChange={handleChange('fullName')} required />
            <Field label="Phone Number *" placeholder="10-digit number" value={form.phone} onChange={handleChange('phone')} required />
            <Field label="Email" type="email" placeholder="patient@email.com" value={form.email} onChange={handleChange('email')} />
            <Field label="Age" type="number" placeholder="Age" value={form.age} onChange={handleChange('age')} />
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5">Gender</label>
              <select value={form.gender} onChange={handleChange('gender')} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-[#F8FAFC] text-sm outline-none focus:ring-2 focus:ring-[#2563EB]/20">
                <option value="">Select</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5">Blood Group</label>
              <select value={form.bloodGroup} onChange={handleChange('bloodGroup')} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-[#F8FAFC] text-sm outline-none focus:ring-2 focus:ring-[#2563EB]/20">
                <option value="">Select</option>
                {['A+','A-','B+','B-','AB+','AB-','O+','O-'].map((b) => <option key={b}>{b}</option>)}
              </select>
            </div>
          </div>

          <Field label="Address" placeholder="Street, city" value={form.address} onChange={handleChange('address')} />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field label="Department" placeholder="e.g. Cardiology" value={form.department} onChange={handleChange('department')} />
            <Field label="Assign Doctor" placeholder="e.g. Dr. Ananya Sharma" value={form.doctor} onChange={handleChange('doctor')} />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1.5">Visit Type</label>
            <div className="flex gap-3">
              {['Walk-in', 'Scheduled', 'Emergency'].map((t) => (
                <button
                  type="button"
                  key={t}
                  onClick={() => setForm({ ...form, appointmentType: t })}
                  className={`px-4 py-2 rounded-full text-xs font-bold border transition-colors ${
                    form.appointmentType === t
                      ? 'bg-[#2563EB] text-white border-[#2563EB]'
                      : 'bg-white text-slate-500 border-slate-200 hover:border-[#2563EB]/40'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1.5">Symptoms / Reason for Visit</label>
            <textarea
              rows={3}
              placeholder="Briefly describe symptoms"
              value={form.symptoms}
              onChange={handleChange('symptoms')}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-[#F8FAFC] text-sm outline-none focus:ring-2 focus:ring-[#2563EB]/20 resize-none"
            />
          </div>

          <div className="flex gap-3 pt-1">
            <button type="submit" className="flex-1 bg-[#2563EB] hover:bg-blue-700 text-white text-sm font-bold py-2.5 rounded-xl transition-colors">
              Register Patient
            </button>
            <button type="button" onClick={clearForm} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-bold py-2.5 rounded-xl transition-colors">
              Clear Form
            </button>
          </div>
        </form>

        {/* Confirmation / summary panel */}
        <div className="bg-white rounded-[18px] border border-slate-100 shadow-sm p-6 flex flex-col">
          <h2 className="text-base font-bold text-slate-800 mb-4">Registration Summary</h2>
          {registered ? (
            <div className="flex-1 flex flex-col">
              <div className="flex items-center gap-2 text-emerald-600 mb-4">
                <CheckCircle2 className="w-5 h-5" />
                <span className="text-sm font-bold">Patient registered successfully</span>
              </div>
              <div className="rounded-2xl border border-slate-100 bg-[#F8FAFC] p-4 flex flex-col gap-2 text-sm">
                <div className="flex justify-between"><span className="text-slate-400">Patient ID</span><span className="font-bold text-[#2563EB]">{registered.id}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Name</span><span className="font-bold text-slate-800">{registered.fullName}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Phone</span><span className="font-semibold text-slate-600">{registered.phone}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Doctor</span><span className="font-semibold text-slate-600">{registered.doctor || '—'}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Visit Type</span><span className="font-semibold text-slate-600">{registered.appointmentType}</span></div>
              </div>
              <button className="mt-4 flex items-center justify-center gap-2 bg-white border border-slate-200 hover:border-[#2563EB]/40 text-slate-700 text-sm font-bold py-2.5 rounded-xl transition-colors">
                <Printer className="w-4 h-4" /> Print Patient ID Card
              </button>
            </div>
          ) : (
            <p className="text-sm text-slate-400">Fill in the form and submit to generate a new patient ID and see the summary here.</p>
          )}
        </div>
      </div>
    </ReceptionistLayout>
  );
};

export default RegisterPatient;
