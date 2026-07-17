import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  UserPlus,
  CalendarClock,
  Users2,
  FolderHeart,
  Receipt,
  BarChart3,
  Bell,
  Settings,
  LogOut,
  BriefcaseMedical,
} from 'lucide-react';

const navItems = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/receptionist/dashboard' },
  { name: 'Register Patient', icon: UserPlus, path: '/receptionist/register-patient' },
  { name: 'Appointments', icon: CalendarClock, path: '/receptionist/appointments' },
  { name: 'Walk-in Queue', icon: Users2, path: '/receptionist/walk-in-queue' },
  { name: 'Patient Records', icon: FolderHeart, path: '/receptionist/patient-records' },
  { name: 'Billing', icon: Receipt, path: '/receptionist/billing' },
  { name: 'Reports', icon: BarChart3, path: '/receptionist/reports' },
  { name: 'Notifications', icon: Bell, path: '/receptionist/notifications' },
  { name: 'Settings', icon: Settings, path: '/receptionist/settings' },
];

const Sidebar = () => {
  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 h-[calc(100vh-2rem)] sticky top-4 m-4 mr-0 bg-white rounded-[18px] shadow-[0_4px_24px_rgba(15,23,42,0.06)] border border-slate-100 overflow-hidden">
      {/* Logo */}
      <div className="flex items-center gap-2 px-6 py-6">
        <BriefcaseMedical className="w-7 h-7 text-[#2563EB]" />
        <span className="text-xl font-extrabold bg-gradient-to-r from-[#06B6D4] to-[#2563EB] bg-clip-text text-transparent">
          AxisCare
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 flex flex-col gap-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.path === '/receptionist/dashboard'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-full text-sm font-semibold transition-colors ${
                isActive
                  ? 'bg-[#2563EB] text-white shadow-md shadow-blue-200'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-[#2563EB]'
              }`
            }
          >
            <item.icon className="w-[18px] h-[18px]" />
            {item.name}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-slate-100">
        <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-full text-sm font-semibold text-red-500 hover:bg-red-50 transition-colors">
          <LogOut className="w-[18px] h-[18px]" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
