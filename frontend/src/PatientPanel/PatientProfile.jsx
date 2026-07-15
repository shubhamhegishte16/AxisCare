import React, { useState } from 'react';
import { 
  Bell, 
  User, 
  SquarePen, 
  Plus, 
  AlertTriangle,
  Save,
  X,
  ShieldCheck,
  KeyRound
} from 'lucide-react';
import Navbar from './Navbar';

export default function PatientProfile() {

  const [activeTab, setActiveTab] = useState('profile');

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingInsurance, setIsEditingInsurance] = useState(false);
  
  const [profileData, setProfileData] = useState({
    firstName: 'John',
    lastName: 'S',
    dob: '12/04/1972',
    address: 'Ghatkopar East, Mumbai 400075',
    phone: '234456778',
    email: 'johnS@gmail.com',
    patientPassNo: '1256',
    patientId: '#PT-992813',
    gender: 'Male',
    age: '54',
    dateOfRegistration: '10/24/2022',
    insuranceStatus: 'ABC Verified',
    accountStatus: 'Active Verified Account'
  });

  const [profileBuffer, setProfileBuffer] = useState({ ...profileData });

  const [insuranceData, setInsuranceData] = useState({
    provider: 'ABC Health Insurance',
    policyNumber: 'POL-8837492-X',
    groupNumber: 'GRP-9921',
    coverageType: 'Premium Comprehensive Care',
    validUntil: '12/31/2028',
    deductible: '$500'
  });
  const [insuranceBuffer, setInsuranceBuffer] = useState({ ...insuranceData });

  const [securityData, setSecurityData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [securityMessage, setSecurityMessage] = useState({ type: '', text: '' });

  const handleSaveProfile = () => {
    setProfileData({ ...profileBuffer });
    setIsEditingProfile(false);
  };

  const handleCancelProfile = () => {
    setProfileBuffer({ ...profileData });
    setIsEditingProfile(false);
  };

  const handleSaveInsurance = () => {
    setInsuranceData({ ...insuranceBuffer });
    setIsEditingInsurance(false);
  };

  const handleCancelInsurance = () => {
    setInsuranceBuffer({ ...insuranceData });
    setIsEditingInsurance(false);
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (!securityData.currentPassword || !securityData.newPassword || !securityData.confirmPassword) {
      setSecurityMessage({ type: 'error', text: 'All fields are required.' });
      return;
    }
    if (securityData.newPassword !== securityData.confirmPassword) {
      setSecurityMessage({ type: 'error', text: 'New passwords do not match.' });
      return;
    }
    
    // setSecurityMessage({ type: 'success', text: 'Password updated successfully!' });
    // setSecurityData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    
    // setTimeout(() => setSecurityMessage({ type: '', text: '' }), 4000);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans antialiased text-slate-800 pb-16">
      
      <Navbar />

      <main className="max-w-6xl mx-auto px-6 py-8">
        
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
          
          <div className="bg-white rounded-xl shadow-md border border-slate-100 p-6 flex flex-col items-center">
            <span className="text-xs font-semibold text-blue-400 self-start mb-4">Patient Pass No.: {profileData.patientPassNo}</span>
            
            <div className="w-24 h-24 bg-cyan-500 text-white rounded-full flex items-center justify-center mb-4 shadow-inner">
              <User className="w-14 h-14" />
            </div>

            <h2 className="text-2xl font-bold text-blue-900 mb-0.5">{profileData.firstName} {profileData.lastName}.</h2>
            <a href={`mailto:${profileData.email}`} className="text-xs text-blue-600 font-medium hover:underline">{profileData.email}</a>
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
          </div>

          <div className="lg:col-span-2 bg-white/50 backdrop-blur-sm p-4 rounded-xl border border-dashed border-slate-200 min-h-[400px]">
            
            {activeTab === 'profile' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold text-blue-900">Personal Demographics</h3>
                  {!isEditingProfile ? (
                    <button 
                      onClick={() => setIsEditingProfile(true)}
                      className="flex items-center gap-1.5 text-blue-600 hover:text-blue-800 transition text-sm font-bold"
                    >
                      <span>Tap to edit</span>
                      <SquarePen className="w-4 h-4" />
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button onClick={handleSaveProfile} className="flex items-center gap-1 text-xs bg-emerald-600 text-white px-3 py-1.5 rounded-md hover:bg-emerald-700 font-bold shadow-sm">
                        <Save className="w-3.5 h-3.5" /> Save
                      </button>
                      <button onClick={handleCancelProfile} className="flex items-center gap-1 text-xs bg-slate-400 text-white px-3 py-1.5 rounded-md hover:bg-slate-500 font-bold shadow-sm">
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
                      type="text" 
                      value={profileBuffer.dob} 
                      disabled={!isEditingProfile}
                      onChange={(e) => setProfileBuffer({...profileBuffer, dob: e.target.value})}
                      className={`flex-1 rounded-lg px-4 py-2.5 shadow-sm text-slate-700 transition focus:outline-none focus:ring-2 focus:ring-cyan-400 ${isEditingProfile ? 'bg-white border border-cyan-300' : 'bg-slate-100/80 border border-slate-200 text-slate-400'}`} 
                    />
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
                </div>
              </div>
            )}

            {activeTab === 'insurance' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-600" />
                    <h3 className="text-lg font-bold text-blue-900">Medical Insurance Coverage</h3>
                  </div>
                  {!isEditingInsurance ? (
                    <button 
                      onClick={() => setIsEditingInsurance(true)}
                      className="flex items-center gap-1.5 text-blue-600 hover:text-blue-800 transition text-sm font-bold"
                    >
                      <span>Tap to edit</span>
                      <SquarePen className="w-4 h-4" />
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button onClick={handleSaveInsurance} className="flex items-center gap-1 text-xs bg-emerald-600 text-white px-3 py-1.5 rounded-md hover:bg-emerald-700 font-bold shadow-sm">
                        <Save className="w-3.5 h-3.5" /> Save
                      </button>
                      <button onClick={handleCancelInsurance} className="flex items-center gap-1 text-xs bg-slate-400 text-white px-3 py-1.5 rounded-md hover:bg-slate-500 font-bold shadow-sm">
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
                    className="mt-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-5 py-2.5 rounded-lg shadow transition"
                  >
                    Update Password
                  </button>
                </form>
              </div>
            )}

          </div>
        </div>

        <section className="mt-12 border-t border-slate-200 pt-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-blue-900">Emergency Contacts:</h3>
            <button className="bg-cyan-500 text-white p-1.5 rounded-lg shadow-sm hover:bg-cyan-600 transition">
              <Plus className="w-5 h-5 stroke-[3]" />
            </button>
          </div>

          <div className="bg-blue-50/70 border border-blue-100 rounded-lg p-3 flex items-center gap-3 mb-6">
            <div className="bg-red-500 text-white p-1.5 rounded-md">
              <AlertTriangle className="w-4 h-4 fill-current text-red-500 stroke-white" />
            </div>
            <p className="text-xs font-extrabold text-blue-900 tracking-wide uppercase">
              IN THE EVENT OF A LIFE-THREATENING CRISIS, DISPATCH CITIZEN SERVICES IMMEDIATELY: 911
            </p>
          </div>

          <div className="flex justify-end items-center gap-1.5 mb-4 text-blue-600 hover:text-blue-800 transition cursor-pointer">
            <span className="font-bold text-sm">Tap to edit</span>
            <SquarePen className="w-4 h-4" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Card 1 */}
            <div className="bg-white rounded-xl shadow-md border border-slate-100 p-6 space-y-4">
              <h4 className="text-md font-bold text-blue-800">Primary Contact</h4>
              <p className="text-lg font-black text-blue-900">Jane Doe</p>
              
              <div className="space-y-2 text-sm pt-2">
                <div className="flex justify-between">
                  <span className="text-blue-800 font-bold">Relationship:</span>
                  <span className="text-blue-900 font-bold">Spouse</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-800 font-bold">Phone1:</span>
                  <span className="text-blue-900 font-bold">435678</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-800 font-bold">Phone2:</span>
                  <span className="text-blue-900 font-bold">55467789</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md border border-slate-100 p-6 space-y-4">
              <h4 className="text-md font-bold text-blue-800">Secondary Contact</h4>
              <p className="text-lg font-black text-blue-900">Bucen Lee</p>
              
              <div className="space-y-2 text-sm pt-2">
                <div className="flex justify-between">
                  <span className="text-blue-800 font-bold">Relationship:</span>
                  <span className="text-blue-900 font-bold">Brother</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-800 font-bold">Phone1:</span>
                  <span className="text-blue-900 font-bold">435678</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-800 font-bold">Phone2:</span>
                  <span className="text-blue-900 font-bold">55467789</span>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}