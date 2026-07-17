import React, { useEffect, useState, useCallback } from 'react';
import { Search, Plus, Building2, Mail, Phone, CheckCircle2, Clock, Trash2 } from 'lucide-react';
import PharmacyNavbar from './PharmacyNavbar';
import { PageHeader, StatusBadge, StatCard, Card, Modal, EmptyState } from './UI';
import { pharmacyService } from '../services/pharmacyService';

const emptyForm = { name: '', contact: '', email: '' };

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [stats, setStats] = useState({ total: 0, active: 0, pending: 0, medicines: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [supRes, statRes] = await Promise.all([
        pharmacyService.getSuppliers({ search: search || undefined }),
        pharmacyService.getSupplierStats(),
      ]);
      setSuppliers(supRes.data || []);
      setStats(statRes.data || {});
    } catch (err) {
      setError(err.message || 'Failed to load suppliers');
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    const timer = setTimeout(loadData, 300);
    return () => clearTimeout(timer);
  }, [loadData]);

  const handleAdd = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await pharmacyService.createSupplier(form);
      setForm(emptyForm);
      setShowAdd(false);
      await loadData();
    } catch (err) {
      setError(err.message || 'Failed to add supplier');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await pharmacyService.deleteSupplier(id);
      await loadData();
    } catch (err) {
      setError(err.message || 'Failed to delete supplier');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <PharmacyNavbar />
      <main className="flex-1 p-6 lg:p-8 max-w-7xl mx-auto w-full">
        <PageHeader
          title="Suppliers"
          subtitle={`${stats.total || 0} registered suppliers`}
          action={
            <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2.5 rounded-lg shadow-sm">
              <Plus className="w-4 h-4" /> Add Supplier
            </button>
          }
        />

        {error && <div className="mb-4 text-sm text-red-600 bg-red-50 px-4 py-2.5 rounded-lg">{error}</div>}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
          <StatCard title="TOTAL SUPPLIERS" value={stats.total || 0} icon={Building2} iconColor="text-blue-600" bgColor="bg-blue-50" />
          <StatCard title="ACTIVE" value={stats.active || 0} icon={CheckCircle2} iconColor="text-green-600" bgColor="bg-green-50" />
          <StatCard title="PENDING" value={stats.pending || 0} icon={Clock} iconColor="text-amber-500" bgColor="bg-amber-50" />
          <StatCard title="MEDICINES SUPPLIED" value={stats.medicines || 0} icon={Building2} iconColor="text-blue-600" bgColor="bg-blue-50" />
        </div>

        <Card>
          <div className="relative mb-4">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by supplier name..."
              className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {suppliers.map((s) => (
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
                  <button onClick={() => handleDelete(s._id)} className="text-gray-400 hover:text-red-600"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            ))}
          </div>
          {!loading && suppliers.length === 0 && <EmptyState text="No suppliers match your search." />}
          {loading && <div className="py-10 text-center text-sm text-gray-400">Loading...</div>}
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
            <button type="submit" disabled={saving} className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-semibold px-5 py-2.5 rounded-lg shadow-sm">
              {saving ? 'Saving...' : 'Save Supplier'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Suppliers;