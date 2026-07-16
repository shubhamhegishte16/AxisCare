import React, { useMemo, useState } from 'react';
import { Search, Plus, Building2, Mail, Phone, CheckCircle2, Clock, Trash2 } from 'lucide-react';
import PharmacyNavbar from './PharmacyNavbar';
import { PageHeader, StatusBadge, StatCard, Card, Modal, EmptyState } from './UI';
import { suppliers as initialSuppliers } from './mockData';

const emptyForm = { name: '', contact: '', email: '' };

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState(initialSuppliers);
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const filtered = suppliers.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) || s.id.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = (e) => {
    e.preventDefault();
    const newSupplier = {
      id: `SUP-${String(suppliers.length + 1).padStart(2, '0')}`,
      name: form.name || 'Unnamed Supplier',
      contact: form.contact || '—',
      email: form.email || '—',
      medicines: 0,
      orders: 0,
      status: 'Pending',
    };
    setSuppliers([newSupplier, ...suppliers]);
    setForm(emptyForm);
    setShowAdd(false);
  };

  const handleDelete = (id) => setSuppliers(suppliers.filter((s) => s.id !== id));

  const stats = useMemo(() => ({
    total: suppliers.length,
    active: suppliers.filter((s) => s.status === 'Active').length,
    pending: suppliers.filter((s) => s.status === 'Pending').length,
    medicines: suppliers.reduce((sum, s) => sum + s.medicines, 0),
  }), [suppliers]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <PharmacyNavbar />
      <main className="flex-1 p-6 lg:p-8 max-w-7xl mx-auto w-full">
        <PageHeader
          title="Suppliers"
          subtitle={`${suppliers.length} registered suppliers`}
          action={
            <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2.5 rounded-lg shadow-sm">
              <Plus className="w-4 h-4" /> Add Supplier
            </button>
          }
        />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
          <StatCard title="TOTAL SUPPLIERS" value={stats.total} icon={Building2} iconColor="text-blue-600" bgColor="bg-blue-50" />
          <StatCard title="ACTIVE" value={stats.active} icon={CheckCircle2} iconColor="text-green-600" bgColor="bg-green-50" />
          <StatCard title="PENDING" value={stats.pending} icon={Clock} iconColor="text-amber-500" bgColor="bg-amber-50" />
          <StatCard title="MEDICINES SUPPLIED" value={stats.medicines} icon={Building2} iconColor="text-blue-600" bgColor="bg-blue-50" />
        </div>

        <Card>
          <div className="relative mb-4">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by supplier name or ID..."
              className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((s) => (
              <div key={s.id} className="border border-gray-100 rounded-xl p-4 hover:shadow-sm transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-bold text-gray-800">{s.name}</p>
                    <p className="text-xs text-gray-400">{s.id}</p>
                  </div>
                  <StatusBadge status={s.status} />
                </div>
                <div className="space-y-1.5 mb-4">
                  <p className="text-xs text-gray-500 flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> {s.contact}</p>
                  <p className="text-xs text-gray-500 flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> {s.email}</p>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500 border-t border-gray-50 pt-3">
                  <span>{s.medicines} medicines</span>
                  <span>{s.orders} orders</span>
                  <button onClick={() => handleDelete(s.id)} className="text-gray-400 hover:text-red-600"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            ))}
          </div>
          {filtered.length === 0 && <EmptyState text="No suppliers match your search." />}
        </Card>
      </main>

      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Add Supplier">
        <form onSubmit={handleAdd} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Supplier Name</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Contact Number</label>
            <input
              value={form.contact}
              onChange={(e) => setForm({ ...form, contact: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setShowAdd(false)} className="px-4 py-2.5 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-50">Cancel</button>
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg shadow-sm">Save Supplier</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Suppliers;