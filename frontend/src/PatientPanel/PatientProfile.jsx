import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  User, 
  SquarePen, 
  Plus, 
  AlertTriangle,
  Save,
  X,
  ShieldCheck,
  KeyRound,
  Trash2,
  Edit2,
  Loader2,
  CheckCircle,
  AlertCircle,
  LogOut
} from 'lucide-react';
import Navbar from './Navbar';
import { patientService } from '../services/patientService.js';
import { authService } from '../services/authService.js';

export default function PatientProfile() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [notification, setNotification] = useState({ type: '', message: '' });
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Profile state
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingInsurance, setIsEditingInsurance] = useState(false);
  const [isEditingEmergency, setIsEditingEmergency] = useState(false);
  const [editingContactIndex, setEditingContactIndex] = useState(null);
  
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    dob: '',
    address: '',
    phone: '',
    email: '',
    patientPassNo: '',
    patientId: '',
    gender: '',
    age: '',
    dateOfRegistration: '',
    insuranceStatus: '',
    accountStatus: ''
  });

  const [profileBuffer, setProfileBuffer] = useState({ ...profileData });

  const [insuranceData, setInsuranceData] = useState({
    provider: '',
    policyNumber: '',
    groupNumber: '',
    coverageType: '',
    validUntil: '',
    deductible: ''
  });
  const [insuranceBuffer, setInsuranceBuffer] = useState({ ...insuranceData });

  const [securityData, setSecurityData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [securityMessage, setSecurityMessage] = useState({ type: '', text: '' });

  const [emergencyContacts, setEmergencyContacts] = useState([]);
  const [newContact, setNewContact] = useState({
    name: '',
    relationship: '',
    phone1: '',
    phone2: '',
    isPrimary: false
  });
  const [editingContact, setEditingContact] = useState(null);

  // Load patient data on mount
  useEffect(() => {
    fetchPatientData();
  }, []);

  const fetchPatientData = async () => {
    try {
      setLoading(true);
      // console.log('Fetching patient data...');
      const response = await patientService.getOrCreateProfile();
      // console.log('Patient data response:', response);
      
      if (response.success) {
        const data = response.data;
        // console.log('Patient data:', data);
        
        // Calculate age
        const age = calculateAge(data.dateOfBirth);
        
        // Update profile data
        const newProfileData = {
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          dob: data.dateOfBirth || '01/01/1970',
          address: data.address || 'Not provided',
          phone: data.phoneNumber || '',
          email: data.email || '',
          patientPassNo: data.patientPassNo || '',
          patientId: data.patientId || '',
          gender: data.gender || 'Prefer not to say',
          age: age,
          dateOfRegistration: data.dateOfRegistration || '',
          insuranceStatus: data.insurance?.status || 'Not Available',
          accountStatus: data.accountStatus || 'Active Verified Account'
        };
        
        setProfileData(newProfileData);
        setProfileBuffer(newProfileData);

        setInsuranceData({
          provider: data.insurance?.provider || 'ABC Health Insurance',
          policyNumber: data.insurance?.policyNumber || 'POL-8837492-X',
          groupNumber: data.insurance?.groupNumber || 'GRP-9921',
          coverageType: data.insurance?.coverageType || 'Premium Comprehensive Care',
          validUntil: data.insurance?.validUntil || '12/31/2028',
          deductible: data.insurance?.deductible || '$500'
        });
        setInsuranceBuffer({
          provider: data.insurance?.provider || 'ABC Health Insurance',
          policyNumber: data.insurance?.policyNumber || 'POL-8837492-X',
          groupNumber: data.insurance?.groupNumber || 'GRP-9921',
          coverageType: data.insurance?.coverageType || 'Premium Comprehensive Care',
          validUntil: data.insurance?.validUntil || '12/31/2028',
          deductible: data.insurance?.deductible || '$500'
        });

        setEmergencyContacts(data.emergencyContacts || []);
      }
    } catch (error) {
      console.error('Error fetching patient data:', error);
      showNotification('error', error.message || 'Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const calculateAge = (dob) => {
    if (!dob || dob === '01/01/1970') return '';
    try {
      const birthDate = new Date(dob);
      const ageDifMs = Date.now() - birthDate.getTime();
      const ageDate = new Date(ageDifMs);
      return Math.abs(ageDate.getUTCFullYear() - 1970);
    } catch (e) {
      return '';
    }
  };

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification({ type: '', message: '' }), 5000);
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await authService.logout();
      // Clear local storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Redirect to login page
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout error:', error);
      // Even if API fails, clear local data and redirect
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
  };

  // Profile handlers
  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      // console.log('Saving profile data:', profileBuffer);
      
      const updateData = {
        firstName: profileBuffer.firstName,
        lastName: profileBuffer.lastName,
        dateOfBirth: profileBuffer.dob,
        address: profileBuffer.address,
        phoneNumber: profileBuffer.phone,
        email: profileBuffer.email,
        gender: profileBuffer.gender,
      };

      const response = await patientService.updateProfile(updateData);
      // console.log('Profile update response:', response);
      
      if (response.success) {
        const updatedData = response.data;
        // Update profile data with response
        const newProfileData = {
          ...profileBuffer,
          age: calculateAge(updatedData.dateOfBirth || profileBuffer.dob),
          patientPassNo: updatedData.patientPassNo || profileBuffer.patientPassNo,
          patientId: updatedData.patientId || profileBuffer.patientId,
          dateOfRegistration: updatedData.dateOfRegistration || profileBuffer.dateOfRegistration,
          insuranceStatus: updatedData.insurance?.status || profileBuffer.insuranceStatus,
          accountStatus: updatedData.accountStatus || profileBuffer.accountStatus
        };
        
        setProfileData(newProfileData);
        setProfileBuffer(newProfileData);
        setIsEditingProfile(false);
        showNotification('success', 'Profile updated successfully!');
        
        // Refresh data to ensure consistency
        await fetchPatientData();
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      showNotification('error', error.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleCancelProfile = () => {
    setProfileBuffer({ ...profileData });
    setIsEditingProfile(false);
  };

  // Insurance handlers
  const handleSaveInsurance = async () => {
    try {
      setSaving(true);
      // console.log('Saving insurance data:', insuranceBuffer);
      
      const response = await patientService.updateInsurance(insuranceBuffer);
      // console.log('Insurance update response:', response);
      
      if (response.success) {
        setInsuranceData({ ...insuranceBuffer });
        setIsEditingInsurance(false);
        showNotification('success', 'Insurance information updated successfully!');
        await fetchPatientData(); // Refresh data
      }
    } catch (error) {
      console.error('Error updating insurance:', error);
      showNotification('error', error.message || 'Failed to update insurance');
    } finally {
      setSaving(false);
    }
  };

  const handleCancelInsurance = () => {
    setInsuranceBuffer({ ...insuranceData });
    setIsEditingInsurance(false);
  };

  // Password handler
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    if (!securityData.currentPassword || !securityData.newPassword || !securityData.confirmPassword) {
      setSecurityMessage({ type: 'error', text: 'All fields are required.' });
      return;
    }
    
    if (securityData.newPassword !== securityData.confirmPassword) {
      setSecurityMessage({ type: 'error', text: 'New passwords do not match.' });
      return;
    }

    if (securityData.newPassword.length < 6) {
      setSecurityMessage({ type: 'error', text: 'Password must be at least 6 characters long.' });
      return;
    }

    try {
      setSaving(true);
      const response = await patientService.updatePassword(securityData);
      if (response.success) {
        setSecurityMessage({ type: 'success', text: 'Password updated successfully!' });
        setSecurityData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setTimeout(() => setSecurityMessage({ type: '', text: '' }), 4000);
      }
    } catch (error) {
      setSecurityMessage({ type: 'error', text: error.message || 'Failed to update password' });
    } finally {
      setSaving(false);
    }
  };

  // Emergency Contact handlers
  const handleAddEmergencyContact = async () => {
    if (!newContact.name || !newContact.relationship || !newContact.phone1) {
      showNotification('error', 'Name, relationship, and primary phone are required.');
      return;
    }

    try {
      setSaving(true);
      const updatedContacts = [...emergencyContacts, { ...newContact, isPrimary: emergencyContacts.length === 0 }];
      const response = await patientService.updateEmergencyContacts(updatedContacts);
      
      if (response.success) {
        setEmergencyContacts(response.data);
        setNewContact({ name: '', relationship: '', phone1: '', phone2: '', isPrimary: false });
        showNotification('success', 'Emergency contact added successfully!');
        await fetchPatientData(); // Refresh data
      }
    } catch (error) {
      showNotification('error', error.message || 'Failed to add emergency contact');
    } finally {
      setSaving(false);
    }
  };

  const handleEditEmergencyContact = (index) => {
    setEditingContactIndex(index);
    setEditingContact({ ...emergencyContacts[index] });
  };

  const handleSaveEmergencyContact = async () => {
    if (!editingContact.name || !editingContact.relationship || !editingContact.phone1) {
      showNotification('error', 'Name, relationship, and primary phone are required.');
      return;
    }

    try {
      setSaving(true);
      const updatedContacts = [...emergencyContacts];
      updatedContacts[editingContactIndex] = editingContact;
      const response = await patientService.updateEmergencyContacts(updatedContacts);
      
      if (response.success) {
        setEmergencyContacts(response.data);
        setEditingContactIndex(null);
        setEditingContact(null);
        showNotification('success', 'Emergency contact updated successfully!');
        await fetchPatientData(); // Refresh data
      }
    } catch (error) {
      showNotification('error', error.message || 'Failed to update emergency contact');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteEmergencyContact = async (index) => {
    if (!window.confirm('Are you sure you want to delete this emergency contact?')) return;

    try {
      setSaving(true);
      const updatedContacts = emergencyContacts.filter((_, i) => i !== index);
      const response = await patientService.updateEmergencyContacts(updatedContacts);
      
      if (response.success) {
        setEmergencyContacts(response.data);
        showNotification('success', 'Emergency contact deleted successfully!');
        await fetchPatientData(); // Refresh data
      }
    } catch (error) {
      showNotification('error', error.message || 'Failed to delete emergency contact');
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEditContact = () => {
    setEditingContactIndex(null);
    setEditingContact(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="flex items-center justify-center h-[80vh]">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-cyan-500 animate-spin mx-auto mb-4" />
            <p className="text-slate-600">Loading your profile...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans antialiased text-slate-800 pb-16">
      <Navbar />

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Notification */}
        {notification.message && (
          <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
            notification.type === 'success' 
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
              : 'bg-rose-50 text-rose-700 border border-rose-200'
          }`}>
            {notification.type === 'success' ? (
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
            )}
            <span className="font-medium">{notification.message}</span>
          </div>
        )}

        {/* Tabs */}
        <div className="flex flex-wrap gap-4 mb-8">
          <button 
            onClick={() => setActiveTab('profile')}
            className={`px-6 py-2 rounded-full font-medium text-sm transition shadow-sm ${
              activeTab === 'profile' 
                ? 'bg-cyan-500 text-white' 
                : 'bg-white text-cyan-600 border border-cyan-100 hover:bg-slate-50'
            }`}
          >
            Profile Info
          </button>
          <button 
            onClick={() => setActiveTab('insurance')}
            className={`px-6 py-2 rounded-full font-medium text-sm transition shadow-sm ${
              activeTab === 'insurance' 
                ? 'bg-cyan-500 text-white' 
                : 'bg-white text-cyan-600 border border-cyan-100 hover:bg-slate-50'
            }`}
          >
            Insurance Details
          </button>
          <button 
            onClick={() => setActiveTab('security')}
            className={`px-6 py-2 rounded-full font-medium text-sm transition shadow-sm ${
              activeTab === 'security' 
                ? 'bg-cyan-500 text-white' 
                : 'bg-white text-cyan-600 border border-cyan-100 hover:bg-slate-50'
            }`}
          >
            Security & Login Settings
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start mb-12">
          {/* Left Panel - Patient Card */}
          <div className="bg-white rounded-xl shadow-md border border-slate-100 p-6 flex flex-col items-center">
            <span className="text-xs font-semibold text-blue-400 self-start mb-4">
              Patient Pass No.: {profileData.patientPassNo}
            </span>
            
            <div className="w-24 h-24 bg-cyan-500 text-white rounded-full flex items-center justify-center mb-4 shadow-inner">
              <User className="w-14 h-14" />
            </div>

            <h2 className="text-2xl font-bold text-blue-900 mb-0.5">
              {profileData.firstName} {profileData.lastName}
            </h2>
            <a href={`mailto:${profileData.email}`} className="text-xs text-blue-600 font-medium hover:underline">
              {profileData.email}
            </a>
            <span className="text-xs text-slate-400 mt-0.5 mb-6">{profileData.phone}</span>

            <div className="w-full space-y-3 border-t border-slate-100 pt-5 text-sm">
              <div className="flex justify-between font-medium">
                <span className="text-blue-950 font-bold">Patient ID:</span>
                <span className="text-blue-950 font-bold">{profileData.patientId}</span>
              </div>
              <div className="flex justify-between font-medium">
                <span className="text-blue-950 font-bold">Gender:</span>
                <span className="text-blue-800">{profileData.gender}</span>
              </div>
              <div className="flex justify-between font-medium">
                <span className="text-blue-950 font-bold">Age:</span>
                <span className="text-blue-800">{profileData.age}</span>
              </div>
              <div className="flex justify-between items-start font-medium">
                <span className="text-blue-950 font-bold">Address:</span>
                <span className="text-blue-800 text-right max-w-[160px] leading-tight">{profileData.address}</span>
              </div>
              <div className="flex justify-between font-medium">
                <span className="text-blue-950 font-bold">Date of Registration:</span>
                <span className="text-blue-800">{profileData.dateOfRegistration}</span>
              </div>
              <div className="flex justify-between font-medium">
                <span className="text-blue-950 font-bold">Insurance:</span>
                <span className="text-blue-900 font-bold">{profileData.insuranceStatus}</span>
              </div>
              <div className="flex justify-between font-medium">
                <span className="text-blue-950 font-bold">Status:</span>
                <span className="text-blue-600 font-bold">{profileData.accountStatus}</span>
              </div>
            </div>

            {/* Logout Button at bottom of card */}
            <div className="w-full mt-6 pt-4 border-t border-slate-200">
              <button
                onClick={() => setShowLogoutConfirm(true)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 font-medium rounded-lg transition border border-red-200 hover:border-red-300"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>

          {/* Right Panel - Dynamic Content */}
          <div className="lg:col-span-2 bg-white/50 backdrop-blur-sm p-4 rounded-xl border border-dashed border-slate-200 min-h-[400px]">
            
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold text-blue-900">Personal Demographics</h3>
                  {!isEditingProfile ? (
                    <button 
                      onClick={() => {
                        setProfileBuffer({ ...profileData });
                        setIsEditingProfile(true);
                      }}
                      className="flex items-center gap-1.5 text-blue-600 hover:text-blue-800 transition text-sm font-bold"
                    >
                      <span>Tap to edit</span>
                      <SquarePen className="w-4 h-4" />
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button 
                        onClick={handleSaveProfile} 
                        disabled={saving}
                        className="flex items-center gap-1 text-xs bg-emerald-600 text-white px-3 py-1.5 rounded-md hover:bg-emerald-700 font-bold shadow-sm disabled:opacity-50"
                      >
                        {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />} 
                        {saving ? 'Saving...' : 'Save'}
                      </button>
                      <button 
                        onClick={handleCancelProfile} 
                        className="flex items-center gap-1 text-xs bg-slate-400 text-white px-3 py-1.5 rounded-md hover:bg-slate-500 font-bold shadow-sm"
                      >
                        <X className="w-3.5 h-3.5" /> Cancel
                      </button>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <label className="w-32 text-blue-400 font-bold text-sm md:text-right">First Name:</label>
                    <input 
                      type="text" 
                      value={profileBuffer.firstName} 
                      disabled={!isEditingProfile}
                      onChange={(e) => setProfileBuffer({...profileBuffer, firstName: e.target.value})}
                      className={`flex-1 rounded-lg px-4 py-2.5 shadow-sm text-slate-700 transition focus:outline-none focus:ring-2 focus:ring-cyan-400 ${isEditingProfile ? 'bg-white border border-cyan-300' : 'bg-slate-100/80 border border-slate-200 text-slate-400'}`} 
                    />
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <label className="w-32 text-blue-400 font-bold text-sm md:text-right">Last Name:</label>
                    <input 
                      type="text" 
                      value={profileBuffer.lastName} 
                      disabled={!isEditingProfile}
                      onChange={(e) => setProfileBuffer({...profileBuffer, lastName: e.target.value})}
                      className={`flex-1 rounded-lg px-4 py-2.5 shadow-sm text-slate-700 transition focus:outline-none focus:ring-2 focus:ring-cyan-400 ${isEditingProfile ? 'bg-white border border-cyan-300' : 'bg-slate-100/80 border border-slate-200 text-slate-400'}`} 
                    />
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <label className="w-32 text-blue-400 font-bold text-sm md:text-right">DOB:</label>
                    <input 
                      type="date" 
                      value={profileBuffer.dob} 
                      disabled={!isEditingProfile}
                      onChange={(e) => setProfileBuffer({...profileBuffer, dob: e.target.value})}
                      className={`flex-1 rounded-lg px-4 py-2.5 shadow-sm text-slate-700 transition focus:outline-none focus:ring-2 focus:ring-cyan-400 ${isEditingProfile ? 'bg-white border border-cyan-300' : 'bg-slate-100/80 border border-slate-200 text-slate-400'}`} 
                    />
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <label className="w-32 text-blue-400 font-bold text-sm md:text-right">Gender:</label>
                    <select 
                      value={profileBuffer.gender}
                      disabled={!isEditingProfile}
                      onChange={(e) => setProfileBuffer({...profileBuffer, gender: e.target.value})}
                      className={`flex-1 rounded-lg px-4 py-2.5 shadow-sm text-slate-700 transition focus:outline-none focus:ring-2 focus:ring-cyan-400 ${isEditingProfile ? 'bg-white border border-cyan-300' : 'bg-slate-100/80 border border-slate-200 text-slate-400'}`}
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                      <option value="Prefer not to say">Prefer not to say</option>
                    </select>
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <label className="w-32 text-blue-400 font-bold text-sm md:text-right">Address:</label>
                    <input 
                      type="text" 
                      value={profileBuffer.address} 
                      disabled={!isEditingProfile}
                      onChange={(e) => setProfileBuffer({...profileBuffer, address: e.target.value})}
                      className={`flex-1 rounded-lg px-4 py-2.5 shadow-sm text-slate-700 transition focus:outline-none focus:ring-2 focus:ring-cyan-400 ${isEditingProfile ? 'bg-white border border-cyan-300' : 'bg-slate-100/80 border border-slate-200 text-slate-400'}`} 
                    />
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <label className="w-32 text-blue-400 font-bold text-sm md:text-right">Phone:</label>
                    <input 
                      type="text" 
                      value={profileBuffer.phone} 
                      disabled={!isEditingProfile}
                      onChange={(e) => setProfileBuffer({...profileBuffer, phone: e.target.value})}
                      className={`flex-1 rounded-lg px-4 py-2.5 shadow-sm text-slate-700 transition focus:outline-none focus:ring-2 focus:ring-cyan-400 ${isEditingProfile ? 'bg-white border border-cyan-300' : 'bg-slate-100/80 border border-slate-200 text-slate-400'}`} 
                    />
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <label className="w-32 text-blue-400 font-bold text-sm md:text-right">Email:</label>
                    <input 
                      type="email" 
                      value={profileBuffer.email} 
                      disabled={!isEditingProfile}
                      onChange={(e) => setProfileBuffer({...profileBuffer, email: e.target.value})}
                      className={`flex-1 rounded-lg px-4 py-2.5 shadow-sm text-slate-700 transition focus:outline-none focus:ring-2 focus:ring-cyan-400 ${isEditingProfile ? 'bg-white border border-cyan-300' : 'bg-slate-100/80 border border-slate-200 text-slate-400'}`} 
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Insurance Tab */}
            {activeTab === 'insurance' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-600" />
                    <h3 className="text-lg font-bold text-blue-900">Medical Insurance Coverage</h3>
                  </div>
                  {!isEditingInsurance ? (
                    <button 
                      onClick={() => {
                        setInsuranceBuffer({ ...insuranceData });
                        setIsEditingInsurance(true);
                      }}
                      className="flex items-center gap-1.5 text-blue-600 hover:text-blue-800 transition text-sm font-bold"
                    >
                      <span>Tap to edit</span>
                      <SquarePen className="w-4 h-4" />
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button 
                        onClick={handleSaveInsurance} 
                        disabled={saving}
                        className="flex items-center gap-1 text-xs bg-emerald-600 text-white px-3 py-1.5 rounded-md hover:bg-emerald-700 font-bold shadow-sm disabled:opacity-50"
                      >
                        {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                        {saving ? 'Saving...' : 'Save'}
                      </button>
                      <button 
                        onClick={handleCancelInsurance} 
                        className="flex items-center gap-1 text-xs bg-slate-400 text-white px-3 py-1.5 rounded-md hover:bg-slate-500 font-bold shadow-sm"
                      >
                        <X className="w-3.5 h-3.5" /> Cancel
                      </button>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <label className="w-36 text-blue-400 font-bold text-sm md:text-right">Insurance Provider:</label>
                    <input 
                      type="text" 
                      value={insuranceBuffer.provider} 
                      disabled={!isEditingInsurance}
                      onChange={(e) => setInsuranceBuffer({...insuranceBuffer, provider: e.target.value})}
                      className={`flex-1 rounded-lg px-4 py-2.5 text-slate-700 focus:outline-none ${isEditingInsurance ? 'bg-white border border-cyan-300 focus:ring-2 focus:ring-cyan-400' : 'bg-slate-100/80 border border-slate-200 text-slate-400'}`} 
                    />
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <label className="w-36 text-blue-400 font-bold text-sm md:text-right">Policy ID Number:</label>
                    <input 
                      type="text" 
                      value={insuranceBuffer.policyNumber} 
                      disabled={!isEditingInsurance}
                      onChange={(e) => setInsuranceBuffer({...insuranceBuffer, policyNumber: e.target.value})}
                      className={`flex-1 rounded-lg px-4 py-2.5 text-slate-700 focus:outline-none ${isEditingInsurance ? 'bg-white border border-cyan-300 focus:ring-2 focus:ring-cyan-400' : 'bg-slate-100/80 border border-slate-200 text-slate-400'}`} 
                    />
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <label className="w-36 text-blue-400 font-bold text-sm md:text-right">Group Number:</label>
                    <input 
                      type="text" 
                      value={insuranceBuffer.groupNumber} 
                      disabled={!isEditingInsurance}
                      onChange={(e) => setInsuranceBuffer({...insuranceBuffer, groupNumber: e.target.value})}
                      className={`flex-1 rounded-lg px-4 py-2.5 text-slate-700 focus:outline-none ${isEditingInsurance ? 'bg-white border border-cyan-300 focus:ring-2 focus:ring-cyan-400' : 'bg-slate-100/80 border border-slate-200 text-slate-400'}`} 
                    />
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <label className="w-36 text-blue-400 font-bold text-sm md:text-right">Coverage Class:</label>
                    <input 
                      type="text" 
                      value={insuranceBuffer.coverageType} 
                      disabled={!isEditingInsurance}
                      onChange={(e) => setInsuranceBuffer({...insuranceBuffer, coverageType: e.target.value})}
                      className={`flex-1 rounded-lg px-4 py-2.5 text-slate-700 focus:outline-none ${isEditingInsurance ? 'bg-white border border-cyan-300 focus:ring-2 focus:ring-cyan-400' : 'bg-slate-100/80 border border-slate-200 text-slate-400'}`} 
                    />
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <label className="w-36 text-blue-400 font-bold text-sm md:text-right">Valid Until:</label>
                    <input 
                      type="date" 
                      value={insuranceBuffer.validUntil} 
                      disabled={!isEditingInsurance}
                      onChange={(e) => setInsuranceBuffer({...insuranceBuffer, validUntil: e.target.value})}
                      className={`flex-1 rounded-lg px-4 py-2.5 text-slate-700 focus:outline-none ${isEditingInsurance ? 'bg-white border border-cyan-300 focus:ring-2 focus:ring-cyan-400' : 'bg-slate-100/80 border border-slate-200 text-slate-400'}`} 
                    />
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <label className="w-36 text-blue-400 font-bold text-sm md:text-right">Deductible Limit:</label>
                    <input 
                      type="text" 
                      value={insuranceBuffer.deductible} 
                      disabled={!isEditingInsurance}
                      onChange={(e) => setInsuranceBuffer({...insuranceBuffer, deductible: e.target.value})}
                      className={`flex-1 rounded-lg px-4 py-2.5 text-slate-700 focus:outline-none ${isEditingInsurance ? 'bg-white border border-cyan-300 focus:ring-2 focus:ring-cyan-400' : 'bg-slate-100/80 border border-slate-200 text-slate-400'}`} 
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <KeyRound className="w-5 h-5 text-amber-500" />
                  <h3 className="text-lg font-bold text-blue-900">Change Account Password</h3>
                </div>

                {securityMessage.text && (
                  <div className={`mb-4 p-3 rounded-md text-sm font-semibold border ${
                    securityMessage.type === 'success' 
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                      : 'bg-rose-50 text-rose-700 border-rose-200'
                  }`}>
                    {securityMessage.text}
                  </div>
                )}

                <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-500">Current Security Password</label>
                    <input 
                      type="password" 
                      placeholder="Enter current password"
                      value={securityData.currentPassword}
                      onChange={(e) => setSecurityData({...securityData, currentPassword: e.target.value})}
                      className="bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-500">New Password</label>
                    <input 
                      type="password" 
                      placeholder="Enter new strong password"
                      value={securityData.newPassword}
                      onChange={(e) => setSecurityData({...securityData, newPassword: e.target.value})}
                      className="bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-500">Confirm New Password</label>
                    <input 
                      type="password" 
                      placeholder="Repeat new password"
                      value={securityData.confirmPassword}
                      onChange={(e) => setSecurityData({...securityData, confirmPassword: e.target.value})}
                      className="bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400"
                    />
                  </div>

                  <button 
                    type="submit"
                    disabled={saving}
                    className="mt-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-5 py-2.5 rounded-lg shadow transition disabled:opacity-50"
                  >
                    {saving ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" /> Updating...
                      </span>
                    ) : (
                      'Update Password'
                    )}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>

        {/* Emergency Contacts Section */}
        <section className="mt-12 border-t border-slate-200 pt-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-blue-900">Emergency Contacts:</h3>
            {!isEditingEmergency ? (
              <button 
                onClick={() => setIsEditingEmergency(true)}
                className="flex items-center gap-1.5 text-blue-600 hover:text-blue-800 transition text-sm font-bold"
              >
                <span>Manage</span>
                <SquarePen className="w-4 h-4" />
              </button>
            ) : (
              <button 
                onClick={() => setIsEditingEmergency(false)}
                className="flex items-center gap-1.5 text-slate-500 hover:text-slate-700 transition text-sm font-bold"
              >
                <span>Done</span>
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="bg-blue-50/70 border border-blue-100 rounded-lg p-3 flex items-center gap-3 mb-6">
            <div className="bg-red-500 text-white p-1.5 rounded-md">
              <AlertTriangle className="w-4 h-4 fill-current text-red-500 stroke-white" />
            </div>
            <p className="text-xs font-extrabold text-blue-900 tracking-wide uppercase">
              IN THE EVENT OF A LIFE-THREATENING CRISIS, DISPATCH CITIZEN SERVICES IMMEDIATELY: 911
            </p>
          </div>

          {/* Add Emergency Contact Form */}
          {isEditingEmergency && (
            <div className="bg-white rounded-xl shadow-md border border-slate-100 p-6 mb-6">
              <h4 className="font-bold text-blue-900 mb-4">Add New Emergency Contact</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={newContact.name}
                  onChange={(e) => setNewContact({...newContact, name: e.target.value})}
                  className="rounded-lg px-4 py-2.5 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
                <input
                  type="text"
                  placeholder="Relationship"
                  value={newContact.relationship}
                  onChange={(e) => setNewContact({...newContact, relationship: e.target.value})}
                  className="rounded-lg px-4 py-2.5 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
                <input
                  type="text"
                  placeholder="Primary Phone"
                  value={newContact.phone1}
                  onChange={(e) => setNewContact({...newContact, phone1: e.target.value})}
                  className="rounded-lg px-4 py-2.5 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
                <input
                  type="text"
                  placeholder="Secondary Phone (Optional)"
                  value={newContact.phone2}
                  onChange={(e) => setNewContact({...newContact, phone2: e.target.value})}
                  className="rounded-lg px-4 py-2.5 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
              </div>
              <button
                onClick={handleAddEmergencyContact}
                disabled={saving}
                className="mt-4 bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-2 rounded-lg font-medium shadow-sm transition disabled:opacity-50"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin inline mr-2" /> : <Plus className="w-4 h-4 inline mr-2" />}
                Add Contact
              </button>
            </div>
          )}

          {/* Emergency Contacts Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {emergencyContacts.length === 0 ? (
              <div className="col-span-2 text-center py-8 text-slate-500">
                No emergency contacts added yet. Click "Manage" to add one.
              </div>
            ) : (
              emergencyContacts.map((contact, index) => (
                <div key={index} className="bg-white rounded-xl shadow-md border border-slate-100 p-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-md font-bold text-blue-800">
                        {contact.isPrimary ? 'Primary Contact' : 'Secondary Contact'}
                      </h4>
                      <p className="text-lg font-black text-blue-900">{contact.name}</p>
                    </div>
                    {isEditingEmergency && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditEmergencyContact(index)}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteEmergencyContact(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                  
                  {editingContactIndex === index ? (
                    // Edit mode
                    <div className="space-y-3 pt-2">
                      <input
                        type="text"
                        value={editingContact.name}
                        onChange={(e) => setEditingContact({...editingContact, name: e.target.value})}
                        className="w-full rounded-lg px-3 py-2 border border-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                      />
                      <input
                        type="text"
                        value={editingContact.relationship}
                        onChange={(e) => setEditingContact({...editingContact, relationship: e.target.value})}
                        className="w-full rounded-lg px-3 py-2 border border-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                      />
                      <input
                        type="text"
                        value={editingContact.phone1}
                        onChange={(e) => setEditingContact({...editingContact, phone1: e.target.value})}
                        className="w-full rounded-lg px-3 py-2 border border-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                      />
                      <input
                        type="text"
                        value={editingContact.phone2}
                        onChange={(e) => setEditingContact({...editingContact, phone2: e.target.value})}
                        className="w-full rounded-lg px-3 py-2 border border-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                      />
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={handleSaveEmergencyContact}
                          disabled={saving}
                          className="bg-emerald-600 text-white px-4 py-1.5 rounded-md text-sm font-bold hover:bg-emerald-700 transition disabled:opacity-50"
                        >
                          {saving ? <Loader2 className="w-4 h-4 animate-spin inline" /> : 'Save'}
                        </button>
                        <button
                          onClick={handleCancelEditContact}
                          className="bg-slate-400 text-white px-4 py-1.5 rounded-md text-sm font-bold hover:bg-slate-500 transition"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    // View mode
                    <div className="space-y-2 text-sm pt-2">
                      <div className="flex justify-between">
                        <span className="text-blue-800 font-bold">Relationship:</span>
                        <span className="text-blue-900 font-bold">{contact.relationship}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-800 font-bold">Phone1:</span>
                        <span className="text-blue-900 font-bold">{contact.phone1}</span>
                      </div>
                      {contact.phone2 && (
                        <div className="flex justify-between">
                          <span className="text-blue-800 font-bold">Phone2:</span>
                          <span className="text-blue-900 font-bold">{contact.phone2}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </section>
      </main>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <LogOut className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Confirm Logout</h3>
              <p className="text-slate-600 mb-6">
                Are you sure you want to logout? You'll need to login again to access your account.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}