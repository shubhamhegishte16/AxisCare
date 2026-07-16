import React, { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import RoleAuthLayout from './RoleAuthLayout';
import { getRoleConfig } from './roleConfig';

const initialForm = { fullName: '', email: '', phone: '', password: '', confirmPassword: '' };

const RoleRegister = () => {
  const { role } = useParams();
  const navigate = useNavigate();
  const { label } = getRoleConfig(role);

  const [form, setForm] = useState(initialForm);
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!form.fullName) newErrors.fullName = 'Full name is required';
    if (!form.email) newErrors.email = 'Email is required';
    if (!form.phone) newErrors.phone = 'Phone number is required';
    if (!form.password) newErrors.password = 'Password is required';
    if (form.confirmPassword !== form.password || !form.confirmPassword)
      newErrors.confirmPassword = 'Passwords do not match';
    setErrors(newErrors);
    if (Object.keys(newErrors).length) return;

    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: form.fullName,
          email: form.email,
          phone: form.phone,
          password: form.password,
          role: role,
        }),
      });

      const data = await response.json();

      if (data.success) {
        navigate(`/${role}/login`);
      } else {
        setErrors({ ...newErrors, email: data.message });
      }
    } catch (err) {
      console.error("Registration error:", err);
      setErrors({ ...newErrors, email: "Server error. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <RoleAuthLayout role={role}>
      <h2 className="text-xl font-bold text-gray-900 text-center mb-1">Create your {label} account</h2>
      <p className="text-sm text-gray-500 text-center mb-6">Fill the details to create your account</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="Full name" placeholder="Enter full name" value={form.fullName} onChange={set('fullName')} error={errors.fullName} />
        <Field label="Email" type="email" placeholder="Enter email" value={form.email} onChange={set('email')} error={errors.email} />
        <Field label="Phone Number" placeholder="Enter phone number" value={form.phone} onChange={set('phone')} error={errors.phone} />

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
          <div className="relative">
            <input
              type={showPass ? 'text' : 'password'}
              placeholder="Create password"
              value={form.password}
              onChange={set('password')}
              className={`w-full px-4 py-2.5 rounded-lg border bg-white text-sm outline-none focus:ring-2 focus:ring-blue-200 pr-10 ${errors.password ? 'border-red-400' : 'border-gray-200'}`}
            />
            <button type="button" onClick={() => setShowPass((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Confirm password</label>
          <div className="relative">
            <input
              type={showConfirm ? 'text' : 'password'}
              placeholder="Confirm password"
              value={form.confirmPassword}
              onChange={set('confirmPassword')}
              className={`w-full px-4 py-2.5 rounded-lg border bg-white text-sm outline-none focus:ring-2 focus:ring-blue-200 pr-10 ${errors.confirmPassword ? 'border-red-400' : 'border-gray-200'}`}
            />
            <button type="button" onClick={() => setShowConfirm((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold py-2.5 rounded-lg transition-colors shadow-sm mt-2"
        >
          {loading ? 'Creating account…' : 'Register'}
        </button>

        <p className="text-center text-sm text-gray-500">
          Already have an account?{' '}
          <Link to={`/${role}/login`} className="text-blue-600 font-semibold hover:underline">
            Login
          </Link>
        </p>

        <Link to="/role-select" className="block text-center text-xs text-gray-400 hover:text-gray-600 mt-2">
          ← Back to role select
        </Link>
      </form>
    </RoleAuthLayout>
  );
};

const Field = ({ label, error, ...props }) => (
  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>
    <input
      {...props}
      className={`w-full px-4 py-2.5 rounded-lg border bg-white text-sm outline-none focus:ring-2 focus:ring-blue-200 ${error ? 'border-red-400' : 'border-gray-200'}`}
    />
    {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
  </div>
);

export default RoleRegister;
