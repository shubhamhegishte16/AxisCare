import React, { useState } from 'react';
import Header from './Header';
import { 
  User,
  Briefcase,
  Lock,
  Camera,
  Trash2,
  Key,
  ShieldCheck,
  LogOut,
  Save,
  Link2,
  AtSign,
  Globe,
  Phone,
  Mail,
  MapPin,
  Calendar
} from 'lucide-react';
const DoctorSettings = () => {
  const [aboutYou, setAboutYou] = useState('Experienced Cardiologist with expertise in diagnosing and treating cardiovascular conditions. Passionate about patient care and preventive cardiology.');
  const [professionalBio, setProfessionalBio] = useState('I have over 10 years of experience in cardiology with a special interest in interventional cardiology, echocardiography and preventive heart care.');
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Header />
      <main className="flex-1 p-6 lg:p-8 max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Profile Settings</h1>
            <p className="text-gray-500 text-sm">Manage your personal information and professional details.</p></div>
          <button className="flex items-center gap-2 bg-[#00B9D6] text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-sm hover:bg-[#00a3bd] transition-colors">
            <Save className="w-4 h-4" />
            Save Changes</button></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Left Column */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Personal Information */}
            <SectionCard icon={User} title="Personal Information">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <FieldLabel>FULL NAME</FieldLabel>
                  <input type="text" defaultValue="Dr. Ananya Sharma" className={inputCls} /></div>
                <div>
                  <FieldLabel>DATE OF BIRTH</FieldLabel>
                  <div className="relative">
                    <input type="text" defaultValue="12 Feb 1988" className={inputCls + " pr-9"} />
                    <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /></div></div>
                <div>
                  <FieldLabel>GENDER</FieldLabel>
                  <select className={inputCls}>
                    <option>Female</option>
                    <option>Male</option>
                    <option>Other</option></select></div>
                <div>
                  <FieldLabel>QUALIFICATION</FieldLabel>
                  <input type="text" defaultValue="MD (Cardiology)" className={inputCls} /></div>
                <div>
                  <FieldLabel>EXPERIENCE</FieldLabel>
                  <input type="text" defaultValue="10+ Years" className={inputCls} /></div>
                <div>
                  <FieldLabel>NATIONALITY</FieldLabel>
                  <select className={inputCls}>
                    <option>Indian</option>
                    <option>Other</option></select></div></div>
              <div className="mt-4">
                <FieldLabel>ABOUT YOU</FieldLabel>
                <textarea
                  value={aboutYou}
                  onChange={e => setAboutYou(e.target.value)}
                  maxLength={300}
                  rows={4}
                  className={inputCls + " resize-none"}
                ></textarea>
                <p className="text-[11px] text-gray-400 text-right mt-1">{aboutYou.length} / 300</p></div></SectionCard>
            {/* Professional Information */}
            <SectionCard icon={Briefcase} title="Professional Information">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <FieldLabel>SPECIALIZATION</FieldLabel>
                  <input type="text" defaultValue="Cardiology" className={inputCls} /></div>
                <div>
                  <FieldLabel>DEPARTMENT</FieldLabel>
                  <input type="text" defaultValue="Cardiology" className={inputCls} /></div>
                <div>
                  <FieldLabel>LICENSE / REGISTRATION NO.</FieldLabel>
                  <input type="text" defaultValue="MMC/2014/123456" className={inputCls} /></div>
                <div>
                  <FieldLabel>YEARS OF EXPERIENCE</FieldLabel>
                  <input type="text" defaultValue="10+ Years" className={inputCls} /></div>
                <div>
                  <FieldLabel>CONSULTATION FEE (₹)</FieldLabel>
                  <input type="number" defaultValue="1200" className={inputCls} /></div>
                <div>
                  <FieldLabel>JOINING DATE</FieldLabel>
                  <div className="relative">
                    <input type="text" defaultValue="15 Aug 2018" className={inputCls + " pr-9"} />
                    <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /></div></div>
                <div>
                  <FieldLabel>UNIVERSITY / COLLEGE</FieldLabel>
                  <input type="text" defaultValue="All India Institute of Medical Sciences (AIIMS)" className={inputCls} /></div>
                <div>
                  <FieldLabel>DEGREE</FieldLabel>
                  <input type="text" defaultValue="MD (Cardiology)" className={inputCls} /></div></div>
              <div className="mt-4">
                <FieldLabel>PROFESSIONAL BIO</FieldLabel>
                <textarea
                  value={professionalBio}
                  onChange={e => setProfessionalBio(e.target.value)}
                  maxLength={300}
                  rows={4}
                  className={inputCls + " resize-none"}
                ></textarea>
                <p className="text-[11px] text-gray-400 text-right mt-1">{professionalBio.length} / 300</p></div></SectionCard>
            {/* Account Settings */}
            <SectionCard icon={Lock} title="Account Settings">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex flex-col gap-3">
                  <div>
                    <p className="text-sm font-bold text-gray-900">Change Password</p>
                    <p className="text-xs text-gray-500 mt-0.5">Update your account password</p></div>
                  <button className="flex items-center gap-2 text-xs font-bold text-gray-600 border border-gray-200 bg-white px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors self-start">
                    <Key className="w-3.5 h-3.5" /> Change Password</button></div>
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex flex-col gap-3">
                  <div>
                    <p className="text-sm font-bold text-gray-900">Two-Factor Authentication</p>
                    <p className="text-xs text-gray-500 mt-0.5">Add an extra layer of security to your account</p></div>
                  <button className="flex items-center gap-2 text-xs font-bold text-teal-600 border border-teal-200 bg-teal-50 px-3 py-2 rounded-lg hover:bg-teal-100 transition-colors self-start">
                    <ShieldCheck className="w-3.5 h-3.5" /> Enable 2FA</button></div>
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex flex-col gap-3">
                  <div>
                    <p className="text-sm font-bold text-gray-900">Logout from All Devices</p>
                    <p className="text-xs text-gray-500 mt-0.5">Sign out from all devices except this one</p></div>
                  <button className="flex items-center gap-2 text-xs font-bold text-red-600 border border-red-200 bg-red-50 px-3 py-2 rounded-lg hover:bg-red-100 transition-colors self-start">
                    <LogOut className="w-3.5 h-3.5" /> Logout All</button></div></div></SectionCard></div>
          {/* Right Column */}
          <div className="flex flex-col gap-6">
            {/* Profile Picture */}
            <SectionCard icon={Camera} title="Profile Picture">
              <div className="flex items-center gap-4">
                <div className="relative shrink-0">
                  <img src="https://i.pravatar.cc/150?img=32" alt="Dr. Ananya" className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md" />
                  <div className="absolute bottom-0 right-0 w-7 h-7 bg-[#00B9D6] rounded-full flex items-center justify-center border-2 border-white cursor-pointer">
                    <Camera className="w-3.5 h-3.5 text-white" /></div></div>
                <div className="flex-1">
                  <p className="text-[10px] text-gray-400 font-medium mb-3">JPG, PNG or GIF. Max size of 2MB</p>
                  <button className="flex items-center gap-2 text-xs font-bold text-[#00B9D6] border border-[#00B9D6] bg-teal-50 px-3 py-2 rounded-lg hover:bg-teal-100 transition-colors w-full justify-center mb-2">
                    <Camera className="w-3.5 h-3.5" /> Upload New Photo</button>
                  <button className="flex items-center gap-2 text-xs font-bold text-red-500 border border-red-200 bg-red-50 px-3 py-2 rounded-lg hover:bg-red-100 transition-colors w-full justify-center">
                    <Trash2 className="w-3.5 h-3.5" /> Remove Photo</button></div></div></SectionCard>
            {/* Contact Information */}
            <SectionCard icon={Mail} title="Contact Information">
              <div className="flex flex-col gap-4">
                <div>
                  <FieldLabel>EMAIL ADDRESS</FieldLabel>
                  <input type="email" defaultValue="ananya.sharma@axiscare.com" className={inputCls} /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <FieldLabel>PHONE NUMBER</FieldLabel>
                    <div className="flex items-center gap-2 border border-gray-200 rounded-lg overflow-hidden bg-white">
                      <span className="bg-gray-50 px-2 py-2.5 border-r border-gray-200 text-xs text-gray-500">🇮🇳</span>
                      <input type="text" defaultValue="+91 98765 43210" className="flex-1 text-sm p-2 outline-none placeholder-gray-400 bg-white" /></div></div>
                  <div>
                    <FieldLabel>ALTERNATE PHONE (OPTIONAL)</FieldLabel>
                    <div className="flex items-center gap-2 border border-gray-200 rounded-lg overflow-hidden bg-white">
                      <span className="bg-gray-50 px-2 py-2.5 border-r border-gray-200 text-xs text-gray-500">🇮🇳</span>
                      <input type="text" defaultValue="+91 91234 56789" className="flex-1 text-sm p-2 outline-none placeholder-gray-400 bg-white" /></div></div></div>
                <div>
                  <FieldLabel>ADDRESS</FieldLabel>
                  <input type="text" defaultValue="123, Green Avenue, Andheri West, Mumbai, Maharashtra - 400058" className={inputCls} /></div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <FieldLabel>CITY</FieldLabel>
                    <input type="text" defaultValue="Mumbai" className={inputCls} /></div>
                  <div>
                    <FieldLabel>STATE</FieldLabel>
                    <input type="text" defaultValue="Maharashtra" className={inputCls} /></div>
                  <div>
                    <FieldLabel>PIN CODE</FieldLabel>
                    <input type="text" defaultValue="400058" className={inputCls} /></div></div></div></SectionCard>
            {/* Social Links */}
            <SectionCard icon={Globe} title="Social Links (Optional)">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
                    <Link2 className="w-4 h-4 text-blue-600" /></div>
                  <input type="url" defaultValue="https://www.linkedin.com/in/ananyasharma" className={inputCls} /></div>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-sky-50 rounded-lg flex items-center justify-center shrink-0">
                    <AtSign className="w-4 h-4 text-sky-500" /></div>
                  <input type="url" defaultValue="https://twitter.com/ananyasharma" className={inputCls} /></div>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-gray-50 rounded-lg flex items-center justify-center shrink-0">
                    <Globe className="w-4 h-4 text-gray-500" /></div>
                  <input type="url" defaultValue="https://www.ananyasharma.com" className={inputCls} /></div></div></SectionCard></div></div></main></div>
  );
};
const inputCls = "w-full p-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#00B9D6] focus:border-transparent transition-all";
const FieldLabel = ({ children }) => (
  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-1.5">{children}</label>
);
const SectionCard = ({ icon: Icon, title, children }) => (
  <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
    <div className="flex items-center gap-2 mb-5 pb-4 border-b border-gray-100">
      <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
        <Icon className="w-4 h-4 text-blue-500" /></div>
      <h2 className="text-base font-bold text-gray-900">{title}</h2></div>
    {children}</div>
);
export default DoctorSettings;
