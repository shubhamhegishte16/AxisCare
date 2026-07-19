import React, { useEffect, useRef, useState } from 'react';
import { AlertCircle, Bell, Camera, ChevronDown, FileCheck, FileText, FlaskConical, KeyRound, Loader2 } from 'lucide-react';
import LabHeader from './LabHeader';
import { labService } from '../services/labService';

const API_ORIGIN = 'http://localhost:5000';
const defaultForm = { fullName: '', email: '', phone: '', empId: '', designation: '', department: '' };
const defaultNotifications = { emailNewRequests: true, emailResultUpdates: true, emailSystemAlerts: true, appNewRequests: true, appResultUpdates: true, appSystemAlerts: true };
const defaultPreferences = { defaultSampleType: 'Blood', defaultPriority: 'Normal', resultsAutoApprove: 'After Verification', workingTimeStart: '08:00', workingTimeEnd: '16:00' };
const NOTIFS = [
  { eKey: 'emailNewRequests', aKey: 'appNewRequests', icon: FileText, label: 'New Test Requests', sub: 'Get notified when new test requests are assigned' },
  { eKey: 'emailResultUpdates', aKey: 'appResultUpdates', icon: FileCheck, label: 'Test Results Updated', sub: 'Get notified when test results are updated' },
  { eKey: 'emailSystemAlerts', aKey: 'appSystemAlerts', icon: AlertCircle, label: 'System Alerts', sub: 'Get notified about system updates and alerts' },
];

const Toggle = ({ on, toggle, disabled }) => (
  <button type="button" disabled={disabled} onClick={toggle} className={`relative inline-flex w-10 h-[22px] rounded-full transition-colors duration-200 flex-shrink-0 disabled:opacity-60 ${on ? 'bg-[#00B9D6]' : 'bg-gray-200'}`}>
    <span className={`absolute top-[3px] left-[3px] w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${on ? 'translate-x-[18px]' : 'translate-x-0'}`} />
  </button>
);
const Label = ({ text }) => <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">{text}</label>;
const Input = ({ label, value, onChange, disabled, type = 'text', placeholder }) => (
  <div><Label text={label} /><input type={type} value={value || ''} onChange={onChange} disabled={disabled} placeholder={placeholder} className={`w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-[#00B9D6]/30 focus:border-[#00B9D6] transition-all ${disabled ? 'bg-gray-50 text-gray-400 cursor-not-allowed' : 'bg-white'}`} /></div>
);
const SelectField = ({ label, value, onChange, options }) => (
  <div><Label text={label} /><div className="relative"><select value={value || ''} onChange={onChange} className="appearance-none w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg bg-white outline-none focus:ring-2 focus:ring-[#00B9D6]/30 text-gray-700">{options.map(o => <option key={o}>{o}</option>)}</select><ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" /></div></div>
);
const Card = ({ icon: Icon, iconBg, iconColor, title, desc, children }) => (
  <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden"><div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100"><div className={`w-8 h-8 rounded-xl ${iconBg} flex items-center justify-center flex-shrink-0`}><Icon className={`w-4 h-4 ${iconColor}`} /></div><div><p className="text-sm font-bold text-gray-900">{title}</p><p className="text-[11px] text-gray-400 mt-0.5">{desc}</p></div></div><div className="px-6 py-5">{children}</div></div>
);

export default function LabSettings() {
  const fileRef = useRef(null);
  const [form, setForm] = useState(defaultForm), [savedForm, setSavedForm] = useState(defaultForm), [notifications, setNotifications] = useState(defaultNotifications), [preferences, setPreferences] = useState(defaultPreferences);
  const [avatar, setAvatar] = useState(''), [loading, setLoading] = useState(true), [saving, setSaving] = useState(false), [message, setMessage] = useState(''), [error, setError] = useState('');
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '' }), [showPasswordForm, setShowPasswordForm] = useState(false);

  const hydrate = (data) => {
    const nextForm = { fullName: data.user?.fullName || '', email: data.user?.email || '', phone: data.user?.phone || '', empId: data.empId || '', designation: data.designation || '', department: data.department || data.user?.department || '' };
    setForm(nextForm); setSavedForm(nextForm); setNotifications({ ...defaultNotifications, ...(data.notifications || {}) }); setPreferences({ ...defaultPreferences, ...(data.preferences || {}) }); setAvatar(data.user?.avatar ? `${API_ORIGIN}${data.user.avatar}` : '');
  };
  const fetchSettings = async () => {
    try { setLoading(true); setError(''); const res = await labService.getSettings(); if (res.success) hydrate(res.data); }
    catch (err) { setError(err.response?.data?.message || 'Failed to load lab settings.'); }
    finally { setLoading(false); }
  };
  useEffect(() => { fetchSettings(); }, []);

  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }));
  const setPref = k => e => setPreferences(p => ({ ...p, [k]: e.target.value }));
  const showMsg = (text) => { setMessage(text); window.setTimeout(() => setMessage(''), 2500); };
  const saveProfile = async () => {
    try { setSaving(true); setError(''); const res = await labService.updateSettingsProfile(form); if (res.success) { hydrate(res.data); showMsg('Profile saved successfully.'); } }
    catch (err) { setError(err.response?.data?.message || 'Failed to save profile.'); }
    finally { setSaving(false); }
  };
  const savePreferences = async () => {
    try { setSaving(true); setError(''); const res = await labService.updateLabPreferences(preferences); if (res.success) { setPreferences({ ...defaultPreferences, ...res.data }); showMsg('Lab preferences saved.'); } }
    catch (err) { setError(err.response?.data?.message || 'Failed to save preferences.'); }
    finally { setSaving(false); }
  };
  const toggleNotification = async (key) => {
    const next = { ...notifications, [key]: !notifications[key] };
    setNotifications(next);
    try { const res = await labService.updateNotificationSettings(next); if (res.success) setNotifications({ ...defaultNotifications, ...res.data }); }
    catch (err) { setNotifications(notifications); setError(err.response?.data?.message || 'Failed to update notifications.'); }
  };
  const uploadAvatar = async (e) => {
    const file = e.target.files?.[0]; if (!file) return;
    try { setSaving(true); setError(''); const res = await labService.uploadAvatar(file); if (res.success) { setAvatar(`${API_ORIGIN}${res.avatar}`); showMsg('Photo updated.'); } }
    catch (err) { setError(err.response?.data?.message || 'Failed to upload photo.'); }
    finally { setSaving(false); e.target.value = ''; }
  };
  const changePassword = async () => {
    try { setSaving(true); setError(''); const res = await labService.changePassword(passwords); if (res.success) { setPasswords({ currentPassword: '', newPassword: '' }); setShowPasswordForm(false); showMsg('Password changed successfully.'); } }
    catch (err) { setError(err.response?.data?.message || 'Failed to change password.'); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="min-h-screen bg-gray-50 flex flex-col"><LabHeader activePage="settings" /><div className="flex-1 flex items-center justify-center gap-2 text-gray-500 font-semibold"><Loader2 className="w-6 h-6 animate-spin text-[#00B9D6]" />Loading settings...</div></div>;
  const avatarSrc = avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(form.fullName || 'Lab User')}&background=00B9D6&color=fff&size=56`;
  const username = form.email ? form.email.split('@')[0] : form.empId;

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <LabHeader activePage="settings" />
      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mt-6 space-y-5">
        <div><h1 className="text-xl font-extrabold text-gray-900">Settings</h1><p className="text-xs text-gray-400 mt-0.5">Manage your account, preferences and system settings.</p></div>
        {message && <div className="bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-xl px-4 py-3 text-sm font-semibold">{message}</div>}
        {error && <div className="bg-red-50 border border-red-100 text-red-600 rounded-xl px-4 py-3 text-sm font-semibold">{error}</div>}

        <Card icon={FlaskConical} iconBg="bg-blue-50" iconColor="text-blue-500" title="Profile Settings" desc="Update your personal information and profile details.">
          <div className="flex items-center justify-between mb-5"><div className="relative w-14 h-14 flex-shrink-0"><img src={avatarSrc} alt="avatar" className="w-14 h-14 rounded-full object-cover border-2 border-[#00B9D6]/20" /><button type="button" onClick={() => fileRef.current?.click()} className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-[#00B9D6] rounded-full flex items-center justify-center hover:bg-[#00a8c3] transition-colors shadow"><Camera className="w-2.5 h-2.5 text-white" /></button><input ref={fileRef} type="file" accept="image/*" className="sr-only" onChange={uploadAvatar} /></div><button type="button" onClick={() => fileRef.current?.click()} className="flex items-center gap-1.5 text-xs font-bold text-[#00B9D6] border border-[#00B9D6] px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors"><Camera className="w-3.5 h-3.5" />Change Photo</button></div>
          <div className="grid grid-cols-3 gap-4 mb-4"><Input label="Full Name" value={form.fullName} onChange={set('fullName')} /><Input label="Email Address" value={form.email} onChange={set('email')} type="email" /><Input label="Phone Number" value={form.phone} onChange={set('phone')} /></div>
          <div className="grid grid-cols-3 gap-4 mb-5"><Input label="Employee ID" value={form.empId} onChange={set('empId')} /><Input label="Designation" value={form.designation} onChange={set('designation')} /><SelectField label="Department" value={form.department} onChange={set('department')} options={['Pathology Lab', 'Hematology', 'Biochemistry', 'Microbiology', 'Radiology', 'Other']} /></div>
          <div className="flex justify-end gap-2 pt-4 border-t border-gray-100"><button type="button" onClick={() => setForm(savedForm)} className="px-4 py-2 text-sm font-semibold text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">Cancel</button><button type="button" disabled={saving} onClick={saveProfile} className="px-4 py-2 text-sm font-bold text-white bg-[#00B9D6] hover:bg-[#00a8c3] rounded-lg shadow-sm transition-colors disabled:opacity-60">{saving ? 'Saving...' : 'Save Changes'}</button></div>
        </Card>

        <Card icon={KeyRound} iconBg="bg-purple-50" iconColor="text-purple-500" title="Account Settings" desc="Manage your account information and login credentials.">
          <div className="grid grid-cols-2 gap-4"><Input label="Username" value={username} disabled /><div><Label text="Password" /><div className="flex items-center gap-3"><input type="password" value="passwordhidden" readOnly className="flex-1 px-3 py-2.5 text-sm border border-gray-200 rounded-lg outline-none bg-white" /><button type="button" onClick={() => setShowPasswordForm(p => !p)} className="flex items-center gap-1 text-xs font-bold text-[#00B9D6] whitespace-nowrap hover:underline flex-shrink-0"><KeyRound className="w-3 h-3" />Change Password</button></div></div></div>
          {showPasswordForm && <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-100"><Input label="Current Password" type="password" value={passwords.currentPassword} onChange={e => setPasswords(p => ({ ...p, currentPassword: e.target.value }))} /><Input label="New Password" type="password" value={passwords.newPassword} onChange={e => setPasswords(p => ({ ...p, newPassword: e.target.value }))} /><div className="flex items-end"><button type="button" disabled={saving} onClick={changePassword} className="w-full px-4 py-2.5 text-sm font-bold text-white bg-[#00B9D6] hover:bg-[#00a8c3] rounded-lg disabled:opacity-60">Update Password</button></div></div>}
        </Card>

        <Card icon={Bell} iconBg="bg-amber-50" iconColor="text-amber-500" title="Notification Preferences" desc="Choose how you want to receive notifications.">
          <div className="grid grid-cols-2 gap-8">{[{ title: 'Email Notifications', getKey: r => r.eKey }, { title: 'In-App Notifications', getKey: r => r.aKey }].map(({ title, getKey }) => <div key={title}><p className="text-xs font-bold text-gray-700 mb-4">{title}</p><div className="space-y-5">{NOTIFS.map(row => <div key={getKey(row)} className="flex items-center justify-between gap-3"><div className="flex items-start gap-2.5 flex-1 min-w-0"><div className="w-7 h-7 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center flex-shrink-0 mt-0.5"><row.icon className="w-3.5 h-3.5 text-gray-400" /></div><div className="min-w-0"><p className="text-xs font-bold text-gray-800 leading-tight">{row.label}</p><p className="text-[10px] text-gray-400 mt-0.5 leading-snug">{row.sub}</p></div></div><Toggle on={notifications[getKey(row)]} toggle={() => toggleNotification(getKey(row))} disabled={saving} /></div>)}</div></div>)}</div>
        </Card>

        <Card icon={FlaskConical} iconBg="bg-teal-50" iconColor="text-teal-500" title="Lab Preferences" desc="Configure laboratory specific preferences and settings.">
          <div className="grid grid-cols-2 gap-4 mb-4"><SelectField label="Default Sample Type" value={preferences.defaultSampleType} onChange={setPref('defaultSampleType')} options={['Blood', 'Urine', 'Serum', 'Plasma']} /><SelectField label="Default Priority" value={preferences.defaultPriority} onChange={setPref('defaultPriority')} options={['Normal', 'High', 'Urgent']} /><SelectField label="Results Auto-Approve" value={preferences.resultsAutoApprove} onChange={setPref('resultsAutoApprove')} options={['After Verification', 'Immediate', 'Never']} /><div className="grid grid-cols-2 gap-3"><Input label="Working Time Start" type="time" value={preferences.workingTimeStart} onChange={setPref('workingTimeStart')} /><Input label="Working Time End" type="time" value={preferences.workingTimeEnd} onChange={setPref('workingTimeEnd')} /></div></div>
          <div className="flex justify-end pt-4 border-t border-gray-100"><button type="button" disabled={saving} onClick={savePreferences} className="px-5 py-2 text-sm font-bold text-white bg-[#00B9D6] hover:bg-[#00a8c3] rounded-lg shadow-sm transition-colors disabled:opacity-60">{saving ? 'Saving...' : 'Save Preferences'}</button></div>
        </Card>
      </main>
    </div>
  );
}
