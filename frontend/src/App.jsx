import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './Landing';
import DoctorDashboard from './doctorpanel/DoctorDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        {/* Redirecting to dashboard for any doctor path for now */}
        <Route path="/doctordashboard/*" element={<DoctorDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
