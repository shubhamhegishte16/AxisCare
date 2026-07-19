import React, { useCallback, useEffect, useState } from 'react';
import { Search, Plus, Eye, Star, Stethoscope, UserCheck, UserMinus, Trash2 } from 'lucide-react';
import AdminLayout from './AdminLayout';
import { PageHeader, StatCard, Card, Modal, ConfirmDialog, StatusBadge, EmptyState } from './UI';
import { adminService } from '../services/adminService';

const emptyForm = { name: '', email: '', phone: '', specialization: '', department: '', experience: '' };

const AdminDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [stats, setStats] = useState({ total: 0, onDuty: 0, onLeave: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionError, setActionError] = useState(null);

  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [viewItem, setViewItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [docRes, statsRes] = await Promise.all([
        adminService.getDoctors({ search: search || undefined }),
        adminService.getDoctorStats(),
      ]);
      if (docRes.success) setDoctors(docRes.data);
      if (statsRes.success) setStats(statsRes.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load doctors');
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    const timer = setTimeout(loadData, 300);
    return () => clearTimeout(timer);
  }, [loadData]);

  const filtered = doctors;

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await adminService.createDoctor(form);
      if (res.success) {
        setForm(emptyForm);
        setShowAdd(false);
        setActionError(null);
        await loadData();
      } else {
        setActionError(res.message || 'Failed to add doctor');
      }
    } catch (err) {
      setActionError(err.response?.data?.message || err.message || 'Failed to add doctor');
    } finally {
      setSaving(false);
    }
  };

  const handleRemove = async () => {
    try {
      const res = await adminService.removeDoctor(deleteItem._id);
      setDeleteItem(null);
      if (res.success) await loadData();
      else setError(res.message || 'Failed to remove doctor');
    } catch (err) {
      setDeleteItem(null);
      setError(err.response?.data?.message || err.message || 'Failed to remove doctor');
    }
  };

  return (
    <AdminLayout>
      <PageHeader
        title="Doctors"
        subtitle="Manage doctor profiles across departments"
        action={
          <button onClick={() => { setForm(emptyForm); setActionError(null); setShowAdd(true); }} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2.5 rounded-lg shadow-sm">
            <Plus className="w-4 h-4" /> Add Doctor
          </button>
        }
      />

      {error && <div className="mb-4 px-4 py-3 rounded-lg bg-red-50 text-red-600 text-sm font-medium">{error}</div>}

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <StatCard title="TOTAL DOCTORS" value={stats.total} icon={Stethoscope} iconColor="text-blue-600" bgColor="bg-blue-50" />
        <StatCard title="ON DUTY" value={stats.onDuty} icon={UserCheck} iconColor="text-green-600" bgColor="bg-green-50" />
        <StatCard title="ON LEAVE" value={stats.onLeave} icon={UserMinus} iconColor="text-amber-500" bgColor="bg-amber-50" />
      </div>

      <Card>
        <div className="relative mb-4 max-w-md">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, specialization, department..."
            className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>

        {loading ? (
          <div className="py-10 text-center text-gray-400 text-sm">Loading doctors...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((doc) => (
              <div key={doc.id} className="border border-gray-100 rounded-xl p-4 hover:border-blue-200 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="w-11 h-11 rounded-full bg-blue-50 flex items-center justify-center">
                      <Stethoscope className="w-5 h-5 text-blue-500" />
                    </span>
                    <div>
                      <p className="font-bold text-gray-900 text-sm">{doc.name}</p>
                      <p className="text-xs text-gray-400">{doc.specialization}</p>
                    </div>
                  </div>
                  <StatusBadge status={doc.status} />
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                  <span>{doc.department}</span>
                  <span>{doc.experience} exp.</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    {doc.rating || '—'} · {doc.patients} patients
                  </div>
                  <div className="flex items-center gap-3">
                    <button onClick={() => setViewItem(doc)} className="text-blue-600 text-xs font-semibold hover:underline flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5" /> View
                    </button>
                    <button onClick={() => setDeleteItem(doc)} className="text-gray-400 hover:text-red-600">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {!loading && filtered.length === 0 && <EmptyState text="No doctors match your search." />}
      </Card>

      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Add New Doctor">
        {actionError && <div className="mb-3 px-3 py-2 rounded-lg bg-red-50 text-red-600 text-xs font-medium">{actionError}</div>}
        <form onSubmit={handleAdd} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name</label>
            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Dr. Full Name" className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-blue-200" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
              <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-blue-200" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Phone</label>
              <input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-blue-200" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Specialization</label>
              <input required value={form.specialization} onChange={(e) => setForm({ ...form, specialization: e.target.value })} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-blue-200" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Department</label>
              <input required value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-blue-200" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Experience</label>
            <input value={form.experience} onChange={(e) => setForm({ ...form, experience: e.target.value })} placeholder="e.g. 8 yrs" className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-blue-200" />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setShowAdd(false)} className="px-4 py-2.5 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={saving} className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-semibold px-5 py-2.5 rounded-lg shadow-sm">{saving ? 'Saving...' : 'Add Doctor'}</button>
          </div>
        </form>
      </Modal>

      <Modal open={!!viewItem} onClose={() => setViewItem(null)} title={viewItem?.name}>
        {viewItem && (
          <div className="space-y-3 text-sm">
            <Row label="ID" value={viewItem.id} />
            <Row label="Specialization" value={viewItem.specialization} />
            <Row label="Department" value={viewItem.department} />
            <Row label="Experience" value={viewItem.experience} />
            <Row label="Patients Handled" value={viewItem.patients} />
            <Row label="Rating" value={`${viewItem.rating || '—'} / 5`} />
            <Row label="Status" value={<StatusBadge status={viewItem.status} />} />
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={!!deleteItem}
        onClose={() => setDeleteItem(null)}
        onConfirm={handleRemove}
        title="Remove Doctor"
        message={`Deactivate ${deleteItem?.name}? Their historical records will be kept.`}
        confirmLabel="Deactivate"
        danger
      />
    </AdminLayout>
  );
};

const Row = ({ label, value }) => (
  <div className="flex items-center justify-between border-b border-gray-50 pb-2">
    <span className="text-gray-400">{label}</span>
    <span className="font-semibold text-gray-800">{value}</span>
  </div>
);

export default AdminDoctors;
