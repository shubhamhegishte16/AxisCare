// BookAppointmentModal.jsx - 
import React, { useState, useEffect } from 'react';
import {
    SquarePlus,
    Bell,
    User,
    AlertTriangle,
    ChevronDown,
    Menu,
    X,
    Loader2
} from 'lucide-react';
import { appointmentService } from '../services/appointmentService';
import { patientService } from '../services/patientService';

export default function BookAppointmentModal({ isOpen, onClose }) {
    const [loading, setLoading] = useState(false);
    const [loadingDoctors, setLoadingDoctors] = useState(false);
    const [doctors, setDoctors] = useState([]);
    const [allDoctors, setAllDoctors] = useState([]);
    const [formData, setFormData] = useState({
        fullName: '',
        phoneNumber: '',
        email: '',
        age: '',
        gender: 'Prefer not to say',
        address: '',
        department: '',
        doctor: '',
        doctorProfileId: '',
        appointmentType: 'In-Person',
        preferredDate: '',
        preferredTime: '',
        reasonForVisit: '',
        symptoms: '',
    });
    const [documentFile, setDocumentFile] = useState(null);
    const [error, setError] = useState('');

    // Load patient data and doctors when modal opens
    useEffect(() => {
        if (isOpen) {
            loadPatientData();
            loadAllDoctors();
        }
    }, [isOpen]);

    const loadPatientData = async () => {
        try {
            const response = await patientService.getOrCreateProfile();
            if (response.success) {
                const data = response.data;
                setFormData(prev => ({
                    ...prev,
                    fullName: `${data.firstName} ${data.lastName}`.trim(),
                    phoneNumber: data.phoneNumber || '',
                    email: data.email || '',
                    age: '',
                    gender: data.gender || 'Prefer not to say',
                    address: data.address || '',
                }));
            }
        } catch (error) {
            console.error('Error loading patient data:', error);
        }
    };

    const loadAllDoctors = async () => {
        try {
            setLoadingDoctors(true);
            setError('');
            
            const response = await appointmentService.getDoctors();
            
            if (response.success) {
                const doctorsList = response.data;
                setAllDoctors(doctorsList);
                setDoctors(doctorsList);
                
                if (doctorsList.length === 0) {
                    setError('No doctors found in the system. Please contact admin.');
                }
            } else {
                setError('Failed to load doctors');
            }
        } catch (error) {
            console.error('Error loading doctors:', error);
            setError(error.message || 'Failed to load doctors');
        } finally {
            setLoadingDoctors(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        
        // If department changes, filter doctors and reset doctor selection
        if (name === 'department') {
            if (value) {
                // Filter doctors by department (case-insensitive)
                const filtered = allDoctors.filter(doc => {
                    const docDept = doc.department ? doc.department.toLowerCase().trim() : '';
                    const selectedDept = value.toLowerCase().trim();
                    return docDept === selectedDept;
                });
                
                setDoctors(filtered);
                
                if (filtered.length === 0) {
                    setError(`No doctors found in ${value} department.`);
                } else {
                    setError('');
                }
            } else {
                setDoctors(allDoctors);
                setError('');
            }
            
            // Reset doctor selection
            setFormData(prev => ({ ...prev, doctor: '' }));
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setDocumentFile(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        // Validate doctor selection
        if (!formData.doctor) {
            setError('Please select a doctor');
            return;
        }
        
        try {
            setLoading(true);
            
            const submitData = new FormData();
            Object.keys(formData).forEach(key => {
                submitData.append(key, formData[key]);
            });
            if (documentFile) {
                submitData.append('document', documentFile);
            }

            const response = await appointmentService.bookAppointment(submitData);
            
            if (response.success) {
                onClose();
            } else {
                setError(response.message || 'Failed to book appointment');
            }
        } catch (error) {
            console.error('Error booking appointment:', error);
            setError(error.message || 'Failed to book appointment. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    const departmentOptions = [
        'Cardiology',
        'ENT',
        'General Medicine',
        'Orthopedics',
        'Pediatrics',
        'Dermatology',
        'Ophthalmology',
        'Neurology'
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Modal Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-[#0f4c81]">Book New Appointment</h2>
                    <button 
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                            {error}
                        </div>
                    )}

                    {/* Personal Information */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                            <User className="w-4 h-4 text-[#00B4D8]" />
                            Personal Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                                <input
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00B4D8]"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                                <input
                                    type="tel"
                                    name="phoneNumber"
                                    value={formData.phoneNumber}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00B4D8]"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00B4D8]"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Age *</label>
                                <input
                                    type="number"
                                    name="age"
                                    value={formData.age}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00B4D8]"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Gender *</label>
                                <select
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00B4D8]"
                                    required
                                >
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                    <option value="Prefer not to say">Prefer not to say</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
                                <input
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00B4D8]"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Appointment Details */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-700 mb-3">Appointment Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Department *</label>
                                <select
                                    name="department"
                                    value={formData.department}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00B4D8]"
                                    required
                                >
                                    <option value="">Select Department</option>
                                    {departmentOptions.map(dept => (
                                        <option key={dept} value={dept}>{dept}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Doctor *</label>
                                <select
                                    name="doctor"
                                    value={formData.doctor}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00B4D8]"
                                    required
                                    disabled={loadingDoctors || !formData.department}
                                >
                                    <option value="">
                                        {!formData.department 
                                            ? 'Select department first' 
                                            : loadingDoctors 
                                            ? 'Loading doctors...' 
                                            : doctors.length === 0 
                                            ? 'No doctors available' 
                                            : 'Select Doctor'}
                                    </option>
                                    {doctors.map((doc) => (
                                        <option key={doc._id} value={doc.fullName}>
                                            {doc.fullName} {doc.department ? `(${doc.department})` : ''}
                                        </option>
                                    ))}
                                </select>
                                {loadingDoctors && (
                                    <p className="text-gray-500 text-xs mt-1 flex items-center gap-1">
                                        <Loader2 className="w-3 h-3 animate-spin" /> Loading doctors...
                                    </p>
                                )}
                                {!loadingDoctors && formData.department && doctors.length === 0 && (
                                    <p className="text-red-500 text-xs mt-1">
                                        No doctors available in {formData.department} department.
                                        <button 
                                            type="button"
                                            onClick={loadAllDoctors}
                                            className="text-blue-500 hover:underline ml-1"
                                        >
                                            Refresh
                                        </button>
                                    </p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Appointment Type *</label>
                                <select
                                    name="appointmentType"
                                    value={formData.appointmentType}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00B4D8]"
                                    required
                                >
                                    <option value="In-Person">In-Person</option>
                                    <option value="Video Consult">Video Consult</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Date *</label>
                                <input
                                    type="date"
                                    name="preferredDate"
                                    value={formData.preferredDate}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00B4D8]"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Time *</label>
                                <input
                                    type="time"
                                    name="preferredTime"
                                    value={formData.preferredTime}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00B4D8]"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Medical Details */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-700 mb-3">Medical Details</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Visit *</label>
                                <textarea
                                    name="reasonForVisit"
                                    value={formData.reasonForVisit}
                                    onChange={handleInputChange}
                                    rows="2"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00B4D8]"
                                    placeholder="Briefly describe your reason for visit"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Symptoms</label>
                                <textarea
                                    name="symptoms"
                                    value={formData.symptoms}
                                    onChange={handleInputChange}
                                    rows="2"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00B4D8]"
                                    placeholder="Describe any symptoms you're experiencing"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Upload Medical Documents (Optional)</label>
                                <input
                                    type="file"
                                    onChange={handleFileChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00B4D8]"
                                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading || !formData.doctor}
                            className="px-6 py-2 bg-[#00B4D8] hover:bg-[#0096B4] text-white rounded-lg font-medium transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Booking...
                                </>
                            ) : (
                                'Book Appointment'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}