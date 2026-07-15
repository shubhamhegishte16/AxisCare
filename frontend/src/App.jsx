import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './Landing';
import DoctorDashboard from './doctorpanel/DoctorDashboard';

// Patient Panel
import PatientDashboard from './PatientPanel/PatientDashboard.jsx';
import PatientProfile from './PatientPanel/PatientProfile.jsx';
import PatientMedical from './PatientPanel/PatientMedical.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        {/* Redirecting to dashboard for any doctor path for now */}
        <Route path="/doctordashboard/*" element={<DoctorDashboard />} />


        {/* Patient Panel */}
        <Route path="/patient-dashboard" element={<PatientDashboard />} />
        <Route path="/patient-profile" element={<PatientProfile />} />
        <Route path='/patient-history' element={<PatientMedical />} />

      </Routes>
    </Router>
  );
}

export default App;
