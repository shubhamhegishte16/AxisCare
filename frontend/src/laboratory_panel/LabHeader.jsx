import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  FlaskConical, 
  FileSpreadsheet, 
  History, 
  Settings, 
  Bell, 
  ChevronDown,
  LogOut
} from 'lucide-react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

const LabHeader = () => {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [localUser, setLocalUser] = useState(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try { return JSON.parse(userStr); } catch (e) {}
    }
    return null;
  });

  const handleLogout = async () => {
    try {
      await authService.logout();
      navigate('/lab/login');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/lab', exact: true },
    { name: 'Test Requests', icon: FlaskConical, path: '/lab/requests', exact: false },
    { name: 'Test Results', icon: FileSpreadsheet, path: '/lab/results', exact: false },
    { name: 'Test History', icon: History, path: '/lab/history', exact: false },
    { name: 'Settings', icon: Settings, path: '/lab/settings', exact: false },
  ];

  return (
    <header className="bg-white border-b border-gray-100 py-3.5 px-6 flex items-center justify-between sticky top-0 z-50 shadow-sm">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <div className="bg-blue-600 p-1.5 rounded-lg flex items-center justify-center">
          <FlaskConical className="w-5 h-5 text-white" />
        </div>
        <span className="text-xl font-extrabold bg-gradient-to-r from-[#00B9D6] to-[#004AC6] bg-clip-text text-transparent mr-4">
          AxisCare
        </span>
      </div>

      {/* Navigation */}
      <nav className="hidden lg:flex items-center gap-1">
        {navItems.map((item) =>
          !item.path ? (
            <span
              key={item.name}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-gray-300 cursor-default"
            >
              <item.icon className="w-4 h-4" />
              {item.name}
            </span>
          ) : (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.exact}
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-[#00B9D6] text-white shadow-sm'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              <item.icon className="w-4 h-4" />
              {item.name}
            </NavLink>
          )
        )}
      </nav>

      {/* Right Actions */}
      <div className="flex items-center gap-4">
        {/* Notification Bell */}
        <div className="text-gray-400 hover:text-gray-600 relative transition-colors cursor-pointer">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center border-2 border-white px-0.5">
            2
          </span>
        </div>


        <div className="h-8 w-px bg-gray-200 mx-1"></div>

        {/* User Profile Dropdown */}
        <div className="relative">
          <div
            className="flex items-center gap-3 cursor-pointer group select-none"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <div className="text-right hidden sm:block">
              <p className="text-xs text-gray-400 font-medium leading-tight">Lab Technician</p>
              <p className="text-sm font-bold text-gray-800 leading-tight">
                {localUser?.fullName || 'Rahul Verma'}
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden border-2 border-white shadow-sm flex items-center justify-center">
              <img
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(localUser?.fullName || 'Rahul Verma')}&background=00B9D6&color=fff`}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <ChevronDown className={`w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
          </div>

          {showDropdown && (
            <div className="absolute right-0 mt-2.5 w-52 bg-white border border-gray-100 rounded-xl shadow-lg py-1 z-50">
              <div className="px-4 py-2.5 border-b border-gray-50">
                <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">Signed in as</p>
                <p className="text-sm font-semibold text-gray-800 truncate mt-0.5">{localUser?.email || 'rahul.verma@axiscare.com'}</p>
              </div>

              <button
                onClick={() => setShowDropdown(false)}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors text-left"
              >
                <Settings className="w-4 h-4 text-gray-400" />
                Settings
              </button>

              <button
                onClick={() => { setShowDropdown(false); handleLogout(); }}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
              >
                <LogOut className="w-4 h-4 text-red-400" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default LabHeader;
