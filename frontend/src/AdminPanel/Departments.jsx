import React, { useCallback, useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Building2, Stethoscope, Users } from 'lucide-react';
import AdminLayout from './AdminLayout';
import { PageHeader, StatCard, Card, Modal, ConfirmDialog, StatusBadge, EmptyState } from './UI';
import { adminService } from '../services/adminService';

const emptyForm = { name: '', head: '' };

const AdminDepartments = () => {
  const [departments, setDepartments] = useState([]);
  const [stats, setStats] = useState({ total: 0, active: 0, totalDoctors: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionError, setActionError] = useState(null);

  const [showAdd, setShowAdd] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [deptRes, statsRes] = await Promise.all([
        adminService.getDepartments(),
        adminService.getDepartmentStats(),
      ]);
      if (deptRes.success) setDepartments(deptRes.data);
      if (statsRes.success) setStats(statsRes.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load departments');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const openEdit = (d) => {
    setEditItem(d);
    setActionError(null);
    setForm({ name: d.name, head: d.head });
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await adminService.createDepartment(form);
      if (res.success) {
        setForm(emptyForm);
        setShowAdd(false);
        await loadData();
      } else {
        setActionError(res.message || 'Failed to add department');
      }
    } catch (err) {
      setActionError(err.response?.data?.message || err.message || 'Failed to add department');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await adminService.updateDepartment(editItem._id, form);
      if (res.success) {
        setEditItem(null);
        await loadData();
      } else {
        setActionError(res.message || 'Failed to update department');
      }
    } catch (err) {
      setActionError(err.response?.data?.message || err.message || 'Failed to update department');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      const res = await adminService.deleteDepartment(deleteItem._id);
      setDeleteItem(null);
      if (res.success) await loadData();
      else setError(res.message || 'Failed to delete department');
    } catch (err) {
      setDeleteItem(null);
      setError(err.response?.data?.message || err.message || 'Failed to delete department');
    }
  };

  return (
    <AdminLayout>
      <PageHeader
        title="Departments"
        subtitle="Manage hospital departments and their leads"
        action={
          <button onClick={() => { setForm(emptyForm); setActionError(null); setShowAdd(true); }} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2.5 rounded-lg shadow-sm">
            <Plus className="w-4 h-4" /> Add Department
          </button>
        }
      />

      {error && <div className="mb-4 px-4 py-3 rounded-lg bg-red-50 text-red-600 text-sm font-medium">{error}</div>}

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <StatCard title="TOTAL DEPARTMENTS" value={stats.total} icon={Building2} iconColor="text-blue-600" bgColor="bg-blue-50" />
        <StatCard title="ACTIVE" value={stats.active} icon={Building2} iconColor="text-green-600" bgColor="bg-green-50" />
        <StatCard title="TOTAL DOCTORS ASSIGNED" value={stats.totalDoctors} icon={Stethoscope} iconColor="text-indigo-600" bgColor="bg-indigo-50" />
      </div>

      {loading ? (
        <div className="py-10 text-center text-gray-400 text-sm">Loading departments...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {departments.map((d) => (
            <Card key={d.id}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="w-11 h-11 rounded-lg bg-blue-50 flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-blue-500" />
                  </span>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{d.name}</p>
                    <p className="text-xs text-gray-400">Head: {d.head}</p>
                  </div>
                </div>
                <StatusBadge status={d.status} />
              </div>
              <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                <span className="flex items-center gap-1"><Stethoscope className="w-3.5 h-3.5" /> {d.doctors} doctors</span>
                <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {d.staff} staff</span>
              </div>
              <div className="flex justify-end gap-3 pt-3 border-t border-gray-50">
                <button onClick={() => openEdit(d)} className="text-gray-400 hover:text-blue-600">
                  <Pencil className="w-4 h-4" />
                </button>
                <button onClick={() => setDeleteItem(d)} className="text-gray-400 hover:text-red-600">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}
      {!loading && departments.length === 0 && <EmptyState text="No departments yet." />}

      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Add Department">
        {actionError && <div className="mb-3 px-3 py-2 rounded-lg bg-red-50 text-red-600 text-xs font-medium">{actionError}</div>}
        <DeptForm form={form} setForm={setForm} onSubmit={handleAdd} submitLabel={saving ? 'Saving...' : 'Add Department'} onCancel={() => setShowAdd(false)} disabled={saving} />
      </Modal>

      <Modal open={!!editItem} onClose={() => setEditItem(null)} title={`Edit ${editItem?.name || ''}`}>
        {actionError && <div className="mb-3 px-3 py-2 rounded-lg bg-red-50 text-red-600 text-xs font-medium">{actionError}</div>}
        <DeptForm form={form} setForm={setForm} onSubmit={handleEdit} submitLabel={saving ? 'Saving...' : 'Save Changes'} onCancel={() => setEditItem(null)} disabled={saving} />
      </Modal>

      <ConfirmDialog
        open={!!deleteItem}
        onClose={() => setDeleteItem(null)}
        onConfirm={handleDelete}
        title="Delete Department"
        message={`Are you sure you want to delete ${deleteItem?.name}? Doctors assigned to it will need to be reassigned.`}
        confirmLabel="Delete"
        danger
      />
    </AdminLayout>
  );
};

const DeptForm = ({ form, setForm, onSubmit, submitLabel, onCancel, disabled }) => (
  <form onSubmit={onSubmit} className="space-y-4">
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Department Name</label>
      <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-blue-200" />
    </div>
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Department Head</label>
      <input value={form.head} onChange={(e) => setForm({ ...form, head: e.target.value })} placeholder="Dr. Full Name" className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-blue-200" />
    </div>
    <div className="flex justify-end gap-3 pt-2">
      <button type="button" onClick={onCancel} className="px-4 py-2.5 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-50">Cancel</button>
      <button type="submit" disabled={disabled} className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-semibold px-5 py-2.5 rounded-lg shadow-sm">{submitLabel}</button>
    </div>
  </form>
);

export default AdminDepartments;
