import React, { useState } from 'react';
import { Receipt, Search, Plus, Download } from 'lucide-react';
import ReceptionistLayout from './ReceptionistLayout';

const invoices = [
  { id: 'INV-2291', patient: 'Rajesh Kumar', amount: 1800, date: '12 Jul 2026', status: 'Paid', method: 'UPI' },
  { id: 'INV-2292', patient: 'Priya Mehta', amount: 3200, date: '14 Jul 2026', status: 'Paid', method: 'Card' },
  { id: 'INV-2293', patient: 'Amit Verma', amount: 950, date: '15 Jul 2026', status: 'Pending', method: '—' },
  { id: 'INV-2294', patient: 'Sunita Rao', amount: 2100, date: '10 Jul 2026', status: 'Paid', method: 'Cash' },
  { id: 'INV-2295', patient: 'Karan Malhotra', amount: 500, date: '16 Jul 2026', status: 'Overdue', method: '—' },
];

const statusStyles = {
  Paid: 'bg-emerald-50 text-emerald-600',
  Pending: 'bg-amber-50 text-amber-600',
  Overdue: 'bg-red-50 text-red-500',
};

const Billing = () => {
  const [search, setSearch] = useState('');

  const filtered = invoices.filter(
    (i) => i.patient.toLowerCase().includes(search.toLowerCase()) || i.id.toLowerCase().includes(search.toLowerCase())
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
        <button className="flex items-center gap-2 bg-[#2563EB] hover:bg-blue-700 text-white text-sm font-bold px-4 py-2.5 rounded-xl transition-colors">
          <Plus className="w-4 h-4" /> New Invoice
        </button>
      </div>

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
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">Invoices Today</p>
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
                  <tr key={i.id} className="border-t border-slate-50 hover:bg-[#F8FAFC]/70 transition-colors">
                    <td className="px-5 py-3 font-semibold text-slate-500 whitespace-nowrap">{i.id}</td>
                    <td className="px-5 py-3 font-bold text-slate-800 whitespace-nowrap">{i.patient}</td>
                    <td className="px-5 py-3 font-bold text-slate-800 whitespace-nowrap">₹{i.amount.toLocaleString('en-IN')}</td>
                    <td className="px-5 py-3 text-slate-500 whitespace-nowrap">{i.date}</td>
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
      </div>
    </ReceptionistLayout>
  );
};

export default Billing;
