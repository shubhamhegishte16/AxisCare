import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Stethoscope,
  Headset,
  User,
  FlaskConical,
  Pill,
} from 'lucide-react';

const roles = [
  { key: 'admin', label: 'Admin', icon: ShieldCheck, path: '/admin' },
  { key: 'doctor', label: 'Doctor', icon: Stethoscope, path: '/doctordashboard' },
  { key: 'receptionist', label: 'Receptionist', icon: Headset, path: '/receptionist' },
  { key: 'patient', label: 'Patient', icon: User, path: '/patient-dashboard' },
  { key: 'lab', label: 'Laboratory Staff', icon: FlaskConical, path: '/lab' },
  { key: 'pharmacist', label: 'Pharmacist', icon: Pill, path: '/pharmacist' },
];

export default function RoleSelect() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#eef3fd] to-[#f7f9fd] flex flex-col items-center px-6 py-16 sm:py-20">
      <div className="text-center mb-10 sm:mb-14">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight">
          <span className="bg-gradient-to-r from-[#22c3e6] to-[#1d4ed8] bg-clip-text text-transparent underline decoration-[#1d4ed8]/70 decoration-4 underline-offset-8">
            AxisCare
          </span>
        </h1>
        <p className="mt-6 text-xl sm:text-2xl font-bold text-[#1a2b6b]">
          Select role
        </p>
      </div>

      <div className="w-full max-w-3xl grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
        {roles.map(({ key, label, icon: Icon, path }) => (
          <button
            key={key}
            onClick={() => navigate(path)}
            className="group flex flex-col items-center justify-center gap-4 rounded-3xl bg-[#dbe6fb] hover:bg-[#cfdefa] shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-200 aspect-square p-4 sm:p-6 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#1d4ed8]/40"
          >
            <span className="flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20">
              <Icon
                className="w-12 h-12 sm:w-16 sm:h-16 text-[#2f6fe0]"
                strokeWidth={1.5}
              />
            </span>
            <span className="text-base sm:text-xl font-bold text-[#0f1b3d] text-center leading-tight">
              {label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
