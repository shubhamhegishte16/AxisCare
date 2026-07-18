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
  Active: 'bg-green-50 text-green-600',
  Inactive: 'bg-gray-100 text-gray-500',
  Suspended: 'bg-red-50 text-red-600',
  Pending: 'bg-amber-50 text-amber-600',
  Scheduled: 'bg-blue-50 text-blue-600',
  Completed: 'bg-green-50 text-green-600',
  Cancelled: 'bg-red-50 text-red-600',
  Paid: 'bg-green-50 text-green-600',
  Unpaid: 'bg-red-50 text-red-600',
  'On Duty': 'bg-green-50 text-green-600',
  'Off Duty': 'bg-gray-100 text-gray-500',
  'On Leave': 'bg-amber-50 text-amber-600',
  Approved: 'bg-green-50 text-green-600',
  Rejected: 'bg-red-50 text-red-600',
  Unread: 'bg-blue-50 text-blue-600',
  Read: 'bg-gray-100 text-gray-500',
};

export const StatusBadge = ({ status }) => (
  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${statusStyles[status] || 'bg-gray-100 text-gray-500'}`}>
    {status}
  </span>
);

export const RoleBadge = ({ role }) => {
  const styles = {
    admin: 'bg-purple-50 text-purple-600',
    doctor: 'bg-blue-50 text-blue-600',
    receptionist: 'bg-teal-50 text-teal-600',
    patient: 'bg-gray-100 text-gray-600',
    laboratory: 'bg-indigo-50 text-indigo-600',
    pharmacist: 'bg-emerald-50 text-emerald-600',
  };
  const label = role ? role.charAt(0).toUpperCase() + role.slice(1) : 'User';
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${styles[role] || 'bg-gray-100 text-gray-500'}`}>
      {label}
    </span>
  );
};

export const StatCard = ({ title, value, icon: Icon, iconColor, bgColor, trend }) => (
  <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
    <div className="flex items-center justify-between mb-3">
      <span className="text-xs font-semibold text-gray-400 tracking-wide">{title}</span>
      <span className={`w-9 h-9 rounded-lg ${bgColor} flex items-center justify-center`}>
        <Icon className={`w-4.5 h-4.5 ${iconColor}`} />
      </span>
    </div>
    <div className="text-2xl font-bold text-gray-900">{value}</div>
    {trend && <div className="text-xs text-gray-400 mt-1">{trend}</div>}
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

export const ConfirmDialog = ({ open, onClose, onConfirm, title, message, confirmLabel = 'Confirm', danger }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gray-900/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
        <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-sm text-gray-500 mb-6">{message}</p>
        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2.5 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-50">
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`px-5 py-2.5 rounded-lg text-sm font-semibold text-white shadow-sm ${danger ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {confirmLabel}
          </button>
        </div>
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

export const Toggle = ({ checked, onChange }) => (
  <button
    type="button"
    onClick={() => onChange(!checked)}
    className={`w-10 h-5.5 h-6 rounded-full relative transition-colors ${checked ? 'bg-blue-600' : 'bg-gray-200'}`}
  >
    <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${checked ? 'translate-x-4' : ''}`} />
  </button>
);
