import React from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

/**
 * Shared shell for every Receptionist page (Dashboard, Appointments, etc.)
 * so the sidebar + topbar + page background stay identical across the panel.
 */
const ReceptionistLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans flex">
      <Sidebar />
      <div className="flex-1 min-w-0 flex flex-col">
        <Topbar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1600px] w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default ReceptionistLayout;
