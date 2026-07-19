import React, { useState, useEffect } from 'react';
import { X, Loader2, Calendar, Clock, MapPin, Stethoscope, User, Phone, Mail, AlertCircle, Plus, Minus, CheckCircle } from 'lucide-react';
import { labAppointmentService } from '../services/LabAppointmentService';

export default function BookLabAppointment({ isOpen, onClose, prescription, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [patientData, setPatientData] = useState(null);
  const [formData, setFormData] = useState({
    patientName: '',
    patientAge: '',
    patientGender: 'Prefer not to say',
    patientPhone: '',
    patientEmail: '',
    patientAddress: '',
    labName: '',
    labAddress: '',
    appointmentDate: '',
    appointmentTime: '',
    appointmentType: 'In-Person',
    notes: '',
    symptoms: '',
    referringDoctor: '',
  });
  const [labTests, setLabTests] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setSuccess(false);
      setBookingDetails(null);
      setError(null);
      loadPatientData();
      
      if (prescription) {
        let tests = [];
        if (prescription.labTests) {
          if (Array.isArray(prescription.labTests)) {
            tests = prescription.labTests.map(t => ({ 
              testName: t.testName || t, 
              category: t.category || 'Other',
              instructions: t.instructions || ''
            }));
          } else if (typeof prescription.labTests === 'string') {
            tests = prescription.labTests.split(',').map(t => ({
              testName: t.trim(),
              category: 'Other',
              instructions: ''
            }));
          }
        }
        
        if (tests.length === 0) {
          tests = [{ testName: '', category: 'Other', instructions: '' }];
        }
        
        setLabTests(tests);
        setFormData(prev => ({
          ...prev,
          referringDoctor: prescription.doctorName || '',
          patientName: prescription.patientName || prev.patientName,
          patientAge: prescription.patientAge || prev.patientAge,
          patientGender: prescription.patientGender || prev.patientGender,
        }));
      }
    }
  }, [isOpen, prescription]);

  const loadPatientData = async () => {
    try {
      const response = await labAppointmentService.getPatientProfile();
      if (response.success) {
        const data = response.data;
        setPatientData(data);
        setFormData(prev => ({
          ...prev,
          patientName: data.firstName + ' ' + data.lastName || '',
          patientAge: data.age || '',
          patientGender: data.gender || 'Prefer not to say',
          patientPhone: data.phoneNumber || '',
          patientEmail: data.email || '',
          patientAddress: data.address || '',
        }));
      }
    } catch (error) {
      console.error('Error loading patient data:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddTest = () => {
    setLabTests(prev => [...prev, { testName: '', category: 'Other', instructions: '' }]);
  };

  const handleRemoveTest = (index) => {
    setLabTests(prev => prev.filter((_, i) => i !== index));
  };

  const handleTestChange = (index, field, value) => {
    setLabTests(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.labName || !formData.labAddress || !formData.appointmentDate || !formData.appointmentTime) {
      setError('Please fill in all required fields.');
      return;
    }

    const invalidTests = labTests.filter(t => !t.testName || t.testName.trim() === '');
    if (invalidTests.length > 0) {
      setError('Please fill in all test names.');
      return;
    }

    if (labTests.length === 0) {
      setError('Please add at least one lab test.');
      return;
    }

    try {
      setLoading(true);
      const response = await labAppointmentService.bookLabAppointment({
        ...formData,
        labTests: labTests,
        prescriptionId: prescription?._id || null,
        referringDoctor: formData.referringDoctor || prescription?.doctorName || '',
      });

      if (response.success) {
        setSuccess(true);
        setBookingDetails(response.data);
        
        // Auto close after 3 seconds
        setTimeout(() => {
          if (onSuccess) onSuccess(response.data);
          onClose();
        }, 3000);
      } else {
        setError(response.message || 'Failed to book appointment');
      }
    } catch (error) {
      console.error('Error booking lab appointment:', error);
      setError(error.message || 'Failed to book appointment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  // Show success view
  if (success && bookingDetails) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <div className="bg-white rounded-2xl max-w-md w-full shadow-xl p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Appointment Booked!</h3>
          <p className="text-gray-600 mb-4">
            Your lab appointment has been booked successfully.
          </p>
          <div className="bg-gray-50 rounded-lg p-4 text-left space-y-2 text-sm">
            <p><strong>Lab:</strong> {bookingDetails.labName}</p>
            <p><strong>Date:</strong> {bookingDetails.appointmentDate}</p>
            <p><strong>Time:</strong> {bookingDetails.appointmentTime}</p>
            <p><strong>Tests:</strong> {bookingDetails.labTests?.map(t => t.testName).join(', ')}</p>
          </div>
          <button
            onClick={() => {
              if (onSuccess) onSuccess(bookingDetails);
              onClose();
            }}
            className="mt-6 px-6 py-2 bg-[#00b4d8] hover:bg-[#0092b3] text-white rounded-lg font-medium transition"
          >
            Done
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center rounded-t-2xl">
          <div className="flex items-center gap-3">
            <Stethoscope className="w-6 h-6 text-[#00b4d8]" />
            <h2 className="text-xl font-bold text-[#0f4c81]">Book Lab Appointment</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition"
            disabled={loading}
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Personal Information */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <User className="w-4 h-4 text-[#00b4d8]" />
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* ... keep all existing form fields ... */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  name="patientName"
                  value={formData.patientName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00b4d8]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Age *</label>
                <input
                  type="number"
                  name="patientAge"
                  value={formData.patientAge}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00b4d8]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gender *</label>
                <select
                  name="patientGender"
                  value={formData.patientGender}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00b4d8]"
                  required
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                <input
                  type="tel"
                  name="patientPhone"
                  value={formData.patientPhone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00b4d8]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input
                  type="email"
                  name="patientEmail"
                  value={formData.patientEmail}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00b4d8]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
                <input
                  type="text"
                  name="patientAddress"
                  value={formData.patientAddress}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00b4d8]"
                  required
                />
              </div>
            </div>
          </div>

          {/* Lab Tests */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-[#00b4d8]" />
              Lab Tests *
              <button
                type="button"
                onClick={handleAddTest}
                className="ml-2 text-xs bg-[#00b4d8] text-white px-2 py-1 rounded-md hover:bg-[#0092b3]"
              >
                + Add Test
              </button>
            </h3>
            {labTests.length === 0 ? (
              <p className="text-sm text-gray-500">No tests added. Click "Add Test" to add lab tests.</p>
            ) : (
              labTests.map((test, index) => (
                <div key={index} className="flex flex-wrap items-center gap-3 mb-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex-1 min-w-[200px]">
                    <input
                      type="text"
                      placeholder="Test Name *"
                      value={test.testName}
                      onChange={(e) => handleTestChange(index, 'testName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00b4d8]"
                      required
                    />
                  </div>
                  <div className="w-40">
                    <select
                      value={test.category}
                      onChange={(e) => handleTestChange(index, 'category', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00b4d8]"
                    >
                      <option value="Hematology">Hematology</option>
                      <option value="Biochemistry">Biochemistry</option>
                      <option value="Urinalysis">Urinalysis</option>
                      <option value="Microbiology">Microbiology</option>
                      <option value="Pathology">Pathology</option>
                      <option value="Radiology">Radiology</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Instructions (optional)"
                      value={test.instructions || ''}
                      onChange={(e) => handleTestChange(index, 'instructions', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00b4d8]"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveTest(index)}
                    className="text-red-500 hover:text-red-700 p-1"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Appointment Details */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#00b4d8]" />
              Appointment Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Lab Name *</label>
                <input
                  type="text"
                  name="labName"
                  value={formData.labName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00b4d8]"
                  required
                  placeholder="e.g., City Diagnostic Lab"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Lab Address *</label>
                <input
                  type="text"
                  name="labAddress"
                  value={formData.labAddress}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00b4d8]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Appointment Date *</label>
                <input
                  type="date"
                  name="appointmentDate"
                  value={formData.appointmentDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00b4d8]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Appointment Time *</label>
                <input
                  type="time"
                  name="appointmentTime"
                  value={formData.appointmentTime}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00b4d8]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Appointment Type</label>
                <select
                  name="appointmentType"
                  value={formData.appointmentType}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00b4d8]"
                >
                  <option value="In-Person">In-Person</option>
                  <option value="Home Collection">Home Collection</option>
                  <option value="Video Consult">Video Consult</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Referring Doctor</label>
                <input
                  type="text"
                  name="referringDoctor"
                  value={formData.referringDoctor}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00b4d8]"
                  placeholder="Doctor who prescribed the tests"
                />
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Additional Information</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Symptoms</label>
                <textarea
                  name="symptoms"
                  value={formData.symptoms}
                  onChange={handleInputChange}
                  rows="2"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00b4d8]"
                  placeholder="Describe any symptoms you're experiencing"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Additional Notes</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows="2"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00b4d8]"
                  placeholder="Any additional information for the lab"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex flex-wrap justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || labTests.length === 0}
              className="px-6 py-2 bg-[#00b4d8] hover:bg-[#0092b3] text-white rounded-lg font-medium transition flex items-center gap-2 disabled:opacity-50"
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
