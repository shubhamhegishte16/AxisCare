import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { PackagePlus, Bell, User, LogOut } from 'lucide-react';

const navItems = [
  { label: 'Dashboard', path: '/pharmacy/dashboard' },
  { label: 'Medicines', path: '/pharmacy/medicines' },
  { label: 'Prescriptions', path: '/pharmacy/prescriptions' },
  { label: 'Inventory', path: '/pharmacy/inventory' },
  { label: 'Orders', path: '/pharmacy/orders' },
  { label: 'Suppliers', path: '/pharmacy/suppliers' },
  { label: 'Reports', path: '/pharmacy/reports' },
];

const PharmacyNavbar = () => {
  const navigate = useNavigate();

  let storedUser = null;
  try {
    storedUser = JSON.parse(localStorage.getItem('user'));
  } catch {
    storedUser = null;
  }
  const userName = storedUser?.fullName || 'Pharmacist';
  const userRole = storedUser?.role
    ? storedUser.role.charAt(0).toUpperCase() + storedUser.role.slice(1)
    : 'Pharmacist';

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
      navigate('/pharmacist/login', { replace: true });
    }
  };

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between gap-6">
        {/* Logo */}
        <button
          onClick={() => navigate('/pharmacy/dashboard')}
          className="flex items-center gap-2 shrink-0"
        >
          <span className="w-7 h-7 rounded-md bg-blue-600 flex items-center justify-center">
            <PackagePlus className="w-4 h-4 text-white" />
          </span>
          <span className="text-lg font-extrabold bg-gradient-to-r from-[#00B9D6] to-[#004AC6] bg-clip-text text-transparent">
            AxisCare
          </span>
        </button>

        {/* Nav links */}
        <nav className="hidden lg:flex items-center gap-1 flex-1 justify-center">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  isActive
                    ? 'text-blue-600'
                    : 'text-gray-500 hover:text-gray-800'
                }`
              }
            >
              {({ isActive }) => (
                <span className={isActive ? 'border-b-2 border-blue-600 pb-[18px] -mb-[18px]' : ''}>
                  {item.label}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-4 shrink-0">
          <button
            onClick={() => navigate('/pharmacy/notifications')}
            className="relative text-blue-600 hover:text-blue-700"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-500" />
          </button>

          <button
            onClick={() => navigate('/pharmacy/profile')}
            className="flex items-center gap-2"
          >
            <span className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center">
              <User className="w-5 h-5 text-blue-500" />
            </span>
            <span className="hidden sm:flex flex-col items-start leading-tight">
              <span className="text-sm font-bold text-gray-900">{userName}</span>
              <span className="text-xs text-gray-400">{userRole}</span>
            </span>
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-gray-400 hover:text-red-600 transition-colors"
            aria-label="Logout"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default PharmacyNavbar;