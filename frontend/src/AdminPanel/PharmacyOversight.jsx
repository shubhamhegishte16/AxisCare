import React, { useEffect, useState } from 'react';
import { Package, AlertTriangle, ClipboardList, IndianRupee } from 'lucide-react';
import AdminLayout from './AdminLayout';
import { PageHeader, StatCard, Card } from './UI';
import { adminService } from '../services/adminService';

const AdminPharmacyOversight = () => {
  const [snapshot, setSnapshot] = useState({ totalMedicines: 0, lowStock: 0, pendingPrescriptions: 0, salesToday: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const res = await adminService.getPharmacyOverview();
        if (!cancelled) {
          if (res.success) {
            setSnapshot(res.data);
            setError(null);
          } else {
            setError(res.message || 'Failed to load pharmacy overview');
          }
        }
      } catch (err) {
        if (!cancelled) setError(err.response?.data?.message || err.message || 'Failed to load pharmacy overview');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64 text-gray-500">Loading pharmacy overview...</div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center h-64 gap-2 text-center">
          <p className="text-red-500 font-semibold">Couldn't load pharmacy overview</p>
          <p className="text-gray-400 text-sm">{error}</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <PageHeader title="Pharmacy Overview" subtitle="Read-only snapshot of pharmacy operations" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="TOTAL MEDICINES" value={snapshot.totalMedicines.toLocaleString()} icon={Package} iconColor="text-blue-600" bgColor="bg-blue-50" />
        <StatCard title="LOW STOCK ITEMS" value={snapshot.lowStock} icon={AlertTriangle} iconColor="text-amber-500" bgColor="bg-amber-50" />
        <StatCard title="PENDING PRESCRIPTIONS" value={snapshot.pendingPrescriptions} icon={ClipboardList} iconColor="text-indigo-600" bgColor="bg-indigo-50" />
        <StatCard title="TODAY'S SALES" value={`Rs. ${snapshot.salesToday.toLocaleString()}`} icon={IndianRupee} iconColor="text-green-600" bgColor="bg-green-50" />
      </div>

      <Card title="Quick Summary">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div className="flex items-center justify-between border-b border-gray-50 pb-2 sm:border-b-0 sm:pb-0">
            <span className="text-gray-500">Medicine catalog</span>
            <span className="font-semibold text-gray-800">{snapshot.totalMedicines} items</span>
          </div>
          <div className="flex items-center justify-between border-b border-gray-50 pb-2 sm:border-b-0 sm:pb-0">
            <span className="text-gray-500">Needs restocking</span>
            <span className="font-semibold text-gray-800">{snapshot.lowStock} items</span>
          </div>
          <div className="flex items-center justify-between border-b border-gray-50 pb-2 sm:border-b-0 sm:pb-0">
            <span className="text-gray-500">Awaiting fulfillment</span>
            <span className="font-semibold text-gray-800">{snapshot.pendingPrescriptions} prescriptions</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-500">Sales so far today</span>
            <span className="font-semibold text-gray-800">Rs. {snapshot.salesToday.toLocaleString()}</span>
          </div>
        </div>
      </Card>
    </AdminLayout>
  );
};

export default AdminPharmacyOversight;