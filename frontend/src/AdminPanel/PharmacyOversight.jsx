import React from 'react';
import { Package, AlertTriangle, ClipboardList, IndianRupee } from 'lucide-react';
import AdminLayout from './AdminLayout';
import { PageHeader, StatCard, Card } from './UI';

const AdminPharmacyOversight = () => (
  <AdminLayout>
    <PageHeader title="Pharmacy Overview" subtitle="Read-only snapshot of pharmacy operations" />

    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <StatCard title="TOTAL MEDICINES" value={pharmacySnapshot.totalMedicines.toLocaleString()} icon={Package} iconColor="text-blue-600" bgColor="bg-blue-50" />
      <StatCard title="LOW STOCK ITEMS" value={pharmacySnapshot.lowStock} icon={AlertTriangle} iconColor="text-amber-500" bgColor="bg-amber-50" />
      <StatCard title="PENDING PRESCRIPTIONS" value={pharmacySnapshot.pendingPrescriptions} icon={ClipboardList} iconColor="text-indigo-600" bgColor="bg-indigo-50" />
      <StatCard title="TODAY'S SALES" value={`Rs. ${pharmacySnapshot.salesToday.toLocaleString()}`} icon={IndianRupee} iconColor="text-green-600" bgColor="bg-green-50" />
    </div>

    <Card title="About this view">
      <p className="text-sm text-gray-500 leading-relaxed">
        This page gives admins a high-level snapshot of pharmacy activity without duplicating the
        full Pharmacy Panel. Detailed medicine catalog management, purchase orders, supplier
        records, and billing continue to live in the Pharmacist Panel and are managed by pharmacy
        staff directly. Once the backend is wired up, this page will pull live totals from the
        same pharmacy data pharmacists see, purely for visibility.
      </p>
    </Card>
  </AdminLayout>
);

export default AdminPharmacyOversight;
