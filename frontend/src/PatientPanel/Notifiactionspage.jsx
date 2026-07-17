import React, { useState, useEffect } from 'react';
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
    Eye,
    Loader2
} from 'lucide-react';
import Navbar from './Navbar.jsx';
import { notificationService } from '../services/PatientNotificationService.js';

export default function NotificationsPage() {
    const [activeTab, setActiveTab] = useState('All');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [unreadCount, setUnreadCount] = useState(0);
    const [actionLoading, setActionLoading] = useState(null);

    const tabs = ['All', 'Alerts', 'Appointments', 'Billing', 'Unread'];

    // Fetch notifications on mount
    useEffect(() => {
        fetchNotifications();
        fetchUnreadCount();
    }, []);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const response = await notificationService.getNotifications();
            if (response.success) {
                setNotifications(response.data);
                setUnreadCount(response.unreadCount || 0);
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchUnreadCount = async () => {
        try {
            const response = await notificationService.getUnreadCount();
            if (response.success) {
                setUnreadCount(response.unreadCount);
            }
        } catch (error) {
            console.error('Error fetching unread count:', error);
        }
    };

    const filteredNotifications = notifications.filter(item => {
        if (activeTab === 'All') return true;
        if (activeTab === 'Unread') return !item.read;
        if (activeTab === 'Alerts') return item.type === 'Alert';
        if (activeTab === 'Appointments') return item.type === 'Appointments';
        if (activeTab === 'Billing') return item.type === 'Billing';
        return true;
    });

    const markAsRead = async (id) => {
        try {
            setActionLoading(id);
            const response = await notificationService.markAsRead(id);
            if (response.success) {
                setNotifications(prev => prev.map(n => 
                    n._id === id ? { ...n, read: true } : n
                ));
                setUnreadCount(prev => Math.max(0, prev - 1));
            }
        } catch (error) {
            console.error('Error marking notification as read:', error);
        } finally {
            setActionLoading(null);
        }
    };

    const markAllAsRead = async () => {
        try {
            const response = await notificationService.markAllAsRead();
            if (response.success) {
                setNotifications(prev => prev.map(n => ({ ...n, read: true })));
                setUnreadCount(0);
            }
        } catch (error) {
            console.error('Error marking all as read:', error);
        }
    };

    const deleteNotification = async (id) => {
        if (!window.confirm('Are you sure you want to delete this notification?')) return;
        
        try {
            const response = await notificationService.deleteNotification(id);
            if (response.success) {
                setNotifications(prev => prev.filter(n => n._id !== id));
                if (!notifications.find(n => n._id === id)?.read) {
                    setUnreadCount(prev => Math.max(0, prev - 1));
                }
            }
        } catch (error) {
            console.error('Error deleting notification:', error);
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case 'Alert': return <AlertTriangle className="w-5 h-5 text-[#D32F2F]" />;
            case 'Appointments': return <Calendar className="w-5 h-5 text-[#2E7D32]" />;
            case 'Billing': return <CreditCard className="w-5 h-5 text-[#E65100]" />;
            default: return <FileText className="w-5 h-5 text-[#00A3C4]" />;
        }
    };

    const getIconColor = (type) => {
        const colors = {
            'Alert': '#D32F2F',
            'Appointments': '#2E7D32',
            'Billing': '#E65100',
            'Medical': '#00A3C4',
            'System': '#1565C0',
            'Reminder': '#6A1B9A',
        };
        return colors[type] || '#00A3C4';
    };

    const getBgColor = (type) => {
        const colors = {
            'Alert': '#FFEBEE',
            'Appointments': '#E8F5E9',
            'Billing': '#FFF3E0',
            'Medical': '#E0F7FA',
            'System': '#E3F2FD',
            'Reminder': '#F3E5F5',
        };
        return colors[type] || '#E0F7FA';
    };

    const handleActionClick = (notification) => {
        // Handle different action types
        switch (notification.actionLabel) {
            case 'Complete Form Now':
                window.location.href = '/profile';
                break;
            case 'Pay Now':
                window.location.href = '/bills';
                break;
            case 'View Details':
            case 'View Report':
                window.location.href = notification.actionUrl || '/appointments';
                break;
            default:
                window.location.href = notification.actionUrl || '/';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen w-full bg-[#F0F6FA] font-sans antialiased flex flex-col">
                <Navbar />
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <Loader2 className="w-12 h-12 text-[#00B4D8] animate-spin mx-auto mb-4" />
                        <p className="text-gray-600">Loading notifications...</p>
                    </div>
                </div>
            </div>
        );
    }

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
                        <div className="flex items-center gap-3">
                            {notifications.some(n => !n.read) && (
                                <button
                                    onClick={markAllAsRead}
                                    className="text-xs text-[#00B4D8] hover:text-[#0096B4] font-medium hover:underline"
                                >
                                    Mark all as read
                                </button>
                            )}
                            <div className="bg-[#FF4D4D] text-white text-xs sm:text-sm font-bold px-3 py-1 rounded-full shadow-sm">
                                {unreadCount} New
                            </div>
                        </div>
                    </div>

                    {/* Categorized Filtration Segment Buttons */}
                    <div className="flex items-center space-x-2 overflow-x-auto pb-3 mb-6 scrollbar-none w-full">
                        {tabs.map((tab) => {
                            const isActive = activeTab === tab;
                            const count = tab === 'Unread' ? unreadCount : 
                                        tab === 'All' ? notifications.length :
                                        notifications.filter(n => n.type === tab.slice(0, -1)).length;
                            return (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-5 py-2 rounded-full font-bold text-xs sm:text-sm border whitespace-nowrap transition-all flex items-center gap-2 ${
                                        isActive
                                            ? 'bg-[#00B4D8] text-white border-[#00B4D8]'
                                            : 'bg-white text-[#00B4D8] border-gray-200 hover:bg-gray-50'
                                    }`}
                                >
                                    {tab}
                                    {count > 0 && tab !== 'All' && (
                                        <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                                            isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
                                        }`}>
                                            {count}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* Notification Card Stack Container */}
                    <div className="space-y-4 w-full">
                        {filteredNotifications.length > 0 ? (
                            filteredNotifications.map((noti) => (
                                <div
                                    key={noti._id}
                                    className={`bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100 flex items-start gap-4 transition-all relative overflow-hidden ${
                                        !noti.read ? 'ring-1 ring-blue-100' : 'opacity-85'
                                    }`}
                                >
                                    {!noti.read && (
                                        <span className="absolute top-4 right-4 w-2.5 h-2.5 bg-[#0066FF] rounded-full"></span>
                                    )}

                                    <div
                                        className="p-3 rounded-xl shrink-0"
                                        style={{ backgroundColor: getBgColor(noti.type) }}
                                    >
                                        {getIcon(noti.type)}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 mb-1">
                                            <h3 className="font-bold text-base text-gray-900 truncate pr-4">
                                                {noti.title}
                                            </h3>
                                            <span className="text-xs font-semibold text-gray-400 whitespace-nowrap">
                                                {new Date(noti.createdAt).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric'
                                                })}
                                                {', '}
                                                {new Date(noti.createdAt).toLocaleTimeString('en-US', {
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </span>
                                        </div>

                                        <p className="text-sm font-semibold text-gray-600 mb-3 leading-relaxed">
                                            {noti.message}
                                        </p>

                                        <div className="flex items-center space-x-3">
                                            <button 
                                                className="bg-[#00B4D8] hover:bg-[#0096B4] text-white text-xs font-bold py-2 px-4 rounded-lg transition-colors shadow-sm"
                                                onClick={() => handleActionClick(noti)}
                                            >
                                                {noti.actionLabel}
                                            </button>

                                            {!noti.read && (
                                                <button
                                                    onClick={() => markAsRead(noti._id)}
                                                    disabled={actionLoading === noti._id}
                                                    className="text-gray-400 hover:text-[#0052CC] text-xs font-bold py-2 px-3 rounded-lg flex items-center space-x-1.5 hover:bg-gray-50 transition-colors disabled:opacity-50"
                                                >
                                                    {actionLoading === noti._id ? (
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                    ) : (
                                                        <CheckCircle className="w-4 h-4" />
                                                    )}
                                                    <span>Mark read</span>
                                                </button>
                                            )}
                                            
                                            <button
                                                onClick={() => deleteNotification(noti._id)}
                                                className="text-gray-300 hover:text-red-500 text-xs p-2 rounded-lg hover:bg-gray-50 transition-colors"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
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