import React from 'react';
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  FileText, 
  FlaskConical, 
  BarChart2, 
  Bell, 
  Settings, 
  ChevronDown,
  BriefcaseMedical
} from 'lucide-react';
import { NavLink, Link } from 'react-router-dom';
const Header = () => {
  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/doctordashboard' },
    { name: 'Appointments', icon: Calendar, path: '/doctordashboard/appointments' },
    { name: 'Patients', icon: Users, path: '/doctordashboard/patients' },
    { name: 'Prescriptions', icon: FileText, path: '/doctordashboard/prescriptions' },
    { name: 'Lab Requests', icon: FlaskConical, path: '/doctordashboard/lab-requests' },
    { name: 'Reports', icon: BarChart2, path: '/doctordashboard/reports' },
  ];
  return (
    <header className="bg-white border-b border-gray-100 py-3 px-6 flex items-center justify-between sticky top-0 z-50">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <BriefcaseMedical className="w-7 h-7 text-blue-600" />
        <span className="text-xl font-extrabold bg-gradient-to-r from-[#00B9D6] to-[#004AC6] bg-clip-text text-transparent mr-4">
          AxisCare
        </span>
      </div>
      {/* Navigation */}
      <nav className="hidden lg:flex items-center gap-1">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.path === '/doctordashboard'}
            className={({ isActive }) =>
              `flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                isActive
                  ? 'bg-[#00B9D6] text-white shadow-sm'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            <item.icon className="w-4 h-4" />
            {item.name}
          </NavLink>
        ))}
      </nav>
      {/* Right Actions */}
      <div className="flex items-center gap-4">
        <Link to="/doctordashboard/notifications" className="text-gray-400 hover:text-gray-600 relative transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
        </Link>
        <Link to="/doctordashboard/settings" className="text-gray-400 hover:text-gray-600 transition-colors">
          <Settings className="w-5 h-5" />
        </Link>
        <div className="h-8 w-px bg-gray-200 mx-2"></div>
        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="text-right hidden sm:block group-hover:opacity-80 transition-opacity">
            <p className="text-sm font-bold text-gray-800 leading-tight">Dr. Ananya Sharma</p>
            <p className="text-xs text-gray-500 font-medium leading-tight">Cardiologist</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden border-2 border-white shadow-sm">
             <img src="https://i.pravatar.cc/150?img=32" alt="Dr. Ananya" className="w-full h-full object-cover" />
          </div>
          <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
        </div>
      </div>
    </header>
  );
};
export default Header;
