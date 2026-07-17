import React, { useState, useMemo, useRef, useEffect } from 'react';
import Navbar from './Navbar';
import {
    Search, Loader2, Eye, FileText, Pill, Calendar, AlertCircle, Stethoscope,
    Printer, ShoppingBag, Syringe, X, User, Phone, Mail, MapPin,
    Activity, Heart, Thermometer, Ruler, Weight, Droplet, Monitor,
    CheckCircle2, Clock, Package, Building2, FileCheck
} from 'lucide-react';
import { medicalService } from '../services/medicalHistoryService.js';

const VitalsIcon = ({ type }) => {
    switch (type) {
        case 'heart-rate':
            return (
                <svg className="w-10 h-10 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
            );
        case 'cholesterol':
            return (
                <svg className="w-10 h-10 text-green-500" viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="12" cy="12" r="10" className="opacity-20" />
                    <circle cx="12" cy="8" r="3" fill="none" stroke="currentColor" strokeWidth="2" />
                    <circle cx="8" cy="14" r="3" fill="none" stroke="currentColor" strokeWidth="2" />
                    <circle cx="16" cy="14" r="3" fill="none" stroke="currentColor" strokeWidth="2" />
                </svg>
            );
        case 'hemoglobin':
            return (
                <svg className="w-10 h-10 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2C12 2 6 8 6 12C6 15.3137 8.68629 18 12 18C15.3137 18 18 15.3137 18 12C18 8 12 2 12 2Z" fill="currentColor" fillOpacity="0.2" />
                    <circle cx="10" cy="11" r="1" fill="currentColor" />
                    <circle cx="14" cy="12" r="1.5" fill="currentColor" />
                    <circle cx="11" cy="15" r="1" fill="currentColor" />
                </svg>
            );
        case 'blood-pressure':
            return (
                <svg className="w-10 h-10 text-rose-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z" fill="currentColor" fillOpacity="0.1" />
                    <path d="M12 6V12L15 15" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            );
        case 'glucose':
            return (
                <svg className="w-10 h-10 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="6" y="6" width="6" height="6" rx="1" fill="currentColor" fillOpacity="0.3" />
                    <rect x="12" y="12" width="6" height="6" rx="1" fill="currentColor" fillOpacity="0.7" />
                </svg>
            );
        case 'white-blood':
            return (
                <svg className="w-10 h-10 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="9" strokeDasharray="3 3" />
                    <circle cx="12" cy="12" r="4" fill="currentColor" />
                </svg>
            );
        case 'bmi':
            return (
                <svg className="w-10 h-10 text-indigo-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M16 18V20H21V18H16Z" fill="currentColor" />
                    <rect x="4" y="4" width="8" height="16" rx="1" />
                    <circle cx="17" cy="8" r="2" />
                    <path d="M15 13H19V15H15V13Z" />
                </svg>
            );
        case 'respiratory':
            return (
                <svg className="w-10 h-10 text-cyan-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 12C9 7.5 11 5 11 5M15 12C15 7.5 13 5 13 5M6 18C6 14 9 13 9 13M18 18C18 14 15 13 15 13" strokeLinecap="round" />
                </svg>
            );
        case 'platelets':
            return (
                <svg className="w-10 h-10 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="8" cy="8" r="3" fill="currentColor" fillOpacity="0.2" />
                    <circle cx="16" cy="16" r="4" fill="currentColor" fillOpacity="0.4" />
                    <circle cx="16" cy="7" r="2" fill="currentColor" />
                </svg>
            );
        default:
            return null;
    }
};

export default function PatientMedical() {
    const [activeTab, setActiveTab] = useState('All Visits');
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // State for data
    const [vitalsData, setVitalsData] = useState([]);
    const [visitsData, setVisitsData] = useState([]);
    const [consultationsData, setConsultationsData] = useState([]);
    const [labTestsData, setLabTestsData] = useState([]);
    const [medicationsData, setMedicationsData] = useState([]);
    const [lastCheckup, setLastCheckup] = useState(null);
    const [stats, setStats] = useState({});
    const [hasData, setHasData] = useState(false);

    // Modal states
    const [selectedPrescription, setSelectedPrescription] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedMedication, setSelectedMedication] = useState(null);
    const [isBillModalOpen, setIsBillModalOpen] = useState(false);

    const searchSectionRef = useRef(null);
    const searchInputRef = useRef(null);

    const tabs = ['All Visits', 'Consultation', 'Lab Tests', 'Medications'];

    // Load data on mount
    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        try {
            setLoading(true);
            setError(null);

            const dashboardRes = await medicalService.getDashboard();
            if (dashboardRes.success) {
                const data = dashboardRes.data;
                const vitals = data.vitals || {};

                const hasVisitsData = (data.stats?.totalAppointments || 0) > 0;
                const hasPrescriptionsData = (data.stats?.totalPrescriptions || 0) > 0;
                setHasData(hasVisitsData && hasPrescriptionsData);

                setVitalsData(Object.entries(vitals).map(([key, value], index) => ({
                    id: index + 1,
                    label: key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
                    value: value || 'N/A',
                    color: getColorForVital(key),
                    icon: getIconForVital(key),
                })));
                setLastCheckup(data.patient?.lastCheckup || null);
                setStats(data.stats || {});
            }

            const visitsRes = await medicalService.getVisits();
            if (visitsRes.success) {
                const validVisits = visitsRes.data.filter(v => v.prescriptionId);
                setVisitsData(validVisits);
                if (validVisits.length > 0) setHasData(true);
            }

            const consultationsRes = await medicalService.getConsultations();
            // console.log('Consultations Response:', consultationsRes);
            if (consultationsRes.success) {
                setConsultationsData(consultationsRes.data || []);
                if (consultationsRes.data.length > 0) {
                    setHasData(true);
                    // Update stats with actual data
                    setStats(prev => ({
                        ...prev,
                        totalPrescriptions: consultationsRes.data.length,
                        totalAppointments: consultationsRes.data.length,
                    }));
                }
            }

            const labTestsRes = await medicalService.getLabTests();
            if (labTestsRes.success) {
                setLabTestsData(labTestsRes.data || []);
            }

            const medicationsRes = await medicalService.getMedications();
            if (medicationsRes.success) {
                setMedicationsData(medicationsRes.data || []);
            }

        } catch (error) {
            console.error('Error fetching medical data:', error);
            setError(error.message || 'Failed to load medical data');
        } finally {
            setLoading(false);
        }
    };

    const getColorForVital = (key) => {
        const colors = {
            heartRate: 'text-teal-500',
            cholesterol: 'text-emerald-500',
            haemoglobin: 'text-red-500',
            bloodPressure: 'text-rose-500',
            glucose: 'text-amber-500',
            whiteBlood: 'text-blue-500',
            bmi: 'text-indigo-500',
            respiratory: 'text-sky-500',
            plateletCount: 'text-purple-500',
        };
        return colors[key] || 'text-slate-500';
    };

    const getIconForVital = (key) => {
        const icons = {
            heartRate: 'heart-rate',
            cholesterol: 'cholesterol',
            haemoglobin: 'hemoglobin',
            bloodPressure: 'blood-pressure',
            glucose: 'glucose',
            whiteBlood: 'white-blood',
            bmi: 'bmi',
            respiratory: 'respiratory',
            plateletCount: 'platelets',
        };
        return icons[key] || 'heart-rate';
    };

    const handleScrollToSearch = () => {
        if (searchSectionRef.current) {
            searchSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
            setTimeout(() => {
                searchInputRef.current?.focus();
            }, 400);
        }
    };

    const handleSearchChange = (e) => setSearchQuery(e.target.value.toLowerCase());

    const getStatusColorClass = (status) => {
        switch (status) {
            case 'Completed':
            case 'Purchased':
            case 'Paid':
                return 'text-emerald-600 font-bold';
            case 'Rescheduled':
            case 'Pending':
            case 'Scheduled':
                return 'text-amber-500 font-bold';
            case 'Cancelled':
            case 'Not Purchased':
                return 'text-red-600 font-bold';
            default:
                return 'text-slate-600 font-medium';
        }
    };


    const getFilteredData = useMemo(() => {
        switch (activeTab) {
            case 'All Visits':
                return consultationsData.filter(row =>
                    (row.doctor?.toLowerCase() || '').includes(searchQuery) ||
                    (row.reason?.toLowerCase() || '').includes(searchQuery) ||
                    (row.date?.toLowerCase() || '').includes(searchQuery) ||
                    (row.visitId?.toLowerCase() || '').includes(searchQuery) ||
                    (row.department?.toLowerCase() || '').includes(searchQuery)
                );
            case 'Consultation':
                return consultationsData.filter(row =>
                    (row.doctor?.toLowerCase() || '').includes(searchQuery) ||
                    (row.symptoms?.toLowerCase() || '').includes(searchQuery) ||
                    (row.visitDate?.toLowerCase() || '').includes(searchQuery) ||
                    (row.diagnosis?.toLowerCase() || '').includes(searchQuery)
                );
            case 'Lab Tests':
                return labTestsData.filter(row =>
                    (row.testName?.toLowerCase() || '').includes(searchQuery) ||
                    (row.category?.toLowerCase() || '').includes(searchQuery) ||
                    (row.requestedBy?.toLowerCase() || '').includes(searchQuery)
                );
            case 'Medications':
                return medicationsData.filter(row =>
                    (row.medicine?.toLowerCase() || '').includes(searchQuery) ||
                    (row.status?.toLowerCase() || '').includes(searchQuery)
                );
            default:
                return [];
        }
    }, [activeTab, searchQuery, consultationsData, labTestsData, medicationsData]);

    // Handle view prescription from consultation
    const handleViewConsultation = async (consultation) => {
        try {
            // If the consultation already has all the data, use it directly
            if (consultation.medications && consultation.medications.length > 0) {
                // console.log('Using consultation data directly');
                setSelectedPrescription({
                    ...consultation,
                    prescriptionId: consultation.prescriptionId || 'N/A',
                    doctorName: consultation.doctor || consultation.doctorName || 'N/A',
                    patientName: consultation.patientName || 'Patient',
                    diagnosisPrimary: consultation.diagnosis || consultation.diagnosisPrimary || 'N/A',
                    medicines: consultation.medications || [],
                    labTests: consultation.labTests || '',
                });
                setIsModalOpen(true);
                return;
            }

            // Otherwise fetch from API
            const prescriptionId = consultation.prescriptionIdRef || consultation._id;
            const response = await medicalService.getConsultationDetails(prescriptionId);

            if (response && response.success && response.data) {
                setSelectedPrescription(response.data);
                setIsModalOpen(true);
            } else {
                alert('No prescription details available for this consultation.');
            }
        } catch (error) {
            console.error('Error fetching consultation details:', error);
            alert('Failed to load prescription details. Please try again.');
        }
    };


    // Handle view bill from medication
    const handleViewBill = async (medication) => {
        try {
            const response = await medicalService.getMedicationBill(medication._id);
            if (response.success) {
                setSelectedMedication({
                    medication,
                    bill: response.data.bill
                });
                setIsBillModalOpen(true);
            }
        } catch (error) {
            console.error('Error fetching bill:', error);
            alert('Failed to load bill details');
        }
    };

    // Handle print prescription
    const handlePrint = (rx) => {
        const printWindow = window.open('', '_blank');
        const medicinesHTML = rx.medicines && rx.medicines.length > 0
            ? rx.medicines.map(m => `
                <tr>
                    <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>${m.name}</strong></td>
                    <td style="padding: 10px; border-bottom: 1px solid #eee;">${m.dosage}</td>
                    <td style="padding: 10px; border-bottom: 1px solid #eee;">${m.frequency}</td>
                    <td style="padding: 10px; border-bottom: 1px solid #eee;">${m.duration}</td>
                    <td style="padding: 10px; border-bottom: 1px solid #eee;">${m.instructions || '-'}</td>
                </tr>
            `).join('')
            : '<tr><td colspan="5" style="padding: 10px; text-align: center;">No medications prescribed</td></tr>';

        const vitalsHTML = rx.vitals
            ? Object.entries(rx.vitals)
                .filter(([_, val]) => val && val.trim() !== '')
                .map(([key, val]) => `<div style="margin-bottom: 6px;"><strong>${key.replace(/([A-Z])/g, ' $1').toUpperCase()}:</strong> ${val}</div>`)
                .join('')
            : '';

        printWindow.document.write(`
            <html>
                <head>
                    <title>Prescription - ${rx.prescriptionId}</title>
                    <style>
                        body { font-family: sans-serif; color: #333; margin: 40px; }
                        .header { display: flex; justify-content: space-between; border-bottom: 2px solid #00B9D6; padding-bottom: 20px; margin-bottom: 30px; }
                        .logo { font-size: 24px; font-weight: bold; color: #0b3363; }
                        .doctor-info { text-align: right; }
                        .patient-card { background: #f8f9fa; border: 1px solid #eee; padding: 15px; border-radius: 8px; margin-bottom: 30px; display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
                        .section-title { font-size: 16px; font-weight: bold; color: #0b3363; margin-top: 20px; border-bottom: 1px solid #eee; padding-bottom: 5px; }
                        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
                        th { background: #f4f6f8; padding: 10px; text-align: left; font-size: 12px; font-weight: bold; color: #555; }
                        .footer { margin-top: 80px; display: flex; justify-content: space-between; align-items: flex-end; }
                        .signature { border-top: 1px dashed #ccc; width: 200px; text-align: center; padding-top: 5px; }
                        .sig-text { font-family: serif; font-size: 24px; font-style: italic; margin-bottom: 5px; }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <div>
                            <div class="logo">AxisCare</div>
                            <div>Multi-Specialty Hospital</div>
                        </div>
                        <div class="doctor-info">
                            <h3>Dr. ${rx.doctorName}</h3>
                            <div>${rx.department}</div>
                        </div>
                    </div>

                    <div class="patient-card">
                        <div>
                            <strong>Patient Name:</strong> ${rx.patientName}<br>
                            <strong>Age / Gender:</strong> ${rx.patientAge} / ${rx.patientGender}<br>
                            <strong>Contact:</strong> ${rx.patientContact || 'N/A'}
                        </div>
                        <div>
                            <strong>Prescription ID:</strong> ${rx.prescriptionId}<br>
                            <strong>Date:</strong> ${new Date(rx.createdAt).toLocaleDateString()}<br>
                            <strong>Visit Type:</strong> ${rx.visitType || 'In-Person'}
                        </div>
                    </div>

                    ${vitalsHTML ? `
                        <div class="section-title">Vitals</div>
                        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-top: 10px; font-size: 13px;">
                            ${vitalsHTML}
                        </div>
                    ` : ''}

                    <div class="section-title">Diagnosis</div>
                    <p><strong>Primary:</strong> ${rx.diagnosisPrimary}</p>
                    ${rx.diagnosisNotes ? `<p><strong>Notes:</strong> ${rx.diagnosisNotes}</p>` : ''}

                    <div class="section-title">Rx Medicines</div>
                    <table>
                        <thead>
                            <tr>
                                <th>MEDICINE NAME</th>
                                <th>DOSAGE</th>
                                <th>FREQUENCY</th>
                                <th>DURATION</th>
                                <th>INSTRUCTIONS</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${medicinesHTML}
                        </tbody>
                    </table>

                    ${rx.labTests ? `
                        <div class="section-title">Lab Tests Recommended</div>
                        <p>${rx.labTests}</p>
                    ` : ''}

                    ${rx.exercises ? `
                        <div class="section-title">Exercises / Physiotherapy</div>
                        <p>${rx.exercises}</p>
                    ` : ''}

                    ${rx.dietAdvice ? `
                        <div class="section-title">Diet Advice</div>
                        <p>${rx.dietAdvice}</p>
                    ` : ''}

                    ${rx.additionalNotes ? `
                        <div class="section-title">Additional Notes</div>
                        <p>${rx.additionalNotes}</p>
                    ` : ''}

                    <div class="footer">
                        <div>
                            <strong>Reg No:</strong> N/A
                        </div>
                        <div class="signature">
                            <div class="sig-text">${rx.doctorName.split(' ')[0]}</div>
                            Dr. ${rx.doctorName}
                        </div>
                    </div>

                    <script>
                        window.onload = function() {
                            window.print();
                            window.onafterprint = function() {
                                window.close();
                            }
                        }
                    </script>
                </body>
            </html>
        `);
        printWindow.document.close();
    };

    // Handle purchase medicines (redirect to pharmacy)
    const handlePurchaseMedicines = (prescription) => {
        // Redirect to pharmacy module with prescription details
        window.location.href = `/pharmacy/purchase?prescriptionId=${prescription._id}`;
    };

    // Handle lab appointment booking
    const handleBookLabAppointment = (prescription) => {
        window.location.href = `/lab-appointments/book?prescriptionId=${prescription._id}`;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#F0F5FA] font-sans antialiased">
                <Navbar />
                <div className="flex items-center justify-center h-[80vh]">
                    <div className="text-center">
                        <Loader2 className="w-12 h-12 text-[#00b4d8] animate-spin mx-auto mb-4" />
                        <p className="text-slate-600">Loading your medical history...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#F0F5FA] font-sans antialiased">
                <Navbar />
                <div className="flex items-center justify-center h-[80vh]">
                    <div className="text-center">
                        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                        <p className="text-red-600 font-medium">{error}</p>
                        <button
                            onClick={fetchAllData}
                            className="mt-4 px-6 py-2 bg-[#00b4d8] text-white rounded-lg hover:bg-[#0092b3] transition"
                        >
                            Retry
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (!hasData && visitsData.length === 0 && consultationsData.length === 0) {
        return (
            <div className="min-h-screen bg-[#F0F5FA] font-sans antialiased">
                <Navbar />
                <div className="flex items-center justify-center h-[80vh]">
                    <div className="text-center max-w-md">
                        <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Stethoscope className="w-12 h-12 text-blue-300" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-700 mb-3">No Medical History Yet</h2>
                        <p className="text-slate-500 mb-6">
                            You don't have any medical records yet. Your medical history will appear here after you:
                            <br /><br />
                            1. Visit a doctor for a consultation<br />
                            2. Receive a prescription from the doctor
                        </p>
                        <button
                            onClick={() => window.location.href = '/patient-appointments'}
                            className="px-6 py-3 bg-[#00b4d8] text-white rounded-lg hover:bg-[#0092b3] transition font-medium"
                        >
                            Book Your First Appointment
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Handle view lab test
    const handleViewLabTest = (test) => {
        alert(`Lab Test: ${test.testName}\nCategory: ${test.category}\nStatus: ${test.status}\nRequested By: ${test.requestedBy}\nDate: ${test.date}`);
    };

    return (
        <div className="min-h-screen bg-[#F0F5FA] font-sans antialiased text-slate-800">
            <Navbar />

            <main className="flex-1 w-full max-w-[1400px] mx-auto px-4 sm:px-8 py-6 sm:py-8 flex flex-col justify-between">

                {/* Title Area */}
                <div className="flex items-center justify-between mb-6 sm:mb-8">
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#0f4c81]">
                        My Medical History
                    </h1>
                    <button
                        onClick={handleScrollToSearch}
                        className="p-2.5 bg-white border border-slate-200 rounded-full text-slate-400 hover:text-[#00b4d8] transition-all hover:shadow-sm"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </button>
                </div>

                {/* Stats Summary */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
                        <p className="text-xs text-slate-400 font-medium">Total Visits</p>
                        <p className="text-2xl font-bold text-[#0f4c81]">{consultationsData.length || 0}</p>
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
                        <p className="text-xs text-slate-400 font-medium">Prescriptions</p>
                        <p className="text-2xl font-bold text-[#0f4c81]">{consultationsData.length || 0}</p>
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
                        <p className="text-xs text-slate-400 font-medium">Lab Tests</p>
                        <p className="text-2xl font-bold text-[#0f4c81]">{labTestsData.length || 0}</p>
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
                        <p className="text-xs text-slate-400 font-medium">Bills</p>
                        <p className="text-2xl font-bold text-[#0f4c81]">{stats.totalBills || 0}</p>
                    </div>
                </div>

                {/* Vitals Section */}
                {vitalsData.some(v => v.value && v.value !== 'N/A') && (
                    <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-100/80 p-4 sm:p-8 shadow-sm mb-8 sm:mb-10 relative">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 pb-2 border-b border-slate-50 sm:border-none">
                            <span className="text-[12px] font-semibold text-blue-500 uppercase tracking-wider sm:absolute sm:top-4 sm:right-8">
                                Last Check-up: {lastCheckup ? new Date(lastCheckup).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'N/A'}
                            </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                            {vitalsData.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex items-center justify-between p-4 sm:p-5 bg-white border border-slate-100 rounded-xl sm:rounded-2xl shadow-sm hover:shadow-md hover:border-slate-200 transition-all cursor-pointer"
                                >
                                    <div>
                                        <p className="text-[10px] sm:text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5 sm:mb-1">{item.label}</p>
                                        <p className={`text-lg sm:text-xl font-bold tracking-tight ${item.color}`}>{item.value}</p>
                                    </div>
                                    <div className="p-2 sm:p-2.5 rounded-xl bg-slate-50 shrink-0">
                                        <VitalsIcon type={item.icon} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Filter & Search Area */}
                {(visitsData.length > 0 || consultationsData.length > 0 || labTestsData.length > 0 || medicationsData.length > 0) && (
                    <div ref={searchSectionRef} className="flex flex-col items-center mb-6 sm:mb-8 w-full max-w-4xl mx-auto space-y-4 sm:space-y-5">
                        <div className="relative w-full">
                            <input
                                ref={searchInputRef}
                                type="text"
                                placeholder="Search by Doctor/Diagnosis/Date"
                                value={searchQuery}
                                onChange={handleSearchChange}
                                className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-[#00b4d8] focus:ring-1 focus:ring-[#00b4d8] text-sm text-slate-700 placeholder-slate-400 transition-all shadow-sm"
                            />
                            <span className="absolute left-4 top-3.5 text-slate-400">
                                <Search size={18} />
                            </span>
                        </div>

                        <div className="w-full overflow-x-auto pb-2 -mb-2 scrollbar-none flex justify-start md:justify-center px-1">
                            <div className="flex space-x-2 sm:space-x-3 whitespace-nowrap">
                                {tabs.map((tab) => {
                                    const isActive = activeTab === tab;
                                    const count = tab === 'All Visits' ? visitsData.length :
                                        tab === 'Consultation' ? consultationsData.length :
                                            tab === 'Lab Tests' ? labTestsData.length :
                                                medicationsData.length;
                                    return (
                                        <button
                                            key={tab}
                                            onClick={() => { setActiveTab(tab); setSearchQuery(''); }}
                                            className={`px-5 sm:px-8 py-2 rounded-full text-xs sm:text-sm font-semibold tracking-wide transition-all shrink-0 flex items-center gap-2 ${isActive
                                                ? 'bg-[#00b4d8] text-white shadow-sm shadow-cyan-200'
                                                : 'bg-white border border-[#00b4d8]/40 text-[#00b4d8] hover:bg-[#00b4d8]/5'
                                                }`}
                                        >
                                            {tab}
                                            {count > 0 && (
                                                <span className={`text-xs px-1.5 py-0.5 rounded-full ${isActive ? 'bg-white/20' : 'bg-slate-100'}`}>
                                                    {count}
                                                </span>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}

                {/* Data Table */}
                <div className="bg-white border rounded-xl sm:rounded-2xl border-slate-100 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto w-full">
                        <table className="w-full text-center border-collapse min-w-[700px] md:min-w-full">
                            <thead>
                                <tr className="bg-[#0092b3] text-white text-[12px] sm:text-[13px] font-bold uppercase tracking-wider h-12">
                                    {activeTab === 'All Visits' && (
                                        <>
                                            <th className="py-3 px-4 sm:px-6">VisitId</th>
                                            <th className="py-3 px-4 sm:px-6">Date</th>
                                            <th className="py-3 px-4 sm:px-6">Department</th>
                                            <th className="py-3 px-4 sm:px-6">Doctor</th>
                                            <th className="py-3 px-4 sm:px-6">Reason</th>
                                            <th className="py-3 px-4 sm:px-6">Status</th>
                                            <th className="py-3 px-4 sm:px-6 text-right">View Details</th>
                                        </>
                                    )}
                                    {activeTab === 'Consultation' && (
                                        <>
                                            <th className="py-3 px-4 sm:px-6">Doctor</th>
                                            <th className="py-3 px-4 sm:px-6">Visit Date</th>
                                            <th className="py-3 px-4 sm:px-6">Symptoms</th>
                                            <th className="py-3 px-4 sm:px-6">Diagnosis</th>
                                            <th className="py-3 px-4 sm:px-6">Department</th>
                                            <th className="py-3 px-4 sm:px-6">Follow-up</th>
                                            <th className="py-3 px-4 sm:px-6 text-right">Prescription</th>
                                        </>
                                    )}
                                    {activeTab === 'Lab Tests' && (
                                        <>
                                            <th className="py-3 px-4 sm:px-6">Patient ID</th>
                                            <th className="py-3 px-4 sm:px-6">Test Name</th>
                                            <th className="py-3 px-4 sm:px-6">Category</th>
                                            <th className="py-3 px-4 sm:px-6">Requested By</th>
                                            <th className="py-3 px-4 sm:px-6">Status</th>
                                            <th className="py-3 px-4 sm:px-6">Date</th>
                                            <th className="py-3 px-4 sm:px-6 text-right">View Reports</th>
                                        </>
                                    )}
                                    {activeTab === 'Medications' && (
                                        <>
                                            <th className="py-3 px-4 sm:px-6">Patient ID</th>
                                            <th className="py-3 px-4 sm:px-6">Medicine</th>
                                            <th className="py-3 px-4 sm:px-6">Dosage</th>
                                            <th className="py-3 px-4 sm:px-6">Frequency</th>
                                            <th className="py-3 px-4 sm:px-6">Duration</th>
                                            <th className="py-3 px-4 sm:px-6">Status</th>
                                            <th className="py-3 px-4 sm:px-6 text-right">View Bill</th>
                                        </>
                                    )}
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-100 text-xs sm:text-sm font-medium text-slate-800">
                                {getFilteredData.length === 0 ? (
                                    <tr>
                                        <td colSpan="100%" className="py-12 text-center text-slate-400 font-medium">
                                            {searchQuery ? 'No matching records found.' : 'No records available yet.'}
                                        </td>
                                    </tr>
                                ) : (
                                    getFilteredData.map((row, index) => (
                                        <tr key={row._id || index} className="hover:bg-slate-50/50 transition-colors">
                                            {activeTab === 'All Visits' && (
                                                <>
                                                    <td className="py-4 px-4 sm:px-6 font-bold text-slate-700">
                                                        {row.visitId || row._id?.slice(-6) || 'N/A'}
                                                    </td>
                                                    <td className="py-4 px-4 sm:px-6 text-slate-600">
                                                        {row.date || row.visitDate || row.consultationDate || 'N/A'}
                                                    </td>
                                                    <td className="py-4 px-4 sm:px-6 text-slate-600">
                                                        {row.department || 'General'}
                                                    </td>
                                                    <td className="py-4 px-4 sm:px-6 text-slate-700 font-semibold">
                                                        {row.doctor || row.doctorName || 'N/A'}
                                                    </td>
                                                    <td className="py-4 px-4 sm:px-6 text-slate-600">
                                                        {row.reason || row.chiefComplaint || row.diagnosis || 'N/A'}
                                                    </td>
                                                    <td className="py-4 px-4 sm:px-6">
                                                        <span className={`px-2 py-1 rounded text-xs ${getStatusColorClass(row.status)}`}>
                                                            {row.status || 'Completed'}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 px-4 sm:px-6 text-right">
                                                        <button
                                                            onClick={() => handleViewConsultation(row)}
                                                            className={`bg-[#00b4d8] text-white hover:bg-[#0092b3] px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ml-auto ${!row.prescriptionId && !row.prescriptionIdRef ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                            disabled={!row.prescriptionId && !row.prescriptionIdRef}
                                                        >
                                                            <Eye size={12} /> View
                                                        </button>
                                                    </td>
                                                </>
                                            )}

                                            {activeTab === 'Consultation' && (
                                                <>
                                                    <td className="py-4 px-4 sm:px-6 text-slate-700 font-semibold">
                                                        {row.doctor || row.doctorName || 'N/A'}
                                                    </td>
                                                    <td className="py-4 px-4 sm:px-6 text-slate-600">
                                                        {row.visitDate || row.consultationDate || 'N/A'}
                                                    </td>
                                                    <td className="py-4 px-4 sm:px-6 text-slate-600 max-w-xs truncate">
                                                        {row.symptoms || 'N/A'}
                                                    </td>
                                                    <td className="py-4 px-4 sm:px-6 text-slate-700 font-medium">
                                                        {row.diagnosis || row.diagnosisPrimary || 'N/A'}
                                                    </td>
                                                    <td className="py-4 px-4 sm:px-6 text-slate-600">
                                                        {row.department || 'General'}
                                                    </td>
                                                    <td className="py-4 px-4 sm:px-6 text-slate-600">
                                                        {row.followUp || 'N/A'}
                                                    </td>
                                                    <td className="py-4 px-4 sm:px-6 text-right">
                                                        <button
                                                            onClick={() => handleViewConsultation(row)}
                                                            className="bg-[#00b4d8] text-white hover:bg-[#0092b3] px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ml-auto"
                                                        >
                                                            <Pill size={12} /> View
                                                        </button>
                                                    </td>
                                                </>
                                            )}

                                            {activeTab === 'Lab Tests' && (
                                                <>
                                                    <td className="py-4 px-4 sm:px-6 font-bold text-slate-700">
                                                        {row.patientId || 'N/A'}
                                                    </td>
                                                    <td className="py-4 px-4 sm:px-6 text-slate-800 font-bold">
                                                        {row.testName || 'N/A'}
                                                    </td>
                                                    <td className="py-4 px-4 sm:px-6 text-slate-600">
                                                        {row.category || 'General'}
                                                    </td>
                                                    <td className="py-4 px-4 sm:px-6 text-slate-700 font-semibold">
                                                        {row.requestedBy || 'N/A'}
                                                    </td>
                                                    <td className="py-4 px-4 sm:px-6">
                                                        <span className={getStatusColorClass(row.status)}>
                                                            {row.status || 'Pending'}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 px-4 sm:px-6 text-slate-600">
                                                        {row.date || 'N/A'}
                                                    </td>
                                                    <td className="py-4 px-4 sm:px-6 text-right">
                                                        <button
                                                            onClick={() => handleViewLabTest(row)}
                                                            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ml-auto ${row.status === 'Pending' || row.status === 'Scheduled'
                                                                ? 'bg-slate-300 text-white cursor-not-allowed'
                                                                : 'bg-[#00b4d8] text-white hover:bg-[#0092b3]'
                                                                }`}
                                                            disabled={row.status === 'Pending' || row.status === 'Scheduled'}
                                                        >
                                                            <FileText size={12} /> View
                                                        </button>
                                                    </td>
                                                </>
                                            )}

                                            {activeTab === 'Medications' && (
                                                <>
                                                    <td className="py-4 px-4 sm:px-6 font-bold text-slate-700">
                                                        {row.patientId || 'N/A'}
                                                    </td>
                                                    <td className="py-4 px-4 sm:px-6 text-slate-800 font-bold">
                                                        {row.medicine || 'N/A'}
                                                    </td>
                                                    <td className="py-4 px-4 sm:px-6 text-slate-700">
                                                        {row.dosage || 'N/A'}
                                                    </td>
                                                    <td className="py-4 px-4 sm:px-6 text-slate-600">
                                                        {row.frequency || 'N/A'}
                                                    </td>
                                                    <td className="py-4 px-4 sm:px-6 text-slate-600">
                                                        {row.duration || 'N/A'}
                                                    </td>
                                                    <td className="py-4 px-4 sm:px-6">
                                                        <span className={getStatusColorClass(row.status)}>
                                                            {row.status || 'Not Purchased'}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 px-4 sm:px-6 text-right">
                                                        <button
                                                            onClick={() => handleViewBill(row)}
                                                            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ml-auto ${row.status === 'Not Purchased' || !row.billId
                                                                ? 'bg-slate-300 text-white cursor-not-allowed'
                                                                : 'bg-[#00b4d8] text-white hover:bg-[#0092b3]'
                                                                }`}
                                                            disabled={row.status === 'Not Purchased' || !row.billId}
                                                        >
                                                            <FileText size={12} /> View
                                                        </button>
                                                    </td>
                                                </>
                                            )}
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>

            {/* View Prescription Modal */}
            {isModalOpen && selectedPrescription && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
                        <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gray-50 rounded-t-xl sticky top-0 z-10">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">Prescription Details</h3>
                                <p className="text-xs text-gray-500 font-semibold">{selectedPrescription.prescriptionId} | {new Date(selectedPrescription.createdAt).toLocaleString()}</p>
                            </div>
                            <button
                                onClick={() => { setIsModalOpen(false); setSelectedPrescription(null); }}
                                className="text-gray-400 hover:text-gray-600 text-2xl font-semibold leading-none"
                            >
                                ×
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Patient & Doctor Info */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                                <div>
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Patient</h4>
                                    <p className="font-bold text-gray-800">{selectedPrescription.patientName}</p>
                                    <p className="text-xs text-gray-500">{selectedPrescription.patientAge} / {selectedPrescription.patientGender}</p>
                                    <p className="text-xs text-gray-500">Contact: {selectedPrescription.patientContact || 'N/A'}</p>
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Doctor</h4>
                                    <p className="font-bold text-gray-800">Dr. {selectedPrescription.doctorName}</p>
                                    <p className="text-xs text-gray-500">{selectedPrescription.department}</p>
                                    <p className="text-xs text-gray-500">Type: {selectedPrescription.visitType || 'In-Person'}</p>
                                </div>
                            </div>

                            {/* Vitals */}
                            {selectedPrescription.vitals && Object.values(selectedPrescription.vitals).some(v => v && v.trim() !== '') && (
                                <div>
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Vitals</h4>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-gray-50/50 p-3 rounded-lg text-xs">
                                        {selectedPrescription.vitals.bloodPressure && <div><strong>BP:</strong> {selectedPrescription.vitals.bloodPressure}</div>}
                                        {selectedPrescription.vitals.pulseRate && <div><strong>Pulse:</strong> {selectedPrescription.vitals.pulseRate}</div>}
                                        {selectedPrescription.vitals.temperature && <div><strong>Temp:</strong> {selectedPrescription.vitals.temperature}</div>}
                                        {selectedPrescription.vitals.weight && <div><strong>Weight:</strong> {selectedPrescription.vitals.weight}</div>}
                                        {selectedPrescription.vitals.height && <div><strong>Height:</strong> {selectedPrescription.vitals.height}</div>}
                                        {selectedPrescription.vitals.spO2 && <div><strong>SpO2:</strong> {selectedPrescription.vitals.spO2}</div>}
                                        {selectedPrescription.vitals.bloodSugar && <div className="col-span-2"><strong>Blood Sugar:</strong> {selectedPrescription.vitals.bloodSugar}</div>}
                                    </div>
                                </div>
                            )}

                            {/* Diagnosis */}
                            <div>
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Diagnosis</h4>
                                <div className="p-3 bg-teal-50/40 border border-teal-100 rounded-lg">
                                    <p className="font-semibold text-teal-800">Primary: {selectedPrescription.diagnosisPrimary || 'N/A'}</p>
                                    {selectedPrescription.diagnosisNotes && (
                                        <p className="text-xs text-gray-600 mt-1">Notes: {selectedPrescription.diagnosisNotes}</p>
                                    )}
                                </div>
                            </div>

                            {/* Medicines */}
                            <div>
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Prescribed Medicines</h4>
                                <div className="border border-gray-200 rounded-lg overflow-hidden">
                                    <table className="w-full text-xs">
                                        <thead className="bg-gray-50 text-gray-500 font-bold uppercase border-b border-gray-200">
                                            <tr>
                                                <th className="p-2.5">Medicine</th>
                                                <th className="p-2.5">Dosage</th>
                                                <th className="p-2.5">Frequency</th>
                                                <th className="p-2.5">Duration</th>
                                                <th className="p-2.5">Instructions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50">
                                            {selectedPrescription.medicines && selectedPrescription.medicines.length > 0 ? (
                                                selectedPrescription.medicines.map((med, idx) => (
                                                    <tr key={idx} className="text-gray-700">
                                                        <td className="p-2.5 font-semibold">{med.name}</td>
                                                        <td className="p-2.5">{med.dosage}</td>
                                                        <td className="p-2.5">{med.frequency}</td>
                                                        <td className="p-2.5">{med.duration}</td>
                                                        <td className="p-2.5 italic">{med.instructions || '-'}</td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr><td colSpan={5} className="p-4 text-center text-gray-400">No medicines prescribed</td></tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Lab Tests */}
                            {selectedPrescription.labTests && selectedPrescription.labTests.length > 0 && (
                                <div>
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Lab Tests Recommended</h4>
                                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                                        <ul className="list-disc list-inside text-sm text-gray-700">
                                            {selectedPrescription.labTests.map((test, idx) => (
                                                <li key={idx}>{test}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            )}

                            {/* Advice */}
                            {(selectedPrescription.exercises || selectedPrescription.dietAdvice || selectedPrescription.additionalNotes) && (
                                <div className="space-y-3">
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Advice & Recommendations</h4>
                                    <div className="grid grid-cols-1 gap-3 text-sm text-gray-700">
                                        {selectedPrescription.exercises && (
                                            <div className="bg-gray-50 p-3 rounded-lg">
                                                <strong className="text-xs text-gray-500">Exercises:</strong>
                                                <p className="mt-1">{selectedPrescription.exercises}</p>
                                            </div>
                                        )}
                                        {selectedPrescription.dietAdvice && (
                                            <div className="bg-gray-50 p-3 rounded-lg">
                                                <strong className="text-xs text-gray-500">Diet:</strong>
                                                <p className="mt-1">{selectedPrescription.dietAdvice}</p>
                                            </div>
                                        )}
                                        {selectedPrescription.additionalNotes && (
                                            <div className="bg-gray-50 p-3 rounded-lg">
                                                <strong className="text-xs text-gray-500">Doctor Notes:</strong>
                                                <p className="mt-1">{selectedPrescription.additionalNotes}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="p-6 border-t border-gray-200 flex flex-wrap justify-end gap-3 bg-gray-50 rounded-b-xl">
                            {selectedPrescription.status === 'Generated' && selectedPrescription.medicines?.length > 0 && (
                                <button
                                    onClick={() => handlePurchaseMedicines(selectedPrescription)}
                                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors shadow-sm"
                                >
                                    <ShoppingBag className="w-4 h-4" />
                                    Purchase Medicines
                                </button>
                            )}
                            {selectedPrescription.labTests && selectedPrescription.labTests.length > 0 && selectedPrescription.status !== 'Completed' && (
                                <button
                                    onClick={() => handleBookLabAppointment(selectedPrescription)}
                                    className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors shadow-sm"
                                >
                                    <Syringe className="w-4 h-4" />
                                    Book Lab Appointment
                                </button>
                            )}
                            <button
                                onClick={() => handlePrint(selectedPrescription)}
                                className="flex items-center gap-2 bg-[#0b3363] hover:bg-[#082449] text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors shadow-sm"
                            >
                                <Printer className="w-4 h-4" />
                                Print PDF
                            </button>
                            <button
                                onClick={() => { setIsModalOpen(false); setSelectedPrescription(null); }}
                                className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-sm font-semibold px-4 py-2 rounded-lg transition-colors shadow-sm"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* View Bill Modal */}
            {isBillModalOpen && selectedMedication && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl max-w-md w-full shadow-xl">
                        <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gray-50 rounded-t-xl">
                            <h3 className="text-lg font-bold text-gray-900">Bill Details</h3>
                            <button
                                onClick={() => { setIsBillModalOpen(false); setSelectedMedication(null); }}
                                className="text-gray-400 hover:text-gray-600 text-2xl font-semibold leading-none"
                            >
                                ×
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            {selectedMedication.bill ? (
                                <>
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                        <p className="text-sm font-bold text-blue-800">{selectedMedication.bill.billId}</p>
                                        <p className="text-xs text-blue-600">Status: {selectedMedication.bill.status}</p>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between py-2 border-b border-gray-100">
                                            <span className="text-gray-600">Medicine</span>
                                            <span className="font-bold">{selectedMedication.medication.medicine}</span>
                                        </div>
                                        <div className="flex justify-between py-2 border-b border-gray-100">
                                            <span className="text-gray-600">Dosage</span>
                                            <span>{selectedMedication.medication.dosage}</span>
                                        </div>
                                        <div className="flex justify-between py-2 border-b border-gray-100">
                                            <span className="text-gray-600">Frequency</span>
                                            <span>{selectedMedication.medication.frequency}</span>
                                        </div>
                                        <div className="flex justify-between py-2">
                                            <span className="text-gray-600">Duration</span>
                                            <span>{selectedMedication.medication.duration}</span>
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <div className="flex justify-between">
                                            <span className="font-bold">Total Amount</span>
                                            <span className="font-bold text-lg">${selectedMedication.bill.amount}</span>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">Generated on: {new Date(selectedMedication.bill.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </>
                            ) : (
                                <div className="text-center py-8">
                                    <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                    <p className="text-gray-500">No bill found for this medication</p>
                                </div>
                            )}
                        </div>

                        <div className="p-6 border-t border-gray-200 flex justify-end bg-gray-50 rounded-b-xl">
                            <button
                                onClick={() => { setIsBillModalOpen(false); setSelectedMedication(null); }}
                                className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-sm font-semibold px-4 py-2 rounded-lg transition-colors shadow-sm"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}