import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import {
    Calendar, FileText, Download, ArrowRight, Send,
    CheckCircle2, Heart, Activity, Droplets, TrendingUp,
    Siren, Pill, Loader2, AlertCircle, Bell, User, CreditCard
} from 'lucide-react';
import { dashboardService } from '../services/dashboardService.js';

export default function PatientDashboard() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [dashboardData, setDashboardData] = useState({
        user: { name: 'Patient', email: '' },
        stats: {
            totalAppointments: 0,
            pendingBills: 0,
            paidBills: 0,
            totalBills: 0,
            upcomingAppointments: 0,
            totalMedicalExpenses: 0,
            pendingAmount: 0
        },
        alerts: [],
        healthSummary: {
            bloodPressure: 'Not recorded',
            bloodPressureStatus: 'Not available',
            heartRate: 'Not recorded',
            heartRateStatus: 'Not available',
            bloodSugar: 'Not recorded',
            bloodSugarStatus: 'Not available'
        },
        latestPrescriptions: [],
        upcomingAppointments: [],
        pendingBills: [],
        careTeam: [],
        notifications: []
    });

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            setError(null);
            
            console.log('Fetching dashboard data...');
            const response = await dashboardService.getPatientDashboard();
            console.log('Dashboard response:', response);
            
            if (response.success && response.data) {
                setDashboardData(response.data);
            } else {
                setError(response.message || 'Could not load dashboard data');
            }
        } catch (error) {
            console.error('Error fetching dashboard:', error);
            setError('Failed to load dashboard. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
                year: 'numeric'
            });
        } catch {
            return dateString;
        }
    };

    const formatShortDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            });
        } catch {
            return dateString;
        }
    };

    // Navigation Functions - Using correct paths from App.js
    const handleBookAppointment = () => {
        navigate('/patient-appointments');
    };

    const handleViewAppointments = () => {
        navigate('/patient-appointments');
    };

    const handleViewBills = () => {
        navigate('/patient-bills');
    };

    const handlePayBill = (billId) => {
        navigate('/patient-bills');
    };

    const handleViewPrescription = (prescriptionId) => {
        if (prescriptionId) {
            window.open(`/api/prescriptions/${prescriptionId}/download`, '_blank');
        }
    };

    const handleDownloadPrescription = (prescriptionId) => {
        if (prescriptionId) {
            window.open(`/api/prescriptions/${prescriptionId}/download`, '_blank');
        }
    };

    const handleGetDirections = (appointment) => {
        if (appointment?.location) {
            window.open(`https://www.google.com/maps/search/${encodeURIComponent(appointment.location)}`, '_blank');
        }
    };

    const handleReschedule = (appointmentId) => {
        navigate(`/patient-appointments`);
    };

    const handleViewNotifications = () => {
        navigate('/patient-notifications');
    };

    const handleViewProfile = () => {
        navigate('/patient-profile');
    };

    const handleViewMedicalRecords = () => {
        navigate('/patient-history');
    };

    const handleViewInsurance = () => {
        navigate('/patient-profile');
    };

    const handleRequestRefill = () => {
        navigate('/patient-appointments');
    };

    const handleContactSupport = () => {
        navigate('/patient-profile');
    };

    const handleViewEmergency = () => {
        navigate('/patient-profile');
    };

    const handleBookLabAppointment = () => {
        navigate('/lab-appointments/book');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#f0f5fa]">
                <Navbar />
                <div className="flex items-center justify-center h-[80vh]">
                    <div className="text-center">
                        <Loader2 className="w-12 h-12 text-[#00b4d8] animate-spin mx-auto mb-4" />
                        <p className="text-gray-600">Loading your dashboard...</p>
                    </div>
                </div>
            </div>
        );
    }

    const today = new Date();
    const todayFormatted = today.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    });

    return (
        <div className="min-h-screen w-full bg-[#f0f5fa] font-sans antialiased text-[#0f4c81] flex flex-col">

            <Navbar />

            {error && (
                <div className="max-w-[1400px] mx-auto px-4 sm:px-8 pt-4">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-700">
                        <AlertCircle className="w-4 h-4 inline mr-2" />
                        {error}
                        <button 
                            onClick={fetchDashboardData}
                            className="ml-4 text-blue-600 hover:underline font-medium"
                        >
                            Retry
                        </button>
                    </div>
                </div>
            )}

            <main className="flex-1 w-full max-w-[1400px] mx-auto px-4 sm:px-8 py-6 sm:py-8 space-y-6">

                {/* Hero Section */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div>
                        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#0f4c81]">
                            Welcome Back, {dashboardData.user?.name || 'Patient'}
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">
                            {todayFormatted}
                        </p>
                    </div>
                    <div className="flex gap-3 flex-wrap">
                        <button 
                            onClick={handleBookAppointment}
                            className="bg-[#00b4d8] hover:bg-[#0096b4] text-white font-semibold px-6 py-2.5 rounded-lg text-sm transition shadow-sm"
                        >
                            Book Appointment
                        </button>
                        <button 
                            onClick={handleViewProfile}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-6 py-2.5 rounded-lg text-sm transition flex items-center gap-2"
                        >
                            <User className="w-4 h-4" /> Profile
                        </button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                        <p className="text-xs text-gray-500 font-medium">Total Appointments</p>
                        <p className="text-2xl font-bold text-[#0f4c81] mt-1">
                            {dashboardData.stats?.totalAppointments || 0}
                        </p>
                        <button 
                            onClick={handleViewAppointments}
                            className="text-[#00b4d8] text-xs font-medium hover:underline mt-1"
                        >
                            View All →
                        </button>
                    </div>
                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                        <p className="text-xs text-gray-500 font-medium">Pending Bills</p>
                        <p className="text-2xl font-bold text-red-500 mt-1">
                            Rs. {dashboardData.stats?.pendingAmount?.toFixed(0) || 0}
                        </p>
                        <button 
                            onClick={handleViewBills}
                            className="text-[#00b4d8] text-xs font-medium hover:underline mt-1"
                        >
                            Pay Now →
                        </button>
                    </div>
                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                        <p className="text-xs text-gray-500 font-medium">Upcoming</p>
                        <p className="text-2xl font-bold text-green-600 mt-1">
                            {dashboardData.stats?.upcomingAppointments || 0}
                        </p>
                        <button 
                            onClick={handleViewAppointments}
                            className="text-[#00b4d8] text-xs font-medium hover:underline mt-1"
                        >
                            View Schedule →
                        </button>
                    </div>
                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                        <p className="text-xs text-gray-500 font-medium">Total Bills</p>
                        <p className="text-2xl font-bold text-[#0f4c81] mt-1">
                            Rs. {dashboardData.stats?.totalMedicalExpenses?.toFixed(0) || 0}
                        </p>
                        <button 
                            onClick={handleViewBills}
                            className="text-[#00b4d8] text-xs font-medium hover:underline mt-1"
                        >
                            View Bills →
                        </button>
                    </div>
                </div>

                {/* Alerts Section */}
                {dashboardData.alerts && dashboardData.alerts.length > 0 && (
                    <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h2 className="text-red-500 font-bold text-lg mb-4 flex items-center gap-2">
                            <Siren className="w-5 h-5" /> Alerts
                        </h2>
                        <div className="space-y-3">
                            {dashboardData.alerts.map((alert, index) => (
                                <div key={index} className={`flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 rounded-xl border ${alert.type === 'urgent' ? 'bg-red-50/60 border-red-200' : 'bg-blue-50/60 border-blue-200'}`}>
                                    <div className="flex items-start gap-3">
                                        <div className={`${alert.type === 'urgent' ? 'text-red-500' : 'text-blue-500'} mt-0.5`}>
                                            {alert.type === 'urgent' ? <AlertCircle className="w-5 h-5" /> : <Bell className="w-5 h-5" />}
                                        </div>
                                        <div>
                                            <p className={`font-semibold text-sm ${alert.type === 'urgent' ? 'text-red-700' : 'text-blue-700'}`}>
                                                {alert.message}
                                            </p>
                                        </div>
                                    </div>
                                    {alert.action && (
                                        <button 
                                            onClick={() => {
                                                if (alert.actionType === 'pay') {
                                                    handlePayBill(alert.actionId);
                                                } else if (alert.actionType === 'directions') {
                                                    handleGetDirections(alert.actionData);
                                                } else if (alert.actionType === 'book') {
                                                    handleBookAppointment();
                                                }
                                            }}
                                            className={`${alert.type === 'urgent' ? 'bg-red-500 hover:bg-red-600' : 'bg-[#00b4d8] hover:bg-[#0096b4]'} text-white text-xs font-bold px-5 py-2 rounded-lg shrink-0`}
                                        >
                                            {alert.action}
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Health Snapshot */}
                <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h2 className="text-[#0f4c81] font-bold text-lg mb-6">My Health at a Glance</h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                        {/* Health Summary */}
                        <div className="border border-gray-200 rounded-2xl p-4 shadow-sm">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold text-[#0f4c81]">Health Summary</h3>
                                <button 
                                    onClick={handleViewMedicalRecords}
                                    className="text-[#00b4d8] text-xs font-medium hover:underline"
                                >
                                    View Records →
                                </button>
                            </div>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                                    <span className="flex items-center gap-2 text-blue-600 font-medium">
                                        <Heart className="w-4 h-4 text-red-400" /> Blood Pressure
                                    </span>
                                    <span className="font-bold text-gray-800">{dashboardData.healthSummary?.bloodPressure || 'Not recorded'}</span>
                                    <span className="text-xs text-blue-500">{dashboardData.healthSummary?.bloodPressureStatus || ''}</span>
                                </div>
                                <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                                    <span className="flex items-center gap-2 text-blue-600 font-medium">
                                        <Activity className="w-4 h-4 text-red-500" /> Heart Rate
                                    </span>
                                    <span className="font-bold text-gray-800">{dashboardData.healthSummary?.heartRate || 'Not recorded'}</span>
                                    <span className="text-xs text-blue-500">{dashboardData.healthSummary?.heartRateStatus || ''}</span>
                                </div>
                                <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                                    <span className="flex items-center gap-2 text-blue-600 font-medium">
                                        <Droplets className="w-4 h-4 text-blue-400" /> Blood Sugar
                                    </span>
                                    <span className="font-bold text-gray-800">{dashboardData.healthSummary?.bloodSugar || 'Not recorded'}</span>
                                    <span className="text-xs text-blue-500">{dashboardData.healthSummary?.bloodSugarStatus || ''}</span>
                                </div>
                            </div>
                            <div className="flex justify-end items-center gap-2 pt-3 border-t border-gray-50 mt-3">
                                <TrendingUp className="w-4 h-4 text-blue-400" />
                                <span className="text-xs text-gray-500">Health Trends</span>
                            </div>
                        </div>

                        {/* Latest Prescriptions */}
                        <div className="border border-gray-200 rounded-2xl p-4 shadow-sm">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold text-[#0f4c81]">Latest Prescriptions</h3>
                                <button 
                                    onClick={() => navigate('/patient-appointments')}
                                    className="text-[#00b4d8] text-xs font-medium hover:underline"
                                >
                                    View All →
                                </button>
                            </div>

                            {dashboardData.latestPrescriptions && dashboardData.latestPrescriptions.length > 0 ? (
                                <>
                                    <div className="flex justify-between text-xs font-semibold text-blue-600 mb-3">
                                        <span>Dr. {dashboardData.latestPrescriptions[0]?.doctorName || 'N/A'}</span>
                                        <span className="text-gray-400 font-normal">
                                            {formatShortDate(dashboardData.latestPrescriptions[0]?.issuedDate)}
                                        </span>
                                    </div>
                                    <div className="space-y-2">
                                        {dashboardData.latestPrescriptions.slice(0, 2).map((prescription, index) => (
                                            <div key={index} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                                                <span className="flex items-center gap-2 text-sm font-medium text-gray-800">
                                                    <Pill className="w-4 h-4 text-blue-500" /> {prescription.medicineName}
                                                </span>
                                                <span className="text-xs text-gray-500">{prescription.dosage}</span>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <div className="text-center py-6 text-gray-400 text-sm">
                                    No prescriptions available
                                </div>
                            )}

                            {dashboardData.latestPrescriptions && dashboardData.latestPrescriptions.length > 0 && (
                                <button 
                                    onClick={() => handleDownloadPrescription(dashboardData.latestPrescriptions[0]?.id)}
                                    className="w-full mt-4 bg-[#00b4d8] hover:bg-[#0096b4] text-white text-xs font-bold py-2 rounded-lg flex items-center justify-center gap-2"
                                >
                                    <Download className="w-3 h-3" /> Download Prescription
                                </button>
                            )}
                        </div>
                    </div>
                </section>

                {/* 3 Column Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Upcoming Appointments */}
                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
                        <div>
                            <div className="flex justify-between items-center mb-3">
                                <h3 className="font-bold text-base text-blue-900">Upcoming Appointments</h3>
                                <button 
                                    onClick={handleViewAppointments}
                                    className="text-[#00b4d8] text-xs font-medium hover:underline"
                                >
                                    View All
                                </button>
                            </div>
                            {dashboardData.upcomingAppointments && dashboardData.upcomingAppointments.length > 0 ? (
                                <>
                                    <h4 className="text-sm font-bold text-blue-600 mb-3">
                                        Dr. {dashboardData.upcomingAppointments[0]?.doctorName} 
                                        <span className="text-xs font-normal text-gray-500 ml-2">
                                            [{dashboardData.upcomingAppointments[0]?.specialty || 'General'}]
                                        </span>
                                    </h4>
                                    <div className="space-y-2.5 text-sm">
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <Calendar className="w-4 h-4 text-blue-500" />
                                            <span>{formatDate(dashboardData.upcomingAppointments[0]?.date)}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <span className="text-blue-500 font-bold">⏰</span>
                                            <span>{dashboardData.upcomingAppointments[0]?.time || '10:00 AM'}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <span className="text-blue-500 font-bold">📍</span>
                                            <span>{dashboardData.upcomingAppointments[0]?.location || 'Clinic'}</span>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="text-center py-6 text-gray-400 text-sm">
                                    No upcoming appointments
                                </div>
                            )}
                        </div>
                        {dashboardData.upcomingAppointments && dashboardData.upcomingAppointments.length > 0 && (
                            <div className="flex gap-2 pt-4 border-t border-gray-100 mt-4">
                                <button 
                                    onClick={() => handleGetDirections(dashboardData.upcomingAppointments[0])}
                                    className="flex-1 bg-[#00b4d8] hover:bg-[#0096b4] text-white text-xs font-bold py-2 rounded-lg"
                                >
                                    Get Directions
                                </button>
                                <button 
                                    onClick={() => handleReschedule(dashboardData.upcomingAppointments[0]?.id)}
                                    className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-bold py-2 rounded-lg"
                                >
                                    Reschedule
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Pending Bills */}
                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold text-base text-blue-900">Pending Bills</h3>
                                <button 
                                    onClick={handleViewBills}
                                    className="text-[#00b4d8] text-xs font-medium hover:underline"
                                >
                                    View All
                                </button>
                            </div>
                            {dashboardData.pendingBills && dashboardData.pendingBills.length > 0 ? (
                                <div className="space-y-3">
                                    {dashboardData.pendingBills.slice(0, 2).map((bill, index) => (
                                        <div key={index} className="border-b border-gray-100 pb-2 last:border-0">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600">Invoice #{bill.billId || 'N/A'}</span>
                                                <span className="font-bold text-red-600">Rs. {bill.amount || 0}</span>
                                            </div>
                                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                                                <span>Due: {bill.dueDate || 'N/A'}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-6 text-gray-400 text-sm">
                                    No pending bills 🎉
                                </div>
                            )}
                        </div>
                        {dashboardData.pendingBills && dashboardData.pendingBills.length > 0 && (
                            <button 
                                onClick={handlePayBill}
                                className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white text-sm font-bold py-2.5 rounded-lg flex items-center justify-center gap-2"
                            >
                                <CreditCard className="w-4 h-4" /> Pay Now
                            </button>
                        )}
                    </div>

                    {/* Insurance Panel */}
                    <div className="bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between relative overflow-hidden">
                        <div className="z-10">
                            <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wider block mb-1">Axis Care + Hospitals</span>
                            <h3 className="text-2xl font-black text-purple-900 leading-tight">CASHLESS</h3>
                            <h3 className="text-2xl font-black text-purple-900 leading-tight">INSURANCE</h3>
                            <div className="mt-3 space-y-1">
                                <p className="text-xs text-purple-700 font-medium">✅ Coverage up to Rs. 5,00,000</p>
                                <p className="text-xs text-purple-600">✅ Cashless treatment at network hospitals</p>
                            </div>
                            <button 
                                onClick={handleBookLabAppointment}
                                className="mt-3 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold py-1.5 px-4 rounded-lg transition"
                            >
                                Book Lab Test →
                            </button>
                        </div>
                        <button 
                            onClick={handleViewInsurance}
                            className="mt-4 bg-white/80 hover:bg-white text-purple-700 text-xs font-bold py-2 px-4 rounded-lg border border-purple-200 transition z-10"
                        >
                            View Details →
                        </button>
                        <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-purple-200/30 rounded-full blur-2xl"></div>
                    </div>
                </div>

                {/* Quick Actions */}
                <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h2 className="text-[#0f4c81] font-bold text-lg mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <button 
                            onClick={handleViewMedicalRecords}
                            className="bg-blue-50 hover:bg-blue-100 p-4 rounded-xl text-center transition"
                        >
                            <FileText className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                            <div className="text-xs font-medium text-gray-700">Medical Records</div>
                        </button>
                        <button 
                            onClick={handleRequestRefill}
                            className="bg-green-50 hover:bg-green-100 p-4 rounded-xl text-center transition"
                        >
                            <Pill className="w-6 h-6 text-green-600 mx-auto mb-2" />
                            <div className="text-xs font-medium text-gray-700">Request Refill</div>
                        </button>
                        <button 
                            onClick={handleViewInsurance}
                            className="bg-purple-50 hover:bg-purple-100 p-4 rounded-xl text-center transition"
                        >
                            <CheckCircle2 className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                            <div className="text-xs font-medium text-gray-700">Insurance</div>
                        </button>
                        <button 
                            onClick={handleViewBills}
                            className="bg-orange-50 hover:bg-orange-100 p-4 rounded-xl text-center transition"
                        >
                            <CreditCard className="w-6 h-6 text-orange-600 mx-auto mb-2" />
                            <div className="text-xs font-medium text-gray-700">Pay Bills</div>
                        </button>
                    </div>
                </section>

                {/* Notifications */}
                {dashboardData.notifications && dashboardData.notifications.length > 0 && (
                    <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-[#0f4c81] font-bold text-lg flex items-center gap-2">
                                <Bell className="w-5 h-5" /> Recent Notifications
                            </h2>
                            <button 
                                onClick={handleViewNotifications}
                                className="text-[#00b4d8] text-xs font-medium hover:underline"
                            >
                                View All
                            </button>
                        </div>
                        <div className="space-y-2">
                            {dashboardData.notifications.slice(0, 3).map((notification, index) => (
                                <div key={index} className={`flex items-center justify-between p-3 rounded-lg ${notification.read ? 'bg-gray-50' : 'bg-blue-50 border border-blue-100'}`}>
                                    <div className="flex items-center gap-3">
                                        {!notification.read && <span className="w-2 h-2 bg-blue-500 rounded-full"></span>}
                                        <div>
                                            <p className="text-sm font-medium text-gray-800">{notification.title}</p>
                                            <p className="text-xs text-gray-500">{notification.message}</p>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={handleViewNotifications}
                                        className="text-[#00b4d8] text-xs font-medium hover:underline"
                                    >
                                        View
                                    </button>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Care Team */}
                <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h2 className="text-[#0f4c81] font-bold text-lg mb-4">Care Team</h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="border border-gray-200 rounded-2xl p-4">
                            <h3 className="font-bold text-sm text-[#0f4c81] mb-3">Primary Care Team</h3>
                            {dashboardData.careTeam && dashboardData.careTeam.length > 0 ? (
                                <div className="space-y-3">
                                    {dashboardData.careTeam.map((doctor, index) => (
                                        <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                            <div>
                                                <p className="font-bold text-sm text-gray-800">Dr. {doctor.name}</p>
                                                <p className="text-xs text-gray-500">{doctor.specialty}</p>
                                            </div>
                                            <CheckCircle2 className="w-5 h-5 text-[#00b4d8]" />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-6 text-gray-400 text-sm">
                                    No care team members assigned yet
                                </div>
                            )}
                            <button className="w-full mt-4 bg-[#52b788] hover:bg-[#409a73] text-white text-xs font-bold py-2.5 rounded-lg flex items-center justify-center gap-2 transition">
                                <Send className="w-3.5 h-3.5" /> Message Care Team
                            </button>
                        </div>

                        <div className="border border-gray-200 rounded-2xl p-4 flex flex-col justify-between">
                            <div className="space-y-3">
                                <h3 className="font-bold text-sm text-[#0f4c81]">Quick Resources</h3>
                                <button 
                                    onClick={handleViewEmergency}
                                    className="w-full bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs py-3 px-4 rounded-lg flex items-center justify-between transition"
                                >
                                    <span>Emergency Contact Details</span>
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                                <button 
                                    onClick={handleViewInsurance}
                                    className="w-full bg-blue-50 hover:bg-blue-100 text-blue-600 font-bold text-xs py-3 px-4 rounded-lg flex items-center justify-between transition"
                                >
                                    <span>Insurance Card PDF</span>
                                    <Download className="w-4 h-4" />
                                </button>
                                <button 
                                    onClick={handleRequestRefill}
                                    className="w-full bg-green-50 hover:bg-green-100 text-green-600 font-bold text-xs py-3 px-4 rounded-lg flex items-center justify-between transition"
                                >
                                    <span>Request Prescription Refill</span>
                                    <Send className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

            </main>
        </div>
    );
}