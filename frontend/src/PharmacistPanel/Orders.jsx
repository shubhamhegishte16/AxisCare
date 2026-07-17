import React, { useEffect, useState, useCallback } from 'react';
import { Search, Plus, Trash2, Truck, Clock, CheckCircle2, XCircle, Eye } from 'lucide-react';
import PharmacyNavbar from './PharmacyNavbar';
import { PageHeader, StatusBadge, StatCard, Card, Modal, EmptyState } from './UI';
import { pharmacyService } from '../services/pharmacyService';

const emptyItem = { medicine: '', name: '', quantity: 1, unitPrice: 0 };
const emptyForm = { supplier: '', items: [{ ...emptyItem }] };

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, delivered: 0, totalValue: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [viewItem, setViewItem] = useState(null);
  const [saving, setSaving] = useState(false);

  const statuses = ['All', 'Pending', 'Delivered', 'Cancelled'];

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [orderRes, statRes, supRes, medRes] = await Promise.all([
        pharmacyService.getOrders({ search: search || undefined, status: statusFilter !== 'All' ? statusFilter : undefined }),
        pharmacyService.getOrderStats(),
        pharmacyService.getSuppliers(),
        pharmacyService.getMedicines(),
      ]);
      setOrders(orderRes.data || []);
      setStats(statRes.data || {});
      setSuppliers(supRes.data || []);
      setMedicines(medRes.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  useEffect(() => {
    const timer = setTimeout(loadData, 300);
    return () => clearTimeout(timer);
  }, [loadData]);

  const orderAmount = form.items.reduce(
    (sum, it) => sum + (Number(it.quantity) || 0) * (Number(it.unitPrice) || 0),
    0
  );

  const updateItem = (idx, patch) => {
    setForm((f) => {
      const items = [...f.items];
      items[idx] = { ...items[idx], ...patch };
      return { ...f, items };
    });
  };

  const handleMedicineSelect = (idx, medicineId) => {
    const med = medicines.find((m) => m._id === medicineId);
    updateItem(idx, {
      medicine: medicineId,
      name: med ? med.name : '',
      unitPrice: med ? (med.purchasePrice ?? med.price ?? 0) : 0,
    });
  };

  const addItemRow = () => setForm((f) => ({ ...f, items: [...f.items, { ...emptyItem }] }));

  const removeItemRow = (idx) =>
    setForm((f) => ({ ...f, items: f.items.filter((_, i) => i !== idx) }));

  const handleAdd = async (e) => {
    e.preventDefault();
    setError('');

    const items = form.items
      .filter((it) => it.name && Number(it.quantity) > 0)
      .map((it) => ({
        medicine: it.medicine || undefined,
        name: it.name,
        quantity: Number(it.quantity),
        unitPrice: Number(it.unitPrice) || 0,
      }));

    if (!form.supplier) {
      setError('Please select a supplier');
      return;
    }
    if (items.length === 0) {
      setError('Add at least one medicine to the order');
      return;
    }

    setSaving(true);
    try {
      await pharmacyService.createOrder({
        supplier: form.supplier,
        items,
        amount: orderAmount,
      });
      setForm(emptyForm);
      setShowAdd(false);
      await loadData();
    } catch (err) {
      setError(err.message || 'Failed to place order');
    } finally {
      setSaving(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await pharmacyService.updateOrderStatus(id, status);
      setViewItem((v) => (v && v._id === id ? { ...v, status } : v));
      await loadData();
    } catch (err) {
      setError(err.message || 'Failed to update order status');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <PharmacyNavbar />
      <main className="flex-1 p-6 lg:p-8 max-w-7xl mx-auto w-full">
        <PageHeader
          title="Purchase Orders"
          subtitle={`${stats.total || 0} orders placed`}
          action={
            <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2.5 rounded-lg shadow-sm">
              <Plus className="w-4 h-4" /> New Order
            </button>
          }
        />

        {error && <div className="mb-4 text-sm text-red-600 bg-red-50 px-4 py-2.5 rounded-lg">{error}</div>}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
          <StatCard title="TOTAL ORDERS" value={stats.total || 0} icon={Truck} iconColor="text-blue-600" bgColor="bg-blue-50" />
          <StatCard title="PENDING" value={stats.pending || 0} icon={Clock} iconColor="text-amber-500" bgColor="bg-amber-50" />
          <StatCard title="DELIVERED" value={stats.delivered || 0} icon={CheckCircle2} iconColor="text-green-600" bgColor="bg-green-50" />
          <StatCard title="TOTAL VALUE" value={`Rs. ${(stats.totalValue || 0).toLocaleString()}`} icon={Truck} iconColor="text-blue-600" bgColor="bg-blue-50" />
        </div>

        <Card>
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by supplier or order ID..."
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
                  <th className="pb-3 font-semibold">Order ID</th>
                  <th className="pb-3 font-semibold">Supplier</th>
                  <th className="pb-3 font-semibold">Date</th>
                  <th className="pb-3 font-semibold">Amount</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id} className="border-b border-gray-50 hover:bg-gray-50/60">
                    <td className="py-3 font-semibold text-gray-800">{o.id}</td>
                    <td className="py-3 text-gray-700">{o.supplier}</td>
                    <td className="py-3 text-gray-500">{o.date}</td>
                    <td className="py-3 text-gray-500">Rs. {o.amount.toLocaleString()}</td>
                    <td className="py-3"><StatusBadge status={o.status} /></td>
                    <td className="py-3">
                      <div className="flex items-center justify-end gap-3">
                        <button onClick={() => setViewItem(o)} className="text-gray-400 hover:text-blue-600"><Eye className="w-4 h-4" /></button>
                        {o.status === 'Pending' && (
                          <>
                            <button onClick={() => updateStatus(o._id, 'Delivered')} className="text-gray-400 hover:text-green-600"><CheckCircle2 className="w-4 h-4" /></button>
                            <button onClick={() => updateStatus(o._id, 'Cancelled')} className="text-gray-400 hover:text-red-600"><XCircle className="w-4 h-4" /></button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!loading && orders.length === 0 && <EmptyState text="No purchase orders match your search." />}
            {loading && <div className="py-10 text-center text-sm text-gray-400">Loading...</div>}
          </div>
        </Card>
      </main>

      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="New Purchase Order">
        <form onSubmit={handleAdd} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Supplier</label>
            <select
              value={form.supplier}
              onChange={(e) => setForm({ ...form, supplier: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-blue-200"
            >
              <option value="">Select a supplier</option>
              {suppliers.map((s) => <option key={s.id} value={s.name}>{s.name}</option>)}
            </select>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-sm font-semibold text-gray-700">Medicines to Order</label>
              <button type="button" onClick={addItemRow} className="text-blue-600 text-xs font-semibold hover:underline flex items-center gap-1">
                <Plus className="w-3.5 h-3.5" /> Add item
              </button>
            </div>

            <div className="space-y-2">
              {form.items.map((item, idx) => (
                <div key={idx} className="grid grid-cols-12 gap-2 items-center">
                  <select
                    value={item.medicine}
                    onChange={(e) => handleMedicineSelect(idx, e.target.value)}
                    className="col-span-6 px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-blue-200"
                  >
                    <option value="">Select medicine</option>
                    {medicines.map((m) => <option key={m._id} value={m._id}>{m.name}</option>)}
                  </select>
                  <input
                    type="number"
                    min="1"
                    placeholder="Qty"
                    value={item.quantity}
                    onChange={(e) => updateItem(idx, { quantity: e.target.value })}
                    className="col-span-2 px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-blue-200"
                  />
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Unit Rs."
                    value={item.unitPrice}
                    onChange={(e) => updateItem(idx, { unitPrice: e.target.value })}
                    className="col-span-3 px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-blue-200"
                  />
                  <button
                    type="button"
                    onClick={() => removeItemRow(idx)}
                    disabled={form.items.length === 1}
                    className="col-span-1 text-gray-400 hover:text-red-600 disabled:opacity-30"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <span className="text-sm font-semibold text-gray-600">Order Total</span>
            <span className="text-lg font-bold text-gray-900">Rs. {orderAmount.toLocaleString()}</span>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setShowAdd(false)} className="px-4 py-2.5 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={saving} className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-semibold px-5 py-2.5 rounded-lg shadow-sm">
              {saving ? 'Placing...' : 'Place Order'}
            </button>
          </div>
        </form>
      </Modal>

      <Modal open={!!viewItem} onClose={() => setViewItem(null)} title={viewItem?.id}>
        {viewItem && (
          <div className="space-y-4 text-sm">
            <div className="space-y-3">
              <Row label="Supplier" value={viewItem.supplier} />
              <Row label="Date" value={viewItem.date} />
              <Row label="Status" value={<StatusBadge status={viewItem.status} />} />
            </div>

            {viewItem.items && viewItem.items.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase mb-2">Medicines Ordered</p>
                <div className="border border-gray-100 rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr className="text-left text-gray-400 text-xs uppercase">
                        <th className="py-2 px-3 font-semibold">Medicine</th>
                        <th className="py-2 px-3 font-semibold text-right">Qty</th>
                        <th className="py-2 px-3 font-semibold text-right">Unit Price</th>
                        <th className="py-2 px-3 font-semibold text-right">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {viewItem.items.map((it, idx) => (
                        <tr key={idx} className="border-t border-gray-50">
                          <td className="py-2 px-3 font-medium text-gray-800">{it.name}</td>
                          <td className="py-2 px-3 text-gray-500 text-right">{it.quantity}</td>
                          <td className="py-2 px-3 text-gray-500 text-right">Rs. {it.unitPrice.toLocaleString()}</td>
                          <td className="py-2 px-3 text-gray-700 text-right font-semibold">Rs. {(it.quantity * it.unitPrice).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <span className="font-semibold text-gray-600">Total Amount</span>
              <span className="text-lg font-bold text-gray-900">Rs. {viewItem.amount.toLocaleString()}</span>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

const Row = ({ label, value }) => (
  <div className="flex items-center justify-between border-b border-gray-50 pb-2">
    <span className="text-gray-500">{label}</span>
    <span className="font-semibold text-gray-800">{value}</span>
  </div>
);

export default Orders;