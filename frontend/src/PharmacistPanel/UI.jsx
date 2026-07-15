import React from 'react';

export const StatCard = ({ title, value, icon: Icon, iconColor = 'text-blue-600', bgColor = 'bg-blue-50', subtext }) => (
  <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
    <div className={`w-11 h-11 rounded-lg ${bgColor} flex items-center justify-center shrink-0`}>
      <Icon className={`w-5 h-5 ${iconColor}`} />
    </div>
    <div>
      <p className="text-xs font-semibold text-gray-500">{title}</p>
      <p className="text-xl font-bold text-gray-900 leading-tight">{value}</p>
      {subtext && <p className="text-[11px] text-gray-400 mt-0.5">{subtext}</p>}
    </div>
  </div>
);

const statusStyles = {
  'In Stock': 'bg-green-50 text-green-600 border-green-200',
  'Low Stock': 'bg-amber-50 text-amber-600 border-amber-200',
  'Out of Stock': 'bg-red-50 text-red-600 border-red-200',
  'No Stock': 'bg-red-50 text-red-600 border-red-200',
  'Expiring Soon': 'bg-orange-50 text-orange-600 border-orange-200',
  Pending: 'bg-gray-50 text-gray-500 border-gray-200',
  Completed: 'bg-green-50 text-green-600 border-green-200',
  Delivered: 'bg-green-50 text-green-600 border-green-200',
  Cancelled: 'bg-red-50 text-red-600 border-red-200',
  Paid: 'bg-green-50 text-green-600 border-green-200',
  Active: 'bg-green-50 text-green-600 border-green-200',
  Inactive: 'bg-gray-50 text-gray-500 border-gray-200',
};

export const StatusBadge = ({ status }) => (
  <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border ${statusStyles[status] || 'bg-gray-50 text-gray-500 border-gray-200'}`}>
    {status}
  </span>
);

export const PageHeader = ({ title, subtitle, action }) => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">{title}</h1>
      {subtitle && <p className="text-gray-500 text-sm">{subtitle}</p>}
    </div>
    {action}
  </div>
);

export const Card = ({ title, action, children, className = '' }) => (
  <div className={`bg-white rounded-xl border border-gray-100 shadow-sm ${className}`}>
    {title && (
      <div className="p-5 border-b border-gray-100 flex items-center justify-between">
        <h2 className="text-base font-bold text-gray-900">{title}</h2>
        {action}
      </div>
    )}
    <div className="p-5">{children}</div>
  </div>
);

export const EmptyState = ({ text = 'No data found' }) => (
  <div className="py-12 text-center text-gray-400 text-sm">{text}</div>
);

export const Modal = ({ open, onClose, title, children, wide }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4">
      <div className={`bg-white rounded-2xl shadow-2xl w-full ${wide ? 'max-w-2xl' : 'max-w-md'} max-h-[90vh] overflow-y-auto`}>
        <div className="flex items-center justify-between p-5 border-b border-gray-100 sticky top-0 bg-white">
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
};

export const PharmacyPageLayout = ({ children }) => (
  <main className="flex-1 p-6 lg:p-8 max-w-7xl mx-auto w-full">{children}</main>
);