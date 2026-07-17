import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { Search, Plus, Pencil, Trash2, PackagePlus, Eye, Package, AlertTriangle, XCircle, CalendarClock } from 'lucide-react';
import PharmacyNavbar from './PharmacyNavbar';
import { PageHeader, StatusBadge, StatCard, Card, Modal, EmptyState } from './UI';
import { pharmacyService } from '../services/pharmacyService';

const emptyForm = {
  name: '', genericName: '', brand: '', category: '', manufacturer: '',
  batch: '', mfgDate: '', expiry: '', purchasePrice: '', sellingPrice: '',
  quantity: '', minStock: '', supplier: '', description: '',
};

const formatDate = (d) => (d ? new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—');

const Medicines = () => {
  const [medicines, setMedicines] = useState([]);
  const [stats, setStats] = useState({ total: 0, lowStock: 0, outOfStock: 0, expiringSoon: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [viewItem, setViewItem] = useState(null);
  const [saving, setSaving] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [medRes, statRes] = await Promise.all([
        pharmacyService.getMedicines({ search: search || undefined, category: categoryFilter !== 'All' ? categoryFilter : undefined }),
        pharmacyService.getMedicineStats(),
      ]);
      setMedicines(medRes.data || []);
      setStats(statRes.data || {});
    } catch (err) {
      setError(err.message || 'Failed to load medicines');
    } finally {
      setLoading(false);
    }
  }, [search, categoryFilter]);

  useEffect(() => {
    const timer = setTimeout(loadData, 300);
    return () => clearTimeout(timer);
  }, [loadData]);

  const categories = useMemo(() => ['All', ...new Set(medicines.map((m) => m.category))], [medicines]);

  const handleAdd = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await pharmacyService.createMedicine(form);
      setForm(emptyForm);
      setShowAdd(false);
      await loadData();
    } catch (err) {
      setError(err.message || 'Failed to add medicine');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await pharmacyService.deleteMedicine(id);
      await loadData();
    } catch (err) {
      setError(err.message || 'Failed to delete medicine');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <PharmacyNavbar />
      <main className="flex-1 p-6 lg:p-8 max-w-7xl mx-auto w-full">
        <PageHeader
          title="Medicines"
          subtitle={`${stats.total || 0} medicines in catalog`}
          action={
            <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2.5 rounded-lg shadow-sm">
              <Plus className="w-4 h-4" /> Add Medicine
            </button>
          }
        />

        {error && <div className="mb-4 text-sm text-red-600 bg-red-50 px-4 py-2.5 rounded-lg">{error}</div>}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
          <StatCard title="TOTAL MEDICINES" value={stats.total || 0} icon={Package} iconColor="text-blue-600" bgColor="bg-blue-50" />
          <StatCard title="LOW STOCK" value={stats.lowStock || 0} icon={AlertTriangle} iconColor="text-amber-500" bgColor="bg-amber-50" />
          <StatCard title="OUT OF STOCK" value={stats.outOfStock || 0} icon={XCircle} iconColor="text-red-500" bgColor="bg-red-50" />
          <StatCard title="EXPIRING SOON" value={stats.expiringSoon || 0} icon={CalendarClock} iconColor="text-orange-500" bgColor="bg-orange-50" />
        </div>

        <Card>
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by medicine name or batch..."
                className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-blue-200"
            >
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-400 text-xs uppercase border-b border-gray-100">
                  <th className="pb-3 font-semibold">Medicine</th>
                  <th className="pb-3 font-semibold">Category</th>
                  <th className="pb-3 font-semibold">Batch No.</th>
                  <th className="pb-3 font-semibold">Expiry</th>
                  <th className="pb-3 font-semibold">Stock</th>
                  <th className="pb-3 font-semibold">Price</th>
                  <th className="pb-3 font-semibold">Supplier</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {medicines.map((m) => (
                  <tr key={m.id} className="border-b border-gray-50 hover:bg-gray-50/60">
                    <td className="py-3 font-semibold text-gray-800">
                      <div>{m.name}</div>
                      <div className="text-xs text-gray-400 font-normal">{m.id}</div>
                    </td>
                    <td className="py-3 text-gray-500">{m.category}</td>
                    <td className="py-3 text-gray-500">{m.batch}</td>
                    <td className="py-3 text-gray-500">{formatDate(m.expiry)}</td>
                    <td className="py-3 text-gray-500">{m.stock}</td>
                    <td className="py-3 text-gray-500">Rs. {m.price}</td>
                    <td className="py-3 text-gray-500">{m.supplierName || '—'}</td>
                    <td className="py-3"><StatusBadge status={m.status} /></td>
                    <td className="py-3">
                      <div className="flex items-center justify-end gap-3">
                        <button onClick={() => setViewItem(m)} className="text-gray-400 hover:text-blue-600"><Eye className="w-4 h-4" /></button>
                        <button className="text-gray-400 hover:text-blue-600"><Pencil className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(m._id)} className="text-gray-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!loading && medicines.length === 0 && <EmptyState text="No medicines match your search." />}
            {loading && <div className="py-10 text-center text-sm text-gray-400">Loading...</div>}
          </div>
        </Card>
      </main>

      {/* Add Medicine Modal */}
      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Add Medicine" wide>
        <form onSubmit={handleAdd} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <TextField label="Medicine Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
          <TextField label="Generic Name" value={form.genericName} onChange={(v) => setForm({ ...form, genericName: v })} />
          <TextField label="Brand" value={form.brand} onChange={(v) => setForm({ ...form, brand: v })} />
          <TextField label="Category" value={form.category} onChange={(v) => setForm({ ...form, category: v })} />
          <TextField label="Manufacturer" value={form.manufacturer} onChange={(v) => setForm({ ...form, manufacturer: v })} />
          <TextField label="Batch Number" value={form.batch} onChange={(v) => setForm({ ...form, batch: v })} />
          <TextField label="Manufacturing Date" type="date" value={form.mfgDate} onChange={(v) => setForm({ ...form, mfgDate: v })} />
          <TextField label="Expiry Date" type="date" value={form.expiry} onChange={(v) => setForm({ ...form, expiry: v })} />
          <TextField label="Purchase Price" type="number" value={form.purchasePrice} onChange={(v) => setForm({ ...form, purchasePrice: v })} />
          <TextField label="Selling Price" type="number" value={form.sellingPrice} onChange={(v) => setForm({ ...form, sellingPrice: v })} />
          <TextField label="Quantity" type="number" value={form.quantity} onChange={(v) => setForm({ ...form, quantity: v })} />
          <TextField label="Minimum Stock" type="number" value={form.minStock} onChange={(v) => setForm({ ...form, minStock: v })} />
          <TextField label="Supplier" value={form.supplier} onChange={(v) => setForm({ ...form, supplier: v })} />
          <div className="sm:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description</label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>
          <div className="sm:col-span-2 flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setShowAdd(false)} className="px-4 py-2.5 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={saving} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-semibold px-5 py-2.5 rounded-lg shadow-sm">
              <PackagePlus className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Medicine'}
            </button>
          </div>
        </form>
      </Modal>

      {/* View Medicine Modal */}
      <Modal open={!!viewItem} onClose={() => setViewItem(null)} title={viewItem?.name}>
        {viewItem && (
          <div className="space-y-3 text-sm">
            <Row label="Medicine ID" value={viewItem.id} />
            <Row label="Category" value={viewItem.category} />
            <Row label="Batch Number" value={viewItem.batch} />
            <Row label="Expiry Date" value={formatDate(viewItem.expiry)} />
            <Row label="Stock" value={viewItem.stock} />
            <Row label="Price" value={`Rs. ${viewItem.price}`} />
            <Row label="Supplier" value={viewItem.supplierName || '—'} />
            <Row label="Status" value={<StatusBadge status={viewItem.status} />} />
          </div>
        )}
      </Modal>
    </div>
  );
};

const TextField = ({ label, value, onChange, type = 'text' }) => (
  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-blue-200"
    />
  </div>
);

const Row = ({ label, value }) => (
  <div className="flex items-center justify-between border-b border-gray-50 pb-2">
    <span className="text-gray-500">{label}</span>
    <span className="font-semibold text-gray-800">{value}</span>
  </div>
);

export default Medicines;