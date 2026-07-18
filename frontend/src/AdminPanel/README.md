# Admin Panel — Frontend

This folder is meant to be placed at `frontend/src/AdminPanel/` in the AxisCare project.

## What's included

- `AdminSidebar.jsx` — left navigation (desktop) / drawer (mobile), reads the logged-in
  user's name from `localStorage` and handles logout, same pattern as the Pharmacist Panel.
- `AdminLayout.jsx` — shared page wrapper (sidebar + content area) used by every page below.
- `AdminDashboard.jsx` — system-wide overview: user growth, role distribution, department
  load, pending approvals, recent activity.
- `Users.jsx` — manage every account in the system (any role), add/edit/activate-deactivate/delete.
- `Doctors.jsx` — doctor directory with specialization, department, duty status, ratings.
- `Patients.jsx` — read-only patient directory (admin doesn't touch clinical records —
  that stays in the Doctor Panel).
- `Appointments.jsx` — system-wide appointment oversight across all departments/doctors.
- `Departments.jsx` — create/edit/delete hospital departments and assign heads.
- `PharmacyOversight.jsx` — read-only snapshot into pharmacy stats (not a duplicate of the
  full Pharmacy Panel, which pharmacists still own).
- `Billing.jsx` — hospital-wide revenue vs expenses (distinct from the Pharmacy Panel's
  own per-sale billing).
- `Reports.jsx` — analytics: user growth, revenue trend, department load, role distribution.
- `Notifications.jsx` — admin notification feed (approvals, alerts, reports, system events).
- `AdminProfile.jsx` — admin's own account details + logout.
- `UI.jsx` — shared UI primitives (StatCard, Card, Modal, ConfirmDialog, StatusBadge,
  RoleBadge, EmptyState, Toggle, PageHeader) — same visual language as the Pharmacist Panel.
- `mockData.js` — placeholder data so every page renders and is fully interactive right now.
  **Every page will need to be rewired to real API calls once the backend exists** — same
  process we used for the Pharmacy Panel (a `services/adminService.js` calling
  `/api/admin/...` endpoints, replacing the `mockData` imports).

## Wiring into the app (next step, not done yet)

1. Copy this folder to `frontend/src/AdminPanel/`.
2. In `App.jsx`, import each page and add routes, e.g.:
   ```jsx
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

   // ...inside <Routes>
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
   ```
3. `roleConfig.js` already has an `admin` entry pointing to `/admin` as the dashboard —
   you'll want to update that to `/admin/dashboard` to match the routes above, and add a
   redirect route for bare `/admin` similar to the `/pharmacy` one.
4. Login/Register already work for admin via the existing generic `RoleLogin` /
   `RoleRegister` at `/admin/login` and `/admin/register` — no separate admin login page
   needed (same as we did for pharmacist).

## Not included (by design, per your request)

- No backend routes/controllers/models yet — that's the next step.
- No `adminService.js` — will be added once backend endpoints exist.
- No `App.jsx` edits — wiring is described above but not applied, since you asked for the
  frontend pages only for now.
