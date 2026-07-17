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
    dashboard: '/receptionist/appointments',
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
  // Keyed as "pharmacist" (not "pharmacy") because RoleRegister sends this
  // key straight to the backend as the user's `role`, and the User model's
  // role enum only accepts "pharmacist".
  pharmacist: {
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
