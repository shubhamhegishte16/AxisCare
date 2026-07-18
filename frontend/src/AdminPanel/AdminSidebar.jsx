import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, Stethoscope, HeartPulse, CalendarDays,
  Building2, PillBottle, Receipt, BarChart3, Bell, User, LogOut,
  ShieldCheck, Menu, X,
} from 'lucide-react';

const navItems = [
  { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Users', path: '/admin/users', icon: Users },
  { label: 'Doctors', path: '/admin/doctors', icon: Stethoscope },
  { label: 'Patients', path: '/admin/patients', icon: HeartPulse },
  { label: 'Appointments', path: '/admin/appointments', icon: CalendarDays },
  { label: 'Departments', path: '/admin/departments', icon: Building2 },
  { label: 'Pharmacy', path: '/admin/pharmacy', icon: PillBottle },
  { label: 'Billing & Revenue', path: '/admin/billing', icon: Receipt },
  { label: 'Reports', path: '/admin/reports', icon: BarChart3 },
  { label: 'Notifications', path: '/admin/notifications', icon: Bell },
];

const AdminSidebar = () => {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  let storedUser = null;
  try {
    storedUser = JSON.parse(localStorage.getItem('user'));
  } catch {
    storedUser = null;
  }
  const userName = storedUser?.fullName || 'Admin';

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:5000/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch {
      // ignore network errors, clear local session regardless
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/admin/login', { replace: true });
    }
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2.5 px-5 py-5">
        <span className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center">
          <ShieldCheck className="w-5 h-5 text-white" />
        </span>
        <div>
          <p className="font-bold text-gray-900 leading-tight">AxisCare</p>
          <p className="text-xs text-gray-400 leading-tight">Admin Panel</p>
        </div>
      </div>

      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        {navItems.map(({ label, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
              }`
            }
          >
            <Icon className="w-4.5 h-4.5" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="px-3 py-4 border-t border-gray-100 space-y-1">
        <button
          onClick={() => navigate('/admin/profile')}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-gray-500 hover:bg-gray-50 hover:text-gray-800"
        >
          <span className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
            <User className="w-3.5 h-3.5 text-blue-500" />
          </span>
          <span className="truncate">{userName}</span>
        </button>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-gray-400 hover:bg-red-50 hover:text-red-600"
        >
          <LogOut className="w-4.5 h-4.5" />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile top bar */}
      <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <ShieldCheck className="w-4 h-4 text-white" />
          </span>
          <p className="font-bold text-gray-900 text-sm">AxisCare Admin</p>
        </div>
        <button onClick={() => setMobileOpen(true)} className="text-gray-500">
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-gray-900/40" onClick={() => setMobileOpen(false)} />
          <div className="relative w-64 bg-white h-full shadow-xl">
            <button onClick={() => setMobileOpen(false)} className="absolute top-4 right-4 text-gray-400">
              <X className="w-5 h-5" />
            </button>
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 h-screen sticky top-0 bg-white border-r border-gray-100 shrink-0">
        <SidebarContent />
      </aside>
    </>
  );
};

export default AdminSidebar;
