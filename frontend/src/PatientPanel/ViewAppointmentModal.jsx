import React, { useState } from 'react';
import {
    X,
    Calendar,
    Clock,
    User as UserIcon,
    Phone,
    Mail,
    MapPin,
    Stethoscope,
    FileText,
    AlertCircle,
    CheckCircle,
    XCircle,
    Clock as ClockIcon,
    Loader2,
    Printer,
    CalendarDays,
    UserCircle,
    Building2,
    ClipboardList
} from 'lucide-react';

export default function ViewAppointmentModal({ 
    isOpen, 
    onClose, 
    appointment,
    onCancel,
    onPrint
}) {
    const [loading, setLoading] = useState(false);

    if (!isOpen || !appointment) return null;

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Scheduled':
                return <CheckCircle className="w-5 h-5 text-green-500" />;
            case 'Pending':
                return <ClockIcon className="w-5 h-5 text-orange-500" />;
            case 'Completed':
                return <CheckCircle className="w-5 h-5 text-blue-500" />;
            case 'Cancelled':
                return <XCircle className="w-5 h-5 text-red-500" />;
            default:
                return <AlertCircle className="w-5 h-5 text-gray-500" />;
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            'Scheduled': 'text-green-600',
            'Pending': 'text-orange-600',
            'Completed': 'text-blue-600',
            'Cancelled': 'text-red-600'
        };
        return colors[status] || 'text-gray-600';
    };

    const getStatusBadge = (status) => {
        const classes = {
            'Scheduled': 'bg-green-100 text-green-800',
            'Pending': 'bg-orange-100 text-orange-800',
            'Completed': 'bg-blue-100 text-blue-800',
            'Cancelled': 'bg-red-100 text-red-800'
        };
        return classes[status] || 'bg-gray-100 text-gray-800';
    };

    const handleCancelAction = async () => {
        if (!window.confirm('Are you sure you want to cancel this appointment?')) return;
        
        setLoading(true);
        try {
            if (onCancel) {
                const result = await onCancel(appointment._id);
                if (result && result.success) {
                    onClose();
                }
            }
        } catch (error) {
            console.error('Error cancelling appointment:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePrintAction = () => {
        if (onPrint) onPrint(appointment);
        window.print();
    };

    // Format date for display
    const formatDate = (dateStr) => {
        if (!dateStr) return 'N/A';
        try {
            const date = new Date(dateStr);
            return date.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch {
            return dateStr;
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header - Similar to Book Modal */}
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <h2 className="text-xl font-bold text-[#0f4c81]">Appointment Details</h2>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusBadge(appointment.status)}`}>
                            {appointment.status || 'Pending'}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handlePrintAction}
                            className="p-2 text-gray-500 hover:bg-gray-50 rounded-lg transition"
                            title="Print Details"
                        >
                            <Printer className="w-4 h-4" />
                        </button>
                        <button 
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-full transition"
                        >
                            <X className="w-5 h-5 text-gray-500" />
                        </button>
                    </div>
                </div>

                <div className="p-6 space-y-6">
                    {/* Appointment ID - Form style */}
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div className="flex items-center gap-2 mb-1">
                            <ClipboardList className="w-4 h-4 text-[#0f4c81]" />
                            <p className="text-xs font-medium text-gray-500">Appointment ID</p>
                        </div>
                        <p className="text-sm font-bold text-gray-800">{appointment.appointmentId || 'N/A'}</p>
                    </div>

                    {/* Personal Information Section - Like Book Modal */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                            <UserIcon className="w-4 h-4 text-[#00B4D8]" />
                            Personal Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                                <label className="block text-xs font-medium text-gray-500 mb-1">Full Name</label>
                                <p className="text-sm font-medium text-gray-800">{appointment.fullName || 'N/A'}</p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                                <label className="block text-xs font-medium text-gray-500 mb-1">Phone Number</label>
                                <p className="text-sm font-medium text-gray-800">{appointment.phoneNumber || 'N/A'}</p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                                <label className="block text-xs font-medium text-gray-500 mb-1">Email</label>
                                <p className="text-sm font-medium text-gray-800">{appointment.email || 'N/A'}</p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                                <label className="block text-xs font-medium text-gray-500 mb-1">Age</label>
                                <p className="text-sm font-medium text-gray-800">{appointment.age || 'N/A'}</p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                                <label className="block text-xs font-medium text-gray-500 mb-1">Gender</label>
                                <p className="text-sm font-medium text-gray-800">{appointment.gender || 'N/A'}</p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                                <label className="block text-xs font-medium text-gray-500 mb-1">Address</label>
                                <p className="text-sm font-medium text-gray-800">{appointment.address || 'N/A'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Appointment Details Section - Like Book Modal */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                            <CalendarDays className="w-4 h-4 text-[#00B4D8]" />
                            Appointment Details
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                                <label className="block text-xs font-medium text-gray-500 mb-1">Department</label>
                                <p className="text-sm font-medium text-gray-800">{appointment.department || 'N/A'}</p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                                <label className="block text-xs font-medium text-gray-500 mb-1">Doctor</label>
                                <p className="text-sm font-medium text-gray-800">{appointment.doctor || 'N/A'}</p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                                <label className="block text-xs font-medium text-gray-500 mb-1">Appointment Type</label>
                                <p className="text-sm font-medium text-gray-800">{appointment.appointmentType || 'In-Person'}</p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                                <label className="block text-xs font-medium text-gray-500 mb-1">Preferred Date</label>
                                <p className="text-sm font-medium text-gray-800 flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-gray-400" />
                                    {formatDate(appointment.preferredDate)}
                                </p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                                <label className="block text-xs font-medium text-gray-500 mb-1">Preferred Time</label>
                                <p className="text-sm font-medium text-gray-800 flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-gray-400" />
                                    {appointment.preferredTime || 'N/A'}
                                </p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                                <label className="block text-xs font-medium text-gray-500 mb-1">Status</label>
                                <div className="flex items-center gap-2 mt-1">
                                    {getStatusIcon(appointment.status)}
                                    <span className={`font-bold ${getStatusColor(appointment.status)}`}>
                                        {appointment.status || 'Pending'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Medical Details Section - Like Book Modal */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                            <Stethoscope className="w-4 h-4 text-[#00B4D8]" />
                            Medical Details
                        </h3>
                        <div className="space-y-4">
                            <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                                <label className="block text-xs font-medium text-gray-500 mb-1">Reason for Visit</label>
                                <p className="text-sm font-medium text-gray-800">{appointment.reasonForVisit || 'N/A'}</p>
                            </div>
                            {appointment.symptoms && (
                                <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                                    <label className="block text-xs font-medium text-gray-500 mb-1">Symptoms</label>
                                    <p className="text-sm font-medium text-gray-800">{appointment.symptoms}</p>
                                </div>
                            )}
                            {appointment.documentPath && (
                                <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                                    <label className="block text-xs font-medium text-gray-500 mb-1">Attached Document</label>
                                    <p className="text-sm font-medium text-blue-600 hover:underline cursor-pointer">
                                        <FileText className="w-4 h-4 inline mr-1" />
                                        View Document
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Additional Info - Like Book Modal */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                            <ClockIcon className="w-4 h-4 text-[#00B4D8]" />
                            Additional Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                                <label className="block text-xs font-medium text-gray-500 mb-1">Created On</label>
                                <p className="text-sm font-medium text-gray-800">
                                    {appointment.createdAt ? new Date(appointment.createdAt).toLocaleDateString('en-US', {
                                        month: 'long',
                                        day: 'numeric',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    }) : 'N/A'}
                                </p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                                <label className="block text-xs font-medium text-gray-500 mb-1">Last Updated</label>
                                <p className="text-sm font-medium text-gray-800">
                                    {appointment.updatedAt ? new Date(appointment.updatedAt).toLocaleDateString('en-US', {
                                        month: 'long',
                                        day: 'numeric',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    }) : 'N/A'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons - Like Book Modal */}
                    <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
                        {appointment.status !== 'Completed' && appointment.status !== 'Cancelled' && (
                            <button
                                onClick={handleCancelAction}
                                className="flex items-center gap-2 px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition disabled:opacity-50"
                                disabled={loading}
                            >
                                {loading ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <XCircle className="w-4 h-4" />
                                )}
                                {loading ? 'Cancelling...' : 'Cancel Appointment'}
                            </button>
                        )}
                        <button
                            onClick={onClose}
                            className="flex items-center gap-2 px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition ml-auto"
                        >
                            <X className="w-4 h-4" />
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}