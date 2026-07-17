import React, { useState } from 'react';
import { Settings as SettingsIcon, Bell, Lock } from 'lucide-react';
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

const Toggle = ({ label, checked, onChange }) => (
  <div className="flex items-center justify-between py-3">
    <span className="text-sm font-semibold text-slate-700">{label}</span>
    <button
      type="button"
      onClick={onChange}
      className={`w-11 h-6 rounded-full transition-colors relative ${checked ? 'bg-[#2563EB]' : 'bg-slate-200'}`}
    >
      <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${checked ? 'left-5.5 translate-x-0.5' : 'left-0.5'}`} />
    </button>
  </div>
);

const ReceptionistSettings = () => {
  const [profile, setProfile] = useState({ name: 'Sarah', email: 'sarah@axiscare.com', phone: '98765 00000' });
  const [notif, setNotif] = useState({ appointments: true, walkins: true, billing: false, email: true });
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <ReceptionistLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">Settings</h1>
          <p className="text-sm text-slate-400 mt-1">Manage your profile and preferences.</p>
        </div>
        <div className="hidden sm:flex w-12 h-12 rounded-2xl bg-[#EFF6FF] items-center justify-center">
          <SettingsIcon className="w-6 h-6 text-[#2563EB]" />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Profile */}
        <form onSubmit={handleSave} className="xl:col-span-2 bg-white rounded-[18px] border border-slate-100 shadow-sm p-6 flex flex-col gap-5">
          <div className="flex items-center gap-4 mb-2">
            <img src="https://i.pravatar.cc/150?img=47" alt="Sarah" className="w-16 h-16 rounded-full object-cover" />
            <div>
              <p className="text-sm font-bold text-slate-800">{profile.name}</p>
              <p className="text-xs text-slate-400">Receptionist · AxisCare Front Desk</p>
              <button type="button" className="text-xs font-bold text-[#2563EB] hover:underline mt-1">Change Photo</button>
            </div>
          </div>

          <h2 className="text-sm font-bold text-slate-800">Profile Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field label="Full Name" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
            <Field label="Phone Number" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} />
          </div>
          <Field label="Email" type="email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} />

          <div className="flex items-center gap-3 pt-2">
            <button type="submit" className="bg-[#2563EB] hover:bg-blue-700 text-white text-sm font-bold px-6 py-2.5 rounded-xl transition-colors">
              Save Changes
            </button>
            {saved && <span className="text-sm font-semibold text-emerald-600">Saved!</span>}
          </div>
        </form>

        {/* Notification prefs + security */}
        <div className="flex flex-col gap-6">
          <div className="bg-white rounded-[18px] border border-slate-100 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-2">
              <Bell className="w-4 h-4 text-[#2563EB]" />
              <h2 className="text-sm font-bold text-slate-800">Notification Preferences</h2>
            </div>
            <div className="divide-y divide-slate-50">
              <Toggle label="Appointment reminders" checked={notif.appointments} onChange={() => setNotif({ ...notif, appointments: !notif.appointments })} />
              <Toggle label="Walk-in alerts" checked={notif.walkins} onChange={() => setNotif({ ...notif, walkins: !notif.walkins })} />
              <Toggle label="Billing updates" checked={notif.billing} onChange={() => setNotif({ ...notif, billing: !notif.billing })} />
              <Toggle label="Email notifications" checked={notif.email} onChange={() => setNotif({ ...notif, email: !notif.email })} />
            </div>
          </div>

          <div className="bg-white rounded-[18px] border border-slate-100 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <Lock className="w-4 h-4 text-[#2563EB]" />
              <h2 className="text-sm font-bold text-slate-800">Security</h2>
            </div>
            <button className="w-full text-left text-sm font-semibold text-slate-700 hover:text-[#2563EB] py-2 transition-colors">
              Change Password
            </button>
            <button className="w-full text-left text-sm font-semibold text-slate-700 hover:text-[#2563EB] py-2 transition-colors">
              Two-Factor Authentication
            </button>
          </div>
        </div>
      </div>
    </ReceptionistLayout>
  );
};

export default ReceptionistSettings;
