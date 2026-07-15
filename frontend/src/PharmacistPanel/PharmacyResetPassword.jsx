import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthLayout from './AuthLayout';

const PharmacyResetPassword = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!form.password) newErrors.password = 'New password is required';
    if (form.confirmPassword !== form.password || !form.confirmPassword)
      newErrors.confirmPassword = 'Passwords do not match';
    setErrors(newErrors);
    if (Object.keys(newErrors).length) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate('/pharmacy/login');
    }, 700);
  };

  return (
    <AuthLayout illustration="reset">
      <h2 className="text-xl font-bold text-gray-900 text-center mb-1">Reset Password</h2>
      <p className="text-sm text-gray-500 text-center mb-6">Create a new password to secure your account</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">New Password</label>
          <input
            type="password"
            placeholder="Enter new password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className={`w-full px-4 py-2.5 rounded-lg border bg-white text-sm outline-none focus:ring-2 focus:ring-blue-200 ${errors.password ? 'border-red-400' : 'border-gray-200'}`}
          />
          {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Confirm Password</label>
          <input
            type="password"
            placeholder="Confirm new password"
            value={form.confirmPassword}
            onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
            className={`w-full px-4 py-2.5 rounded-lg border bg-white text-sm outline-none focus:ring-2 focus:ring-blue-200 ${errors.confirmPassword ? 'border-red-400' : 'border-gray-200'}`}
          />
          {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold py-2.5 rounded-lg transition-colors shadow-sm"
        >
          {loading ? 'Resetting…' : 'Reset Password'}
        </button>

        <p className="text-center text-sm text-gray-500">
          Remember your password?{' '}
          <Link to="/pharmacy/login" className="text-blue-600 font-semibold hover:underline">
            Login
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default PharmacyResetPassword;