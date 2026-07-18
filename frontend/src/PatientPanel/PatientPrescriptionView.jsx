import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import {
  FileText,
  Calendar,
  CheckCircle2,
  Clock,
  XCircle,
  Search,
  Eye,
  Printer,
  Loader2,
  ShoppingCart,
  Pill,
  Stethoscope,
  AlertCircle,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Download,
  CreditCard,
  Calendar as CalendarIcon,
  Clock as ClockIcon,
  User,
  Phone,
  Mail,
  MapPin,
  Activity,
  Heart,
  Thermometer,
  Ruler,
  Weight,
  Droplet,
  Monitor,
  Syringe,
  Building2,
  FileCheck,
  Package,
  ShoppingBag,
  Plus,
  Minus,
  X
} from 'lucide-react';
import { prescriptionService } from '../services/PatientPrescriptionService.js';
import { pharmacyService } from '../services/pharmacyService.js';

export default function PatientPrescriptionView() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('All');
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const [selectedMedicines, setSelectedMedicines] = useState([]);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [labAppointmentLoading, setLabAppointmentLoading] = useState(false);

  const tabs = ['All', 'Active', 'Completed', 'Lab Tests'];

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    try {
      setLoading(true);
      const response = await prescriptionService.getPatientPrescriptions();
      if (response.success) {
        setPrescriptions(response.data);
      }
    } catch (error) {
      console.error('Error fetching prescriptions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (prescription) => {
    setSelectedPrescription(prescription);
    setIsModalOpen(true);
  };

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

    const handlePurchaseMedicines = (prescription) => {
        setSelectedPrescriptionForPurchase(prescription);
        setIsPurchaseModalOpen(true);
    };

  const handleConfirmPurchase = async () => {
    try {
      setPurchaseLoading(true);
      // Call pharmacy API to create order
      const response = await pharmacyService.createOrder({
        prescriptionId: selectedPrescription._id,
        medicines: selectedMedicines,
        patientId: selectedPrescription.patientId,
      });
      if (response.success) {
        alert('Order placed successfully! You will receive a confirmation shortly.');
        setShowPurchaseModal(false);
        fetchPrescriptions();
      }
    } catch (error) {
      console.error('Error purchasing medicines:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setPurchaseLoading(false);
    }
  };

  const handleBookLabAppointment = async (prescription) => {
    try {
      setLabAppointmentLoading(true);
      // Call lab appointment API
      const response = await prescriptionService.bookLabAppointment({
        prescriptionId: prescription._id,
        labTests: prescription.labTests,
        patientId: prescription.patientId,
      });
      if (response.success) {
        alert('Lab appointment booked successfully!');
        fetchPrescriptions();
      }
    } catch (error) {
      console.error('Error booking lab appointment:', error);
      alert('Failed to book lab appointment. Please try again.');
    } finally {
      setLabAppointmentLoading(false);
    }
  };

  const getFilteredPrescriptions = () => {
    let filtered = prescriptions;

    // Filter by tab
    if (activeTab === 'Active') {
      filtered = filtered.filter(p => p.status === 'Generated' || p.status === 'Active');
    } else if (activeTab === 'Completed') {
      filtered = filtered.filter(p => p.status === 'Completed' || p.pharmacyStatus === 'Completed');
    } else if (activeTab === 'Lab Tests') {
      filtered = filtered.filter(p => p.labTests && p.labTests.length > 0);
    }

    // Filter by search
    if (searchQuery) {
      filtered = filtered.filter(p =>
        p.prescriptionId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.doctorName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.diagnosisPrimary?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  };

  const filteredPrescriptions = getFilteredPrescriptions();

  // Stats
  const totalPrescriptions = prescriptions.length;
  const activePrescriptions = prescriptions.filter(p => p.status === 'Generated' || p.status === 'Active').length;
  const completedPrescriptions = prescriptions.filter(p => p.status === 'Completed' || p.pharmacyStatus === 'Completed').length;
  const labTestPrescriptions = prescriptions.filter(p => p.labTests && p.labTests.length > 0).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-[80vh]">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-[#00B9D6] animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading your prescriptions...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Navbar />
      <main className="flex-1 p-6 lg:p-8 max-w-7xl mx-auto w-full">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">My Prescriptions</h1>
            <p className="text-gray-500 text-sm">View all your prescriptions and manage medications.</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => window.location.href = '/patient-appointments'}
              className="flex items-center gap-2 bg-[#00B9D6] text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-sm hover:bg-[#00a3bd] transition-colors"
            >
              <CalendarIcon className="w-4 h-4" />
              Book Appointment
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <StatCard title="Total Prescriptions" value={totalPrescriptions} icon={FileText} iconColor="text-blue-500" bgColor="bg-blue-50" />
          <StatCard title="Active" value={activePrescriptions} icon={CheckCircle2} iconColor="text-green-500" bgColor="bg-green-50" />
          <StatCard title="Completed" value={completedPrescriptions} icon={Package} iconColor="text-purple-500" bgColor="bg-purple-50" />
          <StatCard title="Lab Tests" value={labTestPrescriptions} icon={Syringe} iconColor="text-orange-500" bgColor="bg-orange-50" />
        </div>

        {/* Filters & Search */}
        <div className="bg-white p-4 rounded-t-xl border border-gray-200 border-b-0 flex flex-col xl:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 w-full xl:w-auto">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${activeTab === tab
                    ? 'bg-[#00B9D6] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="relative flex-1 w-full xl:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by ID, doctor, or diagnosis..."
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00B9D6] focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white border border-gray-200 rounded-b-xl shadow-sm overflow-x-auto min-h-[300px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                <th className="px-6 py-4">PRESCRIPTION ID</th>
                <th className="px-6 py-4">DOCTOR</th>
                <th className="px-6 py-4">DIAGNOSIS</th>
                <th className="px-6 py-4">MEDICATIONS</th>
                <th className="px-6 py-4">DATE</th>
                <th className="px-6 py-4">STATUS</th>
                <th className="px-6 py-4 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredPrescriptions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-gray-500 font-medium">
                    <div className="flex flex-col items-center gap-2">
                      <FileText className="w-8 h-8 text-gray-300" />
                      <p>No prescriptions found.</p>
                      <p className="text-sm text-gray-400">Visit a doctor to get a prescription.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredPrescriptions.map((rx) => (
                  <tr key={rx._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-bold text-blue-600 whitespace-nowrap">
                      {rx.prescriptionId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <p className="text-sm font-bold text-gray-900">{rx.doctorName}</p>
                        <p className="text-xs text-gray-500 font-medium">{rx.department}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 font-medium whitespace-nowrap">
                      {rx.diagnosisPrimary}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm font-bold text-gray-900">{rx.medicines?.length || 0} Medicines</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm font-bold text-gray-900">{new Date(rx.createdAt).toLocaleDateString()}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={rx.status} pharmacyStatus={rx.pharmacyStatus} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleViewDetails(rx)}
                          className="p-2 hover:bg-blue-50 rounded-lg transition-colors text-blue-500 hover:text-blue-700"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {rx.status === 'Generated' && rx.medicines?.length > 0 && (
                          <button
                            onClick={() => handlePurchaseMedicines(rx)}
                            className="p-2 hover:bg-green-50 rounded-lg transition-colors text-green-500 hover:text-green-700"
                            title="Purchase Medicines"
                          >
                            <ShoppingBag className="w-4 h-4" />
                          </button>
                        )}
                        {rx.labTests && rx.labTests.length > 0 && rx.status !== 'Completed' && (
                          <button
                            onClick={() => handleBookLabAppointment(rx)}
                            className="p-2 hover:bg-orange-50 rounded-lg transition-colors text-orange-500 hover:text-orange-700"
                            title="Book Lab Appointment"
                          >
                            <Syringe className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* View Details Modal */}
        {isModalOpen && selectedPrescription && (
          <ViewPrescriptionModal
            prescription={selectedPrescription}
            onClose={() => {
              setIsModalOpen(false);
              setSelectedPrescription(null);
            }}
            onPrint={handlePrint}
            onPurchase={handlePurchaseMedicines}
            onLabAppointment={handleBookLabAppointment}
          />
        )}

        {/* Purchase Medicines Modal */}
        {showPurchaseModal && selectedPrescription && (
          <PurchaseMedicinesModal
            prescription={selectedPrescription}
            medicines={selectedMedicines}
            onClose={() => {
              setShowPurchaseModal(false);
              setSelectedMedicines([]);
            }}
            onConfirm={handleConfirmPurchase}
            loading={purchaseLoading}
          />
        )}
      </main>
    </div>
  );
}

// Stat Card Component
const StatCard = ({ title, value, icon: Icon, iconColor, bgColor }) => (
  <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${bgColor}`}>
      <Icon className={`w-5 h-5 ${iconColor}`} />
    </div>
    <div>
      <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">{title}</h3>
      <p className="text-2xl font-extrabold text-gray-900">{value}</p>
    </div>
  </div>
);

// Status Badge Component
const StatusBadge = ({ status, pharmacyStatus }) => {
  if (status === 'Draft') {
    return <span className="px-2 py-1 rounded text-[10px] font-extrabold tracking-wider uppercase bg-gray-100 text-gray-500">Draft</span>;
  }
  if (status === 'Generated' && pharmacyStatus === 'Pending') {
    return <span className="px-2 py-1 rounded text-[10px] font-extrabold tracking-wider uppercase bg-yellow-50 text-yellow-600">Pending Pharmacy</span>;
  }
  if (status === 'Completed' || pharmacyStatus === 'Completed') {
    return <span className="px-2 py-1 rounded text-[10px] font-extrabold tracking-wider uppercase bg-green-50 text-green-600">Completed</span>;
  }
  return <span className="px-2 py-1 rounded text-[10px] font-extrabold tracking-wider uppercase bg-blue-50 text-blue-600">Active</span>;
};

// View Prescription Modal
const ViewPrescriptionModal = ({ prescription, onClose, onPrint, onPurchase, onLabAppointment }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!prescription) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gray-50 rounded-t-xl sticky top-0 z-10">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Prescription Details</h3>
            <p className="text-xs text-gray-500 font-semibold">{prescription.prescriptionId} | {new Date(prescription.createdAt).toLocaleString()}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl font-semibold leading-none">&times;</button>
        </div>

        <div className="p-6 space-y-6">
          {/* Patient & Doctor Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
            <div>
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Patient</h4>
              <p className="font-bold text-gray-800">{prescription.patientName}</p>
              <p className="text-xs text-gray-500">{prescription.patientAge} / {prescription.patientGender}</p>
              <p className="text-xs text-gray-500">Contact: {prescription.patientContact || 'N/A'}</p>
            </div>
            <div>
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Doctor</h4>
              <p className="font-bold text-gray-800">Dr. {prescription.doctorName}</p>
              <p className="text-xs text-gray-500">{prescription.department}</p>
              <p className="text-xs text-gray-500">Type: {prescription.visitType || 'In-Person'}</p>
            </div>
          </div>

          {/* Diagnosis */}
          <div>
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Diagnosis</h4>
            <div className="p-3 bg-teal-50/40 border border-teal-100 rounded-lg">
              <p className="font-semibold text-teal-800">Primary: {prescription.diagnosisPrimary || 'N/A'}</p>
              {prescription.diagnosisNotes && (
                <p className="text-xs text-gray-600 mt-1">Notes: {prescription.diagnosisNotes}</p>
              )}
            </div>
          </div>

          {/* Symptoms & Complaint */}
          {(prescription.chiefComplaint || prescription.symptoms) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {prescription.chiefComplaint && (
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Chief Complaint</h4>
                  <p className="text-sm text-gray-700 bg-gray-50 p-2.5 rounded border border-gray-100">{prescription.chiefComplaint}</p>
                </div>
              )}
              {prescription.symptoms && (
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Symptoms</h4>
                  <p className="text-sm text-gray-700 bg-gray-50 p-2.5 rounded border border-gray-100">{prescription.symptoms}</p>
                </div>
              )}
            </div>
          )}

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
                  {prescription.medicines && prescription.medicines.length > 0 ? (
                    prescription.medicines.map((med, idx) => (
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
          {prescription.labTests && prescription.labTests.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Lab Tests Recommended</h4>
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                <ul className="list-disc list-inside text-sm text-gray-700">
                  {prescription.labTests.map((test, idx) => (
                    <li key={idx}>{test}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Advice */}
          {(prescription.exercises || prescription.dietAdvice || prescription.additionalNotes) && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Advice & Recommendations</h4>
              <div className="grid grid-cols-1 gap-3 text-sm text-gray-700">
                {prescription.exercises && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <strong className="text-xs text-gray-500">Exercises:</strong>
                    <p className="mt-1">{prescription.exercises}</p>
                  </div>
                )}
                {prescription.dietAdvice && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <strong className="text-xs text-gray-500">Diet:</strong>
                    <p className="mt-1">{prescription.dietAdvice}</p>
                  </div>
                )}
                {prescription.additionalNotes && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <strong className="text-xs text-gray-500">Doctor Notes:</strong>
                    <p className="mt-1">{prescription.additionalNotes}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Follow-up */}
          {prescription.followUpDate && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center gap-3">
              <CalendarIcon className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-xs text-blue-700 font-medium">Follow-up Date</p>
                <p className="text-sm font-bold text-blue-900">{new Date(prescription.followUpDate).toLocaleDateString()}</p>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="p-6 border-t border-gray-200 flex flex-wrap justify-end gap-3 bg-gray-50 rounded-b-xl">
          {prescription.status === 'Generated' && prescription.medicines?.length > 0 && (
            <button
              onClick={() => {
                onClose();
                onPurchase(prescription);
              }}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors shadow-sm"
            >
              <ShoppingBag className="w-4 h-4" />
              Purchase Medicines
            </button>
          )}
          {prescription.labTests && prescription.labTests.length > 0 && prescription.status !== 'Completed' && (
            <button
              onClick={() => {
                setIsModalOpen(false);
                handleBookLabAppointment(selectedPrescription);
              }}
              className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors shadow-sm"
            >
              <Syringe className="w-4 h-4" />
              Book Lab Appointment
            </button>
          )}
          <button
            onClick={() => onPrint(prescription)}
            className="flex items-center gap-2 bg-[#0b3363] hover:bg-[#082449] text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors shadow-sm"
          >
            <Printer className="w-4 h-4" />
            Print PDF
          </button>
          <button
            onClick={onClose}
            className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-sm font-semibold px-4 py-2 rounded-lg transition-colors shadow-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// Purchase Medicines Modal
const PurchaseMedicinesModal = ({ prescription, medicines, onClose, onConfirm, loading }) => {
  const [quantities, setQuantities] = useState(medicines.map(() => 1));

  const updateQuantity = (index, delta) => {
    const newQuantities = [...quantities];
    newQuantities[index] = Math.max(1, newQuantities[index] + delta);
    setQuantities(newQuantities);
  };

  const totalItems = quantities.reduce((a, b) => a + b, 0);

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gray-50 rounded-t-xl">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Purchase Medicines</h3>
            <p className="text-xs text-gray-500 font-semibold">{prescription.prescriptionId}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl font-semibold leading-none">&times;</button>
        </div>

        <div className="p-6 space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-800">Prescribed by Dr. {prescription.doctorName}</p>
              <p className="text-xs text-blue-600">Diagnosis: {prescription.diagnosisPrimary}</p>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-bold text-gray-700">Select Medicines</h4>
            {medicines.map((med, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                <div className="flex-1">
                  <p className="font-bold text-gray-800">{med.name}</p>
                  <p className="text-xs text-gray-500">{med.dosage} - {med.frequency} for {med.duration}</p>
                  {med.instructions && (
                    <p className="text-xs text-gray-400 italic">{med.instructions}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(idx, -1)}
                    className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-8 text-center font-bold">{quantities[idx]}</span>
                  <button
                    onClick={() => updateQuantity(idx, 1)}
                    className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Total Items</span>
              <span className="font-bold">{totalItems}</span>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-end gap-3 bg-gray-50 rounded-b-xl">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-200 hover:bg-gray-50 text-gray-700 text-sm font-semibold rounded-lg transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg text-sm font-semibold transition shadow-sm disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShoppingBag className="w-4 h-4" />}
            {loading ? 'Processing...' : 'Confirm Purchase'}
          </button>
        </div>
      </div>
    </div>
  );
};