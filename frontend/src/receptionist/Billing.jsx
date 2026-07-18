import React, { useState, useEffect } from 'react';
import { Search, Plus, Download, Loader2, X } from 'lucide-react';
import ReceptionistLayout from './ReceptionistLayout';
import { receptionistService } from '../services/receptionistService';

const statusStyles = {
  Paid: 'bg-emerald-50 text-emerald-600',
  Pending: 'bg-amber-50 text-amber-600',
  Overdue: 'bg-red-50 text-red-500',
};

const emptyInvoice = { patientName: '', department: '', amount: '', method: 'Cash', status: 'Paid' };

const Billing = () => {
  const [search, setSearch] = useState('');
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyInvoice);
  const [creating, setCreating] = useState(false);

  const fetchInvoices = async () => {
    try {
      const res = await receptionistService.getInvoices();
      if (res.success) setInvoices(res.data);
    } catch (err) {
      setError(err.message || 'Failed to load invoices.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.patientName || !form.amount) return;
    setCreating(true);
    try {
      const res = await receptionistService.createInvoice({ ...form, amount: Number(form.amount) });
      if (res.success) {
        setInvoices((prev) => [res.data, ...prev]);
        setForm(emptyInvoice);
        setShowForm(false);
      }
    } catch (err) {
      setError(err.message || 'Failed to create invoice.');
    } finally {
      setCreating(false);
    }
  };

  const filtered = invoices.filter(
    (i) => i.patientName.toLowerCase().includes(search.toLowerCase()) || i.invoiceId.toLowerCase().includes(search.toLowerCase())
  );

  const totalCollected = invoices.filter((i) => i.status === 'Paid').reduce((s, i) => s + i.amount, 0);
  const totalPending = invoices.filter((i) => i.status !== 'Paid').reduce((s, i) => s + i.amount, 0);

  return (
    <ReceptionistLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">Billing</h1>
          <p className="text-sm text-slate-400 mt-1">Manage patient invoices and payments.</p>
        </div>
        <button
          onClick={() => setShowForm((s) => !s)}
          className="flex items-center gap-2 bg-[#2563EB] hover:bg-blue-700 text-white text-sm font-bold px-4 py-2.5 rounded-xl transition-colors"
        >
          <Plus className="w-4 h-4" /> New Invoice
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 text-sm font-semibold px-4 py-3 rounded-xl mb-4">{error}</div>
      )}

      {showForm && (
        <form onSubmit={handleCreate} className="bg-white rounded-[18px] border border-slate-100 shadow-sm p-5 mb-6 flex flex-col sm:flex-row gap-3 items-end flex-wrap">
          <div className="flex-1 min-w-[160px]">
            <label className="block text-xs font-bold text-slate-500 mb-1.5">Patient Name *</label>
            <input
              value={form.patientName}
              onChange={(e) => setForm({ ...form, patientName: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-[#F8FAFC] text-sm outline-none focus:ring-2 focus:ring-[#2563EB]/20"
              required
            />
          </div>
          <div className="flex-1 min-w-[140px]">
            <label className="block text-xs font-bold text-slate-500 mb-1.5">Department</label>
            <input
              value={form.department}
              onChange={(e) => setForm({ ...form, department: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-[#F8FAFC] text-sm outline-none focus:ring-2 focus:ring-[#2563EB]/20"
            />
          </div>
          <div className="w-32">
            <label className="block text-xs font-bold text-slate-500 mb-1.5">Amount (₹) *</label>
            <input
              type="number"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-[#F8FAFC] text-sm outline-none focus:ring-2 focus:ring-[#2563EB]/20"
              required
            />
          </div>
          <div className="w-32">
            <label className="block text-xs font-bold text-slate-500 mb-1.5">Method</label>
            <select
              value={form.method}
              onChange={(e) => setForm({ ...form, method: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-[#F8FAFC] text-sm outline-none focus:ring-2 focus:ring-[#2563EB]/20"
            >
              <option>Cash</option>
              <option>Card</option>
              <option>UPI</option>
              <option>Insurance</option>
              <option>Not Paid</option>
            </select>
          </div>
          <div className="w-32">
            <label className="block text-xs font-bold text-slate-500 mb-1.5">Status</label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-[#F8FAFC] text-sm outline-none focus:ring-2 focus:ring-[#2563EB]/20"
            >
              <option>Paid</option>
              <option>Pending</option>
              <option>Overdue</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button type="submit" disabled={creating} className="bg-[#2563EB] hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-colors">
              {creating ? 'Saving…' : 'Create'}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500">
              <X className="w-4 h-4" />
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6">
        <div className="bg-white rounded-[18px] border border-slate-100 shadow-sm p-5">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">Total Collected</p>
          <p className="text-3xl font-extrabold text-slate-800">₹{totalCollected.toLocaleString('en-IN')}</p>
        </div>
        <div className="bg-white rounded-[18px] border border-slate-100 shadow-sm p-5">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">Pending / Overdue</p>
          <p className="text-3xl font-extrabold text-amber-600">₹{totalPending.toLocaleString('en-IN')}</p>
        </div>
        <div className="bg-white rounded-[18px] border border-slate-100 shadow-sm p-5">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">Invoices Total</p>
          <p className="text-3xl font-extrabold text-slate-800">{invoices.length}</p>
        </div>
      </div>

      <div className="bg-white rounded-[18px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100">
          <div className="relative max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search invoices by patient or ID..."
              className="w-full pl-11 pr-4 py-2.5 rounded-full bg-[#F8FAFC] border border-slate-100 text-sm outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]/40 transition-all"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center gap-2 py-16">
            <Loader2 className="w-5 h-5 text-[#2563EB] animate-spin" />
            <span className="text-sm text-slate-400">Loading invoices...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-slate-400 uppercase tracking-wide bg-[#F8FAFC]">
                  <th className="px-5 py-3 font-bold">Invoice ID</th>
                  <th className="px-5 py-3 font-bold">Patient</th>
                  <th className="px-5 py-3 font-bold">Amount</th>
                  <th className="px-5 py-3 font-bold">Date</th>
                  <th className="px-5 py-3 font-bold">Method</th>
                  <th className="px-5 py-3 font-bold">Status</th>
                  <th className="px-5 py-3 font-bold">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={7} className="py-10 text-center text-sm text-slate-400">No invoices found</td></tr>
                ) : (
                  filtered.map((i) => (
                    <tr key={i._id} className="border-t border-slate-50 hover:bg-[#F8FAFC]/70 transition-colors">
                      <td className="px-5 py-3 font-semibold text-slate-500 whitespace-nowrap">{i.invoiceId}</td>
                      <td className="px-5 py-3 font-bold text-slate-800 whitespace-nowrap">{i.patientName}</td>
                      <td className="px-5 py-3 font-bold text-slate-800 whitespace-nowrap">₹{i.amount.toLocaleString('en-IN')}</td>
                      <td className="px-5 py-3 text-slate-500 whitespace-nowrap">{new Date(i.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                      <td className="px-5 py-3 text-slate-500 whitespace-nowrap">{i.method}</td>
                      <td className="px-5 py-3">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${statusStyles[i.status]}`}>{i.status}</span>
                      </td>
                      <td className="px-5 py-3">
                        <button className="flex items-center gap-1.5 text-xs font-bold text-[#2563EB] hover:underline whitespace-nowrap">
                          <Download className="w-3.5 h-3.5" /> Receipt
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </ReceptionistLayout>
  );
};

export default Billing;
