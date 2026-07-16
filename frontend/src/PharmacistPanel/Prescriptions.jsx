import React, { useMemo, useState } from 'react';
import { Search, Eye, CheckCircle2, XCircle, ClipboardList, Clock, CheckCheck, Ban } from 'lucide-react';
import PharmacyNavbar from './PharmacyNavbar';
import { PageHeader, StatusBadge, StatCard, Card, Modal, EmptyState } from './UI';
import { todaysPrescriptionRequests as initialRequests, prescriptionMedicines } from './mockData';

const Prescriptions = () => {
  const [requests, setRequests] = useState(initialRequests);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [viewItem, setViewItem] = useState(null);

  const statuses = ['All', 'Pending', 'Completed', 'Cancelled'];

  const filtered = requests.filter((r) => {
    const matchesSearch =
      r.patient.toLowerCase().includes(search.toLowerCase()) ||
      r.id.toLowerCase().includes(search.toLowerCase()) ||
      r.doctor.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const updateStatus = (id, status) => {
    setRequests(requests.map((r) => (r.id === id ? { ...r, status } : r)));
    setViewItem((v) => (v && v.id === id ? { ...v, status } : v));
  };

  const stats = useMemo(() => ({
    total: requests.length,
    pending: requests.filter((r) => r.status === 'Pending').length,
    completed: requests.filter((r) => r.status === 'Completed').length,
    cancelled: requests.filter((r) => r.status === 'Cancelled').length,
  }), [requests]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <PharmacyNavbar />
      <main className="flex-1 p-6 lg:p-8 max-w-7xl mx-auto w-full">
        <PageHeader title="Prescriptions" subtitle={`${requests.length} prescription requests`} />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
          <StatCard title="TOTAL REQUESTS" value={stats.total} icon={ClipboardList} iconColor="text-blue-600" bgColor="bg-blue-50" />
          <StatCard title="PENDING" value={stats.pending} icon={Clock} iconColor="text-amber-500" bgColor="bg-amber-50" />
          <StatCard title="COMPLETED" value={stats.completed} icon={CheckCheck} iconColor="text-green-600" bgColor="bg-green-50" />
          <StatCard title="CANCELLED" value={stats.cancelled} icon={Ban} iconColor="text-red-500" bgColor="bg-red-50" />
        </div>

        <Card>
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by patient, doctor, or RX ID..."
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
                  <th className="pb-3 font-semibold">RX ID</th>
                  <th className="pb-3 font-semibold">Patient</th>
                  <th className="pb-3 font-semibold">Doctor</th>
                  <th className="pb-3 font-semibold">Date</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => (
                  <tr key={r.id} className="border-b border-gray-50 hover:bg-gray-50/60">
                    <td className="py-3 font-semibold text-gray-800">{r.id}</td>
                    <td className="py-3 text-gray-700">{r.patient}</td>
                    <td className="py-3 text-gray-500">{r.doctor}</td>
                    <td className="py-3 text-gray-500">{r.date}</td>
                    <td className="py-3"><StatusBadge status={r.status} /></td>
                    <td className="py-3">
                      <div className="flex items-center justify-end gap-3">
                        <button onClick={() => setViewItem(r)} className="text-gray-400 hover:text-blue-600"><Eye className="w-4 h-4" /></button>
                        {r.status === 'Pending' && (
                          <>
                            <button onClick={() => updateStatus(r.id, 'Completed')} className="text-gray-400 hover:text-green-600"><CheckCircle2 className="w-4 h-4" /></button>
                            <button onClick={() => updateStatus(r.id, 'Cancelled')} className="text-gray-400 hover:text-red-600"><XCircle className="w-4 h-4" /></button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && <EmptyState text="No prescriptions match your search." />}
          </div>
        </Card>
      </main>

      <Modal open={!!viewItem} onClose={() => setViewItem(null)} title={viewItem?.id} wide>
        {viewItem && (
          <div className="space-y-5 text-sm">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-400 mb-1">Patient</p>
                <p className="font-semibold text-gray-800">{viewItem.patient}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">Doctor</p>
                <p className="font-semibold text-gray-800">{viewItem.doctor}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">Date</p>
                <p className="font-semibold text-gray-800">{viewItem.date}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">Status</p>
                <StatusBadge status={viewItem.status} />
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase mb-2">Prescribed Medicines</p>
              {prescriptionMedicines[viewItem.id] ? (
                <div className="border border-gray-100 rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr className="text-left text-gray-400 text-xs uppercase">
                        <th className="py-2 px-3 font-semibold">Medicine</th>
                        <th className="py-2 px-3 font-semibold">Dosage</th>
                        <th className="py-2 px-3 font-semibold">Qty</th>
                        <th className="py-2 px-3 font-semibold">Frequency</th>
                        <th className="py-2 px-3 font-semibold">Duration</th>
                      </tr>
                    </thead>
                    <tbody>
                      {prescriptionMedicines[viewItem.id].map((m, idx) => (
                        <tr key={idx} className="border-t border-gray-50">
                          <td className="py-2 px-3 font-medium text-gray-800">{m.name}</td>
                          <td className="py-2 px-3 text-gray-500">{m.dosage}</td>
                          <td className="py-2 px-3 text-gray-500">{m.qty}</td>
                          <td className="py-2 px-3 text-gray-500">{m.frequency}</td>
                          <td className="py-2 px-3 text-gray-500">{m.duration}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-400 text-sm">No medicine details available for this prescription.</p>
              )}
            </div>

            {viewItem.status === 'Pending' && (
              <div className="flex justify-end gap-3 pt-2">
                <button onClick={() => updateStatus(viewItem.id, 'Cancelled')} className="px-4 py-2.5 rounded-lg text-sm font-semibold text-red-600 hover:bg-red-50">Cancel Request</button>
                <button onClick={() => updateStatus(viewItem.id, 'Completed')} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg shadow-sm">
                  <CheckCircle2 className="w-4 h-4" /> Mark as Dispensed
                </button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Prescriptions;