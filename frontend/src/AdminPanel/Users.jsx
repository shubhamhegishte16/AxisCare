import React, { useMemo, useState } from 'react';
import { Search, Plus, Trash2, Pencil, ShieldOff, ShieldCheck as ShieldCheckIcon } from 'lucide-react';
import AdminLayout from './AdminLayout';
import { PageHeader, StatCard, Card, Modal, ConfirmDialog, EmptyState, RoleBadge, StatusBadge } from './UI';
import { Users as UsersIcon, UserCheck, UserX, UserPlus } from 'lucide-react';

const roles = ['All', 'admin', 'doctor', 'receptionist', 'patient', 'laboratory', 'pharmacist'];
const emptyForm = { name: '', email: '', phone: '', role: 'patient', department: '' };

const AdminUsers = () => {
  const [users, setUsers] = useState(mockUsers);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [showAdd, setShowAdd] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const stats = useMemo(() => ({
    total: users.length,
    active: users.filter((u) => u.status === 'Active').length,
    inactive: users.filter((u) => u.status !== 'Active').length,
    doctors: users.filter((u) => u.role === 'doctor').length,
  }), [users]);

  const filtered = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.id.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'All' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const openAdd = () => {
    setForm(emptyForm);
    setShowAdd(true);
  };

  const openEdit = (u) => {
    setEditItem(u);
    setForm({ name: u.name, email: u.email, phone: u.phone, role: u.role, department: u.department });
  };

  const handleAdd = (e) => {
    e.preventDefault();
    const newUser = {
      id: `USR-${String(users.length + 1).padStart(3, '0')}`,
      ...form,
      status: 'Active',
      joined: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    };
    setUsers((prev) => [newUser, ...prev]);
    setShowAdd(false);
  };

  const handleEdit = (e) => {
    e.preventDefault();
    setUsers((prev) => prev.map((u) => (u.id === editItem.id ? { ...u, ...form } : u)));
    setEditItem(null);
  };

  const toggleStatus = (u) => {
    setUsers((prev) =>
      prev.map((x) => (x.id === u.id ? { ...x, status: x.status === 'Active' ? 'Inactive' : 'Active' } : x))
    );
  };

  const handleDelete = () => {
    setUsers((prev) => prev.filter((u) => u.id !== deleteItem.id));
    setDeleteItem(null);
  };

  return (
    <AdminLayout>
      <PageHeader
        title="Users"
        subtitle="Manage every account across the system"
        action={
          <button onClick={openAdd} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2.5 rounded-lg shadow-sm">
            <Plus className="w-4 h-4" /> Add User
          </button>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="TOTAL USERS" value={stats.total} icon={UsersIcon} iconColor="text-blue-600" bgColor="bg-blue-50" />
        <StatCard title="ACTIVE" value={stats.active} icon={UserCheck} iconColor="text-green-600" bgColor="bg-green-50" />
        <StatCard title="INACTIVE / SUSPENDED" value={stats.inactive} icon={UserX} iconColor="text-red-500" bgColor="bg-red-50" />
        <StatCard title="DOCTORS" value={stats.doctors} icon={UserPlus} iconColor="text-indigo-600" bgColor="bg-indigo-50" />
      </div>

      <Card>
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, or ID..."
              className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-blue-200"
          >
            {roles.map((r) => <option key={r} value={r}>{r === 'All' ? 'All Roles' : r.charAt(0).toUpperCase() + r.slice(1)}</option>)}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-400 text-xs uppercase">
                <th className="pb-3 font-semibold">Name</th>
                <th className="pb-3 font-semibold">Contact</th>
                <th className="pb-3 font-semibold">Role</th>
                <th className="pb-3 font-semibold">Department</th>
                <th className="pb-3 font-semibold">Joined</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id} className="border-t border-gray-50">
                  <td className="py-3">
                    <p className="font-semibold text-gray-800">{u.name}</p>
                    <p className="text-xs text-gray-400">{u.id}</p>
                  </td>
                  <td className="py-3 text-gray-500">
                    <p>{u.email}</p>
                    <p className="text-xs text-gray-400">{u.phone}</p>
                  </td>
                  <td className="py-3"><RoleBadge role={u.role} /></td>
                  <td className="py-3 text-gray-500">{u.department}</td>
                  <td className="py-3 text-gray-500">{u.joined}</td>
                  <td className="py-3"><StatusBadge status={u.status} /></td>
                  <td className="py-3">
                    <div className="flex justify-end gap-3">
                      <button onClick={() => toggleStatus(u)} title={u.status === 'Active' ? 'Deactivate' : 'Activate'} className="text-gray-400 hover:text-amber-600">
                        {u.status === 'Active' ? <ShieldOff className="w-4 h-4" /> : <ShieldCheckIcon className="w-4 h-4" />}
                      </button>
                      <button onClick={() => openEdit(u)} className="text-gray-400 hover:text-blue-600">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => setDeleteItem(u)} className="text-gray-400 hover:text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <EmptyState text="No users match your search." />}
        </div>
      </Card>

      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Add New User">
        <UserForm form={form} setForm={setForm} onSubmit={handleAdd} submitLabel="Add User" onCancel={() => setShowAdd(false)} />
      </Modal>

      <Modal open={!!editItem} onClose={() => setEditItem(null)} title={`Edit ${editItem?.name || ''}`}>
        <UserForm form={form} setForm={setForm} onSubmit={handleEdit} submitLabel="Save Changes" onCancel={() => setEditItem(null)} />
      </Modal>

      <ConfirmDialog
        open={!!deleteItem}
        onClose={() => setDeleteItem(null)}
        onConfirm={handleDelete}
        title="Delete User"
        message={`Are you sure you want to delete ${deleteItem?.name}? This action cannot be undone.`}
        confirmLabel="Delete"
        danger
      />
    </AdminLayout>
  );
};

const UserForm = ({ form, setForm, onSubmit, submitLabel, onCancel }) => (
  <form onSubmit={onSubmit} className="space-y-4">
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name</label>
      <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-blue-200" />
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
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Role</label>
        <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-blue-200">
          {roles.filter((r) => r !== 'All').map((r) => <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Department</label>
        <input value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-blue-200" />
      </div>
    </div>
    <div className="flex justify-end gap-3 pt-2">
      <button type="button" onClick={onCancel} className="px-4 py-2.5 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-50">Cancel</button>
      <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg shadow-sm">{submitLabel}</button>
    </div>
  </form>
);

export default AdminUsers;
