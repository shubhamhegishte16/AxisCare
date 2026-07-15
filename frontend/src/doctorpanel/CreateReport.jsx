import React from 'react';
import Header from './Header';
import { Link } from 'react-router-dom';
import { 
  ChevronLeft, 
  UploadCloud
} from 'lucide-react';
const CreateReport = () => {
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
              <h1 className="text-2xl font-bold text-gray-900 mb-1">New Report</h1>
              <p className="text-gray-500 text-sm">Create a new medical report for the patient</p></div></div>
          <div className="flex items-center gap-3">
            <button className="bg-white border border-gray-200 px-4 py-2 rounded-lg text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 transition-colors">Save Draft</button>
            <button className="bg-white border border-gray-200 px-4 py-2 rounded-lg text-sm font-semibold text-blue-600 shadow-sm hover:bg-gray-50 transition-colors">Preview</button>
            <button className="bg-[#00B9D6] text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-sm hover:bg-[#00a3bd] transition-colors">Generate PDF</button></div></div>
        {/* Form Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* Left Column */}
          <div className="flex flex-col gap-6">
            {/* 1. Patient Information */}
            <SectionCard title="1. Patient Information">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <FieldLabel required>Patient Name</FieldLabel>
                  <select className={inputCls}><option>Select Patient</option></select></div>
                <div>
                  <FieldLabel>Patient ID</FieldLabel>
                  <input type="text" defaultValue="P-0001" className={inputCls} readOnly /></div>
                <div>
                  <FieldLabel>Appointment ID</FieldLabel>
                  <select className={inputCls}><option>Select Appointment</option></select></div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <FieldLabel required>Visit Date</FieldLabel>
                    <input type="date" defaultValue="2026-07-06" className={inputCls} /></div>
                  <div>
                    <FieldLabel>Visit Time</FieldLabel>
                    <input type="time" defaultValue="10:30" className={inputCls} /></div></div>
                <div>
                  <FieldLabel>Age / Gender</FieldLabel>
                  <input type="text" placeholder="-- / --" className={inputCls} readOnly /></div></div></SectionCard>
            {/* 4. Clinical Findings */}
            <SectionCard title="4. Clinical Findings">
              <div className="flex flex-col gap-4">
                <div>
                  <FieldLabel>Symptoms</FieldLabel>
                  <textarea placeholder="Enter symptoms..." className={textareaCls} rows={3}></textarea>
                  <CharCount>0/500</CharCount></div>
                <div>
                  <FieldLabel>Diagnosis</FieldLabel>
                  <textarea placeholder="Enter diagnosis..." className={textareaCls} rows={3}></textarea>
                  <CharCount>0/500</CharCount></div>
                <div>
                  <FieldLabel>Clinical Observations</FieldLabel>
                  <textarea placeholder="Enter clinical observations..." className={textareaCls} rows={4}></textarea>
                  <CharCount>0/1000</CharCount></div></div></SectionCard>
            {/* 7. Laboratory & Imaging */}
            <SectionCard title="7. Laboratory & Imaging">
              <div className="flex flex-col gap-4">
                <div>
                  <FieldLabel>Lab Reports</FieldLabel>
                  <select className={inputCls}><option>Select lab reports</option></select></div>
                <div>
                  <FieldLabel>Imaging / Radiology</FieldLabel>
                  <select className={inputCls}><option>Select imaging reports</option></select></div></div></SectionCard>
            {/* 8. Recommendations */}
            <SectionCard title="8. Recommendations">
              <div className="flex flex-col gap-4">
                <div>
                  <FieldLabel>Follow-up Advice</FieldLabel>
                  <textarea placeholder="Enter follow-up advice..." className={textareaCls} rows={3}></textarea>
                  <CharCount>0/1000</CharCount></div>
                <div>
                  <FieldLabel>Lifestyle / Dietary Advice</FieldLabel>
                  <textarea placeholder="Enter lifestyle or dietary advice..." className={textareaCls} rows={3}></textarea>
                  <CharCount>0/1000</CharCount></div></div></SectionCard>
            {/* 10. Doctor Notes (Internal) */}
            <SectionCard title="10. Doctor Notes (Internal)">
              <div>
                <FieldLabel>Additional Notes</FieldLabel>
                <textarea placeholder="Enter additional notes..." className={textareaCls} rows={4}></textarea>
                <CharCount>0/1000</CharCount></div></SectionCard></div>
          {/* Right Column */}
          <div className="flex flex-col gap-6">
            {/* 2. Report Type */}
            <SectionCard title="2. Report Type">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <FieldLabel required>Report Type</FieldLabel>
                  <select className={inputCls}><option>Consultation Report</option></select></div>
                <div>
                  <FieldLabel>Priority</FieldLabel>
                  <select className={inputCls}><option>NORMAL</option></select></div></div></SectionCard>
            {/* 3. Chief Complaint */}
            <SectionCard title="3. Chief Complaint">
              <div>
                <textarea placeholder="Enter chief complaint..." className={textareaCls} rows={4}></textarea>
                <CharCount>0/500</CharCount></div></SectionCard>
            {/* 5. Vital Signs */}
            <SectionCard title="5. Vital Signs">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <FieldLabel>Temperature (°C)</FieldLabel>
                  <input type="text" defaultValue="36.5" className={inputCls} /></div>
                <div>
                  <FieldLabel>Blood Pressure</FieldLabel>
                  <input type="text" defaultValue="120/80" className={inputCls} /></div>
                <div>
                  <FieldLabel>Pulse Rate (bpm)</FieldLabel>
                  <input type="text" defaultValue="72" className={inputCls} /></div>
                <div>
                  <FieldLabel>Respiratory Rate</FieldLabel>
                  <input type="text" defaultValue="18" className={inputCls} /></div>
                <div>
                  <FieldLabel>SpO2 (%)</FieldLabel>
                  <input type="text" defaultValue="98" className={inputCls} /></div>
                <div>
                  <FieldLabel>Weight (kg)</FieldLabel>
                  <input type="text" placeholder="--" className={inputCls} /></div>
                <div>
                  <FieldLabel>Height (cm)</FieldLabel>
                  <input type="text" placeholder="--" className={inputCls} /></div>
                <div>
                  <FieldLabel>BMI</FieldLabel>
                  <input type="text" placeholder="--" className={inputCls} /></div></div></SectionCard>
            {/* 6. Treatment Summary */}
            <SectionCard title="6. Treatment Summary">
              <div className="flex flex-col gap-4">
                <div>
                  <FieldLabel>Treatment Provided</FieldLabel>
                  <textarea placeholder="Enter treatment provided..." className={textareaCls} rows={3}></textarea>
                  <CharCount>0/1000</CharCount></div>
                <div>
                  <FieldLabel>Medications Given</FieldLabel>
                  <textarea placeholder="Enter medications given..." className={textareaCls} rows={3}></textarea>
                  <CharCount>0/1000</CharCount></div>
                <div>
                  <FieldLabel>Procedures Performed</FieldLabel>
                  <textarea placeholder="Enter procedures performed..." className={textareaCls} rows={3}></textarea>
                  <CharCount>0/1000</CharCount></div></div></SectionCard>
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
                  <input type="radio" name="status" defaultChecked className="w-4 h-4 text-[#00B9D6] focus:ring-[#00B9D6]" />
                  <span className="text-sm font-semibold text-gray-700">Draft</span></label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="status" className="w-4 h-4 text-[#00B9D6] focus:ring-[#00B9D6]" />
                  <span className="text-sm font-semibold text-gray-700">Completed</span></label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="status" className="w-4 h-4 text-[#00B9D6] focus:ring-[#00B9D6]" />
                  <span className="text-sm font-semibold text-gray-700">Signed</span></label></div>
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button className="bg-white border border-gray-200 px-6 py-2 rounded-lg text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 transition-colors">Cancel</button>
                <button className="bg-[#00B9D6] text-white px-6 py-2 rounded-lg text-sm font-semibold shadow-sm hover:bg-[#00a3bd] transition-colors">Save Report</button></div></SectionCard></div></div></main></div>
  );
};
const inputCls = "w-full p-2.5 bg-white border border-gray-200 rounded-lg text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#00B9D6] focus:border-transparent transition-all";
const textareaCls = "w-full p-3 bg-white border border-gray-200 rounded-lg text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#00B9D6] focus:border-transparent transition-all resize-none";
const FieldLabel = ({ children, required }) => (
  <label className="block text-[10px] text-gray-600 mb-1.5">{children} {required && <span className="text-red-500">*</span>}</label>
);
const CharCount = ({ children }) => (
  <p className="text-[10px] text-gray-400 text-right mt-1 font-medium">{children}</p>
);
const SectionCard = ({ title, children }) => (
  <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex flex-col h-full">
    <h3 className="text-sm font-bold text-gray-900 mb-5">{title}</h3>
    <div className="flex-1 flex flex-col">{children}</div></div>
);
export default CreateReport;
