import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './Landing';
import DoctorDashboard from './doctorpanel/DoctorDashboard';
import Patients from './doctorpanel/Patients';
import Appointments from './doctorpanel/Appointments';
import Prescriptions from './doctorpanel/Prescriptions';
import NewPrescription from './doctorpanel/NewPrescription';
import DoctorSettings from './doctorpanel/DoctorSettings';
import Reports from './doctorpanel/Reports';
import CreateReport from './doctorpanel/CreateReport';
import Notifications from './doctorpanel/Notifications';
import RoleSelect from './RoleSelect';

// Patient Panel
import PatientDashboard from './PatientPanel/PatientDashboard.jsx';
import PatientProfile from './PatientPanel/PatientProfile.jsx';
import PatientMedical from './PatientPanel/PatientMedical.jsx';

// Pharmacist Panel
import PharmacyLogin from './PharmacistPanel/PharmacyLogin.jsx';
import PharmacyRegister from './PharmacistPanel/PharmacyRegister.jsx';
import PharmacyForgotPassword from './PharmacistPanel/PharmacyForgotPassword.jsx';
import PharmacyResetPassword from './PharmacistPanel/PharmacyResetPassword.jsx';
import PharmacyDashboard from './PharmacistPanel/PharmacyDashboard.jsx';
import Medicines from './PharmacistPanel/Medicines.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        {/* Redirecting to dashboard for any doctor path for now */}
        <Route path="/doctordashboard" element={<DoctorDashboard />} />
        <Route path="/doctordashboard/patients" element={<Patients />} />
        <Route path="/doctordashboard/appointments" element={<Appointments />} />
        <Route path="/doctordashboard/prescriptions" element={<Prescriptions />} />
        <Route path="/doctordashboard/new-prescription" element={<NewPrescription />} />
        <Route path="/doctordashboard/settings" element={<DoctorSettings />} />
        <Route path="/doctordashboard/reports" element={<Reports />} />
        <Route path="/doctordashboard/create-report" element={<CreateReport />} />
        <Route path="/doctordashboard/notifications" element={<Notifications />} />
        {/* select role Panel */}
	<Route path="/role-select" element={<RoleSelect />} />


        {/* Patient Panel */}
        <Route path="/patient-dashboard" element={<PatientDashboard />} />
        <Route path="/patient-profile" element={<PatientProfile />} />
        <Route path='/patient-history' element={<PatientMedical />} />

        {/* Pharmacist Panel */}
        <Route path="/pharmacy/login" element={<PharmacyLogin />} />
        <Route path="/pharmacy/register" element={<PharmacyRegister />} />
        <Route path="/pharmacy/forgot-password" element={<PharmacyForgotPassword />} />
        <Route path="/pharmacy/reset-password" element={<PharmacyResetPassword />} />
        <Route path="/pharmacy/dashboard" element={<PharmacyDashboard />} />
        <Route path="/pharmacy/medicines" element={<Medicines />} />
        <Route path="/pharmacy" element={<Navigate to="/pharmacy/login" replace />} />

      </Routes>
    </Router>
  );
}

export default App;