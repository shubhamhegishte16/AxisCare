import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Shield, LogOut } from 'lucide-react';
import PharmacyNavbar from './PharmacyNavbar';
import { PageHeader, Card } from './UI';

const PharmacyProfile = () => {
  const navigate = useNavigate();

  let storedUser = null;
  try {
    storedUser = JSON.parse(localStorage.getItem('user'));
  } catch {
    storedUser = null;
  }

  const [showConfirmLogout, setShowConfirmLogout] = useState(false);

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:5000/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch {
      // ignore network errors, clear local session regardless
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/pharmacist/login', { replace: true });
    }
  };

  if (!storedUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
        <PharmacyNavbar />
        <main className="flex-1 p-6 lg:p-8 max-w-7xl mx-auto w-full">
          <Card>
            <p className="text-sm text-gray-500">
              We couldn't find your session details. Please log in again.
            </p>
            <button
              onClick={() => navigate('/pharmacist/login')}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg"
            >
              Go to Login
            </button>
          </Card>
        </main>
      </div>
    );
  }

  const role = storedUser.role
    ? storedUser.role.charAt(0).toUpperCase() + storedUser.role.slice(1)
    : 'Pharmacist';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <PharmacyNavbar />
      <main className="flex-1 p-6 lg:p-8 max-w-3xl mx-auto w-full">
        <PageHeader title="My Profile" subtitle="Your account details" />

        <Card>
          <div className="flex items-center gap-4 mb-6">
            <span className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
              <User className="w-8 h-8 text-blue-500" />
            </span>
            <div>
              <p className="text-lg font-bold text-gray-900">{storedUser.fullName}</p>
              <p className="text-sm text-gray-400">{role}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 py-3 border-t border-gray-100">
              <Mail className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-400">Email</p>
                <p className="text-sm font-semibold text-gray-800">{storedUser.email || '—'}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 py-3 border-t border-gray-100">
              <Phone className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-400">Phone</p>
                <p className="text-sm font-semibold text-gray-800">{storedUser.phone || '—'}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 py-3 border-t border-gray-100">
              <Shield className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-400">Role</p>
                <p className="text-sm font-semibold text-gray-800">{role}</p>
              </div>
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-gray-100">
            {!showConfirmLogout ? (
              <button
                onClick={() => setShowConfirmLogout(true)}
                className="flex items-center gap-2 text-red-600 hover:text-red-700 text-sm font-semibold"
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            ) : (
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">Are you sure you want to logout?</span>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-4 py-2 rounded-lg"
                >
                  Yes, logout
                </button>
                <button
                  onClick={() => setShowConfirmLogout(false)}
                  className="text-sm text-gray-500 hover:text-gray-700 font-semibold"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </Card>
      </main>
    </div>
  );
};

export default PharmacyProfile;