import React, { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import RoleAuthLayout from './RoleAuthLayout';
import { getRoleConfig } from './roleConfig';

const RoleLogin = () => {
  const { role } = useParams();
  const navigate = useNavigate();
  const { label, dashboard } = getRoleConfig(role);

  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({ emailOrPhone: '', password: '', remember: false });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!form.emailOrPhone) newErrors.emailOrPhone = 'Email or phone is required';
    if (!form.password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    if (Object.keys(newErrors).length) return;

    setLoading(true);
    // Mock auth — replace with real API call later
    setTimeout(() => {
      setLoading(false);
      navigate(dashboard);
    }, 700);
  };

  return (
    <RoleAuthLayout role={role}>
      <h2 className="text-2xl font-bold text-gray-900 text-center mb-1">
        {label} Login
      </h2>
      <p className="text-center text-sm text-gray-500 mb-6">Sign in to your {label.toLowerCase()} account</p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email or Phone</label>
          <input
            type="text"
            placeholder="Enter email or phone"
            value={form.emailOrPhone}
            onChange={(e) => setForm({ ...form, emailOrPhone: e.target.value })}
            className={`w-full px-4 py-2.5 rounded-lg border bg-white text-sm outline-none focus:ring-2 focus:ring-blue-200 ${errors.emailOrPhone ? 'border-red-400' : 'border-gray-200'}`}
          />
          {errors.emailOrPhone && <p className="text-xs text-red-500 mt-1">{errors.emailOrPhone}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
          <div className="relative">
            <input
              type={showPass ? 'text' : 'password'}
              placeholder="Enter password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className={`w-full px-4 py-2.5 rounded-lg border bg-white text-sm outline-none focus:ring-2 focus:ring-blue-200 pr-10 ${errors.password ? 'border-red-400' : 'border-gray-200'}`}
            />
            <button type="button" onClick={() => setShowPass((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
        </div>

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-gray-600 cursor-pointer">
            <input
              type="checkbox"
              checked={form.remember}
              onChange={(e) => setForm({ ...form, remember: e.target.checked })}
              className="rounded border-gray-300"
            />
            Remember Me
          </label>
          <button type="button" className="text-blue-600 font-semibold hover:underline">
            Forgot Password?
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold py-2.5 rounded-lg transition-colors shadow-sm"
        >
          {loading ? 'Signing in…' : 'Login'}
        </button>

        <p className="text-center text-sm text-gray-500">
          Don't have an account?{' '}
          <Link to={`/${role}/register`} className="text-blue-600 font-semibold hover:underline">
            Register
          </Link>
        </p>

        <Link to="/role-select" className="block text-center text-xs text-gray-400 hover:text-gray-600 mt-2">
          ← Back to role select
        </Link>
      </form>
    </RoleAuthLayout>
  );
};

export default RoleLogin;
