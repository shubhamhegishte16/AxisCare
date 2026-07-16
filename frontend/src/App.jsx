import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Landing from './Landing';

// Doctor Panel
import DoctorDashboard from './doctorpanel/DoctorDashboard';
import Patients from './doctorpanel/Patients';
import Appointments from './doctorpanel/Appointments';
import Prescriptions from './doctorpanel/Prescriptions';
import NewPrescription from './doctorpanel/NewPrescription';
import DoctorSettings from './doctorpanel/DoctorSettings';
import Reports from './doctorpanel/Reports';
import CreateReport from './doctorpanel/CreateReport';
import Notifications from './doctorpanel/Notifications';

// Shared
import RoleSelect from './RoleSelect';
import RoleLogin from './shared/RoleLogin';
import RoleRegister from './shared/RoleRegister';

// Patient Panel
import PatientDashboard from './PatientPanel/PatientDashboard.jsx';
import PatientProfile from './PatientPanel/PatientProfile.jsx';
import PatientMedical from './PatientPanel/PatientMedical.jsx';
import PatientAppointments from './PatientPanel/PatientAppointments.jsx';
import PatientBills from './PatientPanel/PatientBills.jsx';
import NotificationsPage from './PatientPanel/Notifiactionspage.jsx';

// Pharmacist Panel
import PharmacyLogin from './PharmacistPanel/PharmacyLogin.jsx';
import PharmacyRegister from './PharmacistPanel/PharmacyRegister.jsx';
import PharmacyForgotPassword from './PharmacistPanel/PharmacyForgotPassword.jsx';
import PharmacyResetPassword from './PharmacistPanel/PharmacyResetPassword.jsx';
import PharmacyDashboard from './PharmacistPanel/PharmacyDashboard.jsx';
import Medicines from './PharmacistPanel/Medicines.jsx';
import Prescription from './PharmacistPanel/Prescriptions.jsx';
import Inventory from './PharmacistPanel/Inventory.jsx';
import Orders from './PharmacistPanel/Orders.jsx';
import Suppliers from './PharmacistPanel/Suppliers.jsx';
import Billing from './PharmacistPanel/Billing.jsx';
import Report from './PharmacistPanel/Reports.jsx';
import Notification from './PharmacistPanel/Notifications.jsx';

function App() {
  return (
    <Router>
      <Routes>

        {/* Landing */}
        <Route path="/" element={<Landing />} />

        {/* Role Selection */}
        <Route path="/role-select" element={<RoleSelect />} />

        {/* Doctor Panel */}
        <Route path="/doctordashboard" element={<DoctorDashboard />} />
        <Route path="/doctordashboard/patients" element={<Patients />} />
        <Route path="/doctordashboard/appointments" element={<Appointments />} />
        <Route path="/doctordashboard/prescriptions" element={<Prescriptions />} />
        <Route path="/doctordashboard/new-prescription" element={<NewPrescription />} />
        <Route path="/doctordashboard/settings" element={<DoctorSettings />} />
        <Route path="/doctordashboard/reports" element={<Reports />} />
        <Route path="/doctordashboard/create-report" element={<CreateReport />} />
        <Route path="/doctordashboard/notifications" element={<Notifications />} />

        {/* Patient Panel */}
        <Route path="/patient-dashboard" element={<PatientDashboard />} />
        <Route path="/patient-profile" element={<PatientProfile />} />
        <Route path="/patient-history" element={<PatientMedical />} />
        <Route path="/patient-appointments" element={<PatientAppointments />} />
        <Route path="/patient-bills" element={<PatientBills />} />
        <Route path="/patient-notifications" element={<NotificationsPage />} />

        {/* Pharmacist Authentication */}
        <Route path="/pharmacy/login" element={<PharmacyLogin />} />
        <Route path="/pharmacy/register" element={<PharmacyRegister />} />
        <Route path="/pharmacy/forgot-password" element={<PharmacyForgotPassword />} />
        <Route path="/pharmacy/reset-password" element={<PharmacyResetPassword />} />

        {/* Pharmacist Dashboard */}
        <Route path="/pharmacy/dashboard" element={<PharmacyDashboard />} />
        <Route path="/pharmacy/medicines" element={<Medicines />} />
        <Route path="/pharmacy/prescriptions" element={<Prescription />} />
        <Route path="/pharmacy/inventory" element={<Inventory />} />
        <Route path="/pharmacy/orders" element={<Orders />} />
        <Route path="/pharmacy/suppliers" element={<Suppliers />} />
        <Route path="/pharmacy/billing" element={<Billing />} />
        <Route path="/pharmacy/reports" element={<Report />} />
        <Route path="/pharmacy/notifications" element={<Notification />} />

        {/* Redirect /pharmacy */}
        <Route
          path="/pharmacy"
          element={<Navigate to="/pharmacy/login" replace />}
        />

        {/* Generic Role Login/Register */}
        <Route path="/:role/login" element={<RoleLogin />} />
        <Route path="/:role/register" element={<RoleRegister />} />

      </Routes>
    </Router>
  );
}

export default App;