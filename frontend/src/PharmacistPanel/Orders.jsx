import React, { useMemo, useState } from 'react';
import { Search, Plus, Truck, Clock, CheckCircle2, XCircle, Eye } from 'lucide-react';
import PharmacyNavbar from './PharmacyNavbar';
import { PageHeader, StatusBadge, StatCard, Card, Modal, EmptyState } from './UI';
import { purchaseOrders as initialOrders, suppliers } from './mockData';

const emptyForm = { supplier: '', amount: '' };

const Orders = () => {
  const [orders, setOrders] = useState(initialOrders);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [viewItem, setViewItem] = useState(null);

  const statuses = ['All', 'Pending', 'Delivered', 'Cancelled'];

  const filtered = orders.filter((o) => {
    const matchesSearch = o.supplier.toLowerCase().includes(search.toLowerCase()) || o.id.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAdd = (e) => {
    e.preventDefault();
    const newOrder = {
      id: `PO-${3000 + orders.length + 1}`,
      supplier: form.supplier || 'Unnamed Supplier',
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      amount: Number(form.amount) || 0,
      status: 'Pending',
    };
    setOrders([newOrder, ...orders]);
    setForm(emptyForm);
    setShowAdd(false);
  };

  const updateStatus = (id, status) => setOrders(orders.map((o) => (o.id === id ? { ...o, status } : o)));

  const stats = useMemo(() => ({
    total: orders.length,
    pending: orders.filter((o) => o.status === 'Pending').length,
    delivered: orders.filter((o) => o.status === 'Delivered').length,
    totalValue: orders.reduce((sum, o) => sum + o.amount, 0),
  }), [orders]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <PharmacyNavbar />
      <main className="flex-1 p-6 lg:p-8 max-w-7xl mx-auto w-full">
        <PageHeader
          title="Purchase Orders"
          subtitle={`${orders.length} orders placed`}
          action={
            <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2.5 rounded-lg shadow-sm">
              <Plus className="w-4 h-4" /> New Order
            </button>
          }
        />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
          <StatCard title="TOTAL ORDERS" value={stats.total} icon={Truck} iconColor="text-blue-600" bgColor="bg-blue-50" />
          <StatCard title="PENDING" value={stats.pending} icon={Clock} iconColor="text-amber-500" bgColor="bg-amber-50" />
          <StatCard title="DELIVERED" value={stats.delivered} icon={CheckCircle2} iconColor="text-green-600" bgColor="bg-green-50" />
          <StatCard title="TOTAL VALUE" value={`Rs. ${stats.totalValue.toLocaleString()}`} icon={Truck} iconColor="text-blue-600" bgColor="bg-blue-50" />
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
                {filtered.map((o) => (
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
                            <button onClick={() => updateStatus(o.id, 'Delivered')} className="text-gray-400 hover:text-green-600"><CheckCircle2 className="w-4 h-4" /></button>
                            <button onClick={() => updateStatus(o.id, 'Cancelled')} className="text-gray-400 hover:text-red-600"><XCircle className="w-4 h-4" /></button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && <EmptyState text="No purchase orders match your search." />}
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
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Order Amount (Rs.)</label>
            <input
              type="number"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setShowAdd(false)} className="px-4 py-2.5 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-50">Cancel</button>
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg shadow-sm">Place Order</button>
          </div>
        </form>
      </Modal>

      <Modal open={!!viewItem} onClose={() => setViewItem(null)} title={viewItem?.id}>
        {viewItem && (
          <div className="space-y-3 text-sm">
            <Row label="Supplier" value={viewItem.supplier} />
            <Row label="Date" value={viewItem.date} />
            <Row label="Amount" value={`Rs. ${viewItem.amount.toLocaleString()}`} />
            <Row label="Status" value={<StatusBadge status={viewItem.status} />} />
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