import React, { useState } from 'react';
import { Search, CalendarDays, CalendarCheck, Clock, XCircle } from 'lucide-react';
import AdminLayout from './AdminLayout';
import { PageHeader, StatCard, Card, StatusBadge, EmptyState } from './UI';
import { appointments as mockAppointments } from './mockData';

const statuses = ['All', 'Pending', 'Scheduled', 'Completed', 'Cancelled'];

const AdminAppointments = () => {
  const [appointments] = useState(mockAppointments);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filtered = appointments.filter((a) => {
    const matchesSearch =
      a.patient.toLowerCase().includes(search.toLowerCase()) ||
      a.doctor.toLowerCase().includes(search.toLowerCase()) ||
      a.id.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || a.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: appointments.length,
    scheduled: appointments.filter((a) => a.status === 'Scheduled').length,
    completed: appointments.filter((a) => a.status === 'Completed').length,
    cancelled: appointments.filter((a) => a.status === 'Cancelled').length,
  };

  return (
    <AdminLayout>
      <PageHeader title="Appointments" subtitle="System-wide view of all appointments across departments" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="TOTAL" value={stats.total} icon={CalendarDays} iconColor="text-blue-600" bgColor="bg-blue-50" />
        <StatCard title="SCHEDULED" value={stats.scheduled} icon={Clock} iconColor="text-indigo-600" bgColor="bg-indigo-50" />
        <StatCard title="COMPLETED" value={stats.completed} icon={CalendarCheck} iconColor="text-green-600" bgColor="bg-green-50" />
        <StatCard title="CANCELLED" value={stats.cancelled} icon={XCircle} iconColor="text-red-500" bgColor="bg-red-50" />
      </div>

      <Card>
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by patient, doctor, or appointment ID..."
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
              <tr className="text-left text-gray-400 text-xs uppercase">
                <th className="pb-3 font-semibold">ID</th>
                <th className="pb-3 font-semibold">Patient</th>
                <th className="pb-3 font-semibold">Doctor</th>
                <th className="pb-3 font-semibold">Department</th>
                <th className="pb-3 font-semibold">Date & Time</th>
                <th className="pb-3 font-semibold">Type</th>
                <th className="pb-3 font-semibold text-right">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a) => (
                <tr key={a.id} className="border-t border-gray-50">
                  <td className="py-3 font-semibold text-gray-800">{a.id}</td>
                  <td className="py-3 text-gray-600">{a.patient}</td>
                  <td className="py-3 text-gray-600">{a.doctor}</td>
                  <td className="py-3 text-gray-500">{a.department}</td>
                  <td className="py-3 text-gray-500">{a.date} · {a.time}</td>
                  <td className="py-3 text-gray-500">{a.type}</td>
                  <td className="py-3 text-right"><StatusBadge status={a.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <EmptyState text="No appointments match your search." />}
        </div>
      </Card>
    </AdminLayout>
  );
};

export default AdminAppointments;
