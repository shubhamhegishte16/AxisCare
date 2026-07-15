import React from 'react';
import Header from './Header';
import { Link } from 'react-router-dom';
import { 
  ChevronRight, 
  Save, 
  FileCheck2, 
  Phone,
  Plus
} from 'lucide-react';
const NewPrescription = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Header />
      <main className="flex-1 p-6 lg:p-8 max-w-7xl mx-auto w-full">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">New Prescription</h1>
            <div className="flex items-center gap-2 text-sm">
              <Link to="/doctordashboard/prescriptions" className="text-gray-500 hover:text-gray-900 transition-colors">Prescriptions</Link>
              <ChevronRight className="w-3 h-3 text-gray-400" />
              <span className="text-[#00B9D6] font-medium">New Prescription</span></div></div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-lg text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 transition-colors">
              <Save className="w-4 h-4" />
              Save as Draft</button>
            <button className="flex items-center gap-2 bg-[#00B9D6] text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-sm hover:bg-[#00a3bd] transition-colors">
              <FileCheck2 className="w-4 h-4" />
              Generate Prescription</button></div></div>
        {/* Patient Info Card */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm mb-6 flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img src="https://i.pravatar.cc/150?img=11" alt="Rajesh Kumar" className="w-14 h-14 rounded-full object-cover bg-gray-100" />
            <div>
              <h2 className="text-base font-bold text-gray-900 leading-tight">Rajesh Kumar</h2>
              <div className="text-xs text-gray-500 font-medium flex items-center gap-2 mt-1">
                <span>PID: P10234</span>
                <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                <span>56 Years / Male</span>
                <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                <span>O+</span></div>
              <div className="text-xs text-gray-500 font-medium flex items-center gap-1 mt-1">
                <Phone className="w-3 h-3" />
                +91 98765 43210</div></div></div>
          <div className="flex flex-wrap items-center gap-8 lg:gap-12 text-sm">
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">APPOINTMENT ID</p>
              <p className="font-bold text-gray-900">APT-2026-1250</p></div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">CONSULTATION DATE</p>
              <p className="font-bold text-gray-900">11 Jul 2026, 09:00 AM</p></div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">DEPARTMENT</p>
              <p className="font-bold text-gray-900">Cardiology</p></div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">VISIT TYPE</p>
              <span className="inline-block bg-teal-50 text-teal-600 px-2 py-0.5 rounded text-[10px] font-bold tracking-wide">In-Person</span></div></div></div>
        {/* Form Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Column 1 */}
          <div className="flex flex-col gap-6">
            <FormCard title="1. Chief Complaint" description="Describe the main reason for the visit.">
              <textarea 
                className="w-full h-32 p-3 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00B9D6] focus:border-transparent resize-none placeholder-gray-400"
                placeholder="Enter chief complaint"
              ></textarea></FormCard>
            <FormCard title="2. Symptoms" description="List all symptoms reported by the patient.">
              <textarea 
                className="w-full h-32 p-3 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00B9D6] focus:border-transparent resize-none placeholder-gray-400"
                placeholder="Enter symptoms"
              ></textarea></FormCard>
            <div className="grid grid-cols-2 gap-4">
              <FormCard title="5. Exercises / Physiotherapy" description="Mention recommended exercises or physiotherapy.">
                <textarea 
                  className="w-full h-24 p-3 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00B9D6] focus:border-transparent resize-none placeholder-gray-400"
                  placeholder="Enter exercises or physiotherapy advice"
                ></textarea></FormCard>
              <FormCard title="6. Diet Advice" description="Mention diet recommendations for the patient.">
                <textarea 
                  className="w-full h-24 p-3 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00B9D6] focus:border-transparent resize-none placeholder-gray-400"
                  placeholder="Enter diet advice"
                ></textarea></FormCard></div></div>
          {/* Column 2 */}
          <div className="flex flex-col gap-6">
            <FormCard title="3. Diagnosis">
              <div className="mb-4">
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Primary Diagnosis <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00B9D6] focus:border-transparent placeholder-gray-400"
                  placeholder="Enter diagnosis"
                /></div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Diagnosis Notes</label>
                <textarea 
                  className="w-full h-20 p-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00B9D6] focus:border-transparent resize-none placeholder-gray-400"
                  placeholder="Enter additional diagnosis notes (if any)"
                ></textarea></div></FormCard>
            <FormCard title="4. Medicines">
              <div className="overflow-x-auto hide-scrollbar mb-4">
                <table className="w-full text-left text-xs min-w-[500px]">
                  <thead>
                    <tr className="text-gray-500 font-bold uppercase tracking-wide border-b border-gray-100">
                      <th className="pb-2 font-bold w-1/4">MEDICINE NAME</th>
                      <th className="pb-2 font-bold w-1/5">DOSAGE</th>
                      <th className="pb-2 font-bold w-1/5">FREQUENCY</th>
                      <th className="pb-2 font-bold w-1/5">DURATION</th>
                      <th className="pb-2 font-bold">INSTR...</th></tr></thead>
                  <tbody className="divide-y divide-gray-50">
                    {[1,2,3].map((i) => (
                      <tr key={i}>
                        <td className="py-2 pr-2">
                          <input type="text" className="w-full p-2 bg-white border border-gray-200 rounded-md text-xs focus:ring-1 focus:ring-[#00B9D6] outline-none" placeholder="Enter medicine" /></td>
                        <td className="py-2 pr-2">
                          <input type="text" className="w-full p-2 bg-white border border-gray-200 rounded-md text-xs focus:ring-1 focus:ring-[#00B9D6] outline-none" placeholder="Enter dosage" /></td>
                        <td className="py-2 pr-2">
                          <input type="text" className="w-full p-2 bg-white border border-gray-200 rounded-md text-xs focus:ring-1 focus:ring-[#00B9D6] outline-none" placeholder="Enter frequency" /></td>
                        <td className="py-2 pr-2">
                          <input type="text" className="w-full p-2 bg-white border border-gray-200 rounded-md text-xs focus:ring-1 focus:ring-[#00B9D6] outline-none" placeholder="Enter duration" /></td>
                        <td className="py-2">
                          <input type="text" className="w-full p-2 bg-white border border-gray-200 rounded-md text-xs focus:ring-1 focus:ring-[#00B9D6] outline-none" placeholder="Enter instr" /></td></tr>
                    ))}
                  </tbody></table></div>
              <button className="flex items-center gap-1.5 text-xs font-bold text-teal-600 bg-teal-50 px-3 py-1.5 rounded-md hover:bg-teal-100 transition-colors border border-teal-100">
                <Plus className="w-3 h-3" /> Add Medicine</button></FormCard>
            <FormCard title="7. Additional Notes" description="Any extra notes for the patient.">
              <label className="block text-[10px] font-semibold text-gray-500 mb-1">Doctor Notes</label>
              <textarea 
                className="w-full h-24 p-3 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00B9D6] focus:border-transparent resize-none placeholder-gray-400"
                placeholder="Enter any additional notes"
              ></textarea></FormCard></div>
          {/* Column 3 */}
          <div className="flex flex-col gap-6">
            <FormCard title="8. Vitals">
              <div className="grid grid-cols-2 gap-4">
                <VitalInput label="Blood Pressure" placeholder="Enter BP (e.g. 120/80 mmHg)" />
                <VitalInput label="Pulse Rate" placeholder="Enter pulse rate (e.g. 72 bpm)" />
                <VitalInput label="Temperature" placeholder="Enter temp (e.g. 98.6 °F)" />
                <VitalInput label="Weight" placeholder="Enter weight (e.g. 65 kg)" />
                <VitalInput label="Height" placeholder="Enter height (e.g. 170 cm)" />
                <VitalInput label="SpO2" placeholder="Enter SpO2 (e.g. 98%)" />
                <div className="col-span-2">
                  <VitalInput label="Blood Sugar (RBS)" placeholder="Enter RBS (e.g. 120 mg/dL)" /></div></div></FormCard>
            <FormCard title="9. Lab Tests (If Any)" description="List all tests or investigations you want to recommend.">
              <textarea 
                className="w-full h-24 p-3 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00B9D6] focus:border-transparent resize-none placeholder-gray-400"
                placeholder="Enter lab tests / investigations"
              ></textarea></FormCard>
            <FormCard title="11. Doctor Signature">
              <div className="border border-dashed border-gray-300 rounded-lg h-24 flex items-center justify-center mb-4 bg-gray-50/50">
                <span className="font-serif text-3xl italic text-gray-800">Ananyaa</span></div>
              <div>
                <p className="text-sm font-bold text-gray-900">Dr. Ananya Sharma</p>
                <p className="text-xs text-gray-500 font-medium leading-tight">Cardiologist</p>
                <p className="text-xs text-gray-400 font-medium leading-tight">Reg. No. CARD/2015/9876</p></div></FormCard></div></div></main></div>
  );
};
const FormCard = ({ title, description, children }) => (
  <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col h-full">
    <h3 className="text-sm font-bold text-gray-900 mb-4">{title}</h3>
    <div className="flex-1 flex flex-col">
      {children}
    </div>
    {description && <p className="text-[10px] text-gray-400 font-medium mt-3">{description}</p>}</div>
);
const VitalInput = ({ label, placeholder }) => (
  <div>
    <label className="block text-[10px] font-semibold text-gray-500 mb-1.5">{label}</label>
    <input 
      type="text" 
      className="w-full p-2 bg-white border border-gray-200 rounded-md text-xs focus:ring-1 focus:ring-[#00B9D6] outline-none placeholder-gray-400"
      placeholder={placeholder}
    /></div>
);
export default NewPrescription;
