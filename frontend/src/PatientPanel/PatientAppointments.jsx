// PatientAppointment.jsx -
import React, { useState, useEffect, useCallback } from 'react';
import {
    SquarePlus,
    Bell,
    User,
    AlertTriangle,
    ChevronDown,
    Menu,
    X,
    Loader2,
    Eye,
    Calendar,
    Clock,
    User as UserIcon,
    Phone,
    Mail,
    MapPin,
    Stethoscope,
    FileText,
    CheckCircle,
    XCircle,
    RefreshCw
} from 'lucide-react';
import Navbar from './Navbar.jsx';
import BookAppointmentModal from './BookAppointmentModal.jsx';
import ViewAppointmentModal from './ViewAppointmentModal.jsx';
import { appointmentService } from '../services/appointmentService';

export default function AppointmentsDashboard() {
    const [activeTab, setActiveTab] = useState('All');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [notification, setNotification] = useState({ type: '', message: '' });
    const [cancellingId, setCancellingId] = useState(null);

    // Fetch appointments - wrapped in useCallback to prevent infinite loop
    const fetchAppointments = useCallback(async () => {
        try {
            setLoading(true);
            const response = await appointmentService.getMyAppointments();
            if (response.success) {
                setAppointments(response.data);
            }
        } catch (error) {
            console.error('Error fetching appointments:', error);
            showNotification('error', error.message || 'Failed to load appointments');
        } finally {
            setLoading(false);
        }
    }, []);

    // Show notification
    const showNotification = useCallback((type, message) => {
        setNotification({ type, message });
        setTimeout(() => setNotification({ type: '', message: '' }), 5000);
    }, []);

    // Fetch appointments on mount - only once
    useEffect(() => {
        fetchAppointments();
    }, [fetchAppointments]);

    // Filter appointments based on active tab
    const getFilteredAppointments = useCallback(() => {
        switch (activeTab) {
            case 'Upcoming':
                return appointments.filter(a => a.status === 'Scheduled' || a.status === 'Pending');
            case 'Pending':
                return appointments.filter(a => a.status === 'Pending');
            case 'Past':
                return appointments.filter(a => a.status === 'Completed' || a.status === 'Cancelled');
            default:
                return appointments;
        }
    }, [appointments, activeTab]);

    const filteredAppointments = getFilteredAppointments();

    // Handle view appointment
    const handleViewAppointment = (appointment) => {
        setSelectedAppointment(appointment);
        setIsViewModalOpen(true);
    };

    // Handle cancel appointment
    const handleCancelAppointment = async (appointmentId) => {
        try {
            setCancellingId(appointmentId);
            const response = await appointmentService.cancelAppointment(appointmentId);
            if (response.success) {
                // Update the appointments list locally - immediate update
                const updatedAppointments = appointments.map(appt => 
                    appt._id === appointmentId 
                        ? { ...appt, status: 'Cancelled' }
                        : appt
                );
                setAppointments(updatedAppointments);
                
                showNotification('success', 'Appointment cancelled successfully');
                
                // Also refresh from server to ensure consistency
                await fetchAppointments();
                
                return { success: true };
            } else {
                showNotification('error', response.message || 'Failed to cancel appointment');
                return { success: false };
            }
        } catch (error) {
            console.error('Error cancelling appointment:', error);
            showNotification('error', error.message || 'Failed to cancel appointment');
            return { success: false };
        } finally {
            setCancellingId(null);
        }
    };

    // Handle print appointment
    const handlePrintAppointment = (appointment) => {
        console.log('Printing appointment:', appointment);
    };

    // Get status badge styling
    const getStatusBadge = (status) => {
        const classes = {
            'Scheduled': 'bg-green-100 text-green-800',
            'Pending': 'bg-orange-100 text-orange-800',
            'Completed': 'bg-blue-100 text-blue-800',
            'Cancelled': 'bg-red-100 text-red-800'
        };
        return classes[status] || 'bg-gray-100 text-gray-800';
    };

    // Get count for tabs
    const getCountForTab = useCallback((tab) => {
        switch (tab) {
            case 'All': return appointments.length;
            case 'Upcoming': return appointments.filter(a => a.status === 'Scheduled' || a.status === 'Pending').length;
            case 'Pending': return appointments.filter(a => a.status === 'Pending').length;
            case 'Past': return appointments.filter(a => a.status === 'Completed' || a.status === 'Cancelled').length;
            default: return 0;
        }
    }, [appointments]);

    // Check if there are pending alerts
    const hasPendingAlerts = appointments.some(a => a.status === 'Pending');

    if (loading) {
        return (
            <div className="min-h-screen bg-[#F0F6FA]">
                <Navbar />
                <div className="flex items-center justify-center h-[80vh]">
                    <div className="text-center">
                        <Loader2 className="w-12 h-12 text-[#00B4D8] animate-spin mx-auto mb-4" />
                        <p className="text-gray-600">Loading your appointments...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full bg-[#F0F6FA] font-sans antialiased flex flex-col">
            <Navbar />

            {/* Notification Toast */}
            {notification.message && (
                <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center gap-3 ${
                    notification.type === 'success' 
                        ? 'bg-green-50 text-green-800 border border-green-200' 
                        : notification.type === 'error'
                        ? 'bg-red-50 text-red-800 border border-red-200'
                        : 'bg-blue-50 text-blue-800 border border-blue-200'
                }`}>
                    {notification.type === 'success' && <CheckCircle className="w-5 h-5" />}
                    {notification.type === 'error' && <XCircle className="w-5 h-5" />}
                    {notification.type === 'info' && <RefreshCw className="w-5 h-5" />}
                    <span className="font-medium">{notification.message}</span>
                </div>
            )}

            {/* Main Container */}
            <main className="flex-1 w-full max-w-[1400px] mx-auto px-4 sm:px-8 py-6 sm:py-8 flex flex-col justify-between">
                <div className="flex-1">
                    {/* Title and Action Button Row */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#0f4c81]">
                            My Appointments
                        </h1>
                        <button 
                            className="bg-[#00B4D8] hover:bg-[#0096B4] text-white font-medium py-2.5 px-6 rounded-lg flex items-center justify-center space-x-2 shadow transition-all self-start sm:self-auto w-full sm:w-auto"
                            onClick={() => setIsBookingModalOpen(true)}
                        >
                            <span className="text-xl leading-none font-light">+</span>
                            <span>Book Appointment</span>
                        </button>
                    </div>

                    {/* Immediate Actions & Alerts Component */}
                    {hasPendingAlerts && (
                        <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-100 mb-8 w-full">
                            <h2 className="text-[#FF4D4D] font-bold text-lg mb-4">Immediate Actions & Alerts</h2>
                            <div className="flex items-start space-x-4">
                                <AlertTriangle className="w-6 h-6 text-red-500" />
                                <div className="flex-1">
                                    <p className="text-[#0066FF] font-bold text-sm sm:text-base md:text-lg mb-3 leading-snug">
                                        ALERT: You have {appointments.filter(a => a.status === 'Pending').length} pending appointment(s) that need confirmation.
                                    </p>
                                    <button 
                                        className="bg-[#00B4D8] hover:bg-[#0096B4] text-white text-xs font-bold py-2 px-4 rounded-lg transition-colors shadow-sm"
                                        onClick={() => setActiveTab('Pending')}
                                    >
                                        View Pending
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Filter Navigation Tabs & Counters */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                        <div className="flex items-center space-x-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none w-full sm:w-auto">
                            {['All', 'Upcoming', 'Pending', 'Past'].map((tab) => {
                                const isActive = activeTab === tab;
                                const count = getCountForTab(tab);
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
                                        {count > 0 && (
                                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                                                isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
                                            }`}>
                                                {count}
                                            </span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                        <div className="text-[#5977a5] font-light self-end sm:self-auto pr-2">
                            {filteredAppointments.length} appointments
                        </div>
                    </div>

                    {/* Appointments Data Table Card */}
                    <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden w-full mb-8">
                        {filteredAppointments.length === 0 ? (
                            <div className="text-center py-12">
                                <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <p className="text-gray-500 text-lg">No appointments found</p>
                                <p className="text-gray-400 text-sm mt-2">Book your first appointment today</p>
                                <button 
                                    className="mt-4 bg-[#00B4D8] hover:bg-[#0096B4] text-white font-medium py-2 px-6 rounded-lg transition-colors"
                                    onClick={() => setIsBookingModalOpen(true)}
                                >
                                    Book Appointment
                                </button>
                            </div>
                        ) : (
                            <div className="w-full overflow-x-auto">
                                <table className="w-full text-left border-collapse min-w-[900px] lg:min-w-0">
                                    <thead>
                                        <tr className="bg-[#0487BD] text-white font-bold text-xs sm:text-sm">
                                            <th className="py-4 px-4 sm:px-6 text-center">Date</th>
                                            <th className="py-4 px-4 sm:px-6 text-center">Time</th>
                                            <th className="py-4 px-4 sm:px-6">Doctor</th>
                                            <th className="py-4 px-4 sm:px-6">Reason</th>
                                            <th className="py-4 px-4 sm:px-6 text-center">Age/Gender</th>
                                            <th className="py-4 px-4 sm:px-6 text-center">Status</th>
                                            <th className="py-4 px-4 sm:px-6 text-center">Type</th>
                                            <th className="py-4 px-4 sm:px-6 text-center" colSpan="2">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#BCE1EC]">
                                        {filteredAppointments.map((appt) => {
                                            const canCancel = appt.status !== 'Completed' && appt.status !== 'Cancelled';
                                            return (
                                                <tr key={appt._id} className="hover:bg-slate-50 transition-colors text-sm sm:text-base">
                                                    <td className="py-5 px-4 sm:px-6 font-medium text-gray-800 text-center whitespace-nowrap">
                                                        {appt.preferredDate || '--'}
                                                    </td>
                                                    <td className="py-5 px-4 sm:px-6 font-medium text-gray-800 text-center whitespace-nowrap">
                                                        {appt.preferredTime || '--'}
                                                    </td>
                                                    <td className="py-5 px-4 sm:px-6 font-medium text-gray-800 whitespace-nowrap">
                                                        {appt.doctor || '--'}
                                                    </td>
                                                    <td className="py-5 px-4 sm:px-6 font-medium text-gray-700 max-w-[150px] truncate">
                                                        {appt.reasonForVisit || '--'}
                                                    </td>
                                                    <td className="py-5 px-4 sm:px-6 font-medium text-gray-700 text-center whitespace-nowrap">
                                                        {appt.age}/{appt.gender || '--'}
                                                    </td>
                                                    <td className="py-5 px-4 sm:px-6 text-center whitespace-nowrap">
                                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusBadge(appt.status)}`}>
                                                            {appt.status || 'Pending'}
                                                        </span>
                                                    </td>
                                                    <td className="py-5 px-4 sm:px-6 font-medium text-gray-700 text-center whitespace-nowrap">
                                                        {appt.appointmentType || 'In-Person'}
                                                    </td>
                                                    <td className="py-5 px-2 sm:px-3 text-center whitespace-nowrap">
                                                        <button 
                                                            className="bg-blue-500 hover:bg-blue-600 text-white font-bold text-xs sm:text-sm py-1.5 px-3 rounded-full shadow-sm transition-colors flex items-center gap-1"
                                                            onClick={() => handleViewAppointment(appt)}
                                                        >
                                                            <Eye className="w-3 h-3" />
                                                            <span className="hidden sm:inline">View</span>
                                                        </button>
                                                    </td>
                                                    <td className="py-5 px-2 sm:px-3 text-center whitespace-nowrap">
                                                        {canCancel ? (
                                                            <button 
                                                                className="bg-red-500 hover:bg-red-600 text-white font-bold text-xs sm:text-sm py-1.5 px-3 rounded-full shadow-sm transition-colors flex items-center gap-1 disabled:opacity-50"
                                                                onClick={() => handleCancelAppointment(appt._id)}
                                                                disabled={cancellingId === appt._id}
                                                            >
                                                                {cancellingId === appt._id ? (
                                                                    <Loader2 className="w-3 h-3 animate-spin" />
                                                                ) : (
                                                                    'Cancel'
                                                                )}
                                                            </button>
                                                        ) : (
                                                            <span className="text-gray-400 text-xs">
                                                                {appt.status === 'Completed' ? '✓ Done' : '--'}
                                                            </span>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Book Appointment Modal */}
            <BookAppointmentModal 
                isOpen={isBookingModalOpen} 
                onClose={() => {
                    setIsBookingModalOpen(false);
                    fetchAppointments();
                }} 
            />

            {/* View Appointment Modal */}
            <ViewAppointmentModal
                isOpen={isViewModalOpen}
                onClose={() => {
                    setIsViewModalOpen(false);
                    setSelectedAppointment(null);
                }}
                appointment={selectedAppointment}
                onCancel={handleCancelAppointment}
                onPrint={handlePrintAppointment}
            />
        </div>
    );
}