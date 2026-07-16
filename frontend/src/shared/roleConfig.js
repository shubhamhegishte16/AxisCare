import {
  ShieldCheck,
  Stethoscope,
  Headset,
  User,
  FlaskConical,
  Pill,
} from 'lucide-react';

// Keyed by the URL path segment used in /:role/login and /:role/register
export const roleConfig = {
  admin: {
    label: 'Admin',
    icon: ShieldCheck,
    dashboard: '/admin',
  },
  doctor: {
    label: 'Doctor',
    icon: Stethoscope,
    dashboard: '/doctordashboard',
  },
  receptionist: {
    label: 'Receptionist',
    icon: Headset,
    dashboard: '/receptionist',
  },
  patient: {
    label: 'Patient',
    icon: User,
    dashboard: '/patient-dashboard',
  },
  lab: {
    label: 'Laboratory Staff',
    icon: FlaskConical,
    dashboard: '/lab',
  },
  // Pharmacist has its own dedicated pages (/pharmacy/login, /pharmacy/register),
  // but this entry lets getRoleConfig() resolve gracefully if ever routed generically.
  pharmacy: {
    label: 'Pharmacist',
    icon: Pill,
    dashboard: '/pharmacy/dashboard',
  },
};

const fallback = {
  label: 'User',
  icon: User,
  dashboard: '/',
};

export function getRoleConfig(role) {
  return roleConfig[role] || fallback;
}
