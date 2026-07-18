import React, { useState } from 'react';
import { Search, Eye, HeartPulse, CalendarCheck, UserPlus2 } from 'lucide-react';
import AdminLayout from './AdminLayout';
import { PageHeader, StatCard, Card, Modal, EmptyState } from './UI';
import { patients as mockPatients } from './mockData';

const AdminPatients = () => {
  const [patients] = useState(mockPatients);
  const [search, setSearch] = useState('');
  const [viewItem, setViewItem] = useState(null);

  const filtered = patients.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.email.toLowerCase().includes(search.toLowerCase()) ||
      p.id.toLowerCase().includes(search.toLowerCase())
  );

  const stats = {
    total: patients.length,
    visitsThisMonth: patients.reduce((sum, p) => sum + p.totalVisits, 0),
    newThisMonth: patients.filter((p) => p.totalVisits <= 1).length,
  };

  return (
    <AdminLayout>
      <PageHeader title="Patients" subtitle="Directory of all registered patients" />

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <StatCard title="TOTAL PATIENTS" value={stats.total} icon={HeartPulse} iconColor="text-pink-600" bgColor="bg-pink-50" />
        <StatCard title="TOTAL VISITS" value={stats.visitsThisMonth} icon={CalendarCheck} iconColor="text-blue-600" bgColor="bg-blue-50" />
        <StatCard title="NEW PATIENTS" value={stats.newThisMonth} icon={UserPlus2} iconColor="text-green-600" bgColor="bg-green-50" />
      </div>

      <Card>
        <div className="relative mb-4 max-w-md">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, or ID..."
            className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-400 text-xs uppercase">
                <th className="pb-3 font-semibold">Patient</th>
                <th className="pb-3 font-semibold">Contact</th>
                <th className="pb-3 font-semibold">Age / Gender</th>
                <th className="pb-3 font-semibold">Last Visit</th>
                <th className="pb-3 font-semibold">Total Visits</th>
                <th className="pb-3 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-t border-gray-50">
                  <td className="py-3">
                    <p className="font-semibold text-gray-800">{p.name}</p>
                    <p className="text-xs text-gray-400">{p.id}</p>
                  </td>
                  <td className="py-3 text-gray-500">
                    <p>{p.email}</p>
                    <p className="text-xs text-gray-400">{p.phone}</p>
                  </td>
                  <td className="py-3 text-gray-500">{p.age} / {p.gender}</td>
                  <td className="py-3 text-gray-500">{p.lastVisit}</td>
                  <td className="py-3 text-gray-500">{p.totalVisits}</td>
                  <td className="py-3 text-right">
                    <button onClick={() => setViewItem(p)} className="text-blue-600 text-xs font-semibold hover:underline flex items-center gap-1 justify-end w-full">
                      <Eye className="w-3.5 h-3.5" /> View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <EmptyState text="No patients match your search." />}
        </div>
      </Card>

      <Modal open={!!viewItem} onClose={() => setViewItem(null)} title={viewItem?.name}>
        {viewItem && (
          <div className="space-y-3 text-sm">
            <Row label="Patient ID" value={viewItem.id} />
            <Row label="Email" value={viewItem.email} />
            <Row label="Phone" value={viewItem.phone} />
            <Row label="Age" value={viewItem.age} />
            <Row label="Gender" value={viewItem.gender} />
            <Row label="Last Visit" value={viewItem.lastVisit} />
            <Row label="Total Visits" value={viewItem.totalVisits} />
            <p className="text-xs text-gray-400 pt-2">
              Full medical records are managed in the Doctor Panel. This view is for administrative reference only.
            </p>
          </div>
        )}
      </Modal>
    </AdminLayout>
  );
};

const Row = ({ label, value }) => (
  <div className="flex items-center justify-between border-b border-gray-50 pb-2">
    <span className="text-gray-400">{label}</span>
    <span className="font-semibold text-gray-800">{value}</span>
  </div>
);

export default AdminPatients;
