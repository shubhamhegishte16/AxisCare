import React from 'react';
import AdminSidebar from './AdminSidebar';

const AdminLayout = ({ children }) => (
  <div className="min-h-screen bg-gray-50 flex font-sans">
    <AdminSidebar />
    <main className="flex-1 p-5 lg:p-8 max-w-7xl mx-auto w-full">{children}</main>
  </div>
);

export default AdminLayout;
