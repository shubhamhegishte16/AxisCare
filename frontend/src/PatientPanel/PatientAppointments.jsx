import React, { useState } from 'react';
import {
    SquarePlus,
    Bell,
    User,
    AlertTriangle,
    ChevronDown,
    Menu,
    X
} from 'lucide-react';
import Navbar from './Navbar.jsx';

export default function AppointmentsDashboard() {
    const [activeTab, setActiveTab] = useState('All');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const appointmentsData = [
        {
            time: '8:00 AM',
            doctor: 'Dr. Rajesh Kumar',
            reason: 'Follow-Up Consultation',
            ageGender: '56/Male',
            status: 'Reschedule',
            statusColor: '#E65100',
            type: 'In-Person'
        },
        {
            time: '12:00 PM',
            doctor: 'Dr. Jonathon S.',
            reason: 'Chest pain',
            ageGender: '56/Male',
            status: 'Cancelled',
            statusColor: '#D32F2F',
            type: 'In-Person'
        },
        {
            time: '3:00 PM',
            doctor: 'Dr. Prathamesh P.',
            reason: 'ENT CheckUp',
            ageGender: '56/Male',
            status: 'Scheduled',
            statusColor: '#2E7D32',
            type: 'In-Person'
        }
    ];

    const tabs = ['All', 'Upcoming', 'Pending', 'Past'];

    return (
        <div className="min-h-screen w-full bg-[#F0F6FA] font-sans antialiased flex flex-col">

            <Navbar />

            {/* Main Container (Fills Remaining Space on screen) */}
            <main className="flex-1 w-full max-w-[1400px] mx-auto px-4 sm:px-8 py-6 sm:py-8 flex flex-col justify-between">

                <div className="flex-1">
                    {/* Title and Action Button Row */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#0f4c81]">
                            My Appointments
                        </h1>
                        <button className="bg-[#00B4D8] hover:bg-[#0096B4] text-white font-medium py-2.5 px-6 rounded-lg flex items-center justify-center space-x-2 shadow transition-all self-start sm:self-auto w-full sm:w-auto">
                            <span className="text-xl leading-none font-light">+</span>
                            <span>Book Appointment</span>
                        </button>
                    </div>

                    {/* Immediate Actions & Alerts Component */}
                    <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-100 mb-8 w-full">
                        <h2 className="text-[#FF4D4D] font-bold text-lg mb-4">Immediate Actions & Alerts</h2>

                        <div className="flex items-start space-x-4">
                            
                            <AlertTriangle className="w-6 h-6 text-red-500" />

                            <div className="flex-1">
                                <p className="text-[#0066FF] font-bold text-sm sm:text-base md:text-lg mb-3 leading-snug">
                                    ALERT: You have incomplete intake forms for your upcoming visit on Oct 14.
                                </p>
                                <button className="bg-[#00B4D8] hover:bg-[#0096B4] text-white text-xs font-bold py-2 px-4 rounded-lg transition-colors shadow-sm">
                                    Complete Form Now
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Filter Navigation Tabs & Counters */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                        {/* Scrollable Filters row on extra small viewports */}
                        <div className="flex items-center space-x-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none w-full sm:w-auto">
                            {tabs.map((tab) => {
                                const isActive = activeTab === tab;
                                return (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`px-5 py-2 rounded-full font-bold text-xs sm:text-sm border whitespace-nowrap transition-all ${isActive
                                                ? 'bg-[#00B4D8] text-white border-[#00B4D8]'
                                                : 'bg-white text-[#00B4D8] border-gray-200 hover:bg-gray-50'
                                            }`}
                                    >
                                        {tab}
                                    </button>
                                );
                            })}
                        </div>
                        <div className="text-[#5977a5] font-light self-end sm:self-auto pr-2">
                            3
                        </div>
                    </div>

                    {/* Appointments Data Table Card */}
                    <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden w-full mb-8">
                        <div className="w-full overflow-x-auto">
                            <table className="w-full text-left border-collapse min-w-[800px] lg:min-w-0">
                                <thead>
                                    <tr className="bg-[#0487BD] text-white font-bold text-xs sm:text-sm">
                                        <th className="py-4 px-4 sm:px-6 text-center">Time</th>
                                        <th className="py-4 px-4 sm:px-6">Doctor</th>
                                        <th className="py-4 px-4 sm:px-6">Reason</th>
                                        <th className="py-4 px-4 sm:px-6 text-center">Age/Gender</th>
                                        <th className="py-4 px-4 sm:px-6 text-center">Status</th>
                                        <th className="py-4 px-4 sm:px-6 text-center">Type</th>
                                        <th className="py-4 px-4 sm:px-6 text-center">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#BCE1EC]">
                                    {appointmentsData.map((appt, idx) => (
                                        <tr key={idx} className="hover:bg-slate-50 transition-colors text-sm sm:text-base">
                                            <td className="py-5 px-4 sm:px-6 font-medium text-gray-800 text-center whitespace-nowrap">
                                                {appt.time}
                                            </td>
                                            <td className="py-5 px-4 sm:px-6 font-medium text-gray-800 whitespace-nowrap">
                                                {appt.doctor}
                                            </td>
                                            <td className="py-5 px-4 sm:px-6 font-medium text-gray-700">
                                                {appt.reason}
                                            </td>
                                            <td className="py-5 px-4 sm:px-6 font-medium text-gray-700 text-center whitespace-nowrap">
                                                {appt.ageGender}
                                            </td>
                                            <td className="py-5 px-4 sm:px-6 font-bold text-center whitespace-nowrap" style={{ color: appt.statusColor }}>
                                                {appt.status}
                                            </td>
                                            <td className="py-5 px-4 sm:px-6 font-medium text-gray-700 text-center whitespace-nowrap">
                                                {appt.type}
                                            </td>
                                            <td className="py-5 px-4 sm:px-6 text-center whitespace-nowrap">
                                                <button className="bg-[#00B4D8] hover:bg-[#0096B4] text-white font-bold text-xs sm:text-sm py-1.5 px-4 rounded-full shadow-sm transition-colors">
                                                    Change ?
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}