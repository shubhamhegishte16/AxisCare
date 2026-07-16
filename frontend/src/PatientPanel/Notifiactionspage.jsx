import React, { useState } from 'react';
import {
    SquarePlus,
    Bell,
    User,
    ChevronDown,
    Menu,
    X,
    AlertTriangle,
    Calendar,
    CreditCard,
    FileText,
    CheckCircle,
    Eye
} from 'lucide-react';
import Navbar from './Navbar.jsx';

export default function NotificationsPage() {
    const [activeTab, setActiveTab] = useState('All');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const [notifications, setNotifications] = useState([
        {
            id: 1,
            type: 'Alert',
            title: 'Incomplete Intake Forms',
            message: 'ALERT: You have incomplete intake forms for your upcoming visit on Oct 14.',
            date: 'Today, 10:30 AM',
            read: false,
            actionLabel: 'Complete Form Now',
            iconColor: '#D32F2F',
            bgColor: '#FFEBEE'
        },
        {
            id: 2,
            type: 'Billing',
            title: 'New Invoice Generated',
            message: 'Your invoice #INV-1245 for Consultation with Dr. Rajesh Kumar is ready for payment.',
            date: '12 July 2026',
            read: false,
            actionLabel: 'Pay Now',
            iconColor: '#E65100',
            bgColor: '#FFF3E0'
        },
        {
            id: 3,
            type: 'Appointments',
            title: 'Appointment Scheduled Successfully',
            message: 'Your appointment with Dr. Prathamesh P. for ENT CheckUp has been confirmed for 3:00 PM.',
            date: '11 July 2026',
            read: true,
            actionLabel: 'View Details',
            iconColor: '#2E7D32',
            bgColor: '#E8F5E9'
        },
        {
            id: 4,
            type: 'Medical',
            title: 'Medical History Updated',
            message: 'Dr. Jonathon S. uploaded your laboratory diagnostic test reports.',
            date: '10 July 2026',
            read: true,
            actionLabel: 'View Report',
            iconColor: '#00A3C4',
            bgColor: '#E0F7FA'
        }
    ]);

    const tabs = ['All', 'Alerts', 'Appointments', 'Billing', 'Unread'];

    const markAsRead = (id) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    };

    const filteredNotifications = notifications.filter(item => {
        if (activeTab === 'All') return true;
        if (activeTab === 'Unread') return !item.read;
        if (activeTab === 'Alerts') return item.type === 'Alert';
        if (activeTab === 'Appointments') return item.type === 'Appointments';
        if (activeTab === 'Billing') return item.type === 'Billing';
        return true;
    });

    const getIcon = (type) => {
        switch (type) {
            case 'Alert': return <AlertTriangle className="w-5 h-5 text-[#D32F2F]" />;
            case 'Appointments': return <Calendar className="w-5 h-5 text-[#2E7D32]" />;
            case 'Billing': return <CreditCard className="w-5 h-5 text-[#E65100]" />;
            default: return <FileText className="w-5 h-5 text-[#00A3C4]" />;
        }
    };

    return (
        <div className="min-h-screen w-full bg-[#F0F6FA] font-sans antialiased flex flex-col">

            <Navbar />

            <main className="flex-1 w-full max-w-[1400px] mx-auto px-4 sm:px-8 py-6 sm:py-8 flex flex-col justify-between">

                <div className="flex-1">
                    {/* Section Heading & Dynamic Unread Counter Badge */}
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#0f4c81]">
                            My Notifications
                        </h1>
                        <div className="bg-[#FF4D4D] text-white text-xs sm:text-sm font-bold px-3 py-1 rounded-full shadow-sm">
                            {notifications.filter(n => !n.read).length} New
                        </div>
                    </div>

                    {/* Categorized Filtration Segment Buttons */}
                    <div className="flex items-center space-x-2 overflow-x-auto pb-3 mb-6 scrollbar-none w-full">
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

                    {/* Notification Card Stack Container */}
                    <div className="space-y-4 w-full">
                        {filteredNotifications.length > 0 ? (
                            filteredNotifications.map((noti) => (
                                <div
                                    key={noti.id}
                                    className={`bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100 flex items-start gap-4 transition-all relative overflow-hidden ${!noti.read ? 'ring-1 ring-blue-100' : 'opacity-85'
                                        }`}
                                >
                                    {!noti.read && (
                                        <span className="absolute top-4 right-4 w-2.5 h-2.5 bg-[#0066FF] rounded-full"></span>
                                    )}

                                    <div
                                        className="p-3 rounded-xl shrink-0"
                                        style={{ backgroundColor: noti.bgColor }}
                                    >
                                        {getIcon(noti.type)}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 mb-1">
                                            <h3 className="font-bold text-base text-gray-900 truncate pr-4">
                                                {noti.title}
                                            </h3>
                                            <span className="text-xs font-semibold text-gray-400 whitespace-nowrap">
                                                {noti.date}
                                            </span>
                                        </div>

                                        <p className="text-sm font-semibold text-gray-600 mb-3 leading-relaxed">
                                            {noti.message}
                                        </p>

                                        <div className="flex items-center space-x-3">
                                            <button className="bg-[#00B4D8] hover:bg-[#0096B4] text-white text-xs font-bold py-2 px-4 rounded-lg transition-colors shadow-sm">
                                                {noti.actionLabel}
                                            </button>

                                            {!noti.read && (
                                                <button
                                                    onClick={() => markAsRead(noti.id)}
                                                    className="text-gray-400 hover:text-[#0052CC] text-xs font-bold py-2 px-3 rounded-lg flex items-center space-x-1.5 hover:bg-gray-50 transition-colors"
                                                >
                                                    <CheckCircle className="w-4 h-4" />
                                                    <span>Mark read</span>
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="bg-white rounded-2xl py-12 px-4 border border-gray-200 text-center shadow-inner">
                                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 text-gray-400">
                                    <Eye className="w-6 h-6" />
                                </div>
                                <h3 className="text-base font-bold text-gray-700 mb-1">All Caught Up!</h3>
                                <p className="text-xs font-semibold text-gray-400">No current notifications matched your selected layout filter.</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}