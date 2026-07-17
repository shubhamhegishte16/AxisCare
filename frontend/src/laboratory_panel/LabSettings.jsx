import React, { useState } from 'react';
import { Camera, KeyRound, Bell, FlaskConical, ChevronDown, FileText, FileCheck, AlertCircle } from 'lucide-react';
import LabHeader from './LabHeader';

const Toggle = ({ on, toggle }) => (
  <button
    onClick={toggle}
    className={`relative inline-flex w-10 h-[22px] rounded-full transition-colors duration-200 flex-shrink-0 ${on ? 'bg-[#00B9D6]' : 'bg-gray-200'}`}
  >
    <span className={`absolute top-[3px] left-[3px] w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${on ? 'translate-x-[18px]' : 'translate-x-0'}`} />
  </button>
);

const Label = ({ text }) => (
  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">{text}</label>
);

const Input = ({ label, value, onChange, disabled, type = 'text', placeholder }) => (
  <div>
    <Label text={label} />
    <input
      type={type}
      value={value}
      onChange={onChange}
      disabled={disabled}
      placeholder={placeholder}
      className={`w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-[#00B9D6]/30 focus:border-[#00B9D6] transition-all ${disabled ? 'bg-gray-50 text-gray-400 cursor-not-allowed' : 'bg-white'}`}
    />
  </div>
);

const Card = ({ icon: Icon, iconBg, iconColor, title, desc, children }) => (
  <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
    <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100">
      <div className={`w-8 h-8 rounded-xl ${iconBg} flex items-center justify-center flex-shrink-0`}>
        <Icon className={`w-4 h-4 ${iconColor}`} />
      </div>
      <div>
        <p className="text-sm font-bold text-gray-900">{title}</p>
        <p className="text-[11px] text-gray-400 mt-0.5">{desc}</p>
      </div>
    </div>
    <div className="px-6 py-5">{children}</div>
  </div>
);

const NOTIFS = [
  { eKey: 'er', aKey: 'ar', icon: FileText, label: 'New Test Requests', sub: 'Get notified when new test requests are assigned' },
  { eKey: 'tr', aKey: 'atr', icon: FileCheck, label: 'Test Results Updated', sub: 'Get notified when test results are updated' },
  { eKey: 'sa', aKey: 'asa', icon: AlertCircle, label: 'System Alerts', sub: 'Get notified about system updates and alerts' },
];

export default function LabSettings() {
  const [form, setForm] = useState({ fullName: 'Rahul Verma', email: 'rahul.verma@axiscare.com', phone: '+91 98765 43210', empId: 'LAB-TCH-001', designation: 'Lab Technician', department: 'Pathology Lab' });
  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }));
  const [n, setN] = useState({ er: true, tr: true, sa: true, ar: true, atr: true, asa: true });
  const tog = k => setN(p => ({ ...p, [k]: !p[k] }));
  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <LabHeader />
      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mt-6 space-y-5">
        <div>
          <h1 className="text-xl font-extrabold text-gray-900">Settings</h1>
          <p className="text-xs text-gray-400 mt-0.5">Manage your account, preferences and system settings.</p>
        </div>

        {/* Profile Settings */}
        <Card icon={FlaskConical} iconBg="bg-blue-50" iconColor="text-blue-500" title="Profile Settings" desc="Update your personal information and profile details.">
          <div className="flex items-center justify-between mb-5">
            <div className="relative w-14 h-14 flex-shrink-0">
              <img
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(form.fullName)}&background=00B9D6&color=fff&size=56`}
                alt="avatar"
                className="w-14 h-14 rounded-full object-cover border-2 border-[#00B9D6]/20"
              />
              <label className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-[#00B9D6] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#00a8c3] transition-colors shadow">
                <Camera className="w-2.5 h-2.5 text-white" />
                <input type="file" className="sr-only" />
              </label>
            </div>
            <button className="flex items-center gap-1.5 text-xs font-bold text-[#00B9D6] border border-[#00B9D6] px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors">
              <Camera className="w-3.5 h-3.5" />Change Photo
            </button>
          </div>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <Input label="Full Name" value={form.fullName} onChange={set('fullName')} />
            <Input label="Email Address" value={form.email} onChange={set('email')} type="email" />
            <Input label="Phone Number" value={form.phone} onChange={set('phone')} />
          </div>
          <div className="grid grid-cols-3 gap-4 mb-5">
            <Input label="Employee ID" value={form.empId} disabled />
            <Input label="Designation" value={form.designation} onChange={set('designation')} />
            <div>
              <Label text="Department" />
              <div className="flex items-center justify-between border border-gray-200 rounded-lg px-3 py-2.5 bg-white cursor-pointer hover:bg-gray-50 transition-colors">
                <span className="text-sm text-gray-800">{form.department}</span>
                <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
            <button className="px-4 py-2 text-sm font-semibold text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">Cancel</button>
            <button className="px-4 py-2 text-sm font-bold text-white bg-[#00B9D6] hover:bg-[#00a8c3] rounded-lg shadow-sm transition-colors">Save Changes</button>
          </div>
        </Card>

        {/* Account Settings */}
        <Card icon={KeyRound} iconBg="bg-purple-50" iconColor="text-purple-500" title="Account Settings" desc="Manage your account information and login credentials.">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Username" value="rahul.verma" onChange={() => {}} />
            <div>
              <Label text="Password" />
              <div className="flex items-center gap-3">
                <input
                  type="password"
                  defaultValue="passwordhidden"
                  className="flex-1 px-3 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-[#00B9D6]/30 focus:border-[#00B9D6] transition-all bg-white"
                />
                <button className="flex items-center gap-1 text-xs font-bold text-[#00B9D6] whitespace-nowrap hover:underline flex-shrink-0">
                  <KeyRound className="w-3 h-3" />Change Password
                </button>
              </div>
            </div>
          </div>
        </Card>

        {/* Notification Preferences */}
        <Card icon={Bell} iconBg="bg-amber-50" iconColor="text-amber-500" title="Notification Preferences" desc="Choose how you want to receive notifications.">
          <div className="grid grid-cols-2 gap-8">
            {[{ title: 'Email Notifications', getKey: r => r.eKey }, { title: 'In-App Notifications', getKey: r => r.aKey }].map(({ title, getKey }) => (
              <div key={title}>
                <p className="text-xs font-bold text-gray-700 mb-4">{title}</p>
                <div className="space-y-5">
                  {NOTIFS.map(row => (
                    <div key={getKey(row)} className="flex items-center justify-between gap-3">
                      <div className="flex items-start gap-2.5 flex-1 min-w-0">
                        <div className="w-7 h-7 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <row.icon className="w-3.5 h-3.5 text-gray-400" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-gray-800 leading-tight">{row.label}</p>
                          <p className="text-[10px] text-gray-400 mt-0.5 leading-snug">{row.sub}</p>
                        </div>
                      </div>
                      <Toggle on={n[getKey(row)]} toggle={() => tog(getKey(row))} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Lab Preferences */}
        <Card icon={FlaskConical} iconBg="bg-teal-50" iconColor="text-teal-500" title="Lab Preferences" desc="Configure laboratory specific preferences and settings.">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <Label text="Default Sample Type" />
              <select className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg bg-white outline-none focus:ring-2 focus:ring-[#00B9D6]/30 text-gray-700">
                {['Blood', 'Urine', 'Serum', 'Plasma'].map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
            <div>
              <Label text="Default Priority" />
              <select className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg bg-white outline-none focus:ring-2 focus:ring-[#00B9D6]/30 text-gray-700">
                {['Normal', 'High', 'Urgent'].map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
            <div>
              <Label text="Results Auto-Approve" />
              <select className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg bg-white outline-none focus:ring-2 focus:ring-[#00B9D6]/30 text-gray-700">
                {['After Verification', 'Immediate', 'Never'].map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label text="Working Time Start" />
                <input type="time" defaultValue="08:00" className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg bg-white outline-none focus:ring-2 focus:ring-[#00B9D6]/30 text-gray-700" />
              </div>
              <div>
                <Label text="Working Time End" />
                <input type="time" defaultValue="16:00" className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg bg-white outline-none focus:ring-2 focus:ring-[#00B9D6]/30 text-gray-700" />
              </div>
            </div>
          </div>
          <div className="flex justify-end pt-4 border-t border-gray-100">
            <button className="px-5 py-2 text-sm font-bold text-white bg-[#00B9D6] hover:bg-[#00a8c3] rounded-lg shadow-sm transition-colors">Save Preferences</button>
          </div>
        </Card>
      </main>
    </div>
  );
}
