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
import BookLabAppointmentPage from './PatientPanel/BookLabAppointment.jsx';

// Pharmacist Panel
import PharmacyForgotPassword from './PharmacistPanel/PharmacyForgotPassword.jsx';
import PharmacyResetPassword from './PharmacistPanel/PharmacyResetPassword.jsx';
import PharmacyDashboard from './PharmacistPanel/PharmacyDashboard.jsx';
import PharmacyProfile from './PharmacistPanel/PharmacyProfile.jsx';
import Medicines from './PharmacistPanel/Medicines.jsx';
import Prescription from './PharmacistPanel/Prescriptions.jsx';
import Inventory from './PharmacistPanel/Inventory.jsx';
import Orders from './PharmacistPanel/Orders.jsx';
import Suppliers from './PharmacistPanel/Suppliers.jsx';
import Billing from './PharmacistPanel/Billing.jsx';
import Report from './PharmacistPanel/Reports.jsx';
import Notification from './PharmacistPanel/Notifications.jsx';

import AdminDashboard from './AdminPanel/AdminDashboard.jsx';
import AdminUsers from './AdminPanel/Users.jsx';
import AdminDoctors from './AdminPanel/Doctors.jsx';
import AdminPatients from './AdminPanel/Patients.jsx';
import AdminAppointments from './AdminPanel/Appointments.jsx';
import AdminDepartments from './AdminPanel/Departments.jsx';
import AdminPharmacyOversight from './AdminPanel/PharmacyOversight.jsx';
import AdminBilling from './AdminPanel/Billing.jsx';
import AdminReports from './AdminPanel/Reports.jsx';
import AdminNotifications from './AdminPanel/Notifications.jsx';
import AdminProfile from './AdminPanel/AdminProfile.jsx';


// Receptionist Panel
import ReceptionistDashboard from './receptionist/ReceptionistDashboard.jsx';
import ReceptionistAppointments from './receptionist/ReceptionistAppointments.jsx';
import RegisterPatient from './receptionist/RegisterPatient.jsx';
import WalkInQueue from './receptionist/WalkInQueue.jsx';
import PatientRecords from './receptionist/PatientRecords.jsx';
import ReceptionistBilling from './receptionist/Billing.jsx';
import ReceptionistReports from './receptionist/Reports.jsx';
import ReceptionistNotifications from './receptionist/ReceptionistNotifications.jsx';
import ReceptionistSettings from './receptionist/ReceptionistSettings.jsx';

import LabDashboard from './laboratory_panel/LabDashboard';
import LabRequests from './laboratory_panel/LabRequests';
import LabResults from './laboratory_panel/LabResults';
import LabHistory from './laboratory_panel/LabHistory';
import LabSettings from './laboratory_panel/LabSettings';
import ProcessTest from './laboratory_panel/ProcessTest';

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
        <Route path="/doctordashboard/edit-report/:id" element={<CreateReport />} />
        <Route path="/doctordashboard/notifications" element={<Notifications />} />

        {/* Patient Panel */}
        <Route path="/patient-dashboard" element={<PatientDashboard />} />
        <Route path="/patient-profile" element={<PatientProfile />} />
        <Route path="/patient-history" element={<PatientMedical />} />
        <Route path="/patient-appointments" element={<PatientAppointments />} />
        <Route path="/patient-bills" element={<PatientBills />} />
        <Route path="/patient-notifications" element={<NotificationsPage />} />
        <Route path="/lab-appointments/book" element={<BookLabAppointmentPage />} />

        {/* Pharmacist Authentication (handled by generic /:role/login, /:role/register with role="pharmacist") */}
        <Route path="/pharmacy/login" element={<Navigate to="/pharmacist/login" replace />} />
        <Route path="/pharmacy/register" element={<Navigate to="/pharmacist/register" replace />} />
        <Route path="/pharmacy/forgot-password" element={<PharmacyForgotPassword />} />
        <Route path="/pharmacy/reset-password" element={<PharmacyResetPassword />} />

        {/* Pharmacist Dashboard */}
        <Route path="/pharmacy/dashboard" element={<PharmacyDashboard />} />
        <Route path="/pharmacy/profile" element={<PharmacyProfile />} />
        <Route path="/pharmacy/medicines" element={<Medicines />} />
        <Route path="/pharmacy/prescriptions" element={<Prescription />} />
        <Route path="/pharmacy/inventory" element={<Inventory />} />
        <Route path="/pharmacy/orders" element={<Orders />} />
        <Route path="/pharmacy/suppliers" element={<Suppliers />} />
        <Route path="/pharmacy/billing" element={<Billing />} />
        <Route path="/pharmacy/reports" element={<Report />} />
        <Route path="/pharmacy/notifications" element={<Notification />} />


        {/* Admin Dashboard */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/doctors" element={<AdminDoctors />} />
        <Route path="/admin/patients" element={<AdminPatients />} />
        <Route path="/admin/appointments" element={<AdminAppointments />} />
        <Route path="/admin/departments" element={<AdminDepartments />} />
        <Route path="/admin/pharmacy" element={<AdminPharmacyOversight />} />
        <Route path="/admin/billing" element={<AdminBilling />} />
        <Route path="/admin/reports" element={<AdminReports />} />
        <Route path="/admin/notifications" element={<AdminNotifications />} />
        <Route path="/admin/profile" element={<AdminProfile />} />

        {/* Receptionist Panel */}
        <Route path="/receptionist/dashboard" element={<ReceptionistDashboard />} />
        <Route path="/receptionist/appointments" element={<ReceptionistAppointments />} />
        <Route path="/receptionist/register-patient" element={<RegisterPatient />} />
        <Route path="/receptionist/walk-in-queue" element={<WalkInQueue />} />
        <Route path="/receptionist/patient-records" element={<PatientRecords />} />
        <Route path="/receptionist/billing" element={<ReceptionistBilling />} />
        <Route path="/receptionist/reports" element={<ReceptionistReports />} />
        <Route path="/receptionist/notifications" element={<ReceptionistNotifications />} />
        <Route path="/receptionist/settings" element={<ReceptionistSettings />} />
        <Route path="/receptionist" element={<Navigate to="/receptionist/dashboard" replace />} />

        {/* Redirect /pharmacy */}
        <Route
          path="/pharmacy"
          element={<Navigate to="/pharmacist/login" replace />}
        />
        

        {/* Laboratory Panel */}
        <Route path="/lab" element={<LabDashboard />} />
        <Route path="/lab/dashboard" element={<Navigate to="/lab" replace />} />
        <Route path="/lab/requests" element={<LabRequests />} />
        <Route path="/lab/requests/:id/process" element={<ProcessTest />} />
        <Route path="/lab/results" element={<LabResults />} />
        <Route path="/lab/history" element={<LabHistory />} />
        <Route path="/lab/settings" element={<LabSettings />} />

        {/* Generic Role Login/Register */}
        <Route path="/:role/login" element={<RoleLogin />} />
        <Route path="/:role/register" element={<RoleRegister />} />

      </Routes>
    </Router>
  );
}

export default App;