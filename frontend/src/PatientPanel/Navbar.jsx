import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Bell, User, BriefcaseMedical, Menu, X } from 'lucide-react';

export default function Navbar() {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => setIsOpen(!isOpen);

    const navLinkClass = ({ isActive }) =>
        `transition font-semibold text-sm py-2 md:py-0 md:pb-1 block border-b-2 md:border-b-2 ${isActive
            ? "text-[#00b4d8] border-[#00b4d8]"
            : "text-gray-500 hover:text-[#0f4c81] border-transparent"
        }`;

    return (
        <header className="w-full bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
            {/* Main Header Container */}
            <div className="px-4 sm:px-8 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-xl text-[#0f4c81]">
                    <span className="bg-[#00b4d8] text-white p-1.5 rounded-md flex items-center justify-center">
                        <span className="font-black text-sm text-white px-0.5">
                            <BriefcaseMedical className="text-[#ffffff]" size={20} />
                        </span>
                    </span>
                    <span>Axis<span className="text-[#00b4d8]">Care</span></span>
                </div>

                <div className="flex items-center gap-4">
                    <nav className="hidden md:flex items-center gap-8">
                        <NavLink to="/patient-dashboard" className={navLinkClass}>Dashboard</NavLink>
                        <NavLink to="/patient-appointments" className={navLinkClass}>My Appointments</NavLink>
                        <NavLink to="/patient-history" className={navLinkClass}>Medical History</NavLink>
                        <NavLink to="/patient-bills" className={navLinkClass}>Bills & Receipts</NavLink>
                    </nav>

                    <button className="relative text-[#0f4c81] hover:text-[#00b4d8] p-1 transition" onClick={() => navigate('/patient-notifications')}>
                        <Bell className="w-6 h-6 fill-current" />
                        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                    </button>

                    <div
                        className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100 cursor-pointer hover:bg-gray-100 transition"
                        onClick={() => navigate('/patient-profile')}
                    >
                        <div className="w-7 h-7 bg-[#00b4d8] rounded-full flex items-center justify-center text-white">
                            <User className="w-4 h-4" />
                        </div>
                        <span className="font-bold text-sm text-[#0f4c81] hidden sm:inline">John S.</span>
                    </div>

                    {/* Mobile Hamburger Menu Button */}
                    <button 
                        onClick={toggleMenu} 
                        className="text-[#0f4c81] hover:text-[#00b4d8] md:hidden transition focus:outline-none"
                    >
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Dropdown Navigation */}
            {isOpen && (
                <div className="md:hidden border-t border-gray-150 bg-white px-4 py-3 shadow-inner">
                    <nav className="flex flex-col gap-2">
                        <NavLink to="/patient-dashboard" onClick={toggleMenu} className={navLinkClass}>Dashboard</NavLink>
                        <NavLink to="/patient-appointments" onClick={toggleMenu} className={navLinkClass}>My Appointments</NavLink>
                        <NavLink to="/patient-history" onClick={toggleMenu} className={navLinkClass}>Medical History</NavLink>
                        <NavLink to="/patient-bills" onClick={toggleMenu} className={navLinkClass}>Bills & Receipts</NavLink>
                    </nav>
                </div>
            )}
        </header>
    );
}