import React, { useMemo, useState } from 'react';
import { Search, Boxes, AlertTriangle, XCircle, TrendingUp, PlusCircle, MinusCircle } from 'lucide-react';
import PharmacyNavbar from './PharmacyNavbar';
import { PageHeader, StatusBadge, StatCard, Card, Modal, EmptyState } from './UI';
import { medicinesList as initialMedicines } from './mockData';

const deriveStatus = (stock) => {
  if (stock === 0) return 'Out of Stock';
  if (stock < 100) return 'Low Stock';
  return 'In Stock';
};

const Inventory = () => {
  const [medicines, setMedicines] = useState(initialMedicines);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [adjustItem, setAdjustItem] = useState(null);
  const [adjustAmount, setAdjustAmount] = useState('');

  const statuses = ['All', 'In Stock', 'Low Stock', 'Out of Stock', 'Expiring Soon'];

  const filtered = medicines.filter((m) => {
    const matchesSearch = m.name.toLowerCase().includes(search.toLowerCase()) || m.id.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || m.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const applyAdjustment = (type) => {
    const amt = Number(adjustAmount) || 0;
    if (!adjustItem || amt <= 0) return;
    setMedicines(medicines.map((m) => {
      if (m.id !== adjustItem.id) return m;
      const newStock = type === 'add' ? m.stock + amt : Math.max(0, m.stock - amt);
      const status = m.status === 'Expiring Soon' ? m.status : deriveStatus(newStock);
      return { ...m, stock: newStock, status };
    }));
    setAdjustAmount('');
    setAdjustItem(null);
  };

  const stats = useMemo(() => ({
    totalStock: medicines.reduce((sum, m) => sum + m.stock, 0),
    lowStock: medicines.filter((m) => m.status === 'Low Stock').length,
    outOfStock: medicines.filter((m) => m.status === 'Out of Stock').length,
    value: medicines.reduce((sum, m) => sum + m.stock * m.price, 0),
  }), [medicines]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <PharmacyNavbar />
      <main className="flex-1 p-6 lg:p-8 max-w-7xl mx-auto w-full">
        <PageHeader title="Inventory" subtitle="Track and adjust stock levels across your catalog" />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
          <StatCard title="TOTAL UNITS" value={stats.totalStock.toLocaleString()} icon={Boxes} iconColor="text-blue-600" bgColor="bg-blue-50" />
          <StatCard title="LOW STOCK" value={stats.lowStock} icon={AlertTriangle} iconColor="text-amber-500" bgColor="bg-amber-50" />
          <StatCard title="OUT OF STOCK" value={stats.outOfStock} icon={XCircle} iconColor="text-red-500" bgColor="bg-red-50" />
          <StatCard title="INVENTORY VALUE" value={`Rs. ${stats.value.toLocaleString()}`} icon={TrendingUp} iconColor="text-green-600" bgColor="bg-green-50" />
        </div>

        <Card>
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by medicine name or ID..."
                className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-blue-200"
            >
              {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
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
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold text-right">Adjust</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((m) => (
                  <tr key={m.id} className="border-b border-gray-50 hover:bg-gray-50/60">
                    <td className="py-3 font-semibold text-gray-800">
                      <div>{m.name}</div>
                      <div className="text-xs text-gray-400 font-normal">{m.id}</div>
                    </td>
                    <td className="py-3 text-gray-500">{m.category}</td>
                    <td className="py-3 text-gray-500">{m.batch}</td>
                    <td className="py-3 text-gray-500">{m.expiry}</td>
                    <td className="py-3 text-gray-700 font-semibold">{m.stock}</td>
                    <td className="py-3"><StatusBadge status={m.status} /></td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => setAdjustItem(m)}
                        className="text-xs font-semibold text-blue-600 hover:underline"
                      >
                        Adjust Stock
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && <EmptyState text="No inventory items match your search." />}
          </div>
        </Card>
      </main>

      <Modal open={!!adjustItem} onClose={() => { setAdjustItem(null); setAdjustAmount(''); }} title={`Adjust Stock — ${adjustItem?.name || ''}`}>
        {adjustItem && (
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3">
              <span className="text-sm text-gray-500">Current stock</span>
              <span className="text-lg font-bold text-gray-800">{adjustItem.stock} units</span>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Amount</label>
              <input
                type="number"
                min="0"
                value={adjustAmount}
                onChange={(e) => setAdjustAmount(e.target.value)}
                placeholder="Enter quantity"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => applyAdjustment('remove')}
                className="flex-1 flex items-center justify-center gap-2 border border-red-200 text-red-600 hover:bg-red-50 text-sm font-semibold px-4 py-2.5 rounded-lg"
              >
                <MinusCircle className="w-4 h-4" /> Remove Stock
              </button>
              <button
                onClick={() => applyAdjustment('add')}
                className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2.5 rounded-lg shadow-sm"
              >
                <PlusCircle className="w-4 h-4" /> Add Stock
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Inventory;