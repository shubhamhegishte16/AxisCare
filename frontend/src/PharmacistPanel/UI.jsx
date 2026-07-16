import React from 'react';
import { X, Inbox } from 'lucide-react';

export const PageHeader = ({ title, subtitle, action }) => (
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">{title}</h1>
      {subtitle && <p className="text-gray-500 text-sm">{subtitle}</p>}
    </div>
    {action}
  </div>
);

const statusStyles = {
  'In Stock': 'bg-green-50 text-green-600',
  'Low Stock': 'bg-amber-50 text-amber-600',
  'Out of Stock': 'bg-red-50 text-red-600',
  'No Stock': 'bg-red-50 text-red-600',
  'Expiring Soon': 'bg-orange-50 text-orange-600',
  Pending: 'bg-amber-50 text-amber-600',
  Completed: 'bg-green-50 text-green-600',
  Delivered: 'bg-green-50 text-green-600',
  Cancelled: 'bg-red-50 text-red-600',
  Paid: 'bg-green-50 text-green-600',
  Unpaid: 'bg-red-50 text-red-600',
  Active: 'bg-green-50 text-green-600',
  Inactive: 'bg-gray-100 text-gray-500',
  Approved: 'bg-green-50 text-green-600',
  Rejected: 'bg-red-50 text-red-600',
  Dispensed: 'bg-blue-50 text-blue-600',
};

export const StatusBadge = ({ status }) => (
  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${statusStyles[status] || 'bg-gray-100 text-gray-500'}`}>
    {status}
  </span>
);

export const StatCard = ({ title, value, icon: Icon, iconColor, bgColor }) => (
  <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
    <div className="flex items-center justify-between mb-3">
      <span className="text-xs font-semibold text-gray-400 tracking-wide">{title}</span>
      <span className={`w-9 h-9 rounded-lg ${bgColor} flex items-center justify-center`}>
        <Icon className={`w-4.5 h-4.5 ${iconColor}`} />
      </span>
    </div>
    <div className="text-2xl font-bold text-gray-900">{value}</div>
  </div>
);

export const Card = ({ title, action, className = '', children }) => (
  <div className={`bg-white rounded-xl border border-gray-100 p-5 shadow-sm ${className}`}>
    {(title || action) && (
      <div className="flex items-center justify-between mb-4">
        {title && <h3 className="font-bold text-gray-800">{title}</h3>}
        {action}
      </div>
    )}
    {children}
  </div>
);

export const Modal = ({ open, onClose, title, wide, children }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gray-900/40" onClick={onClose} />
      <div className={`relative bg-white rounded-2xl shadow-xl w-full ${wide ? 'max-w-2xl' : 'max-w-md'} max-h-[90vh] overflow-y-auto`}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white rounded-t-2xl">
          <h3 className="font-bold text-gray-800">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

export const EmptyState = ({ text = 'Nothing here yet.' }) => (
  <div className="flex flex-col items-center justify-center py-14 text-center">
    <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mb-3">
      <Inbox className="w-5 h-5 text-gray-300" />
    </div>
    <p className="text-sm text-gray-400">{text}</p>
  </div>
);