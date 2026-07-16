import React, { useMemo, useState } from 'react';
import { Search, Plus, Receipt, IndianRupee, Clock, CheckCircle2 } from 'lucide-react';
import PharmacyNavbar from './PharmacyNavbar';
import { PageHeader, StatusBadge, StatCard, Card, Modal, EmptyState } from './UI';
import { bills as initialBills } from './mockData';

const emptyForm = { patient: '', amount: '' };

const Billing = () => {
  const [bills, setBills] = useState(initialBills);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const statuses = ['All', 'Paid', 'Pending'];

  const filtered = bills.filter((b) => {
    const matchesSearch = b.patient.toLowerCase().includes(search.toLowerCase()) || b.id.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAdd = (e) => {
    e.preventDefault();
    const newBill = {
      id: `BILL-${9000 + bills.length + 1}`,
      patient: form.patient || 'Walk-in Patient',
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      amount: Number(form.amount) || 0,
      status: 'Pending',
    };
    setBills([newBill, ...bills]);
    setForm(emptyForm);
    setShowAdd(false);
  };

  const markPaid = (id) => setBills(bills.map((b) => (b.id === id ? { ...b, status: 'Paid' } : b)));

  const stats = useMemo(() => ({
    total: bills.length,
    paid: bills.filter((b) => b.status === 'Paid').length,
    pending: bills.filter((b) => b.status === 'Pending').length,
    revenue: bills.filter((b) => b.status === 'Paid').reduce((sum, b) => sum + b.amount, 0),
  }), [bills]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <PharmacyNavbar />
      <main className="flex-1 p-6 lg:p-8 max-w-7xl mx-auto w-full">
        <PageHeader
          title="Billing"
          subtitle={`${bills.length} bills generated`}
          action={
            <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2.5 rounded-lg shadow-sm">
              <Plus className="w-4 h-4" /> Create Bill
            </button>
          }
        />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
          <StatCard title="TOTAL BILLS" value={stats.total} icon={Receipt} iconColor="text-blue-600" bgColor="bg-blue-50" />
          <StatCard title="PAID" value={stats.paid} icon={CheckCircle2} iconColor="text-green-600" bgColor="bg-green-50" />
          <StatCard title="PENDING" value={stats.pending} icon={Clock} iconColor="text-amber-500" bgColor="bg-amber-50" />
          <StatCard title="REVENUE COLLECTED" value={`Rs. ${stats.revenue.toLocaleString()}`} icon={IndianRupee} iconColor="text-green-600" bgColor="bg-green-50" />
        </div>

        <Card>
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by patient or bill ID..."
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
                  <th className="pb-3 font-semibold">Bill ID</th>
                  <th className="pb-3 font-semibold">Patient</th>
                  <th className="pb-3 font-semibold">Date</th>
                  <th className="pb-3 font-semibold">Amount</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((b) => (
                  <tr key={b.id} className="border-b border-gray-50 hover:bg-gray-50/60">
                    <td className="py-3 font-semibold text-gray-800">{b.id}</td>
                    <td className="py-3 text-gray-700">{b.patient}</td>
                    <td className="py-3 text-gray-500">{b.date}</td>
                    <td className="py-3 text-gray-500">Rs. {b.amount.toLocaleString()}</td>
                    <td className="py-3"><StatusBadge status={b.status} /></td>
                    <td className="py-3 text-right">
                      {b.status === 'Pending' && (
                        <button onClick={() => markPaid(b.id)} className="text-xs font-semibold text-blue-600 hover:underline">Mark as Paid</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && <EmptyState text="No bills match your search." />}
          </div>
        </Card>
      </main>

      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Create Bill">
        <form onSubmit={handleAdd} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Patient Name</label>
            <input
              value={form.patient}
              onChange={(e) => setForm({ ...form, patient: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Amount (Rs.)</label>
            <input
              type="number"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setShowAdd(false)} className="px-4 py-2.5 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-50">Cancel</button>
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg shadow-sm">Generate Bill</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Billing;